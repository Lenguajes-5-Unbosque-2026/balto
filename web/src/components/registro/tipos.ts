/** Lo que necesitan las pantallas de E de cada mascota (sale de data/mock/mascotas.csv). */
export type MascotaBasica = {
  id: string
  nombre: string
  imagen: string
  /** "Perro · Golden Retriever · Hembra · 3 años" */
  detalle: string
}

/** Medición de peso para la gráfica de E6. */
export type Medicion = { mascotaId: string; fecha: string; kg: number }
