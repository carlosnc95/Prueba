// Catálogo determinista de temas para la etapa "problema" del chat.
// Mínimo viable recomendado por el README: sin LLM, gratis, sin latencia,
// sin riesgo de alucinación. El valor real se entrega luego por email.
export const intents: { re: RegExp; reply: string }[] = [
  {
    re: /document|pdf|factur|albar|contrat|expedient|escritur|plieg|certificad|papeleo|escane|digitaliz|archivar|formulario|anexo|justificante|ocr/i,
    reply:
      'Leer y clasificar documentos es uno de los casos más directos: la IA extrae los datos, los valida contra vuestros criterios y el equipo solo revisa excepciones.',
  },
  {
    re: /informe|report|excel|hoja de c|dashboard|kpi|cierre|contabil|power bi|cuadre|consolidar|cuadro de mando|estad[ií]stic/i,
    reply:
      'Los informes recurrentes se pueden generar solos: consolidamos las fuentes, automatizamos las comprobaciones y el informe llega hecho para revisar.',
  },
  {
    re: /email|correo|mail|bandeja|whatsapp|ticket|soporte|consulta|cliente|atenci|reclamaci|queja|incidenc|chat en vivo|call center|centralita|telefon/i,
    reply:
      'Ahí encaja un asistente que responde con vuestra documentación y escala a una persona solo lo que lo necesita, sin perder el tono de la casa.',
  },
  {
    re: /duplicad|dos veces|varios sistemas|erp|crm|integr|copiar|pegar|migrar|sincroniz|reintroduc|doble tecle|doble entrada|conectar sistemas/i,
    reply:
      'Eso suele ser un problema de integración: conectamos las herramientas para que el dato se escriba una vez y viaje solo, con trazabilidad.',
  },
  {
    re: /present|propuest|presupuest|oferta|licitaci|cotiz|venta/i,
    reply:
      'Preparar propuestas o presupuestos se puede plantillizar: la IA reutiliza vuestro histórico y deja un borrador listo para ajustar.',
  },
  {
    re: /stock|inventar|almac|log[ií]stic|ruta|reparto|pedido|transporte|entrega|picking/i,
    reply:
      'Con vuestro histórico se puede anticipar demanda y priorizar pedidos o rutas, en lugar de decidirlo a mano cada mañana.',
  },
  {
    re: /candidat|curr[ií]cul|cv|contrataci|rrhh|n[oó]mina|fichaje|vacaciones|baja m[eé]dica|onboarding/i,
    reply:
      'El cribado y la gestión documental de personas es muy automatizable: la IA ordena, resume y compara, y la decisión sigue siendo vuestra.',
  },
  {
    re: /cuadrante|turnos del personal|turnos de trabajo|planificar turnos|planificaci[oó]n de turnos|turno/i,
    reply:
      'Planificar turnos a mano es de lo más pesado: se puede proponer el cuadrante automáticamente y recalcularlo si alguien falta o cambia algo.',
  },
  {
    re: /llamad|\bcita\b|agenda|reserva|recordatorio|cancelaci[oó]n|no-show|no show/i,
    reply:
      'Agendar y confirmar citas es un flujo cerrado: se puede automatizar de punta a punta con avisos y reprogramación incluidos.',
  },
  {
    re: /traduc|transcrib|acta|reuni[oó]n|resumen|minuta|grabaci[oó]n|subtitul/i,
    reply:
      'Transcribir y resumir reuniones o expedientes es inmediato de montar, y deja el resultado buscable para todo el equipo.',
  },
  {
    re: /web|marketing|contenido|redes|seo|newsletter|campañ|copy|anuncio/i,
    reply:
      'La producción de contenido repetitivo se puede asistir: borradores con vuestra voz, revisión humana antes de publicar.',
  },
  {
    re: /cobro|pago|conciliaci[oó]n bancaria|morosidad|domicili|recordatorio de pago/i,
    reply:
      'La gestión de cobros y pagos se puede automatizar casi entera: conciliación con el banco, avisos de vencimiento y solo las excepciones a mano.',
  },
  {
    re: /control de calidad|no conformidad|inspecci[oó]n|defect/i,
    reply:
      'El control de calidad se puede asistir con IA: aparta lo que se desvía del estándar y deja al equipo solo la revisión de lo dudoso.',
  },
  {
    re: /manteni|aver[ií]a|reparaci[oó]n|revisi[oó]n t[eé]cnica/i,
    reply:
      'Con los datos que ya generáis se puede anticipar una avería y avisar antes de la parada, en vez de reaccionar cuando ya ha pasado.',
  },
  {
    re: /proyecto|seguimiento de tareas|hitos|retraso|gantt/i,
    reply:
      'El seguimiento de proyectos se puede automatizar: estado, hitos y retrasos se actualizan solos y solo se avisa de lo que se sale de plazo.',
  },
  {
    re: /garant[ií]a|devoluci[oó]n|rma/i,
    reply:
      'La gestión de garantías y devoluciones es muy mecánica: se puede tramitar sola y dejar al equipo solo los casos que requieren criterio.',
  },
];

// Cada intención puntúa por el número de coincidencias de sus alternativas
// (no solo si hay match); gana la de mayor puntuación. En empate, gana la
// que aparece antes en la lista (las categorías más frecuentes van primero).
export function matchIntent(raw: string): string | null {
  let best: { reply: string; score: number } | null = null;
  for (const intent of intents) {
    const flags = intent.re.flags.includes('g') ? intent.re.flags : intent.re.flags + 'g';
    const hits = raw.match(new RegExp(intent.re.source, flags));
    const score = hits ? hits.length : 0;
    if (score > 0 && (!best || score > best.score)) {
      best = { reply: intent.reply, score };
    }
  }
  return best ? best.reply : null;
}

export const sectores = ['Industria', 'Ingeniería', 'Logística', 'Operaciones', 'Servicios', 'Otro'];
