/** Convierte un CSV (UTF-8, separado por comas, con comillas dobles) en filas de texto. */
export function parsearCsv(texto: string): Record<string, string>[] {
  const filas: string[][] = []
  let fila: string[] = []
  let celda = ""
  let entreComillas = false

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (entreComillas) {
      if (c === '"' && texto[i + 1] === '"') {
        celda += '"'
        i++
      } else if (c === '"') {
        entreComillas = false
      } else {
        celda += c
      }
    } else if (c === '"') {
      entreComillas = true
    } else if (c === ",") {
      fila.push(celda)
      celda = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++
      fila.push(celda)
      filas.push(fila)
      fila = []
      celda = ""
    } else {
      celda += c
    }
  }
  if (celda !== "" || fila.length > 0) {
    fila.push(celda)
    filas.push(fila)
  }

  const [encabezado, ...resto] = filas.filter((f) => f.some((v) => v !== ""))
  return resto.map((f) => Object.fromEntries(encabezado.map((col, i) => [col, f[i] ?? ""])))
}
