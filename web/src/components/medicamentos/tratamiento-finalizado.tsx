"use client"

import { useSearchParams } from "next/navigation"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Resumen } from "@/components/medicamentos/detalle-tratamiento"
import { Nota } from "@/components/nota"
import { duracion, nombreTratamiento, resumenTratamiento } from "@/lib/medicamentos"
import { useMedicamentos, type DatosMedicamentos } from "@/lib/usar-medicamentos"

type FinalizadoProps = DatosMedicamentos & { mascotas: { id: string; nombre: string }[] }

/** G9 · Tratamiento finalizado (/medicamentos/finalizado?id=t04). */
export function TratamientoFinalizado({ mascotas, ...datos }: FinalizadoProps) {
  const id = useSearchParams().get("id")
  const { tratamientos, registros } = useMedicamentos(datos)
  const t = tratamientos.find((x) => x.id === id)
  const mascota = mascotas.find((m) => m.id === t?.mascota_id)
  const resumen = t && resumenTratamiento(t, registros)

  return (
    <main className="flex flex-1 flex-col gap-5 px-pantalla pt-14">
      <Encabezado titulo="Tratamiento" />
      <div className="pt-6">
        <Estado
          tono="exito"
          icono="check_circle"
          titulo="Tratamiento finalizado"
          mensaje={t ? `${nombreTratamiento(t)} quedó guardada en el historial de ${mascota?.nombre ?? "tu mascota"}.` : "El tratamiento quedó en Finalizados."}
        />
      </div>
      {t && resumen && (
        <Resumen dias={`${resumen.dias} de ${duracion(t)} días`} tomadas={`${resumen.tomadas} de ${resumen.total}`} omitidas={resumen.omitidas} />
      )}
      <Nota icono="restart_alt">Si el veterinario la vuelve a recetar, puedes reactivarla desde Finalizados.</Nota>
      <BarraAccion>
        <BotonEnlace href="/medicamentos" className="px-2 texto-cuerpo-fuerte">
          Ver medicamentos
        </BotonEnlace>
        <BotonEnlace href="/linea-de-tiempo" variante="secundario" className="px-2 texto-cuerpo-fuerte">
          Ver línea de tiempo
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}
