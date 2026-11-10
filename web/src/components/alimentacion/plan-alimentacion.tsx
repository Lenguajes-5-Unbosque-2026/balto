"use client"

import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { RasgoOscuro } from "@/components/rasgo"
import { diasRestantes, estadoComida, nombrePlan } from "@/lib/alimentacion"
import { HOY } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { guardarPlan, servirComida, usePlanes, type DatosAlimentacion } from "@/lib/usar-alimentacion"
import { useVolver } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

type PlanProps = DatosAlimentacion & { mascotas: { id: string; nombre: string }[] }

/** H1 · Plan de alimentación de la mascota activa, con los horarios de hoy y los días de alimento que quedan. */
export function PlanAlimentacion({ mascotas, ...datos }: PlanProps) {
  const volver = useVolver("/")
  const [mascota] = useMascotaActiva(mascotas)
  const { planes, servida } = usePlanes(datos)
  const plan = planes[mascota.id]

  if (!plan) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Alimentación" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <div className="pt-6">
          <Estado icono="restaurant" titulo="Aún no tienes un plan de alimentación" mensaje={`Cuéntanos qué come ${mascota.nombre} y te sugerimos la porción y los horarios.`} />
        </div>
        <BarraAccion>
          <BotonEnlace href="/alimentacion/registrar">Crear plan</BotonEnlace>
        </BarraAccion>
      </main>
    )
  }

  const dias = diasRestantes(plan)
  const poco = dias !== null && dias <= 5
  const porComida = plan.comidas.length ? Math.round(plan.gramos_dia / plan.comidas.length) : plan.gramos_dia

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 pb-10">
      <Encabezado
        titulo="Alimentación"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIconoEnlace href="/alimentacion/registrar?editar=1" icono="edit" etiqueta="Cambiar el plan" />}
      />

      <section className="flex flex-col gap-4 rounded-lg bg-oscuro p-4 movil-m:p-5">
        <div className="flex items-center gap-3.5">
          <span className="grid size-13 shrink-0 place-items-center rounded-sm bg-acento-suave text-oscuro">
            <Icono nombre="restaurant" className="icono-l" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 className="texto-titulo-tarjeta break-words text-superficie">{nombrePlan(plan)}</h2>
            <span className="texto-etiqueta text-sobre-oscuro-secundario">
              {plan.gramos_dia} g al día · {plan.comidas.length} {plan.comidas.length === 1 ? "comida" : "comidas"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <RasgoOscuro icono="scale" texto={`${porComida} g`} />
          <RasgoOscuro icono="schedule" texto={`${plan.comidas.length} ${plan.comidas.length === 1 ? "vez" : "veces"}`} />
          {dias !== null && <RasgoOscuro icono="inventory_2" texto={`${dias} días`} />}
        </div>
      </section>

      <h3 className="mt-1 texto-titulo-seccion text-texto">Horarios de hoy</h3>
      <div className="flex flex-col gap-3">
        {plan.comidas.map((c) => {
          const registro = servida(mascota.id, c.hora)
          const estado = estadoComida(c.hora, !!registro)
          const noche = Number(c.hora.slice(0, 2)) >= 17
          return (
            <div key={c.hora} className="flex items-center gap-3.5 rounded-md border border-borde-fuerte bg-superficie p-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
                <Icono nombre={noche ? "dark_mode" : "light_mode"} className="icono-m" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate texto-cuerpo-fuerte text-texto">
                  {c.hora} · {c.nombre}
                </span>
                <span className={cn("truncate texto-etiqueta", estado === "sin_registrar" ? "text-error" : "text-texto-secundario")}>
                  {c.gramos} g · {estado === "servida" ? `Servida a las ${registro!.hora}` : estado === "pendiente" ? "Pendiente" : "Sin registrar"}
                </span>
              </span>
              {estado === "servida" ? (
                <Icono nombre="check_circle" className="shrink-0 icono-m text-texto-secundario" />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    servirComida(mascota.id, c.hora)
                    toast.success(`${c.nombre} servida`)
                  }}
                  className="shrink-0 px-1 texto-etiqueta-fuerte text-primario"
                >
                  Servir
                </button>
              )}
            </div>
          )
        })}
      </div>

      {dias !== null && (
        <Nota tono={poco ? "error" : "info"} icono="inventory_2">
          {dias === 0 ? "Se acabó el alimento." : `Te quedan unos ${dias} días de alimento.`}
          {plan.tipo === "concentrado" && (
            <button
              type="button"
              onClick={() => {
                guardarPlan(mascota.id, { ...plan, fecha_bolsa_abierta: HOY })
                toast.success("Empezamos a contar la bolsa nueva")
              }}
              className="ml-1 texto-etiqueta-fuerte text-primario underline"
            >
              Abrí una bolsa nueva
            </button>
          )}
        </Nota>
      )}

      {plan.tipo === "concentrado" && (
        <BotonEnlace href="/tienda/alimentos" variante={poco ? "primario" : "suave"}>
          Comprar alimento
          <Icono nombre="storefront" className="icono-m" />
        </BotonEnlace>
      )}
    </main>
  )
}
