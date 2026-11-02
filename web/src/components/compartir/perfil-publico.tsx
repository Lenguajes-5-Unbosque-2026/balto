"use client"

import type { ReactNode } from "react"

import { FotoMascota } from "@/components/foto-mascota"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import type { Seccion } from "@/lib/compartir"
import { enMinuscula, ordenarEventos, textoKg, tituloEvento, veterinariaCorta, type Evento } from "@/lib/eventos"
import { fechaDiaMes, fechaNumerica } from "@/lib/fecha"
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
import { useSalud } from "@/lib/usar-salud"

type PerfilPublicoProps = {
  mascota: PerfilMascota
  eventos: Evento[]
  dueno: { nombre: string; telefono: string }
  secciones: Seccion[]
  desde?: string
  hasta?: string
}

const SIN_CONDICIONES: never[] = []

/** Lo que ve quien recibe el perfil (L5) y lo que sale en el PDF: solo las secciones elegidas, con los datos actuales. */
export function PerfilPublico({ mascota, eventos, dueno, secciones, desde, hasta }: PerfilPublicoProps) {
  const { alergias } = useSalud(mascota, SIN_CONDICIONES)
  const en = (s: Seccion) => secciones.includes(s)
  const enRango = (e: Evento) => (!desde || e.fecha >= desde) && (!hasta || e.fecha <= hasta)
  const peso = ultimoPeso(eventos)
  const medicacion = medicacionVigente(eventos)
  const vacunas = ultimasVacunas(eventos).filter(enRango)
  const desparasitacion = ordenarEventos(eventos.filter((e) => e.tipo === "desparasitacion" && enRango(e)))[0]
  const consultas = ordenarEventos(eventos.filter((e) => e.tipo === "consulta" && enRango(e)))
  const examenes = ordenarEventos(eventos.filter((e) => e.tipo === "examen" && enRango(e)))
  const alergico = mascota.sexo === "hembra" ? "Alérgica" : "Alérgico"

  return (
    <>
      <section className="flex flex-col gap-4 rounded-lg border border-borde-fuerte bg-superficie p-4 movil-m:p-5">
        <div className="flex items-center gap-3.5">
          <FotoMascota nombre={mascota.nombre} imagen={mascota.imagen} prioritaria className="size-18 border border-borde" />
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate texto-titulo-pantalla text-texto">{mascota.nombre}</h1>
            <span className="texto-etiqueta text-texto-secundario">{detalleMascota(mascota)}</span>
          </div>
        </div>
        {en("identificacion") && (
          <dl className="flex flex-col gap-2.5">
            <Dato etiqueta="Cédula" valor={mascota.cedula} />
            {mascota.microchip && <Dato etiqueta="Microchip" valor={microchipLegible(mascota.microchip)} />}
            {peso && <Dato etiqueta="Peso" valor={`${textoKg(peso.peso_kg!)} (${fechaDiaMes(peso.fecha)})`} />}
            <Dato
              etiqueta="Contacto"
              valor={<a href={`tel:${dueno.telefono.replace(/\s/g, "")}`}>{`${dueno.nombre.split(" ")[0]} · ${telefonoLocal(dueno.telefono)}`}</a>}
            />
          </dl>
        )}
      </section>

      {alergias.length > 0 ? (
        <Nota tono="error" icono="priority_high">
          {alergico} a: {alergias.map(enMinuscula).join(", ")}
        </Nota>
      ) : (
        <Nota icono="check_circle">Sin alergias registradas</Nota>
      )}

      {en("medicacion") && (
        <Seccion titulo="Medicación vigente" vacia={medicacion.length === 0}>
          {medicacion.map((m) => (
            <Fila key={m.evento.id} icono="medication" titulo={m.nombre} detalle={m.detalle} />
          ))}
        </Seccion>
      )}

      {en("vacunas") && (
        <Seccion titulo="Últimas vacunas" vacia={vacunas.length === 0 && !desparasitacion}>
          {vacunas.map((v) => (
            <Fila key={v.id} icono="vaccines" titulo={nombreVacuna(v)} detalle={fechaNumerica(v.fecha)} />
          ))}
          {desparasitacion && (
            <Fila icono="pest_control" titulo={tituloEvento(desparasitacion)} detalle={`${desparasitacion.producto} · ${fechaNumerica(desparasitacion.fecha)}`} />
          )}
        </Seccion>
      )}

      {en("consultas") && (
        <Seccion titulo="Consultas" vacia={consultas.length === 0}>
          {consultas.map((c) => (
            <Fila
              key={c.id}
              icono="stethoscope"
              titulo={tituloEvento(c)}
              detalle={[fechaNumerica(c.fecha), c.diagnostico, veterinariaCorta(c.veterinaria)].filter(Boolean).join(" · ")}
            />
          ))}
        </Seccion>
      )}

      {en("examenes") && (
        <Seccion titulo="Exámenes" vacia={examenes.length === 0}>
          {examenes.map((x) => (
            <Fila key={x.id} icono="labs" titulo={tituloEvento(x)} detalle={[fechaNumerica(x.fecha), x.resultado_principal].filter(Boolean).join(" · ")} />
          ))}
        </Seccion>
      )}
    </>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 texto-cuerpo text-texto-secundario">{etiqueta}</dt>
      <dd className="min-w-0 truncate text-right texto-etiqueta-fuerte text-texto">{valor}</dd>
    </div>
  )
}

function Seccion({ titulo, vacia, children }: { titulo: string; vacia: boolean; children: ReactNode }) {
  return (
    <section className="flex break-inside-avoid flex-col gap-2.5">
      <h2 className="texto-titulo-tarjeta text-texto">{titulo}</h2>
      {vacia ? <p className="texto-cuerpo text-texto-secundario">Sin registros en este periodo.</p> : children}
    </section>
  )
}

function Fila({ icono, titulo, detalle }: { icono: string; titulo: string; detalle: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
        <Icono nombre={icono} className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate texto-cuerpo-fuerte text-texto">{titulo}</span>
        <span className="truncate texto-etiqueta text-texto-secundario">{detalle}</span>
      </span>
    </div>
  )
}

/** Encabezado "Perfil de salud · Balto / Solo lectura · 23 sep 2026" de L5 y del PDF. */
export function CabeceraPublica({ detalle, candado = true }: { detalle?: string; candado?: boolean }) {
  return (
    <header className="flex items-center gap-3 rounded-md bg-superficie p-3.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
        <Icono nombre="pets" className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="texto-cuerpo-fuerte text-texto">Perfil de salud · Balto</span>
        {detalle && <span className="texto-etiqueta text-texto-secundario">{detalle}</span>}
      </span>
      {candado && <Icono nombre="lock" className="icono-m text-texto-secundario" />}
    </header>
  )
}
