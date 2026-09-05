export const site = {
  name: 'MDS',
  domain: 'https://mdsia.com',
  email: 'hola@mdsia.com',
  ogImage: '/og.png',
  locale: 'es-ES',
  ogLocale: 'es_ES',
  whatsapp: '34611980931',
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
