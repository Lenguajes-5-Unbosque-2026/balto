"use client"

import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace, botonVariants } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import type { Veterinaria } from "@/lib/datos"
import { distanciaKm, estadoHorario, iconoProveedor, puntoDe, rutaMapa, serviciosDe, textoKm } from "@/lib/proveedores"
import { alternarFavorita, puntoReferencia, useFavorita, useUbicacion } from "@/lib/usar-proveedores"
import { useVolver } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

const TITULOS: Record<string, string> = { veterinaria: "Clínica", estetica: "Estética", guarderia: "Guardería", paseo: "Paseador" }

/** K4 · Ficha del proveedor (/veterinarias/ficha?id=v01). */
export function FichaProveedor({ proveedores }: { proveedores: Veterinaria[] }) {
  const volver = useVolver("/veterinarias")
  const p = useSearchParams()
  const v = proveedores.find((x) => x.id === p.get("id"))
  const favorita = useFavorita()
  const ref = puntoReferencia(useUbicacion())

  if (!v) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Proveedor" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <Estado icono="search_off" titulo="No encontramos este lugar" />
      </main>
    )
  }

  const esFavorita = favorita === v.id
  const horario = estadoHorario(v)
  const agendar = new URLSearchParams({ id: v.id })
  for (const k of ["servicio", "alerta"]) if (p.get(k)) agendar.set(k, p.get(k)!)
  const accion = cn("inline-flex items-center justify-center", botonVariants({ variante: "suave" }))

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado
        titulo={TITULOS[v.tipo] ?? "Proveedor"}
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={
          <BotonIcono
            icono={esFavorita ? "favorite" : "favorite_border"}
            etiqueta={esFavorita ? "Quitar de confianza" : "Marcar como de confianza"}
            className={esFavorita ? "text-error" : undefined}
            onClick={() => {
              alternarFavorita(v.id, favorita)
              toast.success(esFavorita ? "Ya no es tu veterinaria de confianza" : "Es tu veterinaria de confianza", {
                description: esFavorita ? undefined : "Aparecerá primero cuando busques.",
              })
            }}
          />
        }
      />

      <div className="flex h-36 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primario bg-acento-suave text-texto-secundario">
        <Icono nombre={iconoProveedor(v)} className="icono-xl text-primario" />
        <span className="texto-etiqueta">Foto del lugar</span>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="texto-titulo-pantalla text-texto">{v.nombre}</h1>
        <span className="texto-cuerpo text-texto-secundario">
          {[v.calificacion && `★ ${v.calificacion.replace(".", ",")} (${v.num_resenas} reseñas)`, textoKm(distanciaKm(ref, puntoDe(v))), horario.texto].filter(Boolean).join(" · ")}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {serviciosDe(v).map((s) => (
          <span key={s} className="flex h-9.5 items-center rounded-completo border border-borde-fuerte bg-superficie px-4 texto-etiqueta-fuerte text-texto">
            {s}
          </span>
        ))}
      </div>

      <dl className="flex flex-col gap-2 rounded-md bg-superficie px-4 py-3.5">
        {[
          ["Dirección", `${v.direccion} · ${v.barrio}`],
          ["Teléfono", v.telefono],
          ["Horario", v.horario],
        ].map(([e, val]) => (
          <div key={e} className="flex items-baseline justify-between gap-4">
            <dt className="shrink-0 texto-etiqueta text-texto-secundario">{e}</dt>
            <dd className="min-w-0 truncate text-right texto-etiqueta-fuerte text-texto">{val}</dd>
          </div>
        ))}
      </dl>

      <div className="flex gap-2.5">
        <a href={`tel:${v.telefono.replace(/\s/g, "")}`} className={accion}>
          Llamar
          <Icono nombre="call" className="icono-m" />
        </a>
        <a href={rutaMapa(v)} target="_blank" rel="noreferrer" className={accion}>
          Ruta
          <Icono nombre="directions" className="icono-m" />
        </a>
      </div>

      <BarraAccion>
        {v.agenda_en_linea === "true" ? (
          <BotonEnlace href={`/veterinarias/agendar?${agendar}`}>
            Agendar cita
            <Icono nombre="calendar_month" className="icono-m" />
          </BotonEnlace>
        ) : (
          <a href={`tel:${v.telefono.replace(/\s/g, "")}`} className={cn("inline-flex items-center justify-center", botonVariants())}>
            Llamar para agendar
            <Icono nombre="call" className="icono-m" />
          </a>
        )}
      </BarraAccion>
    </main>
  )
}
