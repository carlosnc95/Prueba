// Registro de leads en HubSpot desde el chat de diagnóstico.
//
// Es best-effort, igual que la confirmación al lead: si HubSpot falla o no
// hay token configurado, se registra en el log y ya está. El aviso interno
// por correo sigue siendo la fuente de verdad, así que nunca perdemos un
// contacto por un problema del CRM.
//
// Sin SDK: la API de HubSpot es REST y `fetch` es global en el runtime de
// Vercel. Una dependencia menos que mantener.

import { leerEnv } from './entorno';

const API = 'https://api.hubapi.com';
const TIMEOUT_MS = 5000;

export interface LeadCrm {
  nombre: string;
  email: string;
  sector: string;
  horas: string;
  problema: string;
  solucion: string;
}

interface Respuesta<T> {
  ok: boolean;
  status: number;
  datos: T | null;
  texto: string;
}

async function hs<T>(token: string, ruta: string, init: RequestInit = {}): Promise<Respuesta<T>> {
  // Sin timeout, una llamada colgada alargaría la respuesta del chat: el
  // visitante se queda mirando el "enviando" por culpa del CRM.
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API}${ruta}`, {
      ...init,
      signal: control.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });
    const texto = await res.text();
    let datos: T | null = null;
    try {
      datos = texto ? (JSON.parse(texto) as T) : null;
    } catch {
      /* respuesta sin JSON: nos quedamos con el texto para el log */
    }
    return { ok: res.ok, status: res.status, datos, texto };
  } finally {
    clearTimeout(reloj);
  }
}

/** Busca el contacto por email. Devuelve su id o null si no existe. */
async function buscarContacto(token: string, email: string): Promise<string | null> {
  const res = await hs<{ results?: { id: string }[] }>(token, '/crm/v3/objects/contacts/search', {
    method: 'POST',
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
      properties: ['email'],
      limit: 1,
    }),
  });
  if (!res.ok) {
    console.error('HubSpot: fallo buscando contacto', res.status, res.texto.slice(0, 200));
    return null;
  }
  return res.datos?.results?.[0]?.id ?? null;
}

/**
 * Crea el contacto si no existe. Solo se escriben propiedades estándar
 * (email y nombre) para que funcione en cualquier portal sin configurar
 * nada antes; el detalle del caso va en la descripción del negocio.
 */
async function crearOActualizarContacto(token: string, lead: LeadCrm): Promise<string | null> {
  const existente = await buscarContacto(token, lead.email);
  const propiedades = { email: lead.email, firstname: lead.nombre };

  if (existente) {
    const res = await hs(token, `/crm/v3/objects/contacts/${existente}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties: propiedades }),
    });
    if (!res.ok) console.error('HubSpot: fallo actualizando contacto', res.status, res.texto.slice(0, 200));
    return existente;
  }

  const res = await hs<{ id: string }>(token, '/crm/v3/objects/contacts', {
    method: 'POST',
    body: JSON.stringify({ properties: propiedades }),
  });
  if (!res.ok) {
    console.error('HubSpot: fallo creando contacto', res.status, res.texto.slice(0, 200));
    return null;
  }
  return res.datos?.id ?? null;
}

function descripcionNegocio(lead: LeadCrm): string {
  return [
    `Proceso: ${lead.problema}`,
    `Sector: ${lead.sector}`,
    `Horas a la semana: ${lead.horas || 'no indicado'}`,
    '',
    `Apunte mostrado en el chat: ${lead.solucion || '—'}`,
    '',
    `Origen: chat de diagnóstico de la web`,
  ].join('\n');
}

async function crearNegocio(token: string, lead: LeadCrm): Promise<string | null> {
  // pipeline y dealstage se dejan sin fijar salvo que estén configurados:
  // así el negocio cae en el embudo por defecto del portal y esto funciona
  // sin tener que copiar identificadores internos de HubSpot.
  const propiedades: Record<string, string> = {
    dealname: `Diagnóstico — ${lead.nombre} (${lead.sector})`,
    description: descripcionNegocio(lead),
  };
  const pipeline = leerEnv('HUBSPOT_PIPELINE_ID', import.meta.env.HUBSPOT_PIPELINE_ID);
  const etapa = leerEnv('HUBSPOT_DEALSTAGE_ID', import.meta.env.HUBSPOT_DEALSTAGE_ID);
  if (pipeline) propiedades.pipeline = pipeline;
  if (etapa) propiedades.dealstage = etapa;

  const res = await hs<{ id: string }>(token, '/crm/v3/objects/deals', {
    method: 'POST',
    body: JSON.stringify({ properties: propiedades }),
  });
  if (!res.ok) {
    console.error('HubSpot: fallo creando negocio', res.status, res.texto.slice(0, 200));
    return null;
  }
  return res.datos?.id ?? null;
}

async function asociar(token: string, negocioId: string, contactoId: string): Promise<void> {
  const res = await hs(
    token,
    `/crm/v4/objects/deals/${negocioId}/associations/default/contacts/${contactoId}`,
    { method: 'PUT' },
  );
  if (!res.ok) console.error('HubSpot: fallo asociando negocio y contacto', res.status, res.texto.slice(0, 200));
}

/**
 * Punto de entrada. Nunca lanza: cualquier fallo se registra y se sigue.
 * Sin HUBSPOT_TOKEN no hace nada, de modo que el endpoint funciona igual
 * mientras el CRM no esté configurado.
 */
export async function registrarLeadEnHubspot(lead: LeadCrm): Promise<void> {
  try {
    const token = leerEnv('HUBSPOT_TOKEN', import.meta.env.HUBSPOT_TOKEN);
    if (!token) {
      // Aviso explícito: antes esto salía en silencio, y como el camino de
      // éxito tampoco escribía nada, en los logs no había forma de
      // distinguir "no está configurado" de "funcionó".
      console.warn('HubSpot: falta HUBSPOT_TOKEN, el lead no se registra en el CRM');
      return;
    }
    console.log('HubSpot: registrando lead (longitud del token:', token.length, ')');

    const contactoId = await crearOActualizarContacto(token, lead);
    const negocioId = await crearNegocio(token, lead);
    // Sin contacto o sin negocio no hay nada que asociar, pero lo que sí se
    // haya creado se queda: mejor un registro suelto que ninguno.
    if (contactoId && negocioId) await asociar(token, negocioId, contactoId);
    console.log('HubSpot: resultado', { contactoId, negocioId });
  } catch (err) {
    console.error('HubSpot: error registrando el lead', err);
  }
}
