"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace, botonVariants } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { OpcionRadio } from "@/components/opcion-radio"
import { HACE, buscarToxico } from "@/lib/alimentacion"
import type { Veterinaria } from "@/lib/datos"
import { enMinuscula, textoKg, veterinariaCorta, type Evento } from "@/lib/eventos"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { medicacionVigente, razaCorta, ultimoPeso, type PerfilMascota } from "@/lib/perfil"
import { useEventos } from "@/lib/usar-eventos"
import { useSalud, useVolver } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

type UrgenciaProps = { mascotas: PerfilMascota[]; eventos: Evento[]; veterinarias: Veterinaria[] }

const SIN_CONDICIONES: never[] = []
/** K3 con "Urgencias 24 h" y "Abierto ahora" (spec de H). */
const VER_URGENCIAS = "/veterinarias?urgencias=1&abierto=1"
const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** H6 · Urgencia (ya lo comió) → H7 · Llamando a la veterinaria (/alimentacion/urgencia?alimento=Uvas). */
export function Urgencia({ mascotas, eventos: base, veterinarias }: UrgenciaProps) {
  const volver = useVolver("/alimentacion")
  const alimento = useSearchParams().get("alimento") ?? ""
  const toxico = buscarToxico(alimento)
  const [mascota] = useMascotaActiva(mascotas)
  const eventos = useEventos(base).filter((e) => e.mascota_id === mascota.id)
  const { alergias } = useSalud(mascota, SIN_CONDICIONES)
  const peso = ultimoPeso(eventos)
  const medicacion = medicacionVigente(eventos)
  // La veterinaria de confianza: la de la última consulta si atiende urgencias; si no, la primera abierta 24 h.
  const ultima = eventos.find((e) => e.tipo === "consulta")?.veterinaria
  const vet =
    veterinarias.find((v) => v.nombre === ultima && v.urgencias_24h === "true") ?? veterinarias.find((v) => v.urgencias_24h === "true")
  const [hace, setHace] = useState(HACE[0])
  const [eligiendo, setEligiendo] = useState(false)
  const [llamando, setLlamando] = useState(false)

  const que = toxico?.nombre ?? (alimento || "Alimento tóxico")
  const tel = vet ? `tel:${vet.telefono.replace(/\s/g, "")}` : ""

  if (llamando && vet) {
    const detalle = `Comió ${enMinuscula(que)} hace ${enMinuscula(hace)}. Llamé a ${vet.nombre}.`
    const registrar = new URLSearchParams({ titulo: `Comió ${enMinuscula(que)}`, lugar: "Casa", detalle })
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Llamada" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => setLlamando(false)} />} />
        <div className="pt-4">
          <Estado icono="call" titulo={`Llamando a ${veterinariaCorta(vet.nombre)}`} mensaje={`${vet.telefono} · ${vet.horario}`} />
        </div>
        <dl className="flex flex-col gap-2.5 rounded-lg border border-borde-fuerte bg-superficie px-4 py-4 movil-m:px-5">
          <Dato etiqueta="Especie y raza" valor={`${mayuscula(mascota.especie)} · ${razaCorta(mascota.raza)}`} />
          <Dato etiqueta="Edad y peso" valor={[mascota.edad, peso && textoKg(peso.peso_kg!)].filter(Boolean).join(" · ")} />
          <Dato etiqueta="Alergias" valor={alergias.length ? alergias.join(", ") : "Ninguna"} />
          <Dato etiqueta="Medicación" valor={medicacion.map((m) => m.nombre).join(", ") || "Ninguna"} />
          <Dato etiqueta="Qué comió" valor={`${que}, hace ${enMinuscula(hace)}`} />
        </dl>
        <Nota icono="visibility">Mantén esta pantalla abierta mientras hablas.</Nota>
        <BarraAccion>
          <BotonEnlace href={`/registrar/otro?${registrar}`} className="px-2 texto-cuerpo-fuerte">
            Registrar lo que pasó
          </BotonEnlace>
          <Boton variante="secundario" onClick={() => setLlamando(false)}>
            Volver
          </Boton>
        </BarraAccion>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Urgencia" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <div className="pt-4">
        <Estado icono="emergency" titulo="Si ya lo comió, llama ahora" mensaje={`${toxico?.corto ?? "Puede ser peligroso."} No esperes a que aparezcan síntomas.`} />
      </div>
      {vet && (
        <a href={tel} onClick={() => setLlamando(true)} className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre="call" className="icono-m" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate texto-cuerpo-fuerte text-texto">{vet.nombre}</span>
            <span className="truncate texto-etiqueta text-texto-secundario">
              {vet.urgencias_24h === "true" ? "Abierta 24 h" : vet.horario} · {vet.barrio}
            </span>
          </span>
          <Icono nombre="call" className="icono-m text-texto-secundario" />
        </a>
      )}
      <FilaOpcion icono="local_hospital" titulo="Ver veterinarias abiertas ahora" detalle="Cerca de ti" href={VER_URGENCIAS} />
      <dl className="flex flex-col gap-2.5 rounded-lg border border-borde-fuerte bg-superficie px-4 py-4 movil-m:px-5">
        <Dato etiqueta="Qué comió" valor={que} />
        <div className="flex items-baseline justify-between gap-3">
          <dt className="shrink-0 texto-cuerpo text-texto-secundario">Hace</dt>
          <dd className="flex min-w-0 items-baseline gap-3">
            <span className="truncate texto-etiqueta-fuerte text-texto">{hace}</span>
            <button type="button" onClick={() => setEligiendo(true)} className="texto-etiqueta-fuerte text-primario">
              Cambiar
            </button>
          </dd>
        </div>
        {peso && <Dato etiqueta={`Peso de ${mascota.nombre}`} valor={textoKg(peso.peso_kg!)} />}
      </dl>
      <Nota icono="block">No le provoques vómito sin indicación del veterinario.</Nota>
      <BarraAccion>
        {vet && (
          <a href={tel} onClick={() => setLlamando(true)} className={cn("inline-flex items-center justify-center", botonVariants())}>
            Llamar ahora
          </a>
        )}
        <BotonEnlace href={VER_URGENCIAS} variante="secundario">
          Ver veterinarias
        </BotonEnlace>
      </BarraAccion>

      <Hoja abierta={eligiendo} onCerrar={() => setEligiendo(false)} titulo="¿Hace cuánto lo comió?">
        <div role="radiogroup" className="flex flex-col gap-3">
          {HACE.map((h) => (
            <OpcionRadio
              key={h}
              titulo={h}
              activa={hace === h}
              onElegir={() => {
                setHace(h)
                setEligiendo(false)
              }}
            />
          ))}
        </div>
      </Hoja>
    </main>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 texto-cuerpo text-texto-secundario">{etiqueta}</dt>
      <dd className="min-w-0 truncate text-right texto-etiqueta-fuerte text-texto">{valor}</dd>
    </div>
  )
}
