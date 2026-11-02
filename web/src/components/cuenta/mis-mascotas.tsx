"use client"

import { toast } from "sonner"

import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import type { Mascota } from "@/lib/datos"
import { edad } from "@/lib/fecha"
import { aplicarCambios, guardarCambiosMascota, useCambiosMascotas } from "@/lib/mascota-activa"
import { razaCorta } from "@/lib/perfil"
import { avisarPronto } from "@/lib/pronto"
import { useVolver } from "@/lib/usar-salud"

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** "Perro · Golden · 3 años" (M5). */
const detalle = (m: Mascota) => [mayuscula(m.especie), razaCorta(m.raza), edad(m.fecha_nacimiento)].filter(Boolean).join(" · ")

/** M5 · Administrar mascotas, con la sección Archivadas y "Restaurar". */
export function MisMascotas({ mascotas: base }: { mascotas: Mascota[] }) {
  const volver = useVolver("/ajustes")
  const cambios = useCambiosMascotas()
  const mascotas = base.map((m) => aplicarCambios(m, cambios[m.id]))
  const activas = mascotas.filter((m) => !cambios[m.id]?.archivada)
  const archivadas = mascotas.filter((m) => cambios[m.id]?.archivada)

  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14 pb-10">
      <Encabezado
        titulo="Mis mascotas"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIcono icono="add" etiqueta="Agregar mascota" onClick={() => avisarPronto("Agregar mascota")} />}
      />
      {activas.map((m) => (
        <FilaOpcion key={m.id} borde icono="pets" titulo={m.nombre} detalle={detalle(m)} href={`/ajustes/mascotas/editar?id=${m.id}`} />
      ))}
      <Boton variante="secundario" className="mt-1" onClick={() => avisarPronto("Agregar mascota")}>
        Agregar mascota
        <Icono nombre="add" className="icono-m" />
      </Boton>
      <Nota icono="inventory_2">Archivar una mascota guarda su historial sin borrarlo.</Nota>

      {archivadas.length > 0 && (
        <>
          <h2 className="mt-3 texto-micro text-texto-secundario">Archivadas</h2>
          {archivadas.map((m) => (
            <FilaOpcion
              key={m.id}
              icono="inventory_2"
              titulo={m.nombre}
              detalle={detalle(m)}
              derecha={<span className="texto-etiqueta-fuerte text-primario">Restaurar</span>}
              onClick={() => {
                guardarCambiosMascota(m.id, { archivada: false })
                toast.success(`${m.nombre} volvió a Inicio`)
              }}
            />
          ))}
        </>
      )}
    </main>
  )
}
