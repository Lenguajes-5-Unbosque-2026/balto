"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import type { Evento } from "@/lib/eventos"
import { fechaCorta, fechaTarjeta } from "@/lib/fecha"
import {
  CONSISTENCIAS,
  GRUPOS_HABITO,
  detalleRegistro,
  fotosTexto,
  grafica,
  iconoHabito,
  tituloRegistro,
  type GrupoHabito,
  type Habito,
  type Registro,
} from "@/lib/habitos"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { eliminarHabito, useBitacora } from "@/lib/usar-habitos"
import { useVolver } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

type BitacoraProps = { mascotas: { id: string; nombre: string }[]; habitos: Habito[]; eventos: Evento[] }

/** I1 · Bitácora de hábitos e I6 · Bitácora vacía. */
export function BitacoraHabitos({ mascotas, habitos, eventos }: BitacoraProps) {
  const volver = useVolver("/")
  const [mascota] = useMascotaActiva(mascotas)
  const registros = useBitacora(habitos, eventos, mascota.id)
  const [filtro, setFiltro] = useState<GrupoHabito | "todos">("todos")
  const [viendo, setViendo] = useState<Registro | null>(null)

  const grupo = GRUPOS_HABITO.find((g) => g.slug === filtro)
  const lista = grupo ? registros.filter((r) => (grupo.tipos as readonly string[]).includes(r.tipo)) : registros
  const datos = grafica(registros, filtro)
  const max = Math.max(...(datos?.valores ?? [1]), 1)

  const chips = (
    <div className="sin-barra-desplazamiento -mx-pantalla flex gap-2 overflow-x-auto px-pantalla">
      <Chip texto="Todos" icono={registros.length ? undefined : "apps"} activo={filtro === "todos"} onClick={() => setFiltro("todos")} />
      {GRUPOS_HABITO.map((g) => (
        <Chip key={g.slug} texto={g.nombre} icono={g.icono} activo={filtro === g.slug} onClick={() => setFiltro(g.slug)} />
      ))}
    </div>
  )

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado
        titulo={`Hábitos de ${mascota.nombre}`}
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={registros.length > 0 && <BotonIconoEnlace href="/habitos/registrar" icono="add" etiqueta="Registrar hábito" />}
      />
      {chips}

      {registros.length === 0 ? (
        <>
          <div className="pt-4">
            <Estado icono="edit_note" titulo="Aún no registras hábitos" mensaje="Anota un paseo, una siesta o algo atípico y verás la evolución aquí." />
          </div>
          <Nota icono="insights">Con 2 semanas de registro ya se nota un patrón útil para la consulta.</Nota>
          <BarraAccion>
            <BotonEnlace href="/habitos/registrar">Registrar hábito</BotonEnlace>
          </BarraAccion>
        </>
      ) : (
        <>
          {datos && (
            <section className="flex flex-col gap-4 rounded-bloque border border-borde-fuerte bg-superficie p-4 movil-m:p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="texto-cuerpo-fuerte text-texto">{datos.titulo}</h2>
                <span className="shrink-0 texto-micro text-texto-secundario">{datos.rango}</span>
              </div>
              <div className="flex h-24 items-end gap-4 movil-m:gap-6" role="img" aria-label={`${datos.titulo}: ${datos.valores.map((v) => Math.round(v * 10) / 10).join(", ")}`}>
                {datos.valores.map((v, i) => (
                  <span
                    key={i}
                    className={cn("flex-1 rounded-sm", i === datos.valores.length - 1 ? "bg-primario" : "bg-acento")}
                    // Altura proporcional al dato: no es un valor de diseño.
                    style={{ height: `${Math.max(12, (v / max) * 100)}%` }}
                  />
                ))}
              </div>
            </section>
          )}

          {lista.length === 0 ? (
            <p className="py-6 text-center texto-cuerpo text-texto-secundario">No hay registros de este tipo.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {lista.map((r) => {
                const contenido = (
                  <>
                    <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario movil-m:size-12">
                      <Icono nombre={iconoHabito(r.tipo)} className="icono-m movil-m:icono-l" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate texto-cuerpo-fuerte text-texto">{tituloRegistro(r)}</span>
                      <span className={cn("truncate texto-etiqueta", r.consistencia === "con_sangre" ? "text-error" : "text-texto-secundario")}>
                        {detalleRegistro(r)}
                      </span>
                      <span className="flex items-center gap-2 texto-micro whitespace-nowrap normal-case">
                        <span className="text-primario uppercase">{fechaTarjeta(r.fecha)}</span>
                        <span className="flex items-center gap-0.5 text-texto-secundario">
                          <Icono nombre="attach_file" className="icono-xs" />
                          {fotosTexto(r.fotos)}
                        </span>
                      </span>
                    </span>
                    <Icono nombre="chevron_right" className="shrink-0 icono-m text-texto-secundario" />
                  </>
                )
                const clases = "flex min-w-0 items-center gap-3 rounded-md border border-borde-fuerte bg-superficie p-3 text-left movil-m:gap-3.5 movil-m:p-3.5"
                return r.eventoId ? (
                  <Link key={r.id} href={`/evento?id=${r.eventoId}`} className={clases}>
                    {contenido}
                  </Link>
                ) : (
                  <button key={r.id} type="button" onClick={() => setViendo(r)} className={clases}>
                    {contenido}
                  </button>
                )
              })}
            </div>
          )}

          <BarraAccion>
            <BotonEnlace href="/habitos/exportar">Exportar bitácora</BotonEnlace>
          </BarraAccion>
        </>
      )}

      <Hoja abierta={!!viendo} onCerrar={() => setViendo(null)} titulo={viendo ? tituloRegistro(viendo) : "Registro"}>
        {viendo && (
          <div className="flex flex-col gap-3">
            <dl className="flex flex-col gap-2.5 rounded-md border border-borde-fuerte px-4 py-3.5">
              <Fila etiqueta="Fecha" valor={fechaCorta(viendo.fecha)} />
              {viendo.minutos > 0 && <Fila etiqueta="Duración" valor={detalleRegistro(viendo).split(" · ").find((x) => /min|h$/.test(x)) ?? ""} />}
              {viendo.consistencia && <Fila etiqueta="Cómo fue" valor={CONSISTENCIAS.find((c) => c.valor === viendo.consistencia)?.etiqueta ?? ""} />}
            </dl>
            {viendo.observacion && <p className="texto-cuerpo text-texto">{viendo.observacion}</p>}
            {viendo.consistencia === "con_sangre" && (
              <Nota tono="error" icono="warning">
                Consúltalo con tu veterinario.
              </Nota>
            )}
            <Boton
              variante="destructivo-contorno"
              onClick={() => {
                eliminarHabito(viendo.id)
                setViendo(null)
                toast.success("Registro eliminado")
              }}
            >
              Eliminar
              <Icono nombre="delete" className="icono-s" />
            </Boton>
          </div>
        )}
      </Hoja>
    </main>
  )
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="texto-etiqueta text-texto-secundario">{etiqueta}</dt>
      <dd className="texto-etiqueta-fuerte text-texto">{valor}</dd>
    </div>
  )
}
