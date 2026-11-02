"use client"

import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { Selector } from "@/components/selector"
import type { Evento } from "@/lib/eventos"
import { fechaCorta } from "@/lib/fecha"
import type { PerfilMascota } from "@/lib/perfil"
import { pesosAscendentes, variacionPeso } from "@/lib/salud"
import { useMascotaYEventos, useVolver } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

const RANGOS = { "3": "3 meses", "6": "6 meses", "12": "1 año" } as const

/** Primer día del mes que está `meses - 1` meses antes de `iso` ("6 meses" hasta sep = desde abr). */
function inicioRango(iso: string, meses: number) {
  const [a, m] = iso.split("-").map(Number)
  const f = new Date(Date.UTC(a, m - meses, 1))
  return f.toISOString().slice(0, 10)
}

const mesCorto = (iso: string) => fechaCorta(iso).split(" ")[1].toUpperCase()

/** F4 · Evolución del peso: barras por medición, peso actual y variación frente al mes anterior. */
export function EvolucionPeso({ mascotas, eventos: base }: { mascotas: PerfilMascota[]; eventos: Evento[] }) {
  const volver = useVolver("/salud")
  const { mascota, eventos } = useMascotaYEventos(mascotas, base)
  const [rango, setRango] = useState<keyof typeof RANGOS>("6")

  const pesos = pesosAscendentes(eventos)
  const ultima = pesos.at(-1)
  const visibles = ultima ? pesos.filter((p) => p.fecha >= inicioRango(ultima.fecha, Number(rango))) : []
  const variacion = variacionPeso(eventos)
  const max = Math.max(...visibles.map((p) => p.kg), 1)
  const min = Math.min(...visibles.map((p) => p.kg), max)
  const brusco = variacion && variacion.porcentaje > 10

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Evolución del peso" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />

      {!ultima ? (
        <div className="pt-8">
          <Estado icono="monitor_weight" titulo="Registra el primer peso" mensaje={`Con cada medición verás cómo evoluciona ${mascota.nombre}.`} />
        </div>
      ) : (
        <>
          <Selector
            etiqueta="Rango"
            valor={rango}
            onCambio={(v) => setRango(v as keyof typeof RANGOS)}
            opciones={Object.entries(RANGOS).map(([valor, etiqueta]) => ({ valor, etiqueta }))}
          />

          <section className="flex flex-col gap-4 rounded-bloque border border-borde-fuerte bg-superficie p-4 movil-m:p-5">
            <div className="flex items-center justify-between">
              <h2 className="texto-cuerpo-fuerte text-texto">Peso (kg)</h2>
              <span className="texto-micro text-texto-secundario">
                {visibles.length > 1 ? `${mesCorto(visibles[0].fecha)} – ${mesCorto(ultima.fecha)}` : mesCorto(ultima.fecha)}
              </span>
            </div>
            <div className="flex h-36 items-end gap-2.5 movil-m:gap-4" role="img" aria-label={`Pesos: ${visibles.map((p) => p.kg).join(", ")} kg`}>
              {visibles.map((p, i) => (
                <span
                  key={p.id}
                  title={`${String(p.kg).replace(".", ",")} kg · ${fechaCorta(p.fecha)}`}
                  className={cn("flex-1 rounded-sm", i === visibles.length - 1 ? "bg-primario" : "bg-acento")}
                  // Altura proporcional al peso: es un dato, no un valor de diseño.
                  style={{ height: `${35 + ((p.kg - min) / Math.max(max - min, 0.1)) * 25}%` }}
                />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex h-17 flex-col justify-center rounded-md bg-primario px-4 text-superficie">
              <span className="texto-titulo-tarjeta">{String(ultima.kg).replace(".", ",")}</span>
              <span className="texto-etiqueta">kg actual</span>
            </div>
            <div className="flex h-17 flex-col justify-center rounded-md border border-borde-fuerte bg-superficie px-4 text-texto">
              <span className="texto-titulo-tarjeta">{variacion ? variacion.texto : "—"}</span>
              <span className="texto-etiqueta">{variacion ? `vs. ${variacion.mes}` : "Sin medición anterior"}</span>
            </div>
          </div>

          {variacion &&
            (brusco ? (
              <Nota tono="error" icono="warning">
                {mascota.nombre} cambió {Math.round(variacion.porcentaje)} % este mes. Consúltalo con tu veterinario.
              </Nota>
            ) : (
              <Nota tono="exito" icono="check_circle">
                Sin cambios bruscos. Te avisaremos si varía más de 10 % en un mes.
              </Nota>
            ))}
        </>
      )}

      <BarraAccion>
        <BotonEnlace href="/registrar/peso">
          Registrar peso
          <Icono nombre="add" className="icono-m" />
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}
