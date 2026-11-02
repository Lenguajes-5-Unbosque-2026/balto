"use client"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import type { Condicion } from "@/lib/datos"
import { normalizar, type Evento } from "@/lib/eventos"
import { fechaCorta } from "@/lib/fecha"
import { medicacionVigente, type PerfilMascota } from "@/lib/perfil"
import { useMascotaYEventos, useSalud, useVolver } from "@/lib/usar-salud"

const ALIMENTOS = ["pollo", "res", "cerdo", "trigo", "soya", "lacteos", "pescado", "cordero", "huevo", "maiz"]

/** Ícono de cada alergia: alimento, pulgas, polen o genérico. */
export function iconoAlergia(alergia: string) {
  const a = normalizar(alergia)
  if (ALIMENTOS.some((x) => a.startsWith(x))) return "no_food"
  if (a.includes("pulga")) return "pest_control"
  if (a.includes("polen")) return "local_florist"
  if (a.includes("acaro")) return "bug_report"
  return "warning"
}

type AlergiasCondicionesProps = { mascotas: PerfilMascota[]; eventos: Evento[]; condiciones: Condicion[] }

/** F5 · Alergias y condiciones de la mascota activa. */
export function AlergiasCondiciones({ mascotas, eventos: base, condiciones: base2 }: AlergiasCondicionesProps) {
  const volver = useVolver("/salud")
  const { mascota, eventos } = useMascotaYEventos(mascotas, base)
  const { alergias, condiciones } = useSalud(mascota, base2)
  const medicacion = medicacionVigente(eventos)

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Alergias y condiciones" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <Nota tono="error" icono="priority_high">
        Esto aparece primero en la vista rápida y en el reporte que compartes.
      </Nota>

      <h2 className="texto-titulo-tarjeta text-texto">Alergias</h2>
      {alergias.length ? (
        <ul className="flex flex-wrap gap-2">
          {alergias.map((a) => (
            <li key={a} className="flex h-9.5 items-center gap-1.5 rounded-completo bg-primario px-4 texto-etiqueta-fuerte text-superficie">
              <Icono nombre={iconoAlergia(a)} className="icono-s" />
              {a}
            </li>
          ))}
        </ul>
      ) : (
        <p className="texto-cuerpo text-texto-secundario">Sin alergias registradas.</p>
      )}

      <h2 className="mt-1 texto-titulo-tarjeta text-texto">Condiciones</h2>
      <div className="flex flex-col gap-3">
        {condiciones.map((c) => (
          <FilaOpcion
            key={c.id}
            icono="healing"
            titulo={c.nombre}
            detalle={`Diagnóstico ${fechaCorta(c.fecha_diagnostico)}`}
            href={`/salud/alergias/editar?condicion=${c.id}`}
          />
        ))}
        {medicacion.length > 0 && (
          <FilaOpcion icono="medication" titulo="Medicación vigente" detalle={medicacion.map((m) => m.nombre).join(", ")} href="/medicamentos" />
        )}
        {condiciones.length === 0 && medicacion.length === 0 && (
          <p className="texto-cuerpo text-texto-secundario">Sin condiciones diagnosticadas.</p>
        )}
      </div>

      <BarraAccion>
        <BotonEnlace href="/salud/alergias/editar">Editar</BotonEnlace>
      </BarraAccion>
    </main>
  )
}
