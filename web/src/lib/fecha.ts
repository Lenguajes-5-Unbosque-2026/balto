/**
 * "Hoy" para los datos de prueba (data/mock/README.md). Se fija en vez de usar
 * la fecha del sistema para que alertas, pesos y fechas por defecto coincidan
 * con los CSV. Cuando lleguen los datos de Supabase, esto pasa a ser la fecha real.
 */
export const HOY = "2026-10-27"

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

function partes(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number)
  return { a, m, d }
}

/** "2026-09-12" → "12 SEP 2026" (fecha de las tarjetas de evento). */
export function fechaTarjeta(iso: string) {
  const { a, m, d } = partes(iso)
  return `${d} ${MESES[m - 1].toUpperCase()} ${a}`
}

/** "2027-09-05" → "5 sep 2027" (textos corridos). */
export function fechaCorta(iso: string) {
  const { a, m, d } = partes(iso)
  return `${d} ${MESES[m - 1]} ${a}`
}

/** Suma días a una fecha ISO y devuelve otra fecha ISO. */
export function sumarDias(iso: string, dias: number) {
  const { a, m, d } = partes(iso)
  const f = new Date(Date.UTC(a, m - 1, d + dias))
  return f.toISOString().slice(0, 10)
}

/** Meses completos entre dos fechas ISO. */
export function mesesEntre(desde: string, hasta: string) {
  const x = partes(desde)
  const y = partes(hasta)
  return (y.a - x.a) * 12 + (y.m - x.m) - (y.d < x.d ? 1 : 0)
}

/** Edad en años a partir de la fecha de nacimiento ("3 años"). */
export function edad(nacimiento: string) {
  if (!nacimiento) return ""
  const anios = Math.floor(mesesEntre(nacimiento, HOY) / 12)
  return anios === 1 ? "1 año" : `${anios} años`
}

const MESES_LARGOS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

/** "2026-09-12" → "12/09/2026" (fechas de las filas de datos). */
export function fechaNumerica(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split("-")
  return `${d}/${m}/${a}`
}

/** "2026-09-01" → "01 sep" (peso de D1). */
export function fechaDiaMes(iso: string) {
  const { m, d } = partes(iso)
  return `${String(d).padStart(2, "0")} ${MESES[m - 1]}`
}

/** "2026-09-12" → "Septiembre 2026" (grupos de la línea de tiempo). */
export function mesAnio(iso: string) {
  const { a, m } = partes(iso)
  return `${MESES_LARGOS[m - 1]} ${a}`
}

/** "2026-08-01" → "agosto". */
export function nombreMes(iso: string) {
  return MESES_LARGOS[partes(iso).m - 1].toLowerCase()
}

/** Días de una fecha ISO a otra (negativo si la segunda es anterior). */
export function diasEntre(desde: string, hasta: string) {
  const x = partes(desde)
  const y = partes(hasta)
  return Math.round((Date.UTC(y.a, y.m - 1, y.d) - Date.UTC(x.a, x.m - 1, x.d)) / 86_400_000)
}
