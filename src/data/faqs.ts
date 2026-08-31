// Fuente única para el acordeón de FAQ visible y el JSON-LD FAQPage.
// El prototipo (nexo v2.dc.html) tenía 5 preguntas en pantalla y 8 en el
// JSON-LD del <head>, desalineadas. Unificamos a estas 8 en ambos sitios
// (ver README > Home > sección FAQ).
export const faqs = [
  {
    q: '¿Qué incluye exactamente el diagnóstico gratuito?',
    a: 'Un análisis escrito de la tarea que nos cuentas: qué parte puede automatizarse, con qué herramientas, en qué plazo y cuántas horas al año está consumiendo hoy. Lo recibes por email en menos de 48 horas.',
  },
  {
    q: '¿Por qué es gratis?',
    a: 'Es nuestra forma de demostrar criterio antes de pedir nada. Si el caso encaja, preferimos empezar la conversación con el trabajo hecho.',
  },
  {
    q: '¿Cuánto cuesta después el desarrollo?',
    a: 'Trabajamos por proyecto cerrado, empezando por un proceso concreto. El diagnóstico incluye el rango de inversión y el retorno estimado. Sin permanencia.',
  },
  {
    q: '¿Cuánto se tarda en tener algo funcionando?',
    a: 'Las primeras automatizaciones suelen estar en producción en semanas, no en trimestres.',
  },
  {
    q: '¿Tengo que cambiar mis herramientas?',
    a: 'No. Construimos sobre lo que ya usas: ERP, correo, hojas de cálculo o CRM.',
  },
  {
    q: '¿Qué pasa con la confidencialidad de mis datos?',
    a: 'Firmamos acuerdo de confidencialidad antes de ver nada y, cuando el proceso lo requiere, se despliega sobre tu propia infraestructura.',
  },
  {
    q: '¿La IA va a tomar decisiones por mi equipo?',
    a: 'No. La IA prepara, ordena y propone; lo que tiene consecuencias lo confirma siempre una persona.',
  },
  {
    q: '¿Necesito que alguien de mi equipo sea técnico?',
    a: 'No. Entregamos el proceso funcionando y documentado, con formación para quien vaya a usarlo.',
  },
] as const;
