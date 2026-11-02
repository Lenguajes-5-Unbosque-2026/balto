"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useSyncExternalStore } from "react"
import { toast } from "sonner"

import { Boton } from "@/components/boton"
import { Dialogo } from "@/components/dialogo"
import { Icono } from "@/components/icono"
import { useMapaLocal } from "@/lib/almacen-local"
import { cerrarSesion } from "@/lib/acceso"
import { limpiarPendientes, useEnLinea, usePendientes } from "@/lib/conexion"

const TREINTA_DIAS = 30 * 24 * 60 * 60 * 1000
const sinSuscripcion = () => () => {}
/** Pantallas sin la banda: las de acceso y la vista pública. */
const SIN_BANDA = ["/bienvenida", "/ingresar", "/registro", "/recuperar", "/p/", "/compartir/pdf", "/habitos/pdf"]

/**
 * Estados transversales de toda la app: banda roja sin conexión (O2), banda de
 * cambios pendientes (O3), subida al volver el internet y sesión expirada (O4).
 */
export function Vigilante() {
  const router = useRouter()
  const ruta = usePathname()
  const enLinea = useEnLinea()
  const pendientes = usePendientes()
  const cuantos = Object.keys(pendientes).length
  const sesion = useMapaLocal<{ desde: number }>("balto:sesion").actual
  // La hora se lee solo en el navegador (no al prerenderizar).
  const vencida = useSyncExternalStore(sinSuscripcion, () => !!sesion && Date.now() - sesion.desde > TREINTA_DIAS, () => false)
  const [cerrado, setCerrado] = useState(false)
  const expirada = !cerrado && vencida

  // Al volver el internet se suben los pendientes (sin servidor todavía, ya están guardados en el celular).
  useEffect(() => {
    if (enLinea && cuantos > 0) {
      limpiarPendientes(Object.keys(pendientes))
      toast.success("Cambios guardados")
    }
  }, [enLinea, cuantos, pendientes])

  if (SIN_BANDA.some((r) => ruta.startsWith(r))) return null

  return (
    <>
      {(!enLinea || cuantos > 0) && (
        <Link
          href={!enLinea ? "/sin-conexion" : "/pendientes"}
          className="sticky top-0 z-20 mx-pantalla mt-3 -mb-1 flex items-center gap-2.5 rounded-md border border-error-borde bg-error-suave px-4 py-2.5 texto-etiqueta text-texto"
        >
          <Icono nombre={!enLinea ? "wifi_off" : "sync_problem"} className="icono-s text-error" />
          {!enLinea ? "Sin conexión · estás viendo datos guardados" : `${cuantos} ${cuantos === 1 ? "cambio pendiente" : "cambios pendientes"} de subir`}
        </Link>
      )}
      {/* O4 · Sesión expirada */}
      <Dialogo
        abierto={expirada}
        onCerrar={() => setCerrado(true)}
        icono="lock_clock"
        titulo="Tu sesión expiró"
        mensaje="Por seguridad cerramos la sesión después de un tiempo sin uso. Tus datos están guardados."
      >
        <Boton
          onClick={() => {
            cerrarSesion()
            setCerrado(true)
            router.push("/ingresar")
          }}
        >
          Iniciar sesión
        </Boton>
        <Boton
          variante="secundario"
          onClick={() => {
            cerrarSesion()
            setCerrado(true)
            router.push("/bienvenida")
          }}
        >
          Salir
        </Boton>
      </Dialogo>
    </>
  )
}
