// Las 24 soluciones del catálogo, agrupadas en 6 familias.
// Cada familia tiene página propia en /soluciones/<slug> (ver
// src/pages/soluciones/[slug].astro), así que además del label y los items
// lleva su propio texto de SEO y de contexto.
// No confundir con los 4 casosHome de la sección #resolvemos de la Home.

export interface Solucion {
  nombre: string;
  /** Una línea. Se usa en las tarjetas del índice y en la Home. */
  linea: string;
  /** Desarrollo para la página de familia: qué hace y qué cambia en el día a día. */
  detalle: string;
}

export interface Familia {
  slug: string;
  label: string;
  icono: string;
  /** H1 de la página de familia. */
  titulo: string;
  metaTitle: string;
  metaDescription: string;
  /** Entradilla bajo el H1. */
  intro: string;
  /** Párrafo de contexto: el problema que resuelve esta familia. */
  contexto: string;
  items: Solucion[];
}

export const familias: Familia[] = [
  {
    slug: 'documentos-y-datos',
    label: 'Documentos y datos',
    icono: 'checklist',
    titulo: 'Automatizar la lectura de documentos con IA',
    metaTitle: 'Automatizar documentos y datos con IA',
    metaDescription:
      'Lectura y extracción de PDFs, clasificación automática, comparación de versiones y validación de datos maestros. Deja de teclear documentos a mano.',
    intro:
      'Todo lo que hoy alguien abre, lee, interpreta y vuelve a teclear en otro sitio.',
    contexto:
      'Es el trabajo más invisible de una empresa y el que más horas se lleva: facturas de proveedor que alguien pasa al ERP, albaranes que se archivan a mano, pliegos que hay que leer enteros para encontrar tres datos. No es difícil, es repetitivo, y por eso se hace tarde, con prisa y con erratas. Un sistema de IA lee esos documentos, extrae lo que importa y deja al equipo solo las excepciones que necesitan criterio.',
    items: [
      {
        nombre: 'Lectura y extracción de documentos',
        linea: 'Los campos del PDF llegan estructurados a tu sistema.',
        detalle:
          'El sistema lee facturas, albaranes, contratos o fichas técnicas —en PDF, escaneados o fotografiados— y saca los campos que necesitas ya estructurados. En lugar de teclearlos, tu equipo confirma lo que el sistema ha entendido y corrige lo que no encaja.',
      },
      {
        nombre: 'Clasificación y archivo',
        linea: 'Cada documento se etiqueta y se guarda donde toca.',
        detalle:
          'Cada documento que entra se identifica por lo que es, se etiqueta con vuestros criterios y acaba en la carpeta o el sistema que le corresponde. Se acaba la bandeja de "esto ya lo ordenaré" y encontrar algo deja de depender de quién lo guardó.',
      },
      {
        nombre: 'Comparación de versiones',
        linea: 'Señala qué ha cambiado entre dos versiones y qué implica.',
        detalle:
          'Dos versiones de un contrato, un pliego o una especificación, y el sistema marca exactamente qué ha cambiado y qué consecuencias tiene. Sustituye la lectura en paralelo a dos pantallas, que es donde se escapan las cláusulas que luego cuestan dinero.',
      },
      {
        nombre: 'Validación de datos maestros',
        linea: 'Detecta duplicados e incoherencias antes de que molesten.',
        detalle:
          'Revisa vuestras fichas de clientes, proveedores o artículos buscando duplicados, campos incoherentes y datos que se contradicen entre sistemas. Los saca a la luz antes de que provoquen un pedido mal enviado o una factura a la razón social equivocada.',
      },
    ],
  },
  {
    slug: 'clientes-y-comunicacion',
    label: 'Clientes y comunicación',
    icono: 'pizarra',
    titulo: 'IA para atención al cliente y comunicación interna',
    metaTitle: 'Automatizar atención al cliente con IA',
    metaDescription:
      'Asistentes que responden con vuestra documentación, triaje de bandejas de entrada, actas automáticas de reuniones y buscador de conocimiento interno.',
    intro:
      'Responder, clasificar y encontrar información: lo que consume la jornada sin aparecer en ningún informe.',
    contexto:
      'La mayoría de las preguntas que recibe una empresa ya tienen respuesta escrita en algún sitio. El problema es que está repartida entre correos antiguos, manuales en PDF y la cabeza de dos personas. Eso convierte cada consulta en una pequeña investigación y hace que los tiempos de respuesta dependan de quién esté disponible ese día.',
    items: [
      {
        nombre: 'Asistente de atención al cliente',
        linea: 'Responde con vuestra documentación y escala lo que hace falta.',
        detalle:
          'Un asistente que contesta usando vuestros manuales, condiciones y precedentes, no información genérica de internet. Resuelve lo repetitivo al momento y pasa a una persona lo que tiene matiz, con el contexto ya reunido para que no haya que preguntar dos veces.',
      },
      {
        nombre: 'Triaje de bandejas de entrada',
        linea: 'Clasifica el correo y propone borrador de respuesta.',
        detalle:
          'Ordena el buzón compartido por tipo y urgencia, lo asigna a quien corresponde y deja preparado un borrador de respuesta. La persona revisa y envía, en vez de empezar cada correo desde una página en blanco.',
      },
      {
        nombre: 'Resúmenes de llamadas y reuniones',
        linea: 'Actas con compromisos, responsable y fecha.',
        detalle:
          'De la grabación o la transcripción sale un acta con lo acordado, quién se encarga y para cuándo. Lo importante no es el resumen: es que los compromisos queden por escrito el mismo día y no dependan de la memoria de quien tomó notas.',
      },
      {
        nombre: 'Buscador de conocimiento interno',
        linea: 'Responde dudas del equipo citando la fuente.',
        detalle:
          'Preguntas en lenguaje normal sobre vuestros procedimientos y obtienes la respuesta con el enlace al documento del que sale. Reduce las interrupciones a las dos o tres personas que "saben cómo se hace esto" y acorta mucho la curva de quien acaba de entrar.',
      },
    ],
  },
  {
    slug: 'procesos-y-sistemas',
    label: 'Procesos y sistemas',
    icono: 'globo',
    titulo: 'Automatizar procesos e integrar sistemas con IA',
    metaTitle: 'Automatización de procesos e integración de sistemas',
    metaDescription:
      'Integración entre herramientas, flujos con decisión asistida, cierres y conciliaciones automáticas e informes recurrentes que se generan solos.',
    intro:
      'Cuando el dato existe pero alguien tiene que moverlo de un sitio a otro.',
    contexto:
      'Casi ninguna empresa tiene un problema de falta de herramientas: tiene un ERP, un CRM, hojas de cálculo y correo, y una persona haciendo de puente entre todos. Ese puente humano es lento, se equivoca cuando hay volumen y desaparece cuando esa persona está de baja. Lo que automatizamos aquí no son las herramientas, es el hueco entre ellas.',
    items: [
      {
        nombre: 'Integración entre herramientas',
        linea: 'El dato se escribe una vez y viaja solo.',
        detalle:
          'Conectamos los sistemas que ya usáis para que un dato introducido en uno aparezca en los demás sin que nadie lo copie. Se acaban las discrepancias entre lo que dice el CRM y lo que dice el ERP, que casi siempre nacen de una copia que se olvidó.',
      },
      {
        nombre: 'Flujos con decisión asistida',
        linea: 'La IA resuelve los pasos con matiz; tú confirmas.',
        detalle:
          'Para los procesos donde no vale un "si esto, entonces aquello" —clasificar una incidencia, decidir si un pedido cumple condiciones— el sistema aplica vuestro criterio, propone la decisión y la explica. Lo que tiene consecuencias lo confirma siempre una persona.',
      },
      {
        nombre: 'Cierres y conciliaciones',
        linea: 'Cruza fuentes y deja los descuadres señalados.',
        detalle:
          'Cruza banco, facturación y contabilidad, casa lo que cuadra y presenta solo los descuadres con su posible explicación. Convierte el cierre de mes de una jornada de revisión a una de resolver excepciones.',
      },
      {
        nombre: 'Informes recurrentes',
        linea: 'El informe se genera solo, con comentario y avisos.',
        detalle:
          'El informe semanal o mensual se monta solo con los datos actualizados, y además señala lo que se sale de lo normal. Deja de ser un trabajo de recopilación para pasar a ser una lectura de cinco minutos.',
      },
    ],
  },
  {
    slug: 'comercial-y-contenido',
    label: 'Comercial y contenido',
    icono: 'embudo',
    titulo: 'IA para el trabajo comercial y la producción de contenido',
    metaTitle: 'IA para propuestas comerciales y licitaciones',
    metaDescription:
      'Borradores de propuestas a partir de vuestro histórico, priorización de leads, contenido con vuestra voz y respuesta asistida a licitaciones.',
    intro:
      'Preparar propuestas y decidir a quién atender primero, sin que se vaya media semana en ello.',
    contexto:
      'El trabajo comercial tiene una parte de criterio, que no se automatiza, y una parte de reconstrucción: buscar la propuesta parecida del año pasado, adaptar párrafos, revisar el pliego entero para ver si encajáis. Esa segunda parte es la que se come el tiempo y la que hace que las oportunidades buenas se contesten tarde.',
    items: [
      {
        nombre: 'Borradores de propuestas',
        linea: 'Primera versión coherente a partir de vuestro histórico.',
        detalle:
          'A partir de las propuestas que ya habéis ganado, el sistema monta una primera versión adaptada al caso concreto. No sustituye vuestro criterio comercial: os ahorra la hora y media de copiar, pegar y reescribir antes de poder pensar.',
      },
      {
        nombre: 'Priorización de leads',
        linea: 'Ordena contactos por encaje y explica por qué.',
        detalle:
          'Ordena los contactos entrantes según lo que en vuestra experiencia acaba cerrando, y dice en qué se basa. Sirve para atender primero lo que tiene sentido cuando entran más peticiones de las que se pueden atender el mismo día.',
      },
      {
        nombre: 'Contenido con vuestra voz',
        linea: 'Borradores en vuestro estilo, revisión humana antes de publicar.',
        detalle:
          'Borradores de artículos, fichas o newsletters escritos a partir de vuestros propios textos, para que suenen a vosotros y no a plantilla. Siempre pasan por revisión humana antes de publicarse.',
      },
      {
        nombre: 'Respuesta a licitaciones',
        linea: 'Extrae requisitos del pliego y marca lo que falta.',
        detalle:
          'Lee el pliego, saca la lista de requisitos y documentación exigida y señala qué tenéis y qué os falta. Permite decidir en un rato si merece la pena presentarse, en lugar de descubrirlo tres días antes del plazo.',
      },
    ],
  },
  {
    slug: 'operaciones-y-prevision',
    label: 'Operaciones y previsión',
    icono: 'grafico',
    titulo: 'IA para operaciones, previsión y mantenimiento',
    metaTitle: 'Previsión de demanda y mantenimiento predictivo con IA',
    metaDescription:
      'Previsión de demanda y stock, planificación de rutas y turnos, control de calidad asistido y mantenimiento predictivo para industria y logística.',
    intro: 'Anticiparse en lugar de reaccionar, con los datos que ya generáis.',
    contexto:
      'En operaciones el coste no está en la tarea, está en la sorpresa: la rotura de stock que obliga a un envío urgente, la máquina que para en el peor momento, la ruta que se rehace a mano porque ha fallado algo. Vuestros sistemas ya registran las señales que preceden a esas sorpresas; casi nunca hay tiempo de sentarse a mirarlas.',
    items: [
      {
        nombre: 'Previsión de demanda y stock',
        linea: 'Anticipa qué hará falta y avisa antes de la rotura.',
        detalle:
          'Cruza histórico de ventas, estacionalidad y plazos de proveedor para estimar qué vais a necesitar y cuándo pedirlo. El objetivo doble es no quedarse sin material y no tener capital inmovilizado en almacén.',
      },
      {
        nombre: 'Planificación de rutas y turnos',
        linea: 'Propone el reparto del día y recalcula si algo cambia.',
        detalle:
          'Propone el reparto de la jornada teniendo en cuenta cargas, ventanas horarias y disponibilidad real. Cuando surge un imprevisto a media mañana, recalcula en vez de obligar a rehacer el cuadrante a mano.',
      },
      {
        nombre: 'Control de calidad asistido',
        linea: 'Aparta lo que se desvía del estándar para revisión.',
        detalle:
          'A partir de imágenes o mediciones, separa lo que se sale de vuestro estándar para que una persona lo revise. No sustituye al control humano: hace que se concentre donde hay indicios en lugar de repartirse por muestreo.',
      },
      {
        nombre: 'Mantenimiento predictivo',
        linea: 'Avisa de la intervención antes de la parada.',
        detalle:
          'Detecta en los datos del equipo los patrones que suelen preceder a un fallo y avisa con margen para intervenir. Convierte una parada no planificada, que es la cara, en un mantenimiento programado.',
      },
    ],
  },
  {
    slug: 'personas-y-talento',
    label: 'Personas y talento',
    icono: 'equipo',
    titulo: 'IA para selección, onboarding y gestión de personas',
    metaTitle: 'IA para selección de personal y onboarding',
    metaDescription:
      'Cribado de candidaturas, onboarding asistido, control de vencimientos de formación y contratos y análisis de encuestas internas.',
    intro:
      'La parte administrativa de recursos humanos, que crece con cada persona que entra.',
    contexto:
      'En una empresa pequeña, recursos humanos no suele ser un departamento: es alguien que además hace otras cosas. Y aun así hay que leer cien currículos, acompañar a quien entra, vigilar que no caduque una formación obligatoria y leer las respuestas abiertas de la encuesta anual. Es trabajo importante que acaba haciéndose a ratos.',
    items: [
      {
        nombre: 'Cribado de candidaturas',
        linea: 'Resume y ordena frente a los requisitos del puesto.',
        detalle:
          'Resume cada candidatura frente a los requisitos reales del puesto y ordena la pila, explicando el porqué de cada posición. La decisión sigue siendo vuestra: lo que cambia es que llegáis a la entrevista habiendo leído lo relevante de todos, no de los diez primeros.',
      },
      {
        nombre: 'Onboarding asistido',
        linea: 'Acompaña a quien entra: dónde está todo y qué toca.',
        detalle:
          'Un asistente que responde las dudas de las primeras semanas —dónde está cada cosa, cómo se hace este trámite, a quién se pregunta— con vuestra documentación real. Descarga al equipo de repetir lo mismo con cada incorporación.',
      },
      {
        nombre: 'Documentación de personas',
        linea: 'Avisa de vencimientos de formación y contratos.',
        detalle:
          'Controla fechas de caducidad de formaciones obligatorias, reconocimientos médicos y contratos, y avisa con antelación suficiente para renovar. Evita el descubrimiento tardío, que en materia de prevención puede salir caro.',
      },
      {
        nombre: 'Análisis de encuestas internas',
        linea: 'Agrupa las respuestas abiertas por tema.',
        detalle:
          'Agrupa por temas los comentarios libres de una encuesta y señala qué se repite y con qué intensidad. Permite leer de verdad doscientas respuestas abiertas en lugar de quedarse con las cinco primeras y la media numérica.',
      },
    ],
  },
];
