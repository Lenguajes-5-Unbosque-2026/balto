const DIA_BOGOTA = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" })

/**
 * La fecha de hoy en Bogotá ("2026-11-10"), la del día en que se abre la app.
 * Se calcula con la zona de Bogotá para que el servidor y el celular den el
 * mismo día. Las páginas que la usan se arman en cada visita (cargarDatos llama
 * connection()), así que nunca queda la fecha del día en que se compiló.
 */
export function hoy() {
  return DIA_BOGOTA.format(new Date())
}

/** Hora de "ahora" para las tomas de hoy (G1, G2). Es fija: con ella se calculan las tomas pendientes y vencidas del día. */
export const AHORA = "09:41"

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
  const anios = Math.floor(mesesEntre(nacimiento, hoy()) / 12)
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

/** "Samuel Páez" → "samuel_paez", para nombres de archivo. */
export function normalizarNombreArchivo(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
}

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

/** "2026-09-23" → "Miércoles, 23 de septiembre" (J6). */
export function fechaLarga(iso: string) {
  const { m, d } = partes(iso)
  return `${DIAS[diaSemana(iso)]}, ${d} de ${MESES_LARGOS[m - 1].toLowerCase()}`
}

/** Día de la semana de una fecha ISO (0 = domingo). */
export function diaSemana(iso: string) {
  const { a, m, d } = partes(iso)
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay()
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
