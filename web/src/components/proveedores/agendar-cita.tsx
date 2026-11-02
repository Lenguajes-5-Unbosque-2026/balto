"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { CalendarioMes } from "@/components/calendario-mes"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Interruptor } from "@/components/interruptor"
import { OpcionRadio } from "@/components/opcion-radio"
import type { Cita, Veterinaria } from "@/lib/datos"
import { DUENO_ACTUAL_ID } from "@/lib/cuenta-actual"
import { HOY, fechaLarga, sumarDias } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { cuposDel, iconoProveedor, proximosConCupo, servicioParaCita } from "@/lib/proveedores"
import { guardarCita, useCitas } from "@/lib/usar-proveedores"
import { useVolver } from "@/lib/usar-salud"

type AgendarProps = { proveedores: Veterinaria[]; mascotas: { id: string; nombre: string }[]; citas: Cita[] }

/** "Jueves, 25 de septiembre" → "Jue 25". */
const diaCorto = (iso: string) => {
  const [dia, resto] = fechaLarga(iso).split(", ")
  return `${dia.slice(0, 3)} ${resto.split(" ")[0]}`
}

const SERVICIOS_CITA = ["Consulta general", "Vacunación", "Urgencias", "Baño y corte", "Guardería", "Paseo"]

/** K5 · Agendar cita y K10 · Sin horarios disponibles (/veterinarias/agendar?id=v01&servicio=vacunacion; ?cita=ci03 reprograma). */
export function AgendarCita({ proveedores, mascotas, citas: base }: AgendarProps) {
  const router = useRouter()
  const volver = useVolver("/veterinarias")
  const p = useSearchParams()
  const citas = useCitas(base)
  const reprogramar = citas.find((c) => c.id === p.get("cita"))
  const v = proveedores.find((x) => x.id === (reprogramar?.proveedor_id ?? p.get("id")))
  const [activa] = useMascotaActiva(mascotas)
  const [mascotaId, setMascotaId] = useState(reprogramar?.mascota_id ?? activa.id)
  const [servicio, setServicio] = useState(reprogramar?.servicio ?? (v ? servicioParaCita(v, p.get("servicio")) : "Consulta general"))
  const [dia, setDia] = useState(() => (v ? (proximosConCupo(v, HOY, 1)[0] ?? sumarDias(HOY, 1)) : sumarDias(HOY, 1)))
  const [mes, setMes] = useState(`${dia.slice(0, 7)}-01`)
  const [hora, setHora] = useState("")
  const [editando, setEditando] = useState(false)
  const [avisar, setAvisar] = useState(false)

  if (!v) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Agendar cita" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <Estado icono="search_off" titulo="Elige primero dónde" mensaje="Busca la veterinaria o el servicio para agendar." />
      </main>
    )
  }

  const ocupadas = citas.filter((c) => c.proveedor_id === v.id && c.estado !== "cancelada" && c.fecha_hora.startsWith(dia)).map((c) => c.fecha_hora.slice(11))
  const cupos = cuposDel(v, dia, ocupadas)
  const mascota = mascotas.find((m) => m.id === mascotaId) ?? activa
  const marcados = new Set<string>()
  const [a, m] = mes.split("-").map(Number)
  for (let i = 0; i < new Date(Date.UTC(a, m, 0)).getUTCDate(); i++) {
    const f = sumarDias(mes, i)
    if (cuposDel(v, f).length) marcados.add(f)
  }

  function confirmar() {
    const id = reprogramar?.id ?? crypto.randomUUID()
    guardarCita(id, {
      dueno_id: DUENO_ACTUAL_ID,
      mascota_id: mascota.id,
      proveedor_id: v!.id,
      servicio,
      fecha_hora: `${dia} ${hora}`,
      duracion_min: "30",
      estado: "confirmada",
      alerta_id: reprogramar?.alerta_id ?? p.get("alerta") ?? "",
      pedido_id: reprogramar?.pedido_id ?? "",
    })
    router.replace(`/veterinarias/agendada?id=${id}`)
  }

  const tarjeta = (
    <button type="button" onClick={() => setEditando(true)} className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5 text-left">
      <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
        <Icono nombre={iconoProveedor(v)} className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate texto-cuerpo-fuerte text-texto">{v.nombre}</span>
        <span className="truncate texto-etiqueta text-texto-secundario">
          {servicio} · {mascota.nombre}
        </span>
      </span>
      <Icono nombre="edit" className="icono-m text-texto-secundario" />
    </button>
  )

  const hojaEditar = (
    <Hoja abierta={editando} onCerrar={() => setEditando(false)} titulo="Servicio y mascota">
      <div className="flex flex-col gap-3">
        <span className="texto-micro text-texto-secundario">Mascota</span>
        <div className="flex flex-wrap gap-2">
          {mascotas.map((x) => (
            <Chip key={x.id} texto={x.nombre} activo={x.id === mascotaId} onClick={() => setMascotaId(x.id)} />
          ))}
        </div>
        <span className="texto-micro text-texto-secundario">Servicio</span>
        <div role="radiogroup" className="flex flex-col gap-2">
          {SERVICIOS_CITA.map((s) => (
            <OpcionRadio key={s} titulo={s} activa={servicio === s} onElegir={() => setServicio(s)} />
          ))}
        </div>
        <Boton className="mt-2" onClick={() => setEditando(false)}>
          Listo
        </Boton>
      </div>
    </Hoja>
  )

  if (cupos.length === 0) {
    const otros = proximosConCupo(v, dia)
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo={reprogramar ? "Reprogramar cita" : "Agendar cita"} izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        {tarjeta}
        <span className="texto-micro text-primario">Horarios · {diaCorto(dia)}</span>
        <Estado tono="error" icono="event_busy" titulo="No quedan horarios ese día" mensaje="Elige otra fecha o te avisamos si se libera un cupo." />
        <div className="flex flex-wrap justify-center gap-2">
          {otros.map((f) => (
            <Chip key={f} texto={diaCorto(f)} icono="calendar_today" onClick={() => {
              setDia(f)
              setMes(`${f.slice(0, 7)}-01`)
            }} />
          ))}
        </div>
        <div className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre="notifications_active" className="icono-m" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="texto-cuerpo-fuerte text-texto">Avísame si se libera un cupo</span>
            <span className="texto-etiqueta text-texto-secundario">Para el {fechaLarga(dia).toLowerCase()}</span>
          </span>
          <Interruptor
            etiqueta="Avísame si se libera un cupo"
            activo={avisar}
            onCambio={(x) => {
              setAvisar(x)
              if (x) toast.success("Te avisamos si se libera un cupo")
            }}
          />
        </div>
        <BarraAccion>
          <Boton
            disabled={!otros.length}
            onClick={() => {
              setDia(otros[0])
              setMes(`${otros[0].slice(0, 7)}-01`)
            }}
          >
            Ver otro día
          </Boton>
          <Boton variante="secundario" onClick={() => router.push("/veterinarias")} className="px-2 texto-cuerpo-fuerte">
            Otra veterinaria
          </Boton>
        </BarraAccion>
        {hojaEditar}
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo={reprogramar ? "Reprogramar cita" : "Agendar cita"} izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      {tarjeta}
      <CalendarioMes
        mes={mes}
        onMes={setMes}
        seleccionado={dia}
        onElegir={(f) => {
          setDia(f)
          setHora("")
        }}
        marcados={marcados}
        deshabilitado={(f) => f <= HOY}
      />
      <span className="texto-micro text-texto-secundario">Horarios disponibles · {diaCorto(dia)}</span>
      <div className="flex flex-wrap gap-2">
        {cupos.map((h) => (
          <Chip key={h} texto={h} activo={hora === h} onClick={() => setHora(h)} className="h-11 px-4.5 texto-cuerpo-fuerte" />
        ))}
      </div>
      <BarraAccion>
        <Boton disabled={!hora} onClick={confirmar}>
          {reprogramar ? "Confirmar cambio" : "Confirmar cita"}
          <Icono nombre="check" className="icono-m" />
        </Boton>
      </BarraAccion>
      {hojaEditar}
    </main>
  )
}
