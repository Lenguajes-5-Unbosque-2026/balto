import fs from "node:fs"
import path from "node:path"

import { cacheLife, cacheTag } from "next/cache"
import { connection } from "next/server"
import { cache } from "react"

import { DUENO_ACTUAL_ID } from "@/lib/cuenta-actual"
import { parsearCsv } from "@/lib/csv"
import { deSupabase, ETIQUETA_DATOS, TABLAS, type Fila, type Tabla } from "@/lib/esquema"
import type { Evento, Soporte } from "@/lib/eventos"
import { edad } from "@/lib/fecha"
import type { Habito } from "@/lib/habitos"
import type { Alerta, PerfilMascota } from "@/lib/perfil"
import { supabaseServidor } from "@/lib/supabase"

/**
 * Los datos de la app salen de las 22 tablas de Supabase. Sin las variables
 * NEXT_PUBLIC_SUPABASE_* (por ejemplo, en un computador sin .env.local) se
 * usan los CSV de data/mock/, que tienen las mismas columnas.
 *
 * Cada página llama `await cargarDatos()` antes de usar las funciones
 * `obtener…`; estas siguen siendo sincrónicas y leen lo que se cargó.
 */
const CARPETA_MOCK = path.join(process.cwd(), "..", "data", "mock")

type Datos = Record<Tabla, Fila[]>

async function traerDatos(): Promise<Datos> {
  "use cache"
  cacheTag(ETIQUETA_DATOS)
  // Se refresca al guardar desde la app; los cambios hechos a mano en Supabase aparecen en un minuto.
  cacheLife({ stale: 30, revalidate: 60, expire: 86_400 })

  if (!supabaseServidor) {
    return Object.fromEntries(
      TABLAS.map((t) => [t, parsearCsv(fs.readFileSync(path.join(CARPETA_MOCK, `${t}.csv`), "utf8"))]),
    ) as Datos
  }
  const cliente = supabaseServidor
  const tablas = await Promise.all(
    TABLAS.map(async (t) => {
      const { data, error } = await cliente.from(t).select("*")
      if (error) throw new Error(`No se pudo leer la tabla ${t} de Supabase: ${error.message}`)
      return [t, data.map((fila) => deSupabase(t, fila))] as const
    }),
  )
  return Object.fromEntries(tablas) as Datos
}

/** Lo cargado en esta solicitud (y lo último cargado, para generateStaticParams). */
const deLaSolicitud = cache((): { datos?: Datos } => ({}))
let ultimos: Datos | undefined

export async function cargarDatos() {
  // La página se arma en cada visita: así "hoy" (lib/fecha.ts) es el día en que se abre, no el de la compilación.
  await connection()
  const datos = await traerDatos()
  deLaSolicitud().datos = datos
  ultimos = datos
}

function leer(tabla: Tabla): Fila[] {
  const datos = deLaSolicitud().datos ?? ultimos
  if (!datos) throw new Error("Falta `await cargarDatos()` en la página antes de leer los datos.")
  return datos[tabla]
}

export const DUENO_ACTUAL = DUENO_ACTUAL_ID

export type Mascota = {
  id: string
  dueno_id: string
  nombre: string
  especie: "perro" | "gato"
  raza: string
  sexo: string
  fecha_nacimiento: string
  esterilizada: string
  microchip: string
  cedula: string
  estado: string
  imagen: string
}

export type Veterinaria = {
  id: string
  nombre: string
  tipo: string
  /** "urgencias;consulta;vacunacion" */
  servicios: string
  direccion: string
  barrio: string
  latitud: string
  longitud: string
  telefono: string
  horario: string
  urgencias_24h: string
  calificacion: string
  num_resenas: string
  agenda_en_linea: string
  aliada: string
}

/** Bitácora de hábitos de las mascotas del dueño (I). */
export function obtenerHabitos(duenoId = DUENO_ACTUAL): Habito[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("habitos") as Habito[]).filter((h) => ids.has(h.mascota_id))
}

/** Comidas programadas de los planes (H4). */
export type ComidaProgramada = { id: string; plan_id: string; nombre: string; hora: string; gramos: string }

export function obtenerComidas(): ComidaProgramada[] {
  return leer("comidas_programadas") as ComidaProgramada[]
}

export function obtenerMascotas(duenoId = DUENO_ACTUAL): Mascota[] {
  return (leer("mascotas") as Mascota[]).filter((m) => m.dueno_id === duenoId && m.estado === "activa")
}

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** Número de la próxima cédula animal: BAL-0006-… (B6). */
export function siguienteCedula() {
  return Math.max(...(leer("mascotas") as Mascota[]).map((m) => Number(m.cedula.split("-")[1]) || 0)) + 1
}

