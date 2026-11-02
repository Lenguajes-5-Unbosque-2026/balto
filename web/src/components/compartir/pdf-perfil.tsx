"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { CabeceraPublica, PerfilPublico } from "@/components/compartir/perfil-publico"
import { seccionesDe } from "@/lib/compartir"
import type { Evento } from "@/lib/eventos"
import { HOY, fechaCorta } from "@/lib/fecha"
import type { PerfilMascota } from "@/lib/perfil"
import { useEventos } from "@/lib/usar-eventos"

type PdfPerfilProps = { mascotas: PerfilMascota[]; eventos: Evento[]; dueno: { nombre: string; telefono: string } }

/** El reporte de L2 listo para imprimir o guardar como PDF desde el navegador (/compartir/pdf?mascota=m01&secciones=…). */
export function PdfPerfil({ mascotas, eventos: base, dueno }: PdfPerfilProps) {
  const p = useSearchParams()
  const mascota = mascotas.find((m) => m.id === p.get("mascota")) ?? mascotas[0]
  const eventos = useEventos(base).filter((e) => e.mascota_id === mascota.id)

  useEffect(() => {
    // Da tiempo a que carguen la foto y las fuentes antes de abrir el diálogo.
    const espera = setTimeout(() => window.print(), 600)
    return () => clearTimeout(espera)
  }, [])

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla py-10 print:py-4">
      <CabeceraPublica detalle={`Reporte del ${fechaCorta(HOY)}`} candado={false} />
      <PerfilPublico
        mascota={mascota}
        eventos={eventos}
        dueno={dueno}
        secciones={seccionesDe(p.get("secciones") ?? "completo")}
        desde={p.get("desde") ?? ""}
        hasta={p.get("hasta") ?? ""}
      />
    </main>
  )
}
