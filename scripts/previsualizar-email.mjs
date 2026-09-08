// Renderiza la confirmación al lead sin enviar nada por Resend.
//
//   node scripts/previsualizar-email.mjs
//
// Escribe el HTML en previsualizacion-email.html (ignorado por git) e
// imprime la versión texto por consola. Sirve para revisar el copy, el
// escapado y la fecha calculada sin gastar cuota de la API.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const tmp = mkdtempSync(path.join(tmpdir(), 'mds-email-'));
const bundle = path.join(tmp, 'endpoint.mjs');

execFileSync(
  process.execPath,
  [
    path.join('node_modules', 'esbuild', 'bin', 'esbuild'),
    'src/pages/api/diagnostico.ts',
    '--bundle',
    '--platform=node',
    '--format=esm',
    '--log-level=error',
    `--outfile=${bundle}`,
  ],
  { stdio: 'inherit' },
);

const { textoConfirmacion, htmlConfirmacion } = await import(pathToFileURL(bundle).href);
const { fechaEntregaDiagnostico } = await import(pathToFileURL(path.resolve('src/lib/fechas.ts')).href).catch(
  () => ({ fechaEntregaDiagnostico: null }),
);

// Un lead con caracteres que deben escaparse en el HTML.
const lead = {
  nombre: 'Ana <script>alert(1)</script> & Cía',
  email: 'ana@ejemplo.com',
  sector: 'Industria "pesada"',
  problema: "Pasamos facturas a mano al ERP <b>todos los días</b> & nos comen la semana",
  horas: '12 h/semana (~552 h/año)',
};

const fecha = process.argv[2] ?? null;
const f = fecha ?? new Date().toLocaleDateString('es-ES');
const fechaEntrega = fechaEntregaDiagnostico ? fechaEntregaDiagnostico() : f;

const salida = 'previsualizacion-email.html';
writeFileSync(salida, htmlConfirmacion(lead, fechaEntrega), 'utf8');
rmSync(tmp, { recursive: true, force: true });

console.log('--- ASUNTO ---');
console.log(`Hemos recibido tu caso — te escribimos antes del ${fechaEntrega}`);
console.log('\n--- TEXTO ---');
console.log(textoConfirmacion(lead, fechaEntrega));
console.log(`\n--- HTML escrito en ${salida} (ábrelo en el navegador) ---`);
