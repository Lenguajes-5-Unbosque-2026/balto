"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Nota } from "@/components/nota"
import { useVolver } from "@/lib/usar-salud"

/** M15 · Confirmar identidad antes de eliminar la cuenta. */
export function EliminarCuenta() {
  const router = useRouter()
  const volver = useVolver("/ajustes")
  const [clave, setClave] = useState("")

  function eliminar() {
    // Sin Supabase todavía: se borra lo que este navegador guardó de la cuenta.
    try {
      for (const k of Object.keys(window.localStorage)) if (k.startsWith("balto:")) window.localStorage.removeItem(k)
    } catch {
      // Sin almacenamiento: no hay nada guardado que borrar.
    }
    router.replace("/cuenta-eliminada")
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Eliminar cuenta" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <div className="pt-4">
        <Estado tono="error" icono="lock_person" titulo="Confirma que eres tú" mensaje="Por seguridad, escribe tu contraseña para eliminar la cuenta." />
      </div>
      <Campo etiqueta="Contraseña" type="password" icono="lock" autoComplete="current-password" valor={clave} onCambio={setClave} />
      <Nota icono="download">Antes de seguir, considera exportar tus datos. Después no hay vuelta atrás.</Nota>
      <BarraAccion>
        <Boton variante="destructivo" disabled={clave.length < 6} onClick={eliminar} className="px-2 texto-cuerpo-fuerte">
          Eliminar mi cuenta
        </Boton>
        <BotonEnlace href="/ajustes/exportar" variante="secundario" className="px-2 texto-cuerpo-fuerte">
          Exportar primero
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}

/** M16 · Cuenta eliminada. */
export function CuentaEliminada() {
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <header className="flex h-11 items-center justify-center texto-titulo-seccion text-texto">Cuenta</header>
      <div className="pt-4">
        <Estado icono="waving_hand" titulo="Tu cuenta fue eliminada" mensaje="Borramos tus mascotas, eventos y soportes. Gracias por acompañarnos." />
      </div>
      <Nota icono="mail">Si fue un error, escríbenos en los próximos 30 días.</Nota>
      <BarraAccion>
        <BotonEnlace href="/bienvenida">Volver al inicio</BotonEnlace>
      </BarraAccion>
    </main>
  )
}
