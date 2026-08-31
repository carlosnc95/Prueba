import { useEffect, useRef, useState } from 'react';
import { matchIntent, sectores } from '../data/chatCatalog';
import { site } from '../config/site';
import './ChatDiagnostico.css';

type Stage = 'problema' | 'sector' | 'horas' | 'nombre' | 'email' | 'consent' | 'done';

type Message =
  | { id: number; kind: 'bot'; text: string }
  | { id: number; kind: 'user'; text: string }
  | { id: number; kind: 'chips'; options: string[]; disabled: boolean }
  | { id: number; kind: 'consent'; disabled: boolean }
  | { id: number; kind: 'typing' };

// Omit<Union, K> collapses to keys common to every member, dropping the
// variant-specific fields (text/options/...). Distribute it manually so
// push() keeps each variant's own shape minus "id".
type DistributiveOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never;
type NewMessage = DistributiveOmit<Message, 'id'>;

const OPENING: Message[] = [
  { id: 1, kind: 'bot', text: 'Hola 👋 ¿Qué tarea o proceso te gustaría eliminar, automatizar o hacer mucho más rápido?' },
  {
    id: 2,
    kind: 'chips',
    disabled: false,
    options: ['Revisamos muchos documentos', 'Perdemos tiempo con informes', 'Gestionamos muchos emails'],
  },
];

function shorten(text: string) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > 58 ? clean.slice(0, 55) + '…' : clean;
}

function typingDelay() {
  return 600 + Math.random() * 300;
}

