// Catálogo determinista para la etapa "problema" del chat.
// Sin LLM a propósito (ver README): gratis, sin latencia y sin riesgo de
// inventarse nada. El valor real se entrega después, por email y a mano.
//
// Dos capas, en este orden:
//   1. guardias — conversaciones que no son un problema de proceso
//      (saludos, bromas, spam, galimatías...). Reconducen sin avanzar.
//   2. intents  — temas reales.
//
// Regla de estilo: una sola respuesta por turno y breve. Encadenar dos
// burbujas para decir lo mismo hace el chat pesado de leer.

export interface Intent {
  re: RegExp;
  /** Qué es + un ejemplo del resultado, en una frase. Sin detalle técnico. */
  reply: string;
}

export const intents: Intent[] = [
  {
    re: /document|pdf|factur|albar|contrat|expedient|escritur|plieg|certificad|papeleo|escane|digitaliz|archivar|formulario|anexo|justificante|ocr/i,
    reply:
      'Es de los casos más directos: la IA extrae los datos y el equipo solo revisa excepciones. Por ejemplo, la factura llega al correo y sus datos acaban en el ERP solos.',
  },
  {
    re: /informe|report|excel|hoja de c|dashboard|kpi|cierre|contabil|power bi|cuadre|consolidar|cuadro de mando|estad[ií]stic/i,
    reply:
      'Los informes recurrentes se generan solos. Por ejemplo, cada lunes lo tienes en el correo con los datos ya cruzados y lo raro señalado.',
  },
  {
    re: /email|correo|mail|bandeja|whatsapp|ticket|soporte|consulta|atenci[oó]n al cliente|atender|reclamaci|queja|incidenc|chat en vivo|call center|centralita|telefon/i,
    reply:
      'Ahí encaja un asistente que responde con vuestra documentación y escala lo que hace falta. Por ejemplo, clasifica el correo y deja la respuesta redactada para enviar.',
  },
  {
    re: /duplicad|dos veces|varios sistemas|erp|crm|integr|copiar|pegar|migrar|sincroniz|reintroduc|doble tecle|doble entrada|conectar sistemas/i,
    reply:
      'Suena a problema de integración: el dato se escribe una vez y viaja solo. Por ejemplo, cierras la venta en el CRM y el pedido aparece en el ERP sin reescribirlo.',
  },
  {
    re: /present|propuest|presupuest|oferta|licitaci|cotiz|venta/i,
    reply:
      'Preparar propuestas se puede plantillizar con vuestro histórico. Por ejemplo, describes el encargo en tres líneas y sale un borrador con vuestros precios y condiciones.',
  },
  {
    re: /stock|inventar|almac|log[ií]stic|ruta|reparto|pedido|transporte|entrega|picking/i,
    reply:
      'Con vuestro histórico se puede anticipar la demanda. Por ejemplo, el sistema avisa de que un material se agota en dos semanas, contando ya el plazo del proveedor.',
  },
  {
    re: /candidat|curr[ií]cul|\bcv\b|contrataci|rrhh|n[oó]mina|fichaje|vacaciones|baja m[eé]dica|onboarding/i,
    reply:
      'El cribado y la documentación de personas es muy automatizable. Por ejemplo, ochenta candidaturas resumidas y ordenadas frente a los requisitos del puesto.',
  },
  {
    re: /cuadrante|turnos del personal|turnos de trabajo|planificar turnos|planificaci[oó]n de turnos|turno/i,
    reply:
      'El cuadrante se puede proponer solo y recalcular si algo cambia. Por ejemplo, alguien avisa de que no viene y se rehace respetando descansos.',
  },
  {
    re: /llamad|\bcitas?\b|agenda|reserva|recordatorio|cancela|no-show|no show/i,
    reply:
      'Agendar y confirmar citas es un flujo cerrado. Por ejemplo, recordatorio el día antes y, si cancela, el hueco se ofrece a quien esté en lista de espera.',
  },
  {
    re: /traduc|transcrib|acta|reuni[oó]n|resumen|minuta|grabaci[oó]n|subtitul/i,
    reply:
      'Transcribir y resumir es inmediato de montar. Por ejemplo, acabáis la reunión y a los cinco minutos tenéis el acta con acuerdos y responsables.',
  },
  {
    re: /web|marketing|contenido|redes|seo|newsletter|campañ|copy|anuncio/i,
    reply:
      'El contenido repetitivo se puede asistir, con revisión humana antes de publicar. Por ejemplo, de una ficha técnica salen el texto de web, catálogo y correo.',
  },
  {
    re: /cobro|cobrar|pago|pagan?\b|concilia|banco|morosidad|deuda|domicili|recordatorio de pago|impag|remesa/i,
    reply:
      'Cobros y pagos se automatizan casi enteros. Por ejemplo, los movimientos del banco se casan solos con vuestras facturas y queda una lista corta de lo que no cuadra.',
  },
  {
    re: /control de calidad|no conformidad|inspecci[oó]n|defect|merma/i,
    reply:
      'El control de calidad se puede asistir. Por ejemplo, se revisa todo automáticamente y a una persona le llegan solo las piezas con indicios.',
  },
  {
    re: /manteni|aver[ií]|reparaci[oó]n|revisi[oó]n t[eé]cnica|m[aá]quina|se rompe|se estropea|parada no programada|paro de l[ií]nea/i,
    reply:
      'Con vuestros datos se puede anticipar una avería. Por ejemplo, una máquina lleva días con un consumo raro y el sistema propone revisarla antes de que pare.',
  },
  {
    re: /proyecto|seguimiento de tareas|hitos|retraso|gantt/i,
    reply:
      'El seguimiento se actualiza solo. Por ejemplo, en vez de pedir el estado cada semana, recibes aviso únicamente cuando un hito se va a pasar de fecha.',
  },
  {
    re: /garant[ií]a|devoluci[oó]n|\brma\b/i,
    reply:
      'Las devoluciones son muy mecánicas. Por ejemplo, se comprueban fecha y condiciones, se genera la etiqueta y se avisa a almacén sin que nadie intervenga.',
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
  /** Un único mensaje, corto. */
  texto: string;
  chips?: string[];
  /** Añade el contacto humano a ese mismo mensaje, sin abrir otra burbuja. */
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
    texto:
      'Buen intento 🙂 Soy un guion, no un modelo de lenguaje: lo único que sé hacer es recoger tu caso. ¿Qué proceso tienes en mente?',
  },
  {
    id: 'es_bot',
    test: (r) =>
      /eres (un |una )?(bot|robot|humano|persona|m[aá]quina|ia|chatgpt)|hablo con (un|una) (bot|m[aá]quina|persona|humano)|esto es autom[aá]tico|est[aá]s vivo/i.test(r),
    texto:
      'Automático, sí, y bastante simple. El diagnóstico lo escribe una persona y te llega por email. ¿Qué tarea os está costando más tiempo?',
  },
  {
    id: 'quiere_humano',
    test: (r) =>
      /hablar con (alguien|una persona|un humano|un comercial)|(quiero|prefiero|podemos|me gustar[ií]a) hablar|hablar por whatsapp|ten[eé]is tel[eé]fono|vuestro tel[eé]fono|n[uú]mero de tel[eé]fono|ll[aá]mame|me llam[aá]is/i.test(r),
    texto: 'Claro, se puede hablar con una persona sin pasar por aquí.',
    ofreceContacto: true,
  },
  {
    id: 'empleo',
    test: (r) =>
      /busco (trabajo|empleo)|mi (cv|curr[ií]culum)|os env[ií]o mi|oferta de (trabajo|empleo)|vacante|contrat[aá]is|estoy buscando trabajo|pr[aá]cticas|beca/i.test(r),
    texto: 'Por aquí solo recogemos casos de automatización, no puedo tramitar candidaturas.',
    ofreceContacto: true,
  },
  {
    id: 'proveedor',
    test: (r) =>
      /te ofrezco|le ofrezco|os ofrezco|somos una (agencia|empresa) de|posicionamiento web|mejorar tu web|backlinks|colaboraci[oó]n comercial|partnership|criptomoned/i.test(r),
    texto: 'Si me estás ofreciendo un servicio, este no es el canal.',
    ofreceContacto: true,
  },
  {
    id: 'fuera_de_alcance',
    test: (r) =>
      /me hac[eé]is una (web|p[aá]gina)|dise[ñn]o gr[aá]fico|arregl[aá]is (ordenador|m[oó]vil|impresora)|soporte inform[aá]tico|instalar windows|antivirus|montar un pc|hacer un logo/i.test(r),
    texto:
      'Eso se sale de lo nuestro: no hacemos diseño ni soporte informático. Entramos cuando hay un proceso repetitivo que consume horas. ¿Tenéis alguno así?',
  },
  {
    id: 'que_es_ia',
    test: (r) =>
      /qu[eé] es (la )?(ia|inteligencia artificial)|c[oó]mo funciona (la )?ia|me explicas la ia|diferencia entre ia y/i.test(r),
    texto:
      'Mejor que la teoría: dime una tarea concreta que os quite tiempo y te digo si la IA pinta algo ahí. A veces la respuesta es que no hace falta.',
  },
  {
    id: 'broma',
    test: (r) =>
      /cu[eé]ntame un chiste|un chiste|qu[eé] tiempo hace|te quiero|c[aá]sate|significado de la vida|pizza|f[uú]tbol|qui[eé]n va a ganar/i.test(r),
    texto: 'De eso no sé 🙂 Lo mío es medir cuánto tiempo os come una tarea repetitiva. ¿Cuál es la vuestra?',
  },
  {
    id: 'insulto',
    test: (r) =>
      /(eres|sois) (una |un |unos |unas )?(mierda|basura|in[uú]til(es)?|tont[oa]s?|est[uú]pid[oa]s?|penos[oa]s?|mal[oa]s?)|no sirv(es|[eí]s)|vaya (mierda|porquer[ií]a)|idiota|imb[eé]cil|gilipollas/i.test(r),
    texto: 'Puede ser, soy un guion básico. Si algo te interesaba, dímelo y lo pasamos a una persona.',
    ofreceContacto: true,
  },
  {
    id: 'no_quiere',
    test: (r) =>
      /no quiero automatizar|no me interesa|no queremos ia|nada de ia|estamos bien as[ií]|d[eé]jame en paz|no gracias/i.test(r),
    texto:
      'Entendido, sin insistir. Si algún día hay una tarea que se come la semana del equipo, el diagnóstico es gratis.',
  },
  {
    id: 'solo_signos',
    test: (r) => soloSignos(r),
    texto: 'Se me han quedado los emojis sin traducir 🙂 ¿Qué tarea os quita más tiempo?',
  },
  {
    id: 'solo_numeros',
    test: (r) => /^[\d\s.,:;/-]+$/.test(r.trim()),
    texto: 'Me faltan las palabras 🙂 ¿Qué tarea es la que se lleva ese tiempo?',
  },
  {
    id: 'galimatias',
    test: (r) => esGalimatias(r),
    texto: 'Eso no lo he sabido leer. ¿Qué proceso os está costando tiempo?',
  },
];

export const sectores = ['Industria', 'Ingeniería', 'Logística', 'Operaciones', 'Servicios', 'Otro'];
