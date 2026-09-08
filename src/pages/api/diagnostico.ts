import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { site, routes } from '../../config/site';
import { fechaEntregaDiagnostico } from '../../lib/fechas';

export const prerender = false;

const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const MIN_FILL_MS = 3000; // por debajo de esto, casi seguro es un bot

// Rate limit en memoria: se resetea en cada cold start de la función
// serverless, así que NO es una protección robusta por sí sola — es una
// segunda capa junto al honeypot y al guard de tiempo mínimo. Para algo
// fiable en producción hace falta un store compartido (Upstash, Vercel KV).
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

interface DiagnosticoBody {
  nombre?: unknown;
  email?: unknown;
  sector?: unknown;
  horas?: unknown;
  problema?: unknown;
  solucion?: unknown;
  consentimiento?: unknown;
  startedAt?: unknown;
  website?: unknown; // honeypot
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: DiagnosticoBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  // Honeypot: campo oculto que un humano nunca rellena. Si viene relleno,
  // respondemos 200 falso para no delatar el filtro al bot.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json({ ok: true }, 200);
  }

  const startedAt = Number(body.startedAt);
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return json({ error: 'Envío demasiado rápido' }, 400);
  }

  const ip = clientAddress ?? 'unknown';
  if (isRateLimited(ip)) {
    return json({ error: 'Demasiadas solicitudes, inténtalo en un minuto' }, 429);
  }

  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const sector = typeof body.sector === 'string' ? body.sector.trim() : '';
  const horas = typeof body.horas === 'string' ? body.horas.trim() : '';
  const problema = typeof body.problema === 'string' ? body.problema.trim() : '';
  const solucion = typeof body.solucion === 'string' ? body.solucion.trim() : '';

  if (
    nombre.length < 2 ||
    !emailRe.test(email) ||
    sector.length < 2 ||
    problema.length < 2 ||
    body.consentimiento !== true
  ) {
    return json({ error: 'Datos incompletos' }, 400);
  }

  let resend: Resend;
  try {
    // Se instancia aquí (no a nivel de módulo): el SDK de Resend lanza en
    // el constructor si falta la API key, y eso no debe tumbar el endpoint
    // completo antes de llegar a las validaciones/honeypot/rate limit.
    resend = new Resend(import.meta.env.RESEND_API_KEY);
    // El SDK de Resend NO lanza en errores de la API: devuelve
    // { data, error }. Hay que comprobar `error` explícitamente o un 403
    // (p. ej. dominio sin verificar) se trataría como éxito.
    const { error } = await resend.emails.send({
      from: remitente(),
      to: import.meta.env.RESEND_TO_EMAIL || site.email,
      replyTo: email,
      subject: `Nuevo diagnóstico: ${nombre} (${sector})`,
      text: [
        `Nombre: ${nombre}`,
        `Email: ${email}`,
        `Sector: ${sector}`,
        `Horas/semana dedicadas: ${horas || '—'}`,
        '',
        `Problema descrito:`,
        problema,
        '',
        `Apunte de solución mostrado en el chat:`,
        solucion || '—',
        '',
        `Consentimiento RGPD aceptado: ${new Date().toISOString()}`,
        `IP: ${ip}`,
      ].join('\n'),
    });
    if (error) {
      console.error('Resend devolvió error:', error);
      return json({ error: 'No se pudo enviar el email' }, 502);
    }
  } catch (err) {
    console.error('Error enviando email de diagnóstico:', err);
    return json({ error: 'No se pudo enviar el email' }, 502);
  }

  // El lead ya está capturado. La confirmación es cortesía: si falla, se
  // registra y se devuelve 200 igualmente, porque perder el aviso interno
  // por un fallo en el acuse de recibo sería mucho peor que no acusarlo.
  await enviarConfirmacionAlLead(resend, { nombre, email, sector, horas, problema });

  return json({ ok: true }, 200);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function remitente(): string {
  return import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
}

