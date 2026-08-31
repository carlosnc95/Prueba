# Handoff: sitio web de consultoría de automatización con IA (nombre provisional «Sira»)

## Overview
Sitio corporativo de cinco páginas para una consultora española de automatización de procesos con IA, dirigida a pymes. El objetivo único de conversión es captar un **diagnóstico gratuito**: el visitante describe la tarea que le consume tiempo mediante un chat guiado, deja su email con consentimiento RGPD, y recibe un análisis por correo en menos de 48 horas. Un calculador de coste anual actúa como gancho secundario.

Idioma: **español de España** (es-ES), tuteo, tono sobrio y sin jerga de marketing. Sin mercado internacional por ahora.

## About the Design Files
Los archivos `.dc.html` incluidos en este paquete son **referencias de diseño creadas en HTML**: prototipos que muestran el aspecto y el comportamiento previstos. **No son código de producción para copiar tal cual.**

Están escritos con un runtime propietario de prototipado (`support.js`, etiquetas `<x-dc>`, `<sc-for>`, `<sc-if>`, atributos `{{ hole }}`, estilos totalmente inline). Ese runtime **no debe llevarse a producción**.

La tarea es **recrear estos diseños en un stack real**. No existe todavía codebase, así que hay libertad de elección. Recomendación por encaje (sitio mayormente estático, SEO crítico, dos islas interactivas):

- **Astro 5** + islas React o Svelte para el chat y el calculador. Cinco rutas estáticas, `@astrojs/sitemap`, CSS con variables nativas o Tailwind.
- Alternativa válida: **Next.js (App Router, output estático)** si se prevé añadir panel privado o CMS.

Todo lo que en los prototipos vive en `renderVals()` como estilo calculado debe convertirse en CSS normal con clases; los estilos inline eran una restricción del entorno de prototipado, no una decisión de diseño.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografías, espaciados, radios, sombras, copy y microinteracciones son definitivos y deben reproducirse fielmente. Los textos son los definitivos salvo lo marcado como pendiente en «Contenido pendiente».

**Excepción importante — el nombre de marca:** «Sira» es un **placeholder**. La marca definitiva no está decidida. Trátalo como un token único: nombre de marca, dominio `sira.ai`, email `hola@sira.ai`, el logotipo `SIRA` del header y el archivo `og-sira.png` cambiarán todos a la vez. Centraliza esos valores en **un solo archivo de configuración** (`src/config/site.ts` o equivalente) para que el cambio sea de una línea:

```ts
export const site = {
  name: 'Sira',
  domain: 'https://sira.ai',
  email: 'hola@sira.ai',
  ogImage: '/og.png',
};
```

No dejes «Sira» escrito a mano en ninguna plantilla.

---

## Screens / Views

### 1. Home — `nexo v2.dc.html` → ruta `/`
**Propósito:** convertir. El visitante entiende la propuesta en cinco segundos y empieza el chat de diagnóstico sin salir de la primera pantalla.

**Layout general:** ancho máximo de contenido `1240px`, padding lateral `32px`, centrado. Fondo global fijo (ver Design Tokens → Fondo). Header sticky. Secciones separadas por `padding: 56–64px 0` y, algunas, por `border-top: 1px solid #e4e1d3`.

**Header (sticky)**
- `position: sticky; top: 0; z-index: 60`, fondo `rgba(248,247,242,.86)` con `backdrop-filter: blur(10px)`, borde inferior `1px solid #e4e1d3`.
- Fila interior: `padding: 16px 32px`, flex, `space-between`.
- Logo: punto de `9px` `border-radius:50%` en `#2d5b9e` + palabra `SIRA` en Space Grotesk 700, `1.28rem`, `letter-spacing:-.01em`, color `#14161b`. `gap: 9px`.
- Nav: flex, `gap: 28px`. Dos enlaces de texto (`Soluciones`, `Quiénes somos`) en Inter 500 `.9rem` color `#5b6570`, hover `#14161b`. Botón `Cuéntanos tu caso →`: Inter 600 `.9rem`, `padding: 11px 18px`, fondo `#14161b`, texto `#f8f7f2`, `border-radius: 8px`; hover fondo y borde `#2d5b9e`, `box-shadow: 0 10px 22px -10px #2d5b9e70`, `transform: translateY(-1px)`.

