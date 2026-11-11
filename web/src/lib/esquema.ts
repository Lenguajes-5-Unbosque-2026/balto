/**
 * Las 22 tablas de Supabase, con las mismas columnas de data/mock/*.csv.
 * La app trabaja con filas de texto (como el CSV); Supabase guarda algunos
 * valores con su tipo (booleanos, números, listas, fecha y hora, hora). Aquí
 * está la conversión en los dos sentidos.
 */
export const COLUMNAS = {
  alergias: ["id", "mascota_id", "alergia"],
  alertas: ["id", "mascota_id", "tipo", "evento_id", "plan_id", "fecha_vencimiento", "fecha_aviso", "fecha_aviso_pospuesto", "estado", "fecha_resuelta", "evento_resolucion_id"],
  citas: ["id", "dueno_id", "mascota_id", "proveedor_id", "servicio", "fecha_hora", "duracion_min", "estado", "alerta_id", "pedido_id"],
  comidas_programadas: ["id", "plan_id", "nombre", "hora", "gramos"],
  condiciones: ["id", "mascota_id", "nombre", "fecha_diagnostico", "diagnosticada_por"],
  direcciones: ["id", "dueno_id", "nombre", "direccion", "barrio", "indicaciones", "predeterminada"],
  duenos: ["id", "nombre", "correo", "telefono", "ciudad", "fecha_registro", "fecha_aceptacion_terminos", "version_terminos"],
  envios: ["id", "mascota_id", "formato", "secciones", "desde", "hasta", "canal", "destinatario", "token", "vencimiento", "expira_en", "activo", "visitas", "fecha"],
  eventos: [
    "id", "mascota_id", "tipo", "fecha", "origen", "proveedor_id", "veterinaria", "vacuna", "lote", "proximo_refuerzo", "producto", "via",
    "proxima_dosis", "motivo", "diagnostico", "recomendaciones", "tipo_examen", "laboratorio", "resultado_principal", "resultado",
    "solicitado_por", "proximo_control", "medicamento", "dosis", "frecuencia", "duracion_dias", "peso_kg", "que_cambio", "titulo", "lugar",
    "detalle", "recordatorio", "fecha_creacion", "eliminado_en",
  ],
  habitos: ["id", "mascota_id", "tipo", "fecha", "duracion_min", "consistencia", "observacion", "imagen"],
  horarios_toma: ["id", "tratamiento_id", "hora"],
  mascotas: ["id", "dueno_id", "nombre", "especie", "raza", "sexo", "fecha_nacimiento", "esterilizada", "microchip", "cedula", "fecha_emision_cedula", "estado", "carga_inicial", "imagen", "fecha_registro"],
  metodos_pago: ["id", "dueno_id", "tipo", "franquicia", "ultimos_4", "token_pasarela", "predeterminado"],
  pedido_items: ["id", "pedido_id", "producto_id", "cantidad", "precio_unitario", "mascota_id", "cita_id"],
  pedidos: ["id", "numero", "dueno_id", "direccion_id", "metodo_pago", "metodo_pago_id", "subtotal", "envio", "total", "estado_pago", "estado_entrega", "ventana_entrega", "fecha"],
  planes_alimentacion: ["id", "mascota_id", "tipo", "marca", "tipo_alimento", "presentacion_kg", "gramos_dia", "actividad", "fecha_bolsa_abierta", "activo"],
  preferencias_notificacion: ["dueno_id", "tipo", "activo", "anticipacion"],
  productos: ["id", "tipo", "nombre", "especie", "etapa", "presentacion", "precio_cop", "stock", "incluye_aplicacion", "descripcion", "imagen"],
  soportes: ["id", "evento_id", "archivo", "tipo", "tamano_kb", "fecha_subida"],
  tomas: ["id", "tratamiento_id", "fecha_hora_programada", "estado", "hora_real", "aviso_reprogramado"],
  tratamientos: [
    "id", "mascota_id", "evento_id", "medicamento", "presentacion", "via", "dosis", "frecuencia", "dias_semana", "fecha_inicio",
    "duracion_dias", "fecha_fin", "prescrito_por", "estado", "finalizado_antes", "recordatorio",
  ],
  veterinarias: ["id", "nombre", "tipo", "servicios", "direccion", "barrio", "latitud", "longitud", "telefono", "horario", "urgencias_24h", "calificacion", "num_resenas", "agenda_en_linea", "aliada", "imagen"],
} as const

export type Tabla = keyof typeof COLUMNAS
export const TABLAS = Object.keys(COLUMNAS) as Tabla[]

/** Una fila como la usa la app: todo en texto, "" si está vacío. */
export type Fila = Record<string, string>

type Tipo = "booleano" | "numero" | "lista" | "fecha_hora" | "hora" | "imagen"