export default function ChatDiagnostico() {
  const [messages, setMessages] = useState<Message[]>(OPENING);
  const [stage, setStage] = useState<Stage>('problema');
  const [inputValue, setInputValue] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'email'>('text');
  const [inputPlaceholder, setInputPlaceholder] = useState('Escribe tu respuesta...');
  const [consentChecked, setConsentChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [misses, setMisses] = useState(0);
  const [sendError, setSendError] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const nombre = useRef('');
  const email = useRef('');
  const sector = useRef('');
  const horasTexto = useRef('');
  const problema = useRef('');
  const solucion = useRef('');
  const startedAt = useRef(Date.now());
  const nextId = useRef(3);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function push(items: NewMessage[]) {
    setMessages((prev) => [...prev, ...items.map((it) => ({ ...it, id: nextId.current++ }) as Message)]);
  }

  function disableAllChips() {
    setMessages((prev) => prev.map((m) => (m.kind === 'chips' ? { ...m, disabled: true } : m)));
  }

  function selectChip(msgId: number, label: string) {
    const msg = messages.find((m) => m.id === msgId);
    if (msg && msg.kind === 'chips' && msg.disabled) return;
    sendMessage(label);
  }

  function sendMessage(text?: string) {
    const val = (text ?? inputValue).trim();
    if (!val || inputDisabled) return;
    disableAllChips();
    push([{ kind: 'user', text: val }]);
    setInputValue('');
    const typingId = nextId.current++;
    setMessages((prev) => [...prev, { id: typingId, kind: 'typing' }]);
    const t = setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      reply(val);
    }, typingDelay());
    timeouts.current.push(t);
  }

  function askSector(intro: string, raw: string) {
    problema.current = raw;
    solucion.current = intro;
    push([
      { kind: 'bot', text: intro },
      { kind: 'bot', text: '¿En qué sector trabajas?' },
      { kind: 'chips', disabled: false, options: sectores },
    ]);
    setStage('sector');
    setInputPlaceholder('Tu sector...');
  }

  function reply(text: string) {
    if (stage === 'problema') return replyProblema(text);
    if (stage === 'sector') return replySector(text);
    if (stage === 'horas') return replyHoras(text);
    if (stage === 'nombre') return replyNombre(text);
    if (stage === 'email') return replyEmail(text);
    return push([{ kind: 'bot', text: 'Ya tengo tu caso ✓ Si quieres añadir algo, respóndenos al email del diagnóstico y lo incorporamos.' }]);
  }

  function replyProblema(raw: string) {
    const t = raw.toLowerCase();

    if (/^(hola|buenas|hey|qu[eé] tal|buenos d[ií]as|buenas tardes)[\s!.]*$/i.test(t)) {
      return push([{ kind: 'bot', text: '¡Hola! Cuéntame en una frase qué tarea os está costando más tiempo esta semana.' }]);
    }
    if (/(no s[eé]|no lo s[eé]|ni idea|no estoy seguro|varias cosas|de todo)/i.test(t)) {
      return push([
        { kind: 'bot', text: 'Sin problema. Empecemos por lo más repetitivo: ¿qué es lo que más veces al día hace alguien del equipo con datos, documentos o mensajes?' },
        {
          kind: 'chips',
          disabled: false,
          options: ['Copiar datos entre sistemas', 'Revisar documentos', 'Responder consultas', 'Preparar informes'],
        },
      ]);
    }
    if (/(qu[eé] hac[eé]is|c[oó]mo funciona|precio|cu[aá]nto cuesta|tarifa)/i.test(t)) {
      return push([
        {
          kind: 'bot',
          text: 'El diagnóstico es gratis y son 3 minutos: medimos el proceso y te decimos qué se puede automatizar y con qué retorno. Para eso, cuéntame qué tarea te está costando más tiempo.',
        },
      ]);
    }

    if (/no (tenemos|hay|tengo)\s+(ning[uú]n\s+)?problema|todo (va )?bien|sin problemas?\b|no nos afecta/i.test(t)) {
      return push([
        {
          kind: 'bot',
          text: 'Me alegro de que eso vaya bien. Pero seguro que hay algo que os quita tiempo aunque no sea "un problema" — ¿qué tarea repetís cada semana sin pensarlo?',
        },
      ]);
    }

    const matched = matchIntent(raw);
    if (matched) return askSector(matched, raw);

    const words = raw.split(/\s+/).filter(Boolean).length;
    if (words < 3 && misses < 1) {
      setMisses((m) => m + 1);
      return push([{ kind: 'bot', text: 'Cuéntame un poco más: ¿quién lo hace, con qué herramienta y cada cuánto? Con eso ya puedo situarlo.' }]);
    }
    return askSector('Entendido: "' + shorten(raw) + '". Suena a un proceso repetitivo con datos de por medio, y eso se puede medir.', raw);
  }

  function replySector(raw: string) {
    const t = raw.toLowerCase();
    if (raw.trim().length < 2) {
      return push([{ kind: 'bot', text: 'Dime el sector aunque sea de forma aproximada (industria, servicios, logística...).' }]);
    }
    const conocido = sectores.find((s) => t.includes(s.toLowerCase().slice(0, 6)));
    const sectorTexto = conocido || shorten(raw);
    sector.current = sectorTexto;
    push([
      { kind: 'bot', text: 'Perfecto, ' + sectorTexto.toLowerCase() + '. ¿Cuántas horas a la semana se van en esa tarea, más o menos?' },
      { kind: 'chips', disabled: false, options: ['Menos de 5 h', 'Entre 5 y 15 h', 'Más de 15 h'] },
    ]);
    setStage('horas');
    setInputPlaceholder('p. ej. 10 horas');
  }

  function replyHoras(raw: string) {
    const t = raw.toLowerCase();
    let h: number | null = null;
    const num = raw.match(/(\d+([.,]\d+)?)/);
    if (num) h = parseFloat(num[1].replace(',', '.'));
    else if (/menos de 5/.test(t)) h = 4;
    else if (/entre 5|5 y 15/.test(t)) h = 10;
    else if (/m[aá]s de 15/.test(t)) h = 20;
    else if (/media jornada/.test(t)) h = 20;
    else if (/jornada completa|todo el d[ií]a/.test(t)) h = 40;

    if (h === null) {
      return push([
        { kind: 'bot', text: 'Dame un número aproximado de horas a la semana; con un rango me vale.' },
        { kind: 'chips', disabled: false, options: ['Menos de 5 h', 'Entre 5 y 15 h', 'Más de 15 h'] },
      ]);
    }
    const anual = Math.round(h * 46);
    horasTexto.current = `${h} h/semana (~${new Intl.NumberFormat('es-ES').format(anual)} h/año)`;
    push([
      {
        kind: 'bot',
        text: 'Con ' + h + ' h a la semana son unas ' + new Intl.NumberFormat('es-ES').format(anual) + ' h al año dedicadas a esa tarea. En el diagnóstico calculamos qué parte se puede automatizar.',
      },
      { kind: 'bot', text: 'Para prepararlo, ¿cómo te llamas?' },
    ]);
    setStage('nombre');
    setInputPlaceholder('Tu nombre...');
  }

  function replyNombre(raw: string) {
    const clean = raw.trim();
    if (clean.length < 2) {
      return push([{ kind: 'bot', text: 'Dime al menos tu nombre de pila para poder dirigirme a ti.' }]);
    }
    nombre.current = shorten(clean);
    push([{ kind: 'bot', text: `Encantado, ${nombre.current}. ¿A qué email te lo enviamos?` }]);
    setStage('email');
    setInputPlaceholder('tu@empresa.com');
    setInputType('email');
  }

  function replyEmail(raw: string) {
    const token = raw.split(/\s+/).find((w) => w.includes('@')) || raw.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(token);
    if (!ok) {
      return push([{ kind: 'bot', text: 'Ese email no me cuadra. Escríbelo completo, con formato nombre@empresa.com.' }]);
    }
    email.current = token;
    push([
      {
        kind: 'bot',
        text: `Con esto ya tengo tu caso, ${nombre.current}. Te mandamos el diagnóstico completo —alcance y retorno estimado— a ${email.current} en menos de 48 horas. Solo confirma el consentimiento.`,
      },
      { kind: 'consent', disabled: false },
    ]);
    setStage('consent');
    setInputDisabled(true);
  }

  async function handleConsentSubmit() {
    if (!consentChecked || submitting) return;
    setSubmitting(true);
    setSendError(false);

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.current,
          email: email.current,
          sector: sector.current,
          horas: horasTexto.current,
          problema: problema.current,
          solucion: solucion.current,
          consentimiento: true,
          startedAt: startedAt.current,
          website: honeypot, // honeypot: un humano lo deja vacío
        }),
      });

      if (!res.ok) throw new Error('request failed');

      const params = new URLSearchParams({ email: email.current, nombre: nombre.current });
      window.location.href = `/gracias?${params.toString()}`;
    } catch {
      setSubmitting(false);
      setSendError(true);
    }
  }

  return (
    <div className="chat-shell" id="diagnostico">
      <div className="chat-head">
        <div className="chat-avatar" aria-hidden="true">
          {site.name.charAt(0)}
        </div>
        <div>
          <b className="chat-head__title">Diagnóstico {site.name}</b>
          <span className="chat-head__status">
            <span className="chat-head__dot" aria-hidden="true"></span>
            En línea · responde al instante
          </span>
        </div>
      </div>

      <div className="chat-body" ref={bodyRef} role="log" aria-live="polite" aria-label="Conversación del diagnóstico">
        {messages.map((m) => {
          if (m.kind === 'bot') {
            return (
              <div key={m.id} className="chat-row chat-row--bot">
                <div className="chat-bubble chat-bubble--bot">{m.text}</div>
              </div>
            );
          }
          if (m.kind === 'user') {
            return (
              <div key={m.id} className="chat-row chat-row--user">
                <div className="chat-bubble chat-bubble--user">{m.text}</div>
              </div>
            );
          }
          if (m.kind === 'chips') {
            return (
              <div key={m.id} className="chat-row chat-row--bot">
                <div className="chat-chips">
                  {m.options.map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="chat-chip"
                      disabled={m.disabled}
                      onClick={() => selectChip(m.id, label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          if (m.kind === 'consent') {
            return (
              <div key={m.id} className="chat-row chat-row--bot chat-row--full">
                <div className="chat-consent">
                  <label className="chat-consent__label">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      disabled={m.disabled}
                      className="chat-consent__checkbox"
                    />
                    <span>
                      Acepto que {site.name} trate mis datos para preparar y enviarme el diagnóstico. Ver la{' '}
                      <a href="/privacidad" target="_blank" rel="noopener" className="chat-consent__link">
                        política de privacidad
                      </a>
                      .
                    </span>
                  </label>

                  {/* Honeypot anti-spam: invisible para personas, un bot que rellena
                      todos los campos lo delata. No usar display:none (algunos bots lo respetan). */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="chat-honeypot"
                  />

                  <button
                    type="button"
                    className="chat-consent__submit"
                    disabled={!consentChecked || submitting}
                    onClick={handleConsentSubmit}
                  >
                    {submitting ? 'Enviando…' : 'Enviar y recibir el diagnóstico'}
                  </button>

                  {sendError && (
                    <p className="chat-consent__error" role="alert">
                      No hemos podido enviarlo. Inténtalo de nuevo o escríbenos directamente a{' '}
                      <a href={`mailto:${site.email}`} className="chat-consent__link">
                        {site.email}
                      </a>
                      .
                    </p>
                  )}
                </div>
              </div>
            );
          }
          // typing
          return (
            <div key={m.id} className="chat-row chat-row--bot">
              <div className="chat-typing" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`chat-inputrow${inputDisabled ? ' chat-inputrow--disabled' : ''}`}>
        <input
          type={inputType}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          placeholder={inputPlaceholder}
          disabled={inputDisabled}
          autoComplete="off"
          aria-label="Escribe tu respuesta"
          className="chat-input"
        />
        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={inputDisabled}
          aria-label="Enviar mensaje"
          className="chat-send"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M22 2 11 13"></path>
            <path d="M22 2 15 22l-4-9-9-4z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