**Hero — `#inicio`** (`padding: 56px 0`)
- Grid de dos columnas `1.05fr / .95fr`, `gap: 48px`, `align-items: start`. Por debajo de 980px pasa a una columna y el chat va **después** del texto.
- Eyebrow: IBM Plex Mono `.78rem`, `letter-spacing:.14em`, mayúsculas, color `#1e3f70`, con punto de `6px` en `#2d5b9e`. Texto: `Diagnóstico de procesos · IA aplicada`.
- H1: Space Grotesk 700, `clamp(2.8rem, 5.4vw, 4.4rem)`, `line-height: 1`, `letter-spacing:-.03em`, `text-wrap: pretty`. Copy: `¿Qué proceso está frenando a tu empresa?` con **frenando** en `#2d5b9e`.
- Subtítulo: `1.14rem`, color `#5b6570`, `max-width: 44ch`, margen superior `26px`. Copy: `Cuéntanos qué tarea te hace perder tiempo o dinero. Medimos el proceso, diseñamos la solución de IA y la construimos contigo.`
- Botonera (`margin-top: 32px`, flex `gap: 12px`, wrap): primario `Cuéntanos tu caso →` (`padding: 14px 22px`, `border-radius: 9px`, fondo `#14161b`, mismos hovers que el del header) y secundario `Calcula tu ahorro` (transparente, borde `1px solid #14161b`, hover fondo `#f1efe6`).

**Chat de diagnóstico — `#diagnostico`** (columna derecha del hero)
- Contenedor: fondo `#f8f7f2`, borde `1px solid #e4e1d3`, `border-radius: 18px`, `box-shadow: 0 34px 74px -34px rgba(20,22,27,.28)`, `overflow: hidden`, `scroll-margin-top: 104px`.
- Cabecera: avatar cuadrado `32px` `border-radius: 9px` fondo `#14161b` con la inicial de marca en `#f8f7f2`; título `Diagnóstico Sira` (`.9rem`, 700); estado `En línea · responde al instante` (`.74rem`, `#9a9d97`) con punto verde `#3fcb6b` de `6px`.
- Cuerpo: `padding: 20px`, columna flex `gap: 11px`, `min-height: 300px`, `max-height: 360px`, `overflow-y: auto`. Autoscroll al final en cada mensaje nuevo.
- Burbuja bot: fondo `#f1efe6`, `padding: 12px 16px`, `border-radius: 14px` con `border-bottom-left-radius: 4px`, `max-width: 86%`, `font-size: .9rem`, `line-height: 1.5`, alineada a la izquierda.
- Burbuja usuario: fondo `#2d5b9e`, texto `#f8f7f2`, mismo padding y radios pero `border-bottom-right-radius: 4px`, alineada a la derecha.
- Chips de respuesta rápida: fila flex `gap: 8px` con wrap; botón de borde fino sobre crema, hover fondo `#e9eef6` y borde `#2d5b9e`; quedan **deshabilitados** una vez respondida esa pregunta (sin volver a ser clicables).
- Indicador de escritura: tres puntos de `6px` en `#9a9d97` con `@keyframes` de opacidad `.25 → 1`, ciclo `1.2s ease-in-out infinite`, retardos `0 / .2s / .4s`, dentro de una burbuja bot.
- Bloque de consentimiento (aparece tras pedir el email): tarjeta a ancho completo, fondo `#f1efe6`, borde `1px solid #e4e1d3`, `border-radius: 14px`, `padding: 16px`. Checkbox `16px` `accent-color: #2d5b9e` + texto `.84rem` `#5b6570`: `Acepto que Sira trate mis datos para preparar y enviarme el diagnóstico. Ver la política de privacidad.` (enlace subrayado a `/privacidad`, abre en pestaña nueva). Debajo, botón `Enviar y recibir el diagnóstico`, **deshabilitado mientras el checkbox no esté marcado**.
- Fila de entrada al pie: input de texto con placeholder dinámico según la etapa + botón de envío. Se deshabilita (`pointer-events: none`) mientras el bot «escribe».

**Sección `#como-funciona`** — tarjeta oscura sobre el fondo crema
- Caja: fondo `#14161b`, texto `#f8f7f2`, `border-radius: 24px`, `padding: 46px 44px`, `box-shadow: 0 36px 70px -40px rgba(20,22,27,.5)`.
- H2 `Tres pasos, sin vueltas`: Space Grotesk 700, `clamp(1.9rem, 3.2vw, 2.6rem)`, `letter-spacing:-.025em`, `max-width: 20ch`.
- Tres tarjetas en grid, con borde sutil; hover `border-color: #3f5f8f`. Cada una: número/eyebrow en mono, título y una línea de descripción.

**Sección `#resolvemos`** — `Lo que nos suelen contar`
- Eyebrow mono `Qué resolvemos`, H2 `max-width: 26ch`.
- Lista tipo acordeón de casos frecuentes; el primero abierto por defecto (`openCase: 0`).

**Sección `#calculadora`** — `¿Cuánto te cuesta hacerlo a mano?` (`border-top: 1px solid #e4e1d3`)
- Grid de dos columnas: controles a la izquierda, resultado a la derecha.
- Tres `input[type=range]` a ancho completo, `accent-color: #2d5b9e`, cada uno con etiqueta a la izquierda y valor en IBM Plex Mono a la derecha:
  - `Horas a la semana en esa tarea` — min 1, max 20, step 1, **default 8**
  - `Personas implicadas` — min 1, max 10, step 1, **default 3**
  - `Coste medio por hora` — min 12, max 45, step 1, **default 25**
- Panel de resultado: fondo `#14161b`, texto `#f8f7f2`, `border-radius: 18px`, `padding: 34px 32px`, centrado verticalmente.
  - Eyebrow `Coste anual de esa tarea` en mono `.72rem` color `#9fbde4`.
  - Cifra grande: Space Grotesk, `clamp(2.6rem, 5vw, 3.6rem)`, `letter-spacing:-.03em`.
  - Dos métricas secundarias separadas por `border-top: 1px solid #2c3138`: `horas al año` y `jornadas de 8 h al año`.
  - Nota al pie `.78rem` color `#6f767c` explicando el cálculo.
  - CTA claro (fondo `#f8f7f2`, texto `#14161b`) que ancla a `#diagnostico`.

**Fórmula exacta del calculador**
```
horasAnuales = horas × personas × 46          // 46 semanas laborables
costeAnual   = horasAnuales × costeHora
jornadas     = horasAnuales / 8
```
Formato: `Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 })`, sufijo ` €` y ` h`. Recalcula en vivo al mover cada slider, sin botón.

**Sección `#faq`** (`border-top: 1px solid #e4e1d3`)
- Grid de dos columnas: a la izquierda eyebrow mono `Preguntas frecuentes`, H2 `max-width: 20ch` y una tarjeta oscura de contacto (`¿Otra duda?` + email); a la derecha el acordeón de 5 preguntas.
- Cada pregunta: botón a ancho completo con la pregunta y un indicador; respuesta con transición de altura (`overflow: hidden; min-height: 0`). Una sola abierta a la vez.
- Las 5 preguntas visibles están en el prototipo; el `FAQPage` de datos estructurados del `<head>` contiene **8** (versión ampliada para SEO). Mantén esa asimetría o unifica a 8 en pantalla, pero **no dejes desalineados** el JSON-LD y el contenido real: Google penaliza el desajuste. Recomendación: una sola fuente de datos (`src/data/faqs.ts`) que alimente ambos.

**CTA final** (`padding: 56px 0 72px`)
- Caja fondo `#f1efe6`, borde `1px solid #e4e1d3`, `border-radius: 22px`, `padding: 56px 40px`, `text-align: center`.
- Eyebrow mono `Siguiente paso`, H2 `clamp(2rem, 3.8vw, 3rem)` `max-width: 24ch`, párrafo `max-width: 52ch` color `#5b6570`, botón oscuro `padding: 16px 26px` que ancla a `#diagnostico`.

**Footer** — enlaces a las cinco rutas, email de contacto, línea legal, aviso de privacidad. Fondo crema, borde superior `#e4e1d3`, tipografía `.85rem` color `#5b6570`.

---

### 2. Soluciones — `Sira casos.dc.html` → ruta `/casos`
**Propósito:** demostrar amplitud y ayudar al visitante a reconocer su propio problema.

- Cabecera de página: eyebrow mono con punto, H1 `Qué se puede automatizar` (Space Grotesk 700, `clamp(2.5rem, 4.8vw, 3.9rem)`, `line-height: 1.02`, `max-width: 22ch`), subtítulo `Elige una familia y mira las soluciones que montamos.` (`1.1rem`, `#5b6570`, `max-width: 44ch`).
- **Selector de seis familias** (documentos y datos, clientes, procesos, comercial, operaciones, talento) + rejilla de **24 soluciones** en total, cuatro por familia.
- Tarjeta de solución: `<article>` fondo `#f8f7f2`, borde `1px solid #e4e1d3`, `border-radius: 14px`, `padding: 22px`. Título Space Grotesk 600 `1.08rem` `letter-spacing:-.018em` `line-height:1.24`; descripción `.92rem` color `#5b6570` `text-wrap: pretty`. Hover: `border-color: #2d5b9e`, `transform: translateY(-2px)`, sombra azulada suave.
- Sección oscura `Qué automatizamos primero`: H2 `clamp(1.7rem, 2.8vw, 2.2rem)` `max-width: 18ch` a la izquierda, criterios a la derecha separados por `border-top: 1px solid #2c3138`.
- CTA final idéntico al de la home, apuntando a `/#diagnostico`.
- Las 24 soluciones deben vivir en datos (`src/data/soluciones.ts`), no en el markup.

### 3. Quiénes somos — `Sira quienes somos.dc.html` → ruta `/quienes-somos`
Página de confianza: enfoque, forma de trabajar, principios (la IA propone, la persona decide), confidencialidad. Mismo sistema tipográfico y de tarjetas. **Falta el bloque de credenciales** (ver Contenido pendiente).

### 4. Gracias — `Sira gracias.dc.html` → ruta `/gracias`
Confirmación tras enviar el diagnóstico: qué pasa ahora, plazo de 48 h, aviso de revisar spam, enlace de vuelta a `/casos`. Debe llevar `<meta name="robots" content="noindex">`. Es el punto donde se dispara el evento de conversión de analítica.

### 5. Privacidad — `Sira privacidad.dc.html` → ruta `/privacidad`
**Borrador, no válido legalmente.** Estructura y estilo listos; faltan responsable, NIF, dirección, encargados de tratamiento reales y plazos de conservación. Ver Contenido pendiente.

### 6. Plantilla de imagen social — `Sira og.dc.html`
Fuente de la que se rasterizó `og-sira.png` (1200×630). No es una ruta pública; mantenla como utilidad de diseño o sustitúyela por generación de OG en build (`@vercel/og`, `astro-og-canvas`).

---

## Interactions & Behavior

### Chat de diagnóstico (la pieza con más lógica)
Máquina de estados de cinco etapas: `problema → sector → horas → email → done`.

1. **Apertura (al montar):** mensaje bot `Hola 👋 ¿Qué tarea o proceso te gustaría eliminar, automatizar o hacer mucho más rápido?`
2. **`problema`** — texto libre. El prototipo hace **matching por expresiones regulares** contra un catálogo de temas (facturas y documentos, atención al cliente, inventario y previsión de demanda, RRHH y cribado de CV, citas y agenda, etc.) y devuelve una respuesta específica y creíble para el tema detectado. Si no hay coincidencia, incrementa un contador `misses` y repregunta con reformulación; tras varios fallos sigue adelante sin bloquear al usuario. **Este matching es un truco de prototipo.** En producción hay dos caminos:
   - **Mínimo viable (recomendado para lanzar):** conservar el catálogo de regex tal cual. Es determinista, gratis, sin latencia y sin riesgo de alucinación. Funciona porque el valor real se entrega luego por email, a mano.
   - **Con LLM:** llamada a un modelo desde una función servidor (nunca clave de API en cliente), con prompt de sistema que fije tono, límite de longitud y prohibición de prometer precios o plazos. Requiere rate limiting y timeout con caída elegante al catálogo de regex.
3. **`sector`** — chips + texto libre. El bot confirma repitiendo el sector en minúscula.
4. **`horas`** — chips `Menos de 5 h` / `Entre 5 y 15 h` / `Más de 15 h`, o número libre (se extrae con regex de la frase). Si no logra leer un número, repregunta ofreciendo los chips.
5. **`email`** — validación de formato en cliente; al aceptar, muestra el bloque de consentimiento.
6. **Envío** — solo posible con el checkbox marcado. Éxito → navegación a `/gracias`.

Detalles de comportamiento: retardo simulado de «escribiendo» de ~600–900 ms antes de cada respuesta del bot; los chips ya usados quedan deshabilitados; la fila de entrada se bloquea mientras el bot escribe; el cuerpo del chat hace autoscroll al final. **No uses `scrollIntoView`**: asigna `scrollTop = scrollHeight` en el contenedor.

### Revelado al hacer scroll
Casi todas las secciones usan un patrón `reveal(id)`: `IntersectionObserver` que aplica `opacity: 0 → 1` y `translateY(14px → 0)` una sola vez al entrar en viewport, con retardos escalonados por tarjeta. Transición ~`.55s cubic-bezier(.16,.84,.44,1)`.

**Obligatorio:** respetar `@media (prefers-reduced-motion: reduce)` — sin desplazamiento, contenido visible desde el inicio. Y el contenido debe ser visible sin JavaScript (aplica la clase de oculto solo si JS arranca).

### Acordeones (FAQ y casos)
Una sola sección abierta a la vez. Transición de `max-height`/`grid-template-rows` en ~`.3s`. Accesibilidad: `<button>` real, `aria-expanded`, `aria-controls`, panel con `id`.

### Responsive
Único punto de ruptura relevante: **980px** (el prototipo lo gestiona con un flag `isNarrow` en estado; en producción hazlo con media queries CSS puras). Por debajo: grids de dos columnas a una, chat después del texto del hero, nav colapsado a menú, padding lateral a `20px`, `max-height` del chat más generoso.

### Estados que faltan en el prototipo y hay que construir
- **Envío en curso:** botón deshabilitado con spinner o texto `Enviando…`.
- **Error de red:** mensaje bot en tono humano (`No hemos podido enviarlo. Inténtalo de nuevo o escríbenos a hola@…`) sin perder lo ya escrito.
- **Email inválido:** ya cubierto por la repregunta del chat; añade `aria-live` para lectores de pantalla.
- **Doble envío:** bloquear con guardia de estado.

## State Management
Estado local del componente, sin store global. Dos islas independientes:

**Chat:** `messages[]` (`{ id, kind: 'bot'|'user'|'chips'|'consent'|'typing', text?, options?, disabled? }`), `stage`, `inputValue`, `inputPlaceholder`, `inputDisabled`, `consentChecked`, `misses`, y los datos recogidos (`problema`, `sector`, `horas`, `email`).

**Calculador:** `horas: 8`, `personas: 3`, `coste: 25`. Todo derivado se calcula en render, no se guarda.

**Acordeones:** un índice abierto por sección (`openFaq`, `openCase: 0`).

**Datos:** ninguna carga de datos en cliente. La única llamada de red es el `POST` del formulario.

## Backend requerido (no existe en el prototipo)
El chat y el calculador son **solo front**. Para lanzar hace falta:

- **Endpoint de envío** (`POST /api/diagnostico`): recibe `{ problema, sector, horas, email, consentimiento: true, timestamp, origen }`. Validación en servidor (no confíes en la del cliente). Antispam sin CAPTCHA visible: honeypot + comprobación de tiempo mínimo de cumplimentación + rate limiting por IP.
- **Entrega:** email transaccional a la consultora (Resend o Postmark) y acuse de recibo al visitante. Dominio verificado con SPF, DKIM y DMARC, o los avisos caerán en spam.
- **Registro de consentimiento RGPD:** almacenar texto exacto del consentimiento aceptado, marca temporal, IP y versión de la política. Es exigible como prueba.
- **Doble opt-in** si el email va a usarse para algo más que responder a esa solicitud concreta.
- **Retención:** definir plazo de conservación de los leads y borrado automático al vencer.

## Design Tokens

**Colores**
| Token | Valor | Uso |
|---|---|---|
| `--tinta` | `#14161b` | Texto principal, botones oscuros, paneles oscuros |
| `--tinta-suave` | `#2c3138` | Separadores dentro de paneles oscuros |
| `--zafiro` | `#2d5b9e` | Acento de marca, enlaces, burbuja de usuario, hovers |
| `--zafiro-oscuro` | `#1e3f70` | Eyebrows, hover de enlaces |
| `--zafiro-claro` | `#9fbde4` | Eyebrows sobre fondo oscuro |
| `--zafiro-tenue` | `#e9eef6` | Hover de chips |
| `--crema` | `#f8f7f2` | Superficies de tarjeta, texto sobre oscuro |
| `--crema-fondo` | `#f6f4ec` | Color base del fondo |
| `--crema-media` | `#f1efe6` | Burbuja bot, cajas de CTA, hover secundario |
| `--linea` | `#e4e1d3` | Todos los bordes finos sobre crema |
| `--gris-texto` | `#5b6570` | Texto secundario |
| `--gris-tenue` | `#9a9d97` | Metadatos, puntos del indicador |
| `--gris-oscuro-tenue` | `#6f767c` | Notas al pie sobre fondo oscuro |
| `--verde-online` | `#3fcb6b` | Punto de estado «en línea» |

**Fondo global** (una sola declaración, `background-attachment: fixed`, `background-repeat: no-repeat`, sobre `#f6f4ec`):
```css
background-image:
  radial-gradient(1100px 680px at 84% -8%,  rgba(45,91,158,.22), transparent 64%),
  radial-gradient(900px 620px at -12% 18%,  rgba(159,189,228,.30), transparent 66%),
  radial-gradient(1000px 760px at 112% 78%, rgba(206,186,150,.34), transparent 62%),
  radial-gradient(700px 520px at 30% 108%,  rgba(45,91,158,.12), transparent 66%),
  linear-gradient(180deg, rgba(248,247,242,.92), rgba(241,239,230,.45) 48%, rgba(248,247,242,.9));
```
Nota: `background-attachment: fixed` tiene coste de repintado en móvil. Considera desactivarlo por debajo de 980px.

**Tipografía** (Google Fonts; autoaloja los ficheros en producción para evitar la petición externa)
- **Space Grotesk** 500/600/700 — titulares y cifras. `letter-spacing` negativo: `-.018em` a `-.03em` según tamaño.
- **Inter** 400/500/600/700 — cuerpo e interfaz. `line-height: 1.55` en body.
- **IBM Plex Mono** 400/500 — eyebrows y valores numéricos. Siempre `letter-spacing: .14em` + `text-transform: uppercase` en eyebrows, tamaños `.72–.78rem`.

Escala usada: H1 `clamp(2.8rem,5.4vw,4.4rem)` · H1 interior `clamp(2.5rem,4.8vw,3.9rem)` · H2 `clamp(1.9rem,3.2vw,2.6rem)` · H2 menor `clamp(1.7rem,2.8vw,2.2rem)` · H3 `1.08rem` · cuerpo grande `1.14rem` · cuerpo `1rem` · pequeño `.92rem` / `.9rem` · micro `.84rem` / `.78rem` / `.74rem` / `.72rem`.

**Espaciado** — múltiplos de 2 sobre base 4: `4 · 8 · 9 · 11 · 12 · 16 · 20 · 22 · 26 · 28 · 32 · 36 · 46 · 56 · 64 · 72`. Padding vertical de sección: `56–64px`. Contenedor: `1240px` / `32px`.

**Radios** — `8px` botón pequeño · `9px` botón grande y avatar · `14px` burbuja y tarjeta pequeña · `18px` panel · `22px` caja de CTA · `24px` tarjeta oscura grande · `50%` puntos.

**Sombras**
```
0 10px 22px -10px #2d5b9e70          /* hover de botón, azulada */
0 12px 26px -12px #2d5b9e80          /* hover de CTA primario */
0 34px 74px -34px rgba(20,22,27,.28) /* panel del chat */
0 36px 70px -40px rgba(20,22,27,.5)  /* tarjeta oscura */
0 16px…                              /* hover de tarjeta de solución */
```

**Movimiento** — revelado `.55s cubic-bezier(.16,.84,.44,1)`; hover `.18s ease`; acordeón `.3s ease`; parpadeo del indicador `1.2s ease-in-out infinite`.

