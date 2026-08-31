// Las 24 soluciones del catálogo /casos, agrupadas en 6 familias.
// No confundir con los 4 casosHome de la sección #resolvemos de la Home.
export const familias = [
  {
    label: 'Documentos y datos',
    icono: 'checklist',
    items: [
      { nombre: 'Lectura y extracción de documentos', linea: 'Los campos del PDF llegan estructurados a tu sistema.' },
      { nombre: 'Clasificación y archivo', linea: 'Cada documento se etiqueta y se guarda donde toca.' },
      { nombre: 'Comparación de versiones', linea: 'Señala qué ha cambiado entre dos versiones y qué implica.' },
      { nombre: 'Validación de datos maestros', linea: 'Detecta duplicados e incoherencias antes de que molesten.' },
    ],
  },
  {
    label: 'Clientes y comunicación',
    icono: 'pizarra',
    items: [
      { nombre: 'Asistente de atención al cliente', linea: 'Responde con vuestra documentación y escala lo que hace falta.' },
      { nombre: 'Triaje de bandejas de entrada', linea: 'Clasifica el correo y propone borrador de respuesta.' },
      { nombre: 'Resúmenes de llamadas y reuniones', linea: 'Actas con compromisos, responsable y fecha.' },
      { nombre: 'Buscador de conocimiento interno', linea: 'Responde dudas del equipo citando la fuente.' },
    ],
  },
  {
    label: 'Procesos y sistemas',
    icono: 'globo',
    items: [
      { nombre: 'Integración entre herramientas', linea: 'El dato se escribe una vez y viaja solo.' },
      { nombre: 'Flujos con decisión asistida', linea: 'La IA resuelve los pasos con matiz; tú confirmas.' },
      { nombre: 'Cierres y conciliaciones', linea: 'Cruza fuentes y deja los descuadres señalados.' },
      { nombre: 'Informes recurrentes', linea: 'El informe se genera solo, con comentario y avisos.' },
    ],
  },
  {
    label: 'Comercial y contenido',
    icono: 'embudo',
    items: [
      { nombre: 'Borradores de propuestas', linea: 'Primera versión coherente a partir de vuestro histórico.' },
      { nombre: 'Priorización de leads', linea: 'Ordena contactos por encaje y explica por qué.' },
      { nombre: 'Contenido con vuestra voz', linea: 'Borradores en vuestro estilo, revisión humana antes de publicar.' },
      { nombre: 'Respuesta a licitaciones', linea: 'Extrae requisitos del pliego y marca lo que falta.' },
    ],
  },
  {
    label: 'Operaciones y previsión',
    icono: 'grafico',
    items: [
      { nombre: 'Previsión de demanda y stock', linea: 'Anticipa qué hará falta y avisa antes de la rotura.' },
      { nombre: 'Planificación de rutas y turnos', linea: 'Propone el reparto del día y recalcula si algo cambia.' },
      { nombre: 'Control de calidad asistido', linea: 'Aparta lo que se desvía del estándar para revisión.' },
      { nombre: 'Mantenimiento predictivo', linea: 'Avisa de la intervención antes de la parada.' },
    ],
  },
  {
    label: 'Personas y talento',
    icono: 'equipo',
    items: [
      { nombre: 'Cribado de candidaturas', linea: 'Resume y ordena frente a los requisitos del puesto.' },
      { nombre: 'Onboarding asistido', linea: 'Acompaña a quien entra: dónde está todo y qué toca.' },
      { nombre: 'Documentación de personas', linea: 'Avisa de vencimientos de formación y contratos.' },
      { nombre: 'Análisis de encuestas internas', linea: 'Agrupa las respuestas abiertas por tema.' },
    ],
  },
] as const;
