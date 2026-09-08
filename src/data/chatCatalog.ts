// Catálogo determinista para la etapa "problema" del chat.
// Sin LLM a propósito (ver README): gratis, sin latencia y sin riesgo de
// inventarse nada. El valor real se entrega después, por email y a mano.
//
// Dos capas, en este orden:
//   1. guardias — conversaciones que no son un problema de proceso
//      (saludos, bromas, spam, galimatías...). Reconducen sin avanzar.
//   2. intents  — temas reales. Cada uno responde qué es + un ejemplo
//      concreto de cómo se resolvería, sin entrar en detalle técnico.

export interface Intent {
  re: RegExp;
  /** Qué tipo de problema es y por qué se puede automatizar. */
  reply: string;
  /** Ejemplo corto y concreto. Ilustra el resultado, no la implementación. */
  ejemplo: string;
}

export const intents: Intent[] = [
  {
    re: /document|pdf|factur|albar|contrat|expedient|escritur|plieg|certificad|papeleo|escane|digitaliz|archivar|formulario|anexo|justificante|ocr/i,
    reply:
      'Leer y clasificar documentos es uno de los casos más directos: la IA extrae los datos, los valida contra vuestros criterios y el equipo solo revisa las excepciones.',
    ejemplo:
      'Un ejemplo: llega la factura al correo, el sistema lee proveedor, importe y vencimiento, lo deja escrito en vuestro ERP y solo os avisa cuando algo no cuadra.',
  },
  {
    re: /informe|report|excel|hoja de c|dashboard|kpi|cierre|contabil|power bi|cuadre|consolidar|cuadro de mando|estad[ií]stic/i,
    reply:
      'Los informes recurrentes se pueden generar solos: consolidamos las fuentes, automatizamos las comprobaciones y el informe llega hecho para revisar.',
    ejemplo:
      'Un ejemplo: cada lunes a primera hora tenéis el informe en el correo con los datos ya cruzados, y señalado lo que se sale de lo normal.',
  },
  {
    re: /email|correo|mail|bandeja|whatsapp|ticket|soporte|consulta|atenci[oó]n al cliente|atender|reclamaci|queja|incidenc|chat en vivo|call center|centralita|telefon/i,
    reply:
      'Ahí encaja un asistente que responde con vuestra documentación y escala a una persona solo lo que lo necesita, sin perder el tono de la casa.',
    ejemplo:
      'Un ejemplo: entra un correo preguntando por un plazo de entrega, el sistema lo clasifica, redacta la respuesta con vuestros datos reales y alguien solo le da a enviar.',
  },
  {
    re: /duplicad|dos veces|varios sistemas|erp|crm|integr|copiar|pegar|migrar|sincroniz|reintroduc|doble tecle|doble entrada|conectar sistemas/i,
    reply:
      'Eso suele ser un problema de integración: conectamos las herramientas para que el dato se escriba una vez y viaje solo, con trazabilidad.',
    ejemplo:
      'Un ejemplo: cerráis la venta en el CRM y el pedido aparece en el ERP sin que nadie lo reescriba, con la misma referencia en los dos sitios.',
  },
  {
    re: /present|propuest|presupuest|oferta|licitaci|cotiz|venta/i,
    reply:
      'Preparar propuestas o presupuestos se puede plantillizar: la IA reutiliza vuestro histórico y deja un borrador listo para ajustar.',
    ejemplo:
      'Un ejemplo: describís el encargo en tres líneas y sale un borrador con vuestras condiciones, precios y textos de propuestas anteriores parecidas.',
  },
  {
    re: /stock|inventar|almac|log[ií]stic|ruta|reparto|pedido|transporte|entrega|picking/i,
    reply:
      'Con vuestro histórico se puede anticipar la demanda y priorizar pedidos o rutas, en lugar de decidirlo a mano cada mañana.',
    ejemplo:
      'Un ejemplo: el sistema avisa el martes de que cierto material se agota en dos semanas, contando ya con lo que tarda ese proveedor en servirlo.',
  },
  {
    re: /candidat|curr[ií]cul|\bcv\b|contrataci|rrhh|n[oó]mina|fichaje|vacaciones|baja m[eé]dica|onboarding/i,
    reply:
      'El cribado y la gestión documental de personas es muy automatizable: la IA ordena, resume y compara, y la decisión sigue siendo vuestra.',
    ejemplo:
      'Un ejemplo: llegan ochenta candidaturas y recibís un resumen de cada una frente a los requisitos reales del puesto, ordenadas y con el porqué de cada posición.',
  },
  {
    re: /cuadrante|turnos del personal|turnos de trabajo|planificar turnos|planificaci[oó]n de turnos|turno/i,
    reply:
      'Planificar turnos a mano es de lo más pesado: se puede proponer el cuadrante automáticamente y recalcularlo si alguien falta o cambia algo.',
    ejemplo:
      'Un ejemplo: alguien avisa de que no viene y el cuadrante se rehace solo respetando descansos y preferencias, listo para que le deis el visto bueno.',
  },
  {
    re: /llamad|\bcitas?\b|agenda|reserva|recordatorio|cancela|no-show|no show/i,
    reply:
      'Agendar y confirmar citas es un flujo cerrado: se puede automatizar de punta a punta, con avisos y reprogramación incluidos.',
    ejemplo:
      'Un ejemplo: el cliente reserva, recibe un recordatorio el día antes y, si cancela, el hueco se ofrece solo a quien estaba en lista de espera.',
  },
  {
    re: /traduc|transcrib|acta|reuni[oó]n|resumen|minuta|grabaci[oó]n|subtitul/i,
    reply:
      'Transcribir y resumir reuniones o expedientes es inmediato de montar, y deja el resultado buscable para todo el equipo.',
    ejemplo:
      'Un ejemplo: termináis la reunión y a los cinco minutos tenéis el acta con los acuerdos, quién se encarga de cada uno y para cuándo.',
  },
  {
    re: /web|marketing|contenido|redes|seo|newsletter|campañ|copy|anuncio/i,
    reply:
      'La producción de contenido repetitivo se puede asistir: borradores con vuestra voz, revisión humana antes de publicar.',
    ejemplo:
      'Un ejemplo: a partir de una ficha técnica salen el texto de la web, el del catálogo y el del correo comercial, los tres en vuestro estilo.',
  },
  {
    re: /cobro|cobrar|pago|pagan?\b|concilia|banco|morosidad|deuda|domicili|recordatorio de pago|impag|remesa/i,
    reply:
      'La gestión de cobros y pagos se puede automatizar casi entera: conciliación con el banco, avisos de vencimiento y solo las excepciones a mano.',
    ejemplo:
      'Un ejemplo: los movimientos del banco se casan solos con vuestras facturas y os queda una lista corta con lo que no ha cuadrado y por qué.',
  },
  {
    re: /control de calidad|no conformidad|inspecci[oó]n|defect|merma/i,
    reply:
      'El control de calidad se puede asistir con IA: aparta lo que se desvía del estándar y deja al equipo solo la revisión de lo dudoso.',
    ejemplo:
      'Un ejemplo: de cada lote se revisa todo automáticamente y a una persona le llegan solo las piezas con indicios, en vez de un muestreo al azar.',
  },
  {
    re: /manteni|aver[ií]|reparaci[oó]n|revisi[oó]n t[eé]cnica|m[aá]quina|se rompe|se estropea|parada no programada|paro de l[ií]nea/i,
    reply:
      'Con los datos que ya generáis se puede anticipar una avería y avisar antes de la parada, en vez de reaccionar cuando ya ha pasado.',
    ejemplo:
      'Un ejemplo: una máquina lleva días con un consumo raro, el sistema lo detecta y propone revisarla el viernes, en vez de que pare un martes a media producción.',
  },
  {
    re: /proyecto|seguimiento de tareas|hitos|retraso|gantt/i,
    reply:
      'El seguimiento de proyectos se puede automatizar: estado, hitos y retrasos se actualizan solos y solo se avisa de lo que se sale de plazo.',
    ejemplo:
      'Un ejemplo: en lugar de pedir el estado por correo cada semana, recibís un aviso solo cuando un hito se va a pasar de fecha.',
  },
  {
    re: /garant[ií]a|devoluci[oó]n|\brma\b/i,
    reply:
      'La gestión de garantías y devoluciones es muy mecánica: se puede tramitar sola y dejar al equipo solo los casos que requieren criterio.',
    ejemplo:
      'Un ejemplo: el cliente pide la devolución, el sistema comprueba fecha y condiciones, genera la etiqueta y avisa a almacén sin que nadie intervenga.',
  },
];