/** Mascotas con la línea de detalle que muestran los selectores ("Perro · Golden Retriever · Hembra · 3 años"). */
export function obtenerMascotasBasicas(duenoId = DUENO_ACTUAL) {
  return obtenerMascotas(duenoId).map((m) => ({
    id: m.id,
    nombre: m.nombre,
    imagen: m.imagen,
    detalle: [mayuscula(m.especie), m.raza, mayuscula(m.sexo), edad(m.fecha_nacimiento)].filter(Boolean).join(" · "),
  }))
}

/** Pesos registrados de las mascotas del dueño, para la gráfica de E6. */
export function obtenerMediciones(duenoId = DUENO_ACTUAL) {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return obtenerEventos()
    .filter((e) => e.tipo === "peso" && ids.has(e.mascota_id) && e.peso_kg)
    .map((e) => ({ mascotaId: e.mascota_id, fecha: e.fecha, kg: Number(e.peso_kg) }))
}

export function obtenerEventos(mascotaId?: string): Evento[] {
  const soportes = leer("soportes")
  return (leer("eventos") as unknown as Evento[])
    .filter((e) => !e.eliminado_en && (!mascotaId || e.mascota_id === mascotaId))
    .map((e) => ({
      ...e,
      soportes: soportes
        .filter((s) => s.evento_id === e.id)
        .map((s): Soporte => ({
          nombre: s.archivo,
          tipo: s.tipo as Soporte["tipo"],
          tamanoKb: Number(s.tamano_kb),
          url: `/soportes/${s.archivo}`,
        })),
    }))
}

export function obtenerVeterinarias(): Veterinaria[] {
  return (leer("veterinarias") as Veterinaria[]).filter((v) => v.tipo === "veterinaria")
}

/** Veterinarias y demás proveedores (estética, guardería, paseo) del buscador de K. */
export function obtenerProveedores(): Veterinaria[] {
  return leer("veterinarias") as Veterinaria[]
}

export type Cita = {
  id: string
  dueno_id: string
  mascota_id: string
  proveedor_id: string
  servicio: string
  /** "2026-10-29 09:30" */
  fecha_hora: string
  duracion_min: string
  estado: "confirmada" | "por_confirmar" | "cancelada" | "realizada"
  alerta_id: string
  pedido_id: string
}

export function obtenerCitas(duenoId = DUENO_ACTUAL): Cita[] {
  return (leer("citas") as Cita[]).filter((c) => c.dueno_id === duenoId)
}

/** Días de anticipación del aviso de vacunas y desparasitaciones (M3). */
export function anticipacionAvisos(duenoId = DUENO_ACTUAL): number {
  const pref = leer("preferencias_notificacion").find(
    (p) => p.dueno_id === duenoId && p.tipo === "vacunas_desparasitaciones",
  )
  if (!pref || pref.activo !== "true") return 0
  return Number.parseInt(pref.anticipacion, 10) || 0
}

export type Dueno = { id: string; nombre: string; correo: string; ciudad: string; telefono: string }

export function obtenerDueno(duenoId = DUENO_ACTUAL): Dueno {
  const d = leer("duenos").find((x) => x.id === duenoId)!
  return { id: d.id, nombre: d.nombre, correo: d.correo, ciudad: d.ciudad, telefono: d.telefono }
}

/** Preferencias de notificación del dueño (M3). */
export function obtenerPreferencias(duenoId = DUENO_ACTUAL) {
  return leer("preferencias_notificacion")
    .filter((p) => p.dueno_id === duenoId)
    .map((p) => ({ tipo: p.tipo, activo: p.activo, anticipacion: p.anticipacion }))
}

export type Pedido = {
  id: string
  numero: string
  direccion_id: string
  metodo_pago: string
  metodo_pago_id: string
  subtotal: string
  envio: string
  total: string
  estado_pago: string
  /** "" | "confirmado" | "preparacion" | "en_camino" | "entregado" */
  estado_entrega: string
  ventana_entrega: string
  fecha: string
}

export function obtenerPedidos(duenoId = DUENO_ACTUAL): Pedido[] {
  return (leer("pedidos") as (Pedido & { dueno_id: string })[]).filter((p) => p.dueno_id === duenoId)
}

/** Catálogo de la Tienda (N). */
export type Producto = {
  id: string
  tipo: "alimento" | "vacuna" | "desparasitacion"
  nombre: string
  /** "perro", "gato" o "perro;gato" */
  especie: string
  etapa: string
  presentacion: string
  precio_cop: string
  stock: string
  incluye_aplicacion: string
  descripcion: string
}

export function obtenerProductos(): Producto[] {
  return leer("productos") as Producto[]
}

export type PedidoItem = { id: string; pedido_id: string; producto_id: string; cantidad: string; precio_unitario: string; mascota_id: string; cita_id: string }

export function obtenerItemsPedido(): PedidoItem[] {
  return leer("pedido_items") as PedidoItem[]
}

export type Direccion = { id: string; nombre: string; direccion: string; barrio: string; indicaciones: string; predeterminada: string }