/** Dominio sin protocolo, para mostrarlo dentro del texto: "mdsia.com". */
const dominioVisible = site.domain.replace(/^https?:\/\//, '');
const urlSoluciones = `${site.domain}${routes.soluciones}`;
const urlPrivacidad = `${site.domain}${routes.privacidad}`;

export function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * El plan gratuito de Resend limita a 2 peticiones por segundo y aquí van
 * dos envíos seguidos, así que este error concreto es esperable y merece
 * un reintento. El SDK lo devuelve en `error`, no lo lanza.
 */
function esErrorDeRateLimit(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { name?: string; statusCode?: number; message?: string };
  return (
    e.statusCode === 429 ||
    e.name === 'rate_limit_exceeded' ||
    /rate limit|too many requests/i.test(e.message ?? '')
  );
}

interface DatosLead {
  nombre: string;
  email: string;
  sector: string;
  horas: string;
  problema: string;
}

async function enviarConfirmacionAlLead(resend: Resend, lead: DatosLead): Promise<void> {
  try {
    const fecha = fechaEntregaDiagnostico();
    const mensaje = {
      from: remitente(),
      to: lead.email,
      // Las respuestas van al buzón real, no al remitente técnico desde el
      // que envía Resend.
      replyTo: site.email,
      subject: `Hemos recibido tu caso — te escribimos antes del ${fecha}`,
      text: textoConfirmacion(lead, fecha),
      html: htmlConfirmacion(lead, fecha),
    };

    let { error } = await resend.emails.send(mensaje);
    if (error && esErrorDeRateLimit(error)) {
      await esperar(600);
      ({ error } = await resend.emails.send(mensaje));
    }
    if (error) {
      console.error('No se pudo enviar la confirmación al lead:', error);
    }
  } catch (err) {
    console.error('Error enviando la confirmación al lead:', err);
  }
}

export function textoConfirmacion(lead: DatosLead, fecha: string): string {
  return [
    `Hola ${lead.nombre},`,
    '',
    'Gracias por contárnoslo. Esto es lo que hemos registrado:',
    '',
    `· Proceso: ${lead.problema}`,
    `· Sector: ${lead.sector}`,
    `· Horas a la semana: ${lead.horas || 'no indicado'}`,
    '',
    `Lo miramos con calma y te escribimos con el diagnóstico antes del ${fecha}. Te llegará en dos páginas: lo que ese proceso os cuesta hoy en horas y en euros al año, qué parte se puede automatizar y cuál no, el plazo y un rango de inversión.`,
    '',
    'Si mientras tanto quieres añadir algo, responde directamente a este correo.',
    '',
    `Mientras tanto, en ${dominioVisible}${routes.soluciones} tienes ejemplos de lo que solemos automatizar.`,
    '',
    site.firma,
    `${site.name} · ${dominioVisible}`,
    '',
    '---',
    `Usamos tus datos únicamente para responderte a este diagnóstico. Puedes pedirnos que los borremos escribiendo a ${site.email}. Más información en ${dominioVisible}${routes.privacidad}.`,
  ].join('\n');
}

export function htmlConfirmacion(lead: DatosLead, fecha: string): string {
  // Estilos en línea: los clientes de correo descartan el <style> del head.
  const nombre = escaparHtml(lead.nombre);
  const problema = escaparHtml(lead.problema);
  const sector = escaparHtml(lead.sector);
  const horas = escaparHtml(lead.horas || 'no indicado');

  // Comillas simples en "Segoe UI": el atributo style va entre dobles y
  // unas dobles anidadas lo cortarían por la mitad.
  const cuerpo =
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const p = 'margin:0 0 16px;font-size:16px;line-height:1.6;color:#14161b';
  const enlace = 'color:#2d5b9e;text-decoration:underline';
  const dato = 'margin:0 0 6px;font-size:15px;line-height:1.5;color:#14161b';
  const etiqueta = 'color:#5b6570';

  return `<div style="background:#f8f7f2;padding:32px 16px;${cuerpo}">
  <div style="max-width:560px;margin:0 auto">
    <p style="${p}">Hola ${nombre},</p>
    <p style="${p}">Gracias por contárnoslo. Esto es lo que hemos registrado:</p>
    <div style="border-left:3px solid #2d5b9e;padding:2px 0 2px 16px;margin:0 0 24px">
      <p style="${dato}"><span style="${etiqueta}">Proceso:</span> ${problema}</p>
      <p style="${dato}"><span style="${etiqueta}">Sector:</span> ${sector}</p>
      <p style="margin:0;font-size:15px;line-height:1.5;color:#14161b"><span style="${etiqueta}">Horas a la semana:</span> ${horas}</p>
    </div>
    <p style="${p}">Lo miramos con calma y te escribimos con el diagnóstico antes del <strong>${fecha}</strong>. Te llegará en dos páginas: lo que ese proceso os cuesta hoy en horas y en euros al año, qué parte se puede automatizar y cuál no, el plazo y un rango de inversión.</p>
    <p style="${p}">Si mientras tanto quieres añadir algo, responde directamente a este correo.</p>
    <p style="${p}">Mientras tanto, en <a href="${urlSoluciones}" style="${enlace}">${dominioVisible}${routes.soluciones}</a> tienes ejemplos de lo que solemos automatizar.</p>
    <p style="margin:32px 0 0;font-size:16px;line-height:1.6;color:#14161b">${site.firma}<br /><span style="${etiqueta}">${site.name} · <a href="${site.domain}" style="${enlace}">${dominioVisible}</a></span></p>
    <p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #e4e1d3;font-size:13px;line-height:1.5;color:#5b6570">Usamos tus datos únicamente para responderte a este diagnóstico. Puedes pedirnos que los borremos escribiendo a <a href="mailto:${site.email}" style="${enlace}">${site.email}</a>. Más información en <a href="${urlPrivacidad}" style="${enlace}">${dominioVisible}${routes.privacidad}</a>.</p>
  </div>
</div>`;
}