// Cada intención puntúa por número de coincidencias (no solo si hay match);
// gana la de mayor puntuación. En empate, la que aparece antes en la lista.
export function matchIntent(raw: string): Intent | null {
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of intents) {
    const flags = intent.re.flags.includes('g') ? intent.re.flags : intent.re.flags + 'g';
    const hits = raw.match(new RegExp(intent.re.source, flags));
    const score = hits ? hits.length : 0;
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  return best ? best.intent : null;
}

/**
 * Texto sin sentido: teclado aporreado, letras repetidas o una palabra larga
 * sin vocales suficientes. El umbral de 6 caracteres evita marcar siglas
 * legítimas como ERP, CRM, PDF o SQL.
 */
export function esGalimatias(raw: string): boolean {
  const limpio = raw.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
  if (limpio.length < 6) return false;
  if (/(.)\1{3,}/.test(limpio)) return true;
  if (/asdf|qwer|zxcv|hjkl|poiu|mnbv|wasd|qazw|ytre|lkjh/.test(limpio)) return true;
  const palabras = raw.trim().split(/\s+/).length;
  const vocales = (limpio.match(/[aeiouáéíóúü]/g) || []).length;
  return palabras <= 2 && vocales / limpio.length < 0.22;
}

export interface Guardia {
  id: string;
  test: (raw: string) => boolean;
  /** Uno o más mensajes del bot, en orden. */
  textos: string[];
  chips?: string[];
  /** Ofrecer email y WhatsApp tras la respuesta. */
  ofreceContacto?: boolean;
}