export function obtenerDirecciones(duenoId = DUENO_ACTUAL): Direccion[] {
  return (leer("direcciones") as (Direccion & { dueno_id: string })[]).filter((d) => d.dueno_id === duenoId)
}

export type MetodoPago = { id: string; tipo: string; franquicia: string; ultimos_4: string; predeterminado: string }

export function obtenerMetodosPago(duenoId = DUENO_ACTUAL): MetodoPago[] {
  return (leer("metodos_pago") as (MetodoPago & { dueno_id: string })[]).filter((m) => m.dueno_id === duenoId)
}

/** Mascotas activas con lo que muestran Inicio y D1, y sus alergias (B4, F5). */
export function obtenerPerfiles(duenoId = DUENO_ACTUAL): PerfilMascota[] {
  const alergias = leer("alergias")
  return obtenerMascotas(duenoId).map((m) => ({
    id: m.id,
    nombre: m.nombre,
    imagen: m.imagen,
    especie: m.especie,
    raza: m.raza,
    sexo: m.sexo,
    edad: edad(m.fecha_nacimiento),
    microchip: m.microchip,
    cedula: m.cedula,
    alergias: alergias.filter((a) => a.mascota_id === m.id).map((a) => a.alergia),
  }))
}

/** Alertas pendientes (próximas o vencidas) de las mascotas del dueño (J). */
export function obtenerAlertas(duenoId = DUENO_ACTUAL): Alerta[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("alertas") as unknown as Alerta[]).filter(
    (a) => ids.has(a.mascota_id) && (a.estado === "proxima" || a.estado === "vencida"),
  )
}

/** Todas las alertas del dueño, también las resueltas (J1 · pestaña Resueltas). */
export function obtenerTodasAlertas(duenoId = DUENO_ACTUAL): Alerta[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("alertas") as unknown as Alerta[]).filter((a) => ids.has(a.mascota_id))
}

export type Condicion = {
  id: string
  mascota_id: string
  nombre: string
  fecha_diagnostico: string
  diagnosticada_por: string
}

/** Condiciones diagnosticadas de las mascotas del dueño (F5). */
export function obtenerCondiciones(duenoId = DUENO_ACTUAL): Condicion[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("condiciones") as Condicion[]).filter((c) => ids.has(c.mascota_id))
}

/** Una fila de data/mock/tratamientos.csv (G). */
export type Tratamiento = {
  id: string
  mascota_id: string
  evento_id: string
  medicamento: string
  presentacion: string
  via: string
  dosis: string
  frecuencia: string
  /** "martes;viernes" cuando la frecuencia es por días. */
  dias_semana: string
  fecha_inicio: string
  duracion_dias: string
  fecha_fin: string
  prescrito_por: string
  estado: "vigente" | "finalizado"
  finalizado_antes: string
  recordatorio: string
}

export type HorarioToma = { id: string; tratamiento_id: string; hora: string }

export type Toma = {
  id: string
  tratamiento_id: string
  fecha_hora_programada: string
  estado: "tomada" | "omitida" | "pendiente"
  hora_real: string
  aviso_reprogramado: string
}

export function obtenerTratamientos(duenoId = DUENO_ACTUAL): Tratamiento[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("tratamientos") as Tratamiento[]).filter((t) => ids.has(t.mascota_id))
}

export function obtenerHorarios(): HorarioToma[] {
  return leer("horarios_toma") as HorarioToma[]
}

export function obtenerTomas(): Toma[] {
  return leer("tomas") as Toma[]
}

/** Un PDF enviado o un enlace compartido (L). */
export type Envio = {
  id: string
  mascota_id: string
  formato: "pdf" | "enlace"
  /** "identificacion;vacunas;medicacion" o "completo". */
  secciones: string
  desde: string
  hasta: string
  canal: "whatsapp" | "correo" | "imprimir" | "guardar" | "enlace" | "compartir"
  destinatario: string
  token: string
  vencimiento: "" | "24_horas" | "7_dias" | "sin_vencimiento"
  expira_en: string
  activo: string
  visitas: string
  fecha: string
}

export function obtenerEnvios(duenoId = DUENO_ACTUAL): Envio[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("envios") as Envio[]).filter((e) => ids.has(e.mascota_id))
}

export type PlanAlimentacion = {
  id: string
  mascota_id: string
  tipo: "concentrado" | "casero"
  marca: string
  tipo_alimento: string
  presentacion_kg: string
  gramos_dia: string
  actividad: string
  fecha_bolsa_abierta: string
  activo: string
}

export function obtenerPlanes(duenoId = DUENO_ACTUAL): PlanAlimentacion[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("planes_alimentacion") as PlanAlimentacion[]).filter((p) => ids.has(p.mascota_id))
}

/** Eventos de todas las mascotas activas del dueño. */
export function obtenerEventosDueno(duenoId = DUENO_ACTUAL) {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return obtenerEventos().filter((e) => ids.has(e.mascota_id))
}
