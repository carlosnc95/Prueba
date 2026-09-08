// Reordena las rutas que genera @astrojs/vercel (8.2.11) en
// .vercel/output/config.json.
//
// El adaptador crea la regla correcta de caché para /_astro/ —los recursos
// llevan hash en el nombre, así que son inmutables— pero la coloca DESPUÉS
// de {"handle":"filesystem"}. En el enrutado de Vercel ese handle sirve el
// archivo y detiene el recorrido, de modo que la regla nunca se aplica y
// los assets salen con "max-age=0, must-revalidate": el navegador revalida
// todos los archivos en cada visita.
//
// Moviéndola antes del handle (con continue:true) la cabecera se aplica y
// después el archivo se sirve igual. Si algún día el adaptador lo corrige,
// este script no encontrará nada que mover y no hará nada.

import fs from 'node:fs';

const RUTA = '.vercel/output/config.json';

if (!fs.existsSync(RUTA)) {
  console.log('[cache-headers] no hay config.json de Vercel, nada que hacer');
  process.exit(0);
}

const cfg = JSON.parse(fs.readFileSync(RUTA, 'utf8'));
const rutas = cfg.routes ?? [];

const iFs = rutas.findIndex((r) => r.handle === 'filesystem');
const iCache = rutas.findIndex(
  (r) => typeof r.src === 'string' && r.src.includes('_astro') && r.headers?.['cache-control']
);

if (iFs === -1 || iCache === -1) {
  console.log('[cache-headers] no aplica: no están las dos rutas esperadas');
  process.exit(0);
}

if (iCache < iFs) {
  console.log('[cache-headers] ya estaba en orden, sin cambios');
  process.exit(0);
}

const [regla] = rutas.splice(iCache, 1);
rutas.splice(iFs, 0, regla);
cfg.routes = rutas;
fs.writeFileSync(RUTA, JSON.stringify(cfg, null, 2));
console.log(`[cache-headers] regla de /_astro/ movida de la posición ${iCache} a la ${iFs}`);
