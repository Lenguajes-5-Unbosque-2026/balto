"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { CabeceraPublica, PerfilPublico } from "@/components/compartir/perfil-publico"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { estadoEnlace, seccionesDe } from "@/lib/compartir"
import type { Envio } from "@/lib/datos"
import type { Evento } from "@/lib/eventos"
import { HOY, fechaCorta } from "@/lib/fecha"
import type { PerfilMascota } from "@/lib/perfil"
import { useDueno } from "@/lib/usar-cuenta"
import { useEnvios } from "@/lib/usar-envios"
import { useEventos } from "@/lib/usar-eventos"

type VistaPublicaProps = {
  token: string
  mascotas: PerfilMascota[]
  eventos: Evento[]
  envios: Envio[]
  dueno: { id: string; nombre: string; telefono: string }
}

/** L5 · Vista pública del perfil (balto.app/p/<token>) y L6 · Enlace expirado. Quien la abre no necesita cuenta. */
export function VistaPublica({ token, mascotas, eventos: base, envios, dueno: duenoBase }: VistaPublicaProps) {
  const dueno = useDueno(duenoBase)
  const router = useRouter()
  const previa = useSearchParams().get("vista") === "previa"
  const enlace = useEnvios(envios).find((e) => e.formato === "enlace" && e.token === token)
  const eventos = useEventos(base)
  const mascota = mascotas.find((m) => m.id === enlace?.mascota_id)
  const estado = enlace ? estadoEnlace(enlace) : "desactivado"

  if (!enlace || !mascota || estado !== "activo") {
    const horas = enlace?.vencimiento === "24_horas" ? "24 horas" : enlace?.vencimiento === "7_dias" ? "7 días" : ""
    return (
      <main className="flex flex-1 flex-col gap-5 px-pantalla pt-14">
        <header className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre="pets" className="icono-m" />
          </span>
          <span className="texto-cuerpo-fuerte text-texto">Perfil de salud · Balto</span>
        </header>
        <div className="pt-4">
          <Estado
            tono="error"
            icono="link_off"
            titulo="Este enlace ya no sirve"
            mensaje={
              !enlace
                ? "No encontramos este enlace. Revisa que esté completo."
                : estado === "vencido" && horas
                  ? `El dueño lo compartió por ${horas} y ese tiempo ya pasó.`
                  : "El dueño desactivó este enlace."
            }
          />
        </div>
        <Nota icono="refresh">Pídele a quien te lo envió que genere uno nuevo desde la app.</Nota>
        <BarraAccion>
          <BotonEnlace href="/bienvenida">Entendido</BotonEnlace>
        </BarraAccion>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 print:pt-4">
      <CabeceraPublica detalle={`Solo lectura · ${fechaCorta(HOY)}`} />
      <PerfilPublico
        mascota={mascota}
        eventos={eventos.filter((e) => e.mascota_id === mascota.id)}
        dueno={dueno}
        secciones={seccionesDe(enlace.secciones)}
        desde={enlace.desde}
        hasta={enlace.hasta}
      />
      <div className="print:hidden">
        <BarraAccion>
          {/* El PDF sale del diálogo de impresión del navegador ("Guardar como PDF"). */}
          <Boton onClick={() => window.print()}>Descargar PDF</Boton>
          {previa && (
            <Boton variante="secundario" onClick={() => router.back()}>
              Volver
            </Boton>
          )}
        </BarraAccion>
      </div>
    </main>
  )
}
