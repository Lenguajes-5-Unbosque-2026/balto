"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Dialogo } from "@/components/dialogo"
import { Encabezado } from "@/components/encabezado"
import { FilaOpcion } from "@/components/fila-opcion"
import type { Dueno } from "@/lib/datos"
import { useMascotas } from "@/lib/mascota-activa"
import { avisarPronto } from "@/lib/pronto"
import { useDueno } from "@/lib/usar-cuenta"
import { useVolver } from "@/lib/usar-salud"

/** M1 · Ajustes, con M17 · Cerrar sesión y M7 · Eliminar cuenta. */
export function Ajustes({ dueno: base, mascotas: todas }: { dueno: Dueno; mascotas: { id: string }[] }) {
  const router = useRouter()
  const volver = useVolver("/")
  const dueno = useDueno(base)
  const mascotas = useMascotas(todas)
  const [cerrar, setCerrar] = useState(false)
  const [eliminar, setEliminar] = useState(false)

  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14 pb-10">
      <Encabezado titulo="Ajustes" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <FilaOpcion className="mt-1" icono="person" titulo={dueno.nombre} detalle={`${dueno.correo} · ${dueno.ciudad}`} href="/ajustes/datos" />
      <FilaOpcion borde icono="pets" titulo="Mis mascotas" detalle={`${mascotas.length} ${mascotas.length === 1 ? "registrada" : "registradas"}`} href="/ajustes/mascotas" />
      <FilaOpcion borde icono="notifications" titulo="Notificaciones" href="/ajustes/notificaciones" />
      <FilaOpcion borde icono="local_shipping" titulo="Mis pedidos" detalle="Tienda" onClick={() => avisarPronto("Mis pedidos")} />
      <FilaOpcion borde icono="download" titulo="Exportar mis datos" href="/ajustes/exportar" />
      <FilaOpcion borde icono="help" titulo="Ayuda" href="/ajustes/ayuda" />

      <button type="button" onClick={() => setCerrar(true)} className="mt-2 self-center p-2 texto-etiqueta-fuerte text-primario">
        Cerrar sesión
      </button>
      <button type="button" onClick={() => setEliminar(true)} className="self-center p-2 texto-etiqueta-fuerte text-primario">
        Eliminar cuenta
      </button>

      {/* M17 · Cerrar sesión */}
      <Dialogo
        abierto={cerrar}
        onCerrar={() => setCerrar(false)}
        icono="logout"
        titulo="¿Cerrar sesión?"
        mensaje="Tus datos quedan guardados. Vuelves a entrar con tu correo y contraseña."
      >
        <Boton
          onClick={() => {
            setCerrar(false)
            toast.success("Sesión cerrada")
            router.push("/")
          }}
        >
          Cerrar sesión
        </Boton>
        <Boton variante="secundario" onClick={() => setCerrar(false)}>
          Cancelar
        </Boton>
      </Dialogo>

      {/* M7 · Eliminar cuenta */}
      <Dialogo
        abierto={eliminar}
        onCerrar={() => setEliminar(false)}
        tono="destructivo"
        icono="warning"
        titulo="¿Eliminar tu cuenta?"
        mensaje="Se borrarán tus mascotas, eventos y soportes. Antes, descarga tu información."
      >
        <Boton variante="suave" onClick={() => router.push("/ajustes/exportar")}>
          Descargar mi información
        </Boton>
        <Boton variante="destructivo" onClick={() => router.push("/ajustes/eliminar")}>
          Eliminar cuenta
        </Boton>
        <Boton variante="secundario" onClick={() => setEliminar(false)}>
          Cancelar
        </Boton>
      </Dialogo>
    </main>
  )
}
