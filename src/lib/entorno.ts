// Lectura de variables de entorno del servidor.
//
// Astro sustituye `import.meta.env.X` en tiempo de COMPILACIÓN: el valor
// acaba incrustado en el bundle como un literal. Eso tiene dos trampas en
// producción, y las dos son silenciosas:
//
//   1. Si añades una variable en Vercel después del último build, el código
//      desplegado sigue teniendo `undefined` escrito dentro.
//   2. Si rotas una clave sin reconstruir, sigue usándose la antigua.
//
// En ninguno de los dos casos salta un error: simplemente no funciona. Por
// eso se consulta primero `process.env`, que Vercel sí rellena en ejecución,
// y se deja el valor de compilación como respaldo.
//
// Uso:  leerEnv('HUBSPOT_TOKEN', import.meta.env.HUBSPOT_TOKEN)
//
// El segundo argumento se escribe literal a propósito: así Vite lo puede
// sustituir. Con un acceso dinámico (import.meta.env[nombre]) no lo haría.

export function leerEnv(nombre: string, valorDeCompilacion?: unknown): string | undefined {
  const enEjecucion = typeof process !== 'undefined' ? process.env?.[nombre] : undefined;
  if (enEjecucion) return enEjecucion;
  return typeof valorDeCompilacion === 'string' && valorDeCompilacion ? valorDeCompilacion : undefined;
}
