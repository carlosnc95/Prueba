export const site = {
  name: 'MDS',
  domain: 'https://mdsia.com',
  email: 'hola@mdsia.com',
  ogImage: '/og.png',
  locale: 'es-ES',
  ogLocale: 'es_ES',
  whatsapp: '34611980931',
  whatsappMessage: 'Hola, quiero contaros la tarea que más tiempo nos ocupa.',
  // Con quién firma el correo de confirmación que recibe el lead.
  firma: 'MDS IA',
  // ID de medición de Google Analytics 4 (formato G-XXXXXXXXXX). No es un
  // secreto: acaba en el HTML igualmente. Si se deja vacío, ni GA4 ni el
  // banner de cookies se cargan, y el sitio vuelve a no usar cookies.
  ga4Id: 'G-W0Y6TE0FPD',
} as const;

export const nav = [
  { label: 'Soluciones', href: '/soluciones' },
  { label: 'Quiénes somos', href: '/quienes-somos' },
] as const;

export const routes = {
  home: '/',
  soluciones: '/soluciones',
  quienesSomos: '/quienes-somos',
  gracias: '/gracias',
  privacidad: '/privacidad',
} as const;

/** URL de la página de una familia de soluciones. */
export const familiaHref = (slug: string) => `${routes.soluciones}/${slug}`;
