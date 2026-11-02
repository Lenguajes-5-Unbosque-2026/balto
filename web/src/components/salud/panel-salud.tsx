"use client"

import Link from "next/link"

import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import type { Condicion } from "@/lib/datos"
import { enMinuscula, ordenarEventos, textoKg, type Evento } from "@/lib/eventos"
import { fechaCorta } from "@/lib/fecha"
import { estadoVacunas, medicacionVigente, ultimoPeso, type PerfilMascota } from "@/lib/perfil"
import { textoEn, textoProximaVacuna, ultimaDesparasitacion, variacionPeso } from "@/lib/salud"
import { useMascotaYEventos, useSalud, useVolver } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

const sinAnio = (iso: string) => fechaCorta(iso).replace(/ \d{4}$/, "")

type PanelSaludProps = { mascotas: PerfilMascota[]; eventos: Evento[]; condiciones: Condicion[] }

/** F1 · Panel de salud de la mascota activa. */
export function PanelSalud({ mascotas, eventos: base, condiciones }: PanelSaludProps) {
  const volver = useVolver("/")
  const { mascota, eventos } = useMascotaYEventos(mascotas, base)
  const { alergias } = useSalud(mascota, condiciones)

  const vacunas = estadoVacunas(eventos)
  const examenes = eventos.filter((e) => e.tipo === "examen")
  const ultimoExamen = ordenarEventos(examenes)[0]
  const peso = ultimoPeso(eventos)
  const variacion = variacionPeso(eventos)
  const desparasitacion = ultimaDesparasitacion(eventos)
  const vigentes = medicacionVigente(eventos).length

  return (
    <div className="flex flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo={`Salud de ${mascota.nombre}`} izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />

      <div className="grid grid-cols-3 gap-2 movil-m:gap-2.5">
        <Ficha
          valor={vacunas === "vencida" ? "Vencida" : vacunas === "al-dia" ? "Al día" : "—"}
          texto="Vacunas"
          className={vacunas === "vencida" ? "bg-error text-superficie" : "bg-primario text-superficie"}
        />
        <Ficha valor={String(examenes.length)} texto={examenes.length === 1 ? "Examen" : "Exámenes"} className="bg-acento text-texto" />
        <Ficha valor={peso ? textoKg(peso.peso_kg!).replace(" kg", "") : "—"} texto="Kilos" className="border border-borde-fuerte bg-superficie text-texto" />
      </div>

      <div className="flex flex-col gap-3">
        <FilaOpcion borde icono="vaccines" titulo="Carnet de vacunas" detalle={textoProximaVacuna(eventos)} href="/salud/vacunas" />
        <FilaOpcion
          borde
          icono="pest_control"
          titulo="Desparasitaciones"
          detalle={
            desparasitacion?.proxima_dosis
              ? `Próxima: ${sinAnio(desparasitacion.proxima_dosis)} (${textoEn(desparasitacion.proxima_dosis)})`
              : desparasitacion
                ? `Última: ${sinAnio(desparasitacion.fecha)}`
                : "Sin desparasitaciones registradas"
          }
          href="/salud/vacunas?pestana=desparasitacion"
        />
        <FilaOpcion
          borde
          icono="labs"
          titulo="Exámenes y tratamientos"
          detalle={ultimoExamen ? `Último: ${enMinuscula(ultimoExamen.tipo_examen ?? "examen")} (${sinAnio(ultimoExamen.fecha)})` : "Sin exámenes registrados"}
          href="/salud/examenes"
        />
        <FilaOpcion
          borde
          icono="monitor_weight"
          titulo="Evolución del peso"
          detalle={variacion ? `${variacion.texto} kg este mes` : peso ? "Una sola medición" : "Registra el primer peso"}
          href="/salud/peso"
        />
        <FilaOpcion
          borde
          icono="medication"
          titulo="Medicamentos"
          detalle={vigentes === 0 ? "Sin tratamientos vigentes" : vigentes === 1 ? "1 vigente" : `${vigentes} vigentes`}
          href="/medicamentos"
        />
      </div>

      <Link href="/salud/alergias" className="flex items-center gap-3 rounded-md bg-acento-suave px-4 py-3.5">
        <Icono nombre="favorite" className="icono-m text-primario" />
        <span className="min-w-0 flex-1 truncate texto-etiqueta text-texto">
          {alergias.length ? `Alergias: ${alergias.map(enMinuscula).join(", ")}` : "Sin alergias registradas"}
        </span>
      </Link>
    </div>
  )
}

function Ficha({ valor, texto, className }: { valor: string; texto: string; className: string }) {
  return (
    <div className={cn("flex h-17 min-w-0 flex-col justify-center rounded-md px-3 movil-m:px-3.5", className)}>
      <span className="truncate texto-titulo-tarjeta">{valor}</span>
      <span className="truncate texto-etiqueta">{texto}</span>
    </div>
  )
}
