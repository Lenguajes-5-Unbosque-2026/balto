"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { BotonEnlace } from "@/components/boton"
import { Estado } from "@/components/estado"
import { PasoHorarios, type Horarios } from "@/components/medicamentos/paso-horarios"
import { HOY, sumarDias } from "@/lib/fecha"
import { duracion } from "@/lib/medicamentos"
import { guardarTratamiento, useMedicamentos, type DatosMedicamentos } from "@/lib/usar-medicamentos"
import { useVolver } from "@/lib/usar-salud"

/** G4 desde G2: editar los horarios o reactivar un tratamiento finalizado (/medicamentos/horarios?id=t04). */
export function EditarHorarios(datos: DatosMedicamentos) {
  const router = useRouter()
  const volver = useVolver("/medicamentos")
  const parametros = useSearchParams()
  const reactivar = parametros.get("reactivar") === "1"
  const t = useMedicamentos(datos).tratamientos.find((x) => x.id === parametros.get("id"))

  if (!t) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-6 px-pantalla">
        <Estado icono="search_off" titulo="No encontramos el tratamiento" />
        <BotonEnlace href="/medicamentos" variante="secundario">
          Ir a medicamentos
        </BotonEnlace>
      </main>
    )
  }

  function guardar(h: Horarios) {
    const dur = duracion(t!) || 7
    guardarTratamiento(t!.id, {
      frecuencia: h.frecuencia,
      dias_semana: h.dias_semana,
      horas: h.horas,
      recordatorio: String(h.recordatorio),
      // Reactivar: empieza hoy con la misma duración (spec de G).
      ...(reactivar ? { estado: "vigente", finalizado_antes: "false", fecha_inicio: HOY, fecha_fin: sumarDias(HOY, dur) } : {}),
    })
    toast.success(reactivar ? "Tratamiento reactivado" : "Horarios guardados. Valen desde la próxima toma.")
    router.replace(`/medicamentos/detalle?id=${t!.id}`)
  }

  return (
    <PasoHorarios
      // Se vuelve a montar con los datos del tratamiento cuando llegan los cambios guardados en el navegador.
      key={`${t.id}-${t.horas.join()}-${t.frecuencia}`}
      inicial={{ frecuencia: t.frecuencia, horas: t.horas, dias_semana: t.dias_semana, recordatorio: t.recordatorio === "true" || reactivar }}
      textoBoton={reactivar ? "Reactivar" : "Guardar horarios"}
      onVolver={volver}
      onGuardar={guardar}
    />
  )
}
