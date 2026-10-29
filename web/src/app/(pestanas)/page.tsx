import { PanelInicio } from "@/components/inicio/panel-inicio"
import { obtenerAlertas, obtenerDueno, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

/** Inicio · Selector de mascota. Sin mascotas activas sería O1 (fuera del MVP). */
export default function InicioPage() {
  return (
    <PanelInicio
      dueno={obtenerDueno().nombre}
      mascotas={obtenerPerfiles()}
      eventos={obtenerEventosDueno()}
      alertas={obtenerAlertas()}
    />
  )
}
