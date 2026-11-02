import { ordenarEventos, type Evento } from "@/lib/eventos"
import { HOY, diasEntre, fechaCorta, nombreMes } from "@/lib/fecha"
import { nombreVacuna, ultimasVacunas } from "@/lib/perfil"

const sinAnio = (iso: string) => fechaCorta(iso).replace(/ \d{4}$/, "")

/** "hoy", "mañana", "en 2 días", "hace 3 días". */
export function textoEn(fecha: string) {
  const dias = diasEntre(HOY, fecha)
  if (dias === 0) return "hoy"
  if (dias === 1) return "mañana"
  if (dias < 0) return `hace ${-dias} ${dias === -1 ? "día" : "días"}`
  return `en ${dias} días`
}

/** La vacuna con el próximo refuerzo más cercano (vencidas primero). */
export function proximaVacuna(eventos: Evento[]) {
  return ultimasVacunas(eventos)
    .filter((v) => v.proximo_refuerzo)
    .sort((a, b) => a.proximo_refuerzo!.localeCompare(b.proximo_refuerzo!))[0]
}

/** La desparasitación más reciente, que dice cuándo toca la próxima. */
export function ultimaDesparasitacion(eventos: Evento[]) {
  return ordenarEventos(eventos).find((e) => e.tipo === "desparasitacion")
}

/** "Próxima: antirrábica en 2 días" (acceso de F1). */
export function textoProximaVacuna(eventos: Evento[]) {
  const v = proximaVacuna(eventos)
  if (!v) return "Sin vacunas registradas"
  const vencida = v.proximo_refuerzo! < HOY
  return `${vencida ? "Vencida" : "Próxima"}: ${nombreVacuna(v).toLowerCase()} ${textoEn(v.proximo_refuerzo!)}`
}

/** "Próxima dosis: antirrábica · 25 sep (en 2 días)" (barra de F2). */
export function barraProximaDosis(e: Evento | undefined, cual: "vacuna" | "desparasitacion") {
  const fecha = cual === "vacuna" ? e?.proximo_refuerzo : e?.proxima_dosis
  if (!e || !fecha) return ""
  const que = cual === "vacuna" ? nombreVacuna(e).toLowerCase() : (e.producto ?? "desparasitación")
  return `Próxima dosis: ${que} · ${sinAnio(fecha)} (${textoEn(fecha)})`
}

export function pesosAscendentes(eventos: Evento[]) {
  return eventos
    .filter((e) => e.tipo === "peso" && e.peso_kg)
    .map((e) => ({ fecha: e.fecha, kg: Number(e.peso_kg), id: e.id }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
}

/** Diferencia de la última medición con la anterior: "+0,3 kg", "vs. agosto" y si es un cambio brusco (> 10 %). */
export function variacionPeso(eventos: Evento[]) {
  const pesos = pesosAscendentes(eventos)
  const ultima = pesos.at(-1)
  const anterior = pesos.at(-2)
  if (!ultima || !anterior) return null
  const dif = Math.round((ultima.kg - anterior.kg) * 10) / 10
  return {
    dif,
    texto: `${dif > 0 ? "+" : dif < 0 ? "−" : "±"}${String(Math.abs(dif)).replace(".", ",")}`,
    mes: nombreMes(anterior.fecha),
    porcentaje: Math.abs(dif / anterior.kg) * 100,
  }
}

const CORTO = /^.{1,24}$/

/** "Resultados normales" o el resultado principal si es corto ("Negativo") (F3). */
export function resumenExamen(e: Evento) {
  const principal = (e.resultado_principal ?? "").replace(/\.$/, "")
  if (principal && CORTO.test(principal)) return principal
  return e.resultado === "alterado" ? "Resultado alterado" : "Resultados normales"
}

/** "1 PDF", "1 fórmula", "2 fotos" o "Sin soporte" (F3). */
export function textoSoportesSalud(e: Evento) {
  const soportes = e.soportes ?? []
  if (soportes.length === 0) return "Sin soporte"
  if (e.tipo === "tratamiento") return soportes.length === 1 ? "1 fórmula" : `${soportes.length} fórmulas`
  const pdfs = soportes.filter((s) => s.tipo === "pdf").length
  if (pdfs === soportes.length) return pdfs === 1 ? "1 PDF" : `${pdfs} PDF`
  return soportes.length === 1 ? "1 foto" : `${soportes.length} archivos`
}
