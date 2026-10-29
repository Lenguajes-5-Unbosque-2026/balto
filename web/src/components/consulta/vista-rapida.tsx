"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { FotoMascota } from "@/components/foto-mascota"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { enMinuscula, textoKg, type Evento } from "@/lib/eventos"
import { fechaDiaMes, fechaNumerica } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import {
  detalleMascota,
  medicacionVigente,
  microchipLegible,
  nombreVacuna,
  telefonoLocal,
  ultimasVacunas,
  ultimoPeso,
  type PerfilMascota,
} from "@/lib/perfil"
import { avisarPronto } from "@/lib/pronto"
import { useEventos } from "@/lib/usar-eventos"
import { cn } from "@/lib/utils"

type VistaRapidaProps = {
  mascotas: PerfilMascota[]
  eventos: Evento[]
  dueno: { nombre: string; telefono: string }
}


/** D1 · Vista de acceso rápido: lo que se muestra desde el celular en una consulta o una emergencia. */
export function VistaRapida({ mascotas, eventos: base, dueno }: VistaRapidaProps) {
  const [mascota] = useMascotaActiva(mascotas)
  const eventos = useEventos(base).filter((e) => e.mascota_id === mascota.id)
  const peso = ultimoPeso(eventos)
  const medicacion = medicacionVigente(eventos)
  const vacunas = ultimasVacunas(eventos)
  const alergico = mascota.sexo === "hembra" ? "Alérgica" : "Alérgico"

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 pb-10">
      <Encabezado
        titulo="Vista rápida"
        izquierda={<BotonIconoEnlace href="/" icono="close" etiqueta="Cerrar" />}
        derecha={<BotonIcono icono="ios_share" etiqueta="Compartir perfil" onClick={() => avisarPronto("Compartir perfil")} />}
      />

      <div className="flex items-center gap-3.5">
        <FotoMascota nombre={mascota.nombre} imagen={mascota.imagen} prioritaria className="size-16 rounded-md border border-borde" />
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate texto-titulo-tarjeta text-texto">{mascota.nombre}</h2>
          <span className="texto-etiqueta text-texto-secundario">{detalleMascota(mascota)}</span>
        </div>
      </div>

      <dl className="flex flex-col gap-1.5 rounded-md bg-superficie px-4 py-3.5">
        {mascota.microchip && <Dato etiqueta="Microchip" valor={microchipLegible(mascota.microchip)} />}
        <Dato
          etiqueta="Contacto"
          valor={
            <a href={`tel:${dueno.telefono.replace(/\s/g, "")}`}>
              {dueno.nombre.split(" ")[0]} · {telefonoLocal(dueno.telefono)}
            </a>
          }
        />
        {peso && <Dato etiqueta="Peso" valor={`${textoKg(peso.peso_kg!)} (${fechaDiaMes(peso.fecha)})`} />}
      </dl>

      {mascota.alergias.length > 0 ? (
        <Nota tono="error" icono="warning">
          {alergico} a: {mascota.alergias.map(enMinuscula).join(", ")}
        </Nota>
      ) : (
        <Nota icono="check_circle">Sin alergias registradas</Nota>
      )}

      {medicacion.length > 0 && (
        <Seccion titulo="Medicación vigente">
          {medicacion.map((m) => (
            <Fila key={m.evento.id} href={`/evento?id=${m.evento.id}`} icono="medication" titulo={m.nombre} detalle={m.detalle} />
          ))}
        </Seccion>
      )}

      {vacunas.length > 0 && (
        <Seccion titulo="Últimas vacunas">
          {vacunas.map((v) => (
            <Fila key={v.id} href={`/evento?id=${v.id}`} icono="vaccines" titulo={nombreVacuna(v)} detalle={fechaNumerica(v.fecha)} borde />
          ))}
        </Seccion>
      )}
    </main>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 texto-etiqueta text-texto-secundario">{etiqueta}</dt>
      <dd className="min-w-0 truncate text-right texto-etiqueta-fuerte text-texto">{valor}</dd>
    </div>
  )
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="texto-titulo-seccion text-texto">{titulo}</h2>
      {children}
    </section>
  )
}

function Fila({ href, icono, titulo, detalle, borde }: { href: string; icono: string; titulo: string; detalle: string; borde?: boolean }) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-3.5 rounded-md bg-superficie p-3.5", borde && "border border-borde-fuerte")}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
        <Icono nombre={icono} className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate texto-cuerpo-fuerte text-texto">{titulo}</span>
        <span className="truncate texto-etiqueta text-texto-secundario">{detalle}</span>
      </span>
    </Link>
  )
}