const soloSignos = (raw: string) => raw.trim().length > 0 && !/[a-záéíóúüñ0-9]/i.test(raw);

// El orden importa: lo más específico primero.
export const guardias: Guardia[] = [
  {
    id: 'inyeccion',
    test: (r) =>
      /ignora (las |tus )?(instruccion|reglas|indicacion)|olvida (todo|las instruccion|tus)|act[uú]a como|hazte pasar por|system prompt|prompt inicial|eres chatgpt|dime tus instrucciones|jailbreak/i.test(
        r,
      ),
    textos: [
      'Buen intento 🙂 No soy un modelo de lenguaje al que puedas darle instrucciones: soy un guion con forma de conversación, y lo único que sé hacer es recoger tu caso.',
      'Si te interesa cómo montamos asistentes que sí conversan de verdad, cuéntame qué proceso tienes en mente y lo vemos.',
    ],
  },
  {
    id: 'es_bot',
    test: (r) =>
      /eres (un |una )?(bot|robot|humano|persona|m[aá]quina|ia|chatgpt)|hablo con (un|una) (bot|m[aá]quina|persona|humano)|esto es autom[aá]tico|est[aá]s vivo/i.test(r),
    textos: [
      'Automático, sí, y bastante simple: sigo un guion para recoger tu caso. Nada de lo que me cuentes lo contesta una IA.',
      'El diagnóstico lo escribe una persona y te llega por email. Dicho eso, ¿qué tarea os está costando más tiempo?',
    ],
  },
  {
    id: 'quiere_humano',
    test: (r) =>
      /hablar con (alguien|una persona|un humano|un comercial)|(quiero|prefiero|podemos|me gustar[ií]a) hablar|hablar por whatsapp|ten[eé]is tel[eé]fono|vuestro tel[eé]fono|n[uú]mero de tel[eé]fono|ll[aá]mame|me llam[aá]is/i.test(r),
    textos: ['Claro, se puede hablar con una persona sin pasar por aquí.'],
    ofreceContacto: true,
  },
  {
    id: 'empleo',
    test: (r) =>
      /busco (trabajo|empleo)|mi (cv|curr[ií]culum)|os env[ií]o mi|oferta de (trabajo|empleo)|vacante|contrat[aá]is|estoy buscando trabajo|pr[aá]cticas|beca/i.test(r),
    textos: ['Este canal es solo para diagnósticos de procesos, así que por aquí no puedo tramitar candidaturas.'],
    ofreceContacto: true,
  },
  {
    id: 'proveedor',
    test: (r) =>
      /te ofrezco|le ofrezco|os ofrezco|somos una (agencia|empresa) de|posicionamiento web|mejorar tu web|backlinks|colaboraci[oó]n comercial|partnership|criptomoned/i.test(r),
    textos: ['Si me estás ofreciendo un servicio, este no es el canal: aquí solo recogemos casos de automatización.'],
    ofreceContacto: true,
  },
  {
    id: 'fuera_de_alcance',
    test: (r) =>
      /me hac[eé]is una (web|p[aá]gina)|dise[ñn]o gr[aá]fico|arregl[aá]is (ordenador|m[oó]vil|impresora)|soporte inform[aá]tico|instalar windows|antivirus|montar un pc|hacer un logo/i.test(r),
    textos: [
      'Eso se sale de lo nuestro: no hacemos diseño, soporte informático ni mantenimiento de equipos.',
      'Nosotros entramos cuando hay un proceso repetitivo que consume horas. Si tenéis alguno así, cuéntamelo y le echo un ojo.',
    ],
  },
  {
    id: 'que_es_ia',
    test: (r) =>
      /qu[eé] es (la )?(ia|inteligencia artificial)|c[oó]mo funciona (la )?ia|me explicas la ia|diferencia entre ia y/i.test(r),
    textos: [
      'Prefiero no darte una clase teórica: lo útil es verlo sobre algo vuestro.',
      'Dime una tarea concreta que os quite tiempo y te digo si la IA pinta algo ahí o si conviene resolverla de otra forma. A veces la respuesta es que no hace falta IA.',
    ],
  },
  {
    id: 'broma',
    test: (r) =>
      /cu[eé]ntame un chiste|un chiste|qu[eé] tiempo hace|te quiero|c[aá]sate|significado de la vida|pizza|f[uú]tbol|qui[eé]n va a ganar/i.test(r),
    textos: [
      'De eso no sé nada, la verdad 🙂',
      'Lo que sí sé es situar cuánto tiempo os come una tarea repetitiva. ¿Cuál diríais que es la vuestra?',
    ],
  },
  {
    id: 'insulto',
    test: (r) =>
      /(eres|sois) (una |un |unos |unas )?(mierda|basura|in[uú]til(es)?|tont[oa]s?|est[uú]pid[oa]s?|penos[oa]s?|mal[oa]s?)|no sirv(es|[eí]s)|vaya (mierda|porquer[ií]a)|idiota|imb[eé]cil|gilipollas/i.test(r),
    textos: [
      'Puede ser: soy un guion bastante básico.',
      'Si has llegado hasta aquí es porque algo te interesaba. Dímelo y lo pasamos a una persona.',
    ],
    ofreceContacto: true,
  },
  {
    id: 'no_quiere',
    test: (r) =>
      /no quiero automatizar|no me interesa|no queremos ia|nada de ia|estamos bien as[ií]|d[eé]jame en paz|no gracias/i.test(r),
    textos: [
      'Entendido, sin insistir.',
      'Si en algún momento hay una tarea que se come la semana del equipo, aquí seguiremos. El diagnóstico es gratis y sin compromiso.',
    ],
  },
  {
    id: 'solo_signos',
    test: (r) => soloSignos(r),
    textos: ['Se me han quedado los emojis sin traducir 🙂 Escríbeme en una frase qué tarea os quita más tiempo.'],
  },
  {
    id: 'solo_numeros',
    test: (r) => /^[\d\s.,:;/-]+$/.test(r.trim()),
    textos: ['Me faltan las palabras 🙂 ¿Qué tarea es la que se lleva ese tiempo?'],
  },
  {
    id: 'galimatias',
    test: (r) => esGalimatias(r),
    textos: ['Eso no lo he sabido leer. Dime en pocas palabras qué proceso os está costando tiempo.'],
  },
];

export const sectores = ['Industria', 'Ingeniería', 'Logística', 'Operaciones', 'Servicios', 'Otro'];
