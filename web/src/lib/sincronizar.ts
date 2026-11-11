"use client"

import { toast } from "sonner"

import { aSupabase, type Tabla } from "@/lib/esquema"
import { refrescarDatos } from "@/lib/refrescar"
import { supabase } from "@/lib/supabase"

/**
 * Lo que se guarda en la app se escribe también en Supabase. La pantalla no
 * espera: el cambio ya quedó en este navegador (almacen-local, registro-local)
 * y aquí se sube en orden. Sin conexión, la cola espera y se sube al volver.
 */
type Valores = Record<string, unknown>

export type Operacion =
  /** Actualiza la fila que cumple `donde`; si no existe, la crea con `donde`, `fila` y `alCrear`. */
  | { tipo: "guardar"; tabla: Tabla; donde: Record<string, string>; fila: Valores; alCrear?: Valores }
  /** Solo actualiza (si no hay fila, no hace nada). */
  | { tipo: "actualizar"; tabla: Tabla; donde: Record<string, string>; fila: Valores }
  | { tipo: "borrar"; tabla: Tabla; donde: Record<string, string> }
  /** Borra las filas de `donde` y crea `filas` (alergias, soportes, horarios, productos de un pedido…). */
  | { tipo: "reemplazar"; tabla: Tabla; donde: Record<string, string>; filas: Valores[] }
  /** Plan de alimentación activo de una mascota y sus comidas (H4). */
  | { tipo: "plan"; mascotaId: string; plan: Valores; comidas: Valores[]; idNuevo: string }

const CLAVE = "balto:cola-supabase"

function leerCola(): Operacion[] {
  try {
    return JSON.parse(window.localStorage.getItem(CLAVE) ?? "[]") as Operacion[]
  } catch {
    return []
  }
}

let enMemoria: Operacion[] | null = null

function cola() {
  return (enMemoria ??= leerCola())
}

function escribirCola(ops: Operacion[]) {
  enMemoria = ops
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(ops))
  } catch {
    // Sin almacenamiento: la cola queda en memoria hasta recargar.
  }
}

/** Agrega cambios a la cola y la empieza a subir. */
export function enSupabase(...ops: Operacion[]) {
  if (!supabase || ops.length === 0) return
  escribirCola([...cola(), ...ops])
  void subir()
}

class SinConexion extends Error {}

function revisar(error: { message: string } | null) {
  if (!error) return
  if (!navigator.onLine || /fetch|network|load failed/i.test(error.message)) throw new SinConexion(error.message)
  throw new Error(error.message)
}

const filtrar = (tabla: Tabla, donde: Record<string, string>) => aSupabase(tabla, donde)

async function ejecutar(op: Operacion) {
  const sb = supabase!
  switch (op.tipo) {
    case "guardar": {
      const donde = filtrar(op.tabla, op.donde)
      const fila = aSupabase(op.tabla, op.fila)
      for (const k of Object.keys(donde)) delete fila[k]
      const consulta = Object.keys(fila).length
        ? sb.from(op.tabla).update(fila).match(donde).select()
        : sb.from(op.tabla).select().match(donde).limit(1)
      const { data, error } = await consulta
      revisar(error)
      if (!data?.length) {
        const { error: alCrear } = await sb.from(op.tabla).insert(aSupabase(op.tabla, { ...op.alCrear, ...op.donde, ...op.fila }))
        revisar(alCrear)
      }
      return
    }
    case "actualizar": {
      const { error } = await sb.from(op.tabla).update(aSupabase(op.tabla, op.fila)).match(filtrar(op.tabla, op.donde))
      return revisar(error)
    }
    case "borrar": {
      const { error } = await sb.from(op.tabla).delete().match(filtrar(op.tabla, op.donde))
      return revisar(error)
    }
    case "reemplazar": {
      const { error } = await sb.from(op.tabla).delete().match(filtrar(op.tabla, op.donde))
      revisar(error)
      if (!op.filas.length) return
      const { error: alCrear } = await sb.from(op.tabla).insert(op.filas.map((f) => aSupabase(op.tabla, { ...op.donde, ...f })))
      return revisar(alCrear)
    }
    case "plan": {
      // Se actualiza el plan activo de la mascota (o se crea uno) y se reemplazan sus comidas.
      const { data, error } = await sb.from("planes_alimentacion").select("id").eq("mascota_id", op.mascotaId).eq("activo", true).limit(1)
      revisar(error)
      const id = (data?.[0]?.id as string | undefined) ?? op.idNuevo
      const plan = aSupabase("planes_alimentacion", { ...op.plan, id, mascota_id: op.mascotaId, activo: "true" })
      const { error: alGuardar } = data?.length
        ? await sb.from("planes_alimentacion").update(plan).eq("id", id)
        : await sb.from("planes_alimentacion").insert(plan)
      revisar(alGuardar)
      return ejecutar({
        tipo: "reemplazar",
        tabla: "comidas_programadas",
        donde: { plan_id: id },
        filas: op.comidas.map((c, i) => ({ ...c, id: `${id}-c${i + 1}` })),
      })
    }
  }
}

let subiendo = false

async function subir() {
  if (subiendo || !supabase) return
  subiendo = true
  let subidas = 0
  try {
    while (cola().length) {
      const [op, ...resto] = cola()
      try {
        await ejecutar(op)
        subidas++
      } catch (e) {
        // Sin internet: se reintenta al volver la conexión (o al abrir la app otra vez).
        if (e instanceof SinConexion) break
        console.error("Supabase rechazó un cambio", op, e)
        toast.error("No pudimos guardar un cambio en la base de datos.", { description: (e as Error).message })
      }
      escribirCola(resto)
    }
  } finally {
    subiendo = false
  }
  if (subidas) await refrescarDatos().catch(() => undefined)
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => void subir())
  // Lo que quedó pendiente de una visita anterior.
  if (cola().length) queueMicrotask(() => void subir())
}
