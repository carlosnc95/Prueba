import { defineConfig } from 'astro/config';
import { site } from './src/config/site.ts';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

export default defineConfig({
  site: site.domain,
  trailingSlash: 'never',
  // "server" con prerender:true por página (ver cada .astro) para que las
  // 5 rutas sigan siendo estáticas y solo /api/diagnostico sea dinámica.
  output: 'server',
  adapter: vercel(),
  // El catálogo vivía en /casos antes de separarlo por familias. Se mantiene
  // la redirección permanente para no perder los enlaces ya publicados ni lo
  // que Google hubiera rastreado.
  redirects: {
    '/casos': { status: 301, destination: '/soluciones' },
  },
  integrations: [
    react(),
    sitemap({
      // /gracias lleva noindex (es la página de confirmación tras enviar
      // el formulario), no debe aparecer en el sitemap.
      filter: (page) => !page.includes('/gracias'),
    }),
  ],
});