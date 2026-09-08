// Fechas de compromiso comercial, siempre en la zona horaria de España.
//
// La función serverless corre en UTC, así que nada de getDay()/getDate():
// a las 23:30 UTC de un viernes en Madrid ya es sábado, y el cálculo de
// días hábiles saldría desplazado un día. Todo pasa por Intl con
// timeZone explícita.

export const ZONA = 'Europe/Madrid';

const DIAS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const fmtDiaSemana = new Intl.DateTimeFormat('en-US', {
  timeZone: ZONA,
  weekday: 'short',
});

const fmtLarga = new Intl.DateTimeFormat('es-ES', {
  timeZone: ZONA,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

/** Día de la semana (0 domingo … 6 sábado) tal y como se ve en España. */
export function diaSemanaEnEspana(fecha: Date): number {
  return DIAS_EN.indexOf(fmtDiaSemana.format(fecha));
}

/**
 * Suma días hábiles saltando sábados y domingos.
 *
 * No contempla festivos: mantener el calendario de festivos nacionales,
 * autonómicos y locales no compensa para una fecha de compromiso, y un
 * festivo suelto solo nos da un día más de margen del prometido.
 */
export function sumarDiasHabiles(desde: Date, dias: number): Date {
  const fecha = new Date(desde.getTime());
  let restantes = dias;
  while (restantes > 0) {
    fecha.setUTCDate(fecha.getUTCDate() + 1);
    const dia = diaSemanaEnEspana(fecha);
    if (dia !== 0 && dia !== 6) restantes -= 1;
  }
  return fecha;
}

/** "jueves 11 de septiembre". */
export function formatearFechaLarga(fecha: Date): string {
  // es-ES intercala una coma tras el día de la semana ("jueves, 11 de
  // septiembre"). Se quita para que encaje dentro de una frase.
  return fmtLarga.format(fecha).replace(',', '');
}

/**
 * Fecha que prometemos en la confirmación al lead: dos días hábiles.
 * El parámetro `desde` existe para poder fijarla en los tests.
 */
export function fechaEntregaDiagnostico(desde: Date = new Date()): string {
  return formatearFechaLarga(sumarDiasHabiles(desde, 2));
}
