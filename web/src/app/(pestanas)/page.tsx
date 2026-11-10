import { PanelInicio } from "@/components/inicio/panel-inicio"
import { cargarDatos, obtenerAlertas, obtenerDueno, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

/** Inicio · Selector de mascota. Sin mascotas activas sería O1 (fuera del MVP). */
export default async function InicioPage() {
  await cargarDatos()
  return (
    <PanelInicio
      dueno={obtenerDueno()}
      mascotas={obtenerPerfiles()}
      eventos={obtenerEventosDueno()}
      alertas={obtenerAlertas()}
    />
  )
}