**Detalles finos que no hay que perder:** `::selection { background:#2d5b9e; color:#fff }` · `body { -webkit-font-smoothing: antialiased }` · `text-wrap: pretty` en todos los titulares y párrafos largos · `overflow-x: clip` en la raíz · `scroll-margin-top: 104px` en los destinos de ancla (por el header sticky) · `min-width: 0` en las tarjetas de grid para que no desborden.

## Assets
En la raíz del paquete:
- `og-sira.png` — 1200×630, imagen social. **Se regenera al cerrar el nombre.**
- Iconos PNG con fondo transparente: `ic-checklist`, `ic-cohete`, `ic-embudo`, `ic-equipo`, `ic-escudo`, `ic-globo`, `ic-grafico`, `ic-panel`, `ic-pizarra`, `ic-reloj`, `icon-chat`, `icon-datos`, `icon-engranajes`. Sirve en formato moderno (WebP o AVIF) con `width`/`height` explícitos para evitar CLS.
- `robots.txt` y `sitemap.xml` — estructura de URLs limpias ya definida. En Astro, genera el sitemap en build en lugar de mantenerlo a mano.
- Favicon: SVG inline en el `<head>` (cuadrado `#14161b` con círculo `#2d5b9e`). Sustituir por el logotipo definitivo.
- `sira-iconos.jpg` — hoja de referencia de estilo de iconos, no es un asset de producción.

**Sin fotografía.** Si se añade, debe ser real (equipo, oficina, capturas de las automatizaciones); nada de stock genérico ni imágenes generadas.

## SEO y metadatos
Cada ruta necesita: `<title>` propio, `meta description`, `canonical` absoluto, bloque Open Graph completo (`og:type`, `og:site_name`, `og:locale: es_ES`, `og:title`, `og:description`, `og:url`, `og:image` + `width`/`height`), `twitter:card summary_large_image`, `theme-color: #14161b`, `lang="es"`.

JSON-LD ya escrito en la home: `Organization` (nombre, url, logo, descripción, email, `areaServed: ES`, `knowsAbout`) y `FAQPage` con 8 preguntas. Genera ambos desde datos, no a mano. `/gracias` va `noindex`.

## Accesibilidad — pendiente de repasar
El prototipo cumple lo básico (`aria-label` en sliders y en el logo, botones reales, contraste correcto en las combinaciones principales) pero al portarlo hay que verificar: foco visible en todos los interactivos (no eliminar el outline, redefinirlo), navegación completa por teclado en chat y acordeones, `aria-live="polite"` en el cuerpo del chat para anunciar mensajes nuevos, `prefers-reduced-motion`, y contraste real de `#9a9d97` sobre crema (queda al límite de AA en tamaños pequeños — súbelo a `#6f767c` si no pasa).

## Contenido pendiente (bloqueado, requiere material del cliente)
1. **Nombre y marca definitivos** — decisión abierta. Mantén el token centralizado.
2. **Bloque de credenciales en la home** — formación, trayectoria, stack técnico y prueba social. Sin material real todavía. No lo inventes ni lo rellenes con placeholders: si no hay contenido, la sección no existe.
3. **Tramos de inversión** — rangos de precio o niveles de servicio. Pendiente de definir.
4. **Datos legales** — responsable, NIF, domicilio, encargados de tratamiento, plazos de conservación para la política de privacidad y el aviso legal.
5. **Dominio** — `sira.ai` es provisional.

## Files
Prototipos incluidos en este paquete:
- `nexo v2.dc.html` — home (la referencia principal y la más completa)
- `Sira casos.dc.html` — soluciones
- `Sira quienes somos.dc.html` — quiénes somos
- `Sira gracias.dc.html` — gracias
- `Sira privacidad.dc.html` — privacidad (borrador)
- `Sira og.dc.html` — plantilla de imagen social
- `nexo.dc.html` — **primera versión de la home, obsoleta.** Incluida solo como historial; ignórala.

Para abrir cualquiera de ellos en el navegador hace falta `support.js` junto a los archivos (incluido). Ese runtime es de prototipado: sirve para *ver* los diseños, no para portarlos.
