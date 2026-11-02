"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { CabeceraPublica } from "@/components/compartir/perfil-publico"
import { Icono } from "@/components/icono"
import type { Evento } from "@/lib/eventos"
import { fechaNumerica } from "@/lib/fecha"
import { GRUPOS_HABITO, detalleRegistro, iconoHabito, textoRango, tituloRegistro, type Habito } from "@/lib/habitos"
import { useBitacora } from "@/lib/usar-habitos"

type PdfBitacoraProps = { mascotas: { id: string; nombre: string }[]; habitos: Habito[]; eventos: Evento[] }

/** La bitácora de I4 lista para imprimir o guardar como PDF (/habitos/pdf?mascota=m01&grupos=…). */
export function PdfBitacora({ mascotas, habitos, eventos }: PdfBitacoraProps) {
  const p = useSearchParams()
  const mascota = mascotas.find((m) => m.id === p.get("mascota")) ?? mascotas[0]
  const registros = useBitacora(habitos, eventos, mascota.id)
  const desde = p.get("desde") ?? ""
  const hasta = p.get("hasta") ?? ""
  const etologo = p.get("para") === "etologo"
  const elegidos = (p.get("grupos") ?? "").split(";")
  // Para el etólogo, primero el comportamiento atípico y el sueño (spec de I).
  const orden = etologo ? ["atipico", "sueno", "paseos", "deposiciones"] : ["paseos", "sueno", "atipico", "deposiciones"]
  const grupos = orden.map((s) => GRUPOS_HABITO.find((g) => g.slug === s)!).filter((g) => elegidos.includes(g.slug))

  useEffect(() => {
    const espera = setTimeout(() => window.print(), 600)
    return () => clearTimeout(espera)
  }, [])

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla py-10 print:py-4">
      <CabeceraPublica detalle={`${etologo ? "Bitácora de comportamiento" : "Bitácora de hábitos"} de ${mascota.nombre} · ${textoRango(desde, hasta)}`} candado={false} />
      {grupos.map((g) => {
        const propios = registros.filter((r) => (g.tipos as readonly string[]).includes(r.tipo) && r.fecha >= desde && r.fecha <= hasta)
        return (
          <section key={g.slug} className="flex break-inside-avoid flex-col gap-2.5">
            <h2 className="texto-titulo-tarjeta text-texto">
              {g.largo} · {propios.length}
            </h2>
            {propios.length === 0 ? (
              <p className="texto-cuerpo text-texto-secundario">Sin registros en este periodo.</p>
            ) : (
              propios.map((r) => (
                <div key={r.id} className="flex items-start gap-3 rounded-md bg-superficie p-3.5">
                  <Icono nombre={iconoHabito(r.tipo)} className="icono-m text-primario" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="texto-cuerpo-fuerte text-texto">
                      {fechaNumerica(r.fecha)} · {tituloRegistro(r)}
                    </span>
                    <span className="texto-etiqueta text-texto-secundario">{r.observacion || detalleRegistro(r)}</span>
                  </div>
                </div>
              ))
            )}
          </section>
        )
      })}
    </main>
  )
}
