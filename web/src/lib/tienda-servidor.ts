import { marcasDePlanes } from "@/lib/alertas-servidor"
import {
  obtenerCitas,
  obtenerComidas,
  obtenerDirecciones,
  obtenerEventosDueno,
  obtenerItemsPedido,
  obtenerMetodosPago,
  obtenerPedidos,
  obtenerPerfiles,
  obtenerPlanes,
  obtenerProductos,
  obtenerProveedores,
  obtenerTodasAlertas,
} from "@/lib/datos"

/** Lo que leen las pantallas de N: catálogo, pedidos y, para las recomendaciones, planes y alertas. */
export function datosTienda() {
  return {
    productos: obtenerProductos(),
    pedidos: obtenerPedidos(),
    items: obtenerItemsPedido(),
    direcciones: obtenerDirecciones(),
    metodos: obtenerMetodosPago(),
    mascotas: obtenerPerfiles(),
    planes: obtenerPlanes(),
    comidas: obtenerComidas(),
    alertas: obtenerTodasAlertas(),
    eventos: obtenerEventosDueno(),
    marcas: marcasDePlanes(),
    proveedores: obtenerProveedores(),
    citas: obtenerCitas(),
  }
}

export type PropsTienda = ReturnType<typeof datosTienda>