/** Columnas que en Supabase no son texto. Las demás (también las fechas sin hora) llegan igual que en el CSV. */
const TIPOS: Partial<Record<Tabla, Record<string, Tipo>>> = {
  citas: { duracion_min: "numero", fecha_hora: "fecha_hora" },
  comidas_programadas: { gramos: "numero", hora: "hora" },
  direcciones: { predeterminada: "booleano" },
  envios: { secciones: "lista", visitas: "numero", activo: "booleano", expira_en: "fecha_hora" },
  eventos: { recordatorio: "booleano", duracion_dias: "numero", peso_kg: "numero" },
  habitos: { duracion_min: "numero", imagen: "imagen" },
  horarios_toma: { hora: "hora" },
  mascotas: { esterilizada: "booleano", imagen: "imagen" },
  metodos_pago: { predeterminado: "booleano" },
  pedido_items: { cantidad: "numero", precio_unitario: "numero" },
  pedidos: { subtotal: "numero", envio: "numero", total: "numero" },
  planes_alimentacion: { presentacion_kg: "numero", gramos_dia: "numero", activo: "booleano" },
  preferencias_notificacion: { activo: "booleano" },
  productos: { especie: "lista", precio_cop: "numero", stock: "numero", incluye_aplicacion: "booleano", imagen: "imagen" },
  soportes: { tamano_kb: "numero" },
  tomas: { fecha_hora_programada: "fecha_hora", hora_real: "fecha_hora", aviso_reprogramado: "fecha_hora" },
  tratamientos: { duracion_dias: "numero", finalizado_antes: "booleano", recordatorio: "booleano", dias_semana: "lista" },
  veterinarias: {
    servicios: "lista",
    latitud: "numero",
    longitud: "numero",
    calificacion: "numero",
    num_resenas: "numero",
    urgencias_24h: "booleano",
    agenda_en_linea: "booleano",
    aliada: "booleano",
    imagen: "imagen",
  },
}

/** Bogotá no tiene horario de verano: siempre UTC−5. */
const BOGOTA = "-05:00"
const HORAS_BOGOTA = 5

const dos = (n: number) => String(n).padStart(2, "0")

/** "2026-09-12T15:00:00+00:00" → "2026-09-12 10:00" (hora de Bogotá, como en el CSV). */
function fechaHoraLocal(valor: string) {
  const d = new Date(new Date(valor).getTime() - HORAS_BOGOTA * 3_600_000)
  if (Number.isNaN(d.getTime())) return valor
  return `${d.getUTCFullYear()}-${dos(d.getUTCMonth() + 1)}-${dos(d.getUTCDate())} ${dos(d.getUTCHours())}:${dos(d.getUTCMinutes())}`
}

/** Supabase → app. */
export function deSupabase(tabla: Tabla, fila: Record<string, unknown>): Fila {
  const tipos = TIPOS[tabla] ?? {}
  const salida: Fila = {}
  for (const col of COLUMNAS[tabla]) {
    const v = fila[col]
    const tipo = tipos[col]
    if (v === null || v === undefined) salida[col] = ""
    else if (Array.isArray(v)) salida[col] = v.join(";")
    else if (tipo === "fecha_hora") salida[col] = fechaHoraLocal(String(v))
    else if (tipo === "hora") salida[col] = String(v).slice(0, 5)
    // Las fotos subidas a Storage se muestran con el mismo archivo de public/ (que tiene sus versiones recortadas).
    else if (tipo === "imagen") salida[col] = String(v).replace(/^https?:\/\/[^/]+\/storage\/v1\/object\/public\/[^/]+\//, "")
    // Pesos y calificaciones se escriben con un decimal ("28,0 kg", "5.0").
    else if ((col === "peso_kg" || col === "calificacion") && typeof v === "number" && Number.isInteger(v * 10)) salida[col] = v.toFixed(1)
    else salida[col] = String(v)
  }
  return salida
}

/** App → Supabase. Ignora lo que no es una columna de la tabla (soportes, campos calculados…). */
export function aSupabase(tabla: Tabla, fila: Record<string, unknown>): Record<string, unknown> {
  const tipos = TIPOS[tabla] ?? {}
  const columnas: readonly string[] = COLUMNAS[tabla]
  const salida: Record<string, unknown> = {}
  for (const [col, v] of Object.entries(fila)) {
    if (!columnas.includes(col) || v === undefined) continue
    const tipo = tipos[col]
    if (v === null || v === "") salida[col] = null
    else if (tipo === "booleano") salida[col] = v === true || v === "true"
    else if (tipo === "numero") salida[col] = Number.isFinite(Number(v)) ? Number(v) : null
    else if (tipo === "lista") salida[col] = Array.isArray(v) ? v : String(v).split(";").filter(Boolean)
    else if (tipo === "fecha_hora") salida[col] = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(String(v)) ? `${String(v).replace(" ", "T")}:00${BOGOTA}` : v
    else salida[col] = typeof v === "string" ? v : String(v)
  }
  return salida
}

/** Etiqueta del caché de lectura (lib/datos.ts); la app la invalida después de guardar (lib/refrescar.ts). */
export const ETIQUETA_DATOS = "datos"
