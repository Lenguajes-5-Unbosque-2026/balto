"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { Selector } from "@/components/selector"
import { TarjetaEvento } from "@/components/tarjeta-evento"
import { ordenarEventos, tituloEvento, type Evento } from "@/lib/eventos"
import { fechaNumerica, hoy } from "@/lib/fecha"
import { nombreVacuna, ultimasVacunas, type PerfilMascota } from "@/lib/perfil"
import { barraProximaDosis, proximaVacuna, ultimaDesparasitacion } from "@/lib/salud"
import { useMascotaYEventos, useVolver } from "@/lib/usar-salud"

/** F2 · Carnet de vacunas, con la pestaña Desparasitación (/salud/vacunas?pestana=desparasitacion). */
export function CarnetVacunas({ mascotas, eventos: base }: { mascotas: PerfilMascota[]; eventos: Evento[] }) {
  const router = useRouter()
  const volver = useVolver("/salud")
  const pestana = useSearchParams().get("pestana") === "desparasitacion" ? "desparasitacion" : "vacunas"
  const { eventos } = useMascotaYEventos(mascotas, base)

  const vacunas = ultimasVacunas(eventos)
  const desparasitaciones = ordenarEventos(eventos.filter((e) => e.tipo === "desparasitacion"))
  const lista = pestana === "vacunas" ? vacunas : desparasitaciones
  const barra =
    pestana === "vacunas" ? barraProximaDosis(proximaVacuna(eventos), "vacuna") : barraProximaDosis(ultimaDesparasitacion(eventos), "desparasitacion")

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado
        titulo="Carnet de vacunas"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIconoEnlace href="/compartir?contenido=vacunas" icono="ios_share" etiqueta="Compartir el carnet" />}
      />
      <Selector
        etiqueta="Carnet"
        valor={pestana}
        onCambio={(v) => router.replace(v === "vacunas" ? "/salud/vacunas" : "/salud/vacunas?pestana=desparasitacion", { scroll: false })}
        opciones={[
          { valor: "vacunas", etiqueta: "Vacunas" },
          { valor: "desparasitacion", etiqueta: "Desparasitación" },
        ]}
      />

      {lista.length === 0 ? (
        <div className="flex flex-col gap-4 pt-6">
          <Estado
            icono={pestana === "vacunas" ? "vaccines" : "pest_control"}
            titulo={pestana === "vacunas" ? "Aún no hay vacunas registradas" : "Aún no hay desparasitaciones"}
            mensaje="Registra la primera o sube la foto del carnet."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((e) => (
            <TarjetaVacuna key={e.id} evento={e} />
          ))}
        </div>
      )}

      {barra && (
        <Nota icono="event_repeat">
          <span className="texto-etiqueta-fuerte">{barra}</span>
        </Nota>
      )}

      <BarraAccion>
        <BotonEnlace href={pestana === "vacunas" ? "/registrar/vacuna" : "/registrar/desparasitacion"}>
          {pestana === "vacunas" ? "Agregar vacuna" : "Agregar desparasitación"}
          <Icono nombre="add" className="icono-m" />
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}

function TarjetaVacuna({ evento: e }: { evento: Evento }) {
  const fecha = e.tipo === "vacuna" ? e.proximo_refuerzo : e.proxima_dosis
  const vencida = fecha && fecha < hoy()
  return (
    <TarjetaEvento
      evento={e}
      href={`/evento?id=${e.id}`}
      variante="borde"
      titulo={e.tipo === "vacuna" ? nombreVacuna(e) : tituloEvento(e)}
      detalle={
        fecha
          ? `${e.tipo === "vacuna" ? "Refuerzo" : "Próxima"}: ${fechaNumerica(fecha)}${vencida ? " · vencido" : ""}`
          : e.tipo === "vacuna"
            ? "Sin refuerzo"
            : (e.producto ?? "")
      }
    />
  )
}
