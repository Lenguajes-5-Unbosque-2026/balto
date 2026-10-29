import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { FormularioEvento } from "@/components/registro/formulario-evento"
import { anticipacionAvisos, obtenerMascotasBasicas, obtenerMediciones, obtenerVeterinarias } from "@/lib/datos"
import { TIPOS_EVENTO, tipoEvento } from "@/lib/eventos"

export function generateStaticParams() {
  return TIPOS_EVENTO.map((t) => ({ tipo: t.slug }))
}

export async function generateMetadata({ params }: PageProps<"/registrar/[tipo]">): Promise<Metadata> {
  const { tipo } = await params
  return { title: `${tipoEvento(tipo)?.nombre ?? "Registrar"} · Balto` }
}

/**
 * E2–E7, E10 y E11: formulario de cada tipo de evento. Los 9 tipos se generan
 * al compilar; el Suspense solo deja que la navegación sea instantánea.
 */
export default function FormularioPage({ params }: PageProps<"/registrar/[tipo]">) {
  return (
    <Suspense>
      <Formulario params={params} />
    </Suspense>
  )
}

async function Formulario({ params }: Pick<PageProps<"/registrar/[tipo]">, "params">) {
  const { tipo } = await params
  const config = tipoEvento(tipo)
  if (!config) notFound()

  return (
    <FormularioEvento
      tipoInicial={config.slug}
      mascotas={obtenerMascotasBasicas()}
      mediciones={obtenerMediciones()}
      veterinarias={obtenerVeterinarias().map((v) => v.nombre)}
      anticipacion={anticipacionAvisos()}
    />
  )
}
