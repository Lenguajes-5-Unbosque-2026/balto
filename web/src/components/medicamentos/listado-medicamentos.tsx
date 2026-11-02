"use client"

import { useState } from "react"

import { BotonEnlace } from "@/components/boton"
import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { FilaTomaHoy, HojaOmitir } from "@/components/medicamentos/tomas"
import { Selector } from "@/components/selector"
import { fechaCorta, HOY } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import {
  diaTratamiento,
  duracion,
  frecuenciaTratamiento,
  nombreTratamiento,
  tomasDelDia,
  type TomaVista,
} from "@/lib/medicamentos"
import { useMedicamentos, type DatosMedicamentos } from "@/lib/usar-medicamentos"
import { useVolver } from "@/lib/usar-salud"

type ListadoProps = DatosMedicamentos & { mascotas: { id: string; nombre: string }[] }

/** G1 · Listado de medicamentos de la mascota activa, con las tomas de hoy. */
export function ListadoMedicamentos({ mascotas, ...datos }: ListadoProps) {
  const volver = useVolver("/")
  const [mascota] = useMascotaActiva(mascotas)
  const { tratamientos, registros } = useMedicamentos(datos)
  const [pestana, setPestana] = useState<"vigentes" | "finalizados">("vigentes")
  const [omitiendo, setOmitiendo] = useState<TomaVista | null>(null)

  const propios = tratamientos.filter((t) => t.mascota_id === mascota.id)
  const vigentes = propios.filter((t) => t.estado === "vigente")
  const finalizados = propios.filter((t) => t.estado === "finalizado").sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio))
  const hoy = vigentes.flatMap((t) => tomasDelDia(t, HOY, registros)).sort((a, b) => a.hora.localeCompare(b.hora))
  const lista = pestana === "vigentes" ? vigentes : finalizados

  return (
    <div className="flex flex-col gap-4 px-pantalla pt-14">
      <Encabezado
        titulo="Medicamentos"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIconoEnlace href="/medicamentos/agregar" icono="add" etiqueta="Agregar medicamento" />}
      />
      <Selector
        etiqueta="Tratamientos"
        valor={pestana}
        onCambio={(v) => setPestana(v as typeof pestana)}
        opciones={[
          { valor: "vigentes", etiqueta: `Vigentes (${vigentes.length})` },
          { valor: "finalizados", etiqueta: "Finalizados" },
        ]}
      />

      {lista.length === 0 ? (
        <div className="flex flex-col gap-5 pt-6">
          <Estado
            icono="medication"
            titulo={pestana === "vigentes" ? "No hay medicamentos vigentes" : "Aún no hay finalizados"}
            mensaje={
              pestana === "vigentes"
                ? `Agrega el tratamiento que le recetaron a ${mascota.nombre} y te avisamos cada toma.`
                : "Cuando termine un tratamiento, quedará aquí."
            }
          />
          {pestana === "vigentes" && <BotonEnlace href="/medicamentos/agregar">Agregar medicamento</BotonEnlace>}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((t) => (
            <FilaOpcion
              key={t.id}
              borde
              icono="medication"
              titulo={nombreTratamiento(t)}
              detalle={
                t.estado === "vigente"
                  ? `${frecuenciaTratamiento(t)} · día ${diaTratamiento(t)} de ${duracion(t)}`
                  : `Terminó el ${fechaCorta(t.fecha_fin || HOY)}`
              }
              href={`/medicamentos/detalle?id=${t.id}`}
            />
          ))}
        </div>
      )}

      {pestana === "vigentes" && hoy.length > 0 && (
        <>
          <h2 className="mt-2 texto-titulo-seccion text-texto">Tomas de hoy</h2>
          <div className="flex flex-col gap-3">
            {hoy.map((t) => (
              <FilaTomaHoy key={t.clave} toma={t} onOmitir={setOmitiendo} />
            ))}
          </div>
        </>
      )}

      <HojaOmitir toma={omitiendo} onCerrar={() => setOmitiendo(null)} />
    </div>
  )
}
