// Placeholder de marca. Nombre, dominio, email y og image cambian juntos
// el día que se cierre el naming definitivo (ver README > Fidelity).
export const site = {
  name: 'Sira',
  domain: 'https://sira.ai',
  email: 'hola@sira.ai',
  ogImage: '/og.png',
  locale: 'es-ES',
  ogLocale: 'es_ES',
  // Placeholder — sustituir por el número real (con prefijo de país, solo
  // dígitos) cuando esté decidido. Usado para el botón flotante de WhatsApp.
  whatsapp: '34600000000',
  whatsappMessage: 'Hola, quiero contaros la tarea que más tiempo nos ocupa.',
} as const;

export const nav = [
  { label: 'Soluciones', href: '/casos' },
  { label: 'Quiénes somos', href: '/quienes-somos' },
] as const;

export const routes = {
  home: '/',
  casos: '/casos',
  quienesSomos: '/quienes-somos',
  gracias: '/gracias',
  privacidad: '/privacidad',
} as const;
