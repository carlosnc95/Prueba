// Casos de la sección #resolvemos de la Home ("Lo que nos suelen contar").
// No confundir con las 24 soluciones de /casos (src/data/soluciones.ts).
export const casosHome = [
  {
    icon: 'icon-datos',
    sector: 'Industria',
    quote: 'Revisamos cientos de documentos técnicos a mano cada semana.',
    solution:
      'Un sistema de IA lee, clasifica y extrae los datos de cada documento, los cruza con vuestros criterios y deja al equipo solo las excepciones que necesitan criterio humano.',
  },
  {
    icon: 'icon-engranajes',
    sector: 'Operaciones',
    quote: 'Introducimos los mismos datos en varios sistemas cada día.',
    solution:
      'Conectamos las herramientas que ya usáis para que el dato se escriba una sola vez y viaje solo, con control de errores y trazabilidad de cada cambio.',
  },
  {
    icon: 'icon-chat',
    sector: 'Atención al cliente',
    quote: 'Los clientes preguntan siempre lo mismo y tardamos en responder.',
    solution:
      'Un asistente responde con vuestra propia documentación, mantiene el tono de la casa y escala a una persona solo cuando la consulta lo pide.',
  },
  {
    icon: 'icon-datos',
    sector: 'Administración',
    quote: 'El cierre de mes se nos va en cuadrar hojas de cálculo.',
    solution:
      'Consolidamos las fuentes de datos, automatizamos las comprobaciones repetitivas y dejamos el cierre listo para revisar en lugar de construirlo desde cero.',
  },
] as const;
