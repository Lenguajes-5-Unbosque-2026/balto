"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { CabeceraPublica, PerfilPublico } from "@/components/compartir/perfil-publico"
import { seccionesDe } from "@/lib/compartir"
import type { Evento } from "@/lib/eventos"
import { HOY, fechaCorta } from "@/lib/fecha"
import { useMascotas } from "@/lib/mascota-activa"
import type { PerfilMascota } from "@/lib/perfil"
import { useDueno } from "@/lib/usar-cuenta"
import { useEventos } from "@/lib/usar-eventos"

type PdfPerfilProps = { mascotas: PerfilMascota[]; eventos: Evento[]; dueno: { id: string; nombre: string; telefono: string } }

/**
 * El reporte listo para imprimir o guardar como PDF desde el navegador
 * (/compartir/pdf?mascota=m01&secciones=…). Con mascota=todas sale una página por mascota (M6).
 */
export function PdfPerfil({ mascotas: base, eventos: eventosBase, dueno: duenoBase }: PdfPerfilProps) {
  const p = useSearchParams()
  const dueno = useDueno(duenoBase)
  const mascotas = useMascotas(base)
  const eventos = useEventos(eventosBase)
  const cual = p.get("mascota")
  const elegidas = cual === "todas" ? mascotas : [mascotas.find((m) => m.id === cual) ?? mascotas[0]]

  useEffect(() => {
    // Da tiempo a que carguen las fotos y las fuentes antes de abrir el diálogo.
    const espera = setTimeout(() => window.print(), 600)
    return () => clearTimeout(espera)
  }, [])

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla py-10 print:py-4">
      <CabeceraPublica detalle={`Reporte del ${fechaCorta(HOY)}`} candado={false} />
      {elegidas.map((mascota) => (
        <section key={mascota.id} className="flex flex-col gap-4 break-before-page first-of-type:break-before-auto">
          <PerfilPublico
            mascota={mascota}
            eventos={eventos.filter((e) => e.mascota_id === mascota.id)}
            dueno={dueno}
            secciones={seccionesDe(p.get("secciones") ?? "completo")}
            desde={p.get("desde") ?? ""}
            hasta={p.get("hasta") ?? ""}
          />
        </section>
      ))}
    </main>
  )
}
