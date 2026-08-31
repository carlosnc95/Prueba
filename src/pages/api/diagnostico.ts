import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { site } from '../../config/site';

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

  try {
    // Se instancia aquí (no a nivel de módulo): el SDK de Resend lanza en
    // el constructor si falta la API key, y eso no debe tumbar el endpoint
    // completo antes de llegar a las validaciones/honeypot/rate limit.
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    // El SDK de Resend NO lanza en errores de la API: devuelve
    // { data, error }. Hay que comprobar `error` explícitamente o un 403
    // (p. ej. dominio sin verificar) se trataría como éxito.
    const { error } = await resend.emails.send({
      from: import.meta.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
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

  return json({ ok: true }, 200);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
