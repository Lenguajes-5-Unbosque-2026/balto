"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { Busqueda } from "@/components/busqueda"
import { Chip } from "@/components/chip"
import { Estado } from "@/components/estado"
import { Hoja } from "@/components/hoja"
import { Selector } from "@/components/selector"
import { agregarAlimento, EncabezadoTienda, TarjetaProducto, useRecomendados, type PropsTienda } from "@/components/tienda/comun"
import { normalizar } from "@/lib/eventos"
import { paraEspecie } from "@/lib/tienda"
import { useTienda } from "@/lib/usar-tienda"

type Filtro = { especie: "" | "perro" | "gato"; etapa: "" | "adulto" | "cachorro" }

/** N2 · Alimentos con búsqueda y filtros, y N11 · Búsqueda sin resultados (/tienda/alimentos?q=…). */
export function Alimentos(datos: PropsTienda) {
  const { carrito, cuenta } = useTienda(datos)
  const { mascota, alimento } = useRecomendados(datos)
  const [busqueda, setBusqueda] = useState(useSearchParams().get("q") ?? "")
  // "Ver todo" de N1 abre el catálogo sin el filtro de la mascota.
  const [paraMascota, setParaMascota] = useState(useSearchParams().get("todo") !== "1")
  const [filtro, setFiltro] = useState<Filtro>({ especie: "", etapa: "" })
  const [verFiltros, setVerFiltros] = useState(false)

  const etapaMascota = (Number.parseInt(mascota.edad, 10) || 0) < 1 ? "cachorro" : "adulto"
  const especie = paraMascota ? mascota.especie : filtro.especie
  const etapa = paraMascota ? etapaMascota : filtro.etapa
  const lista = datos.productos
    .filter((p) => p.tipo === "alimento")
    .filter((p) => (!especie || paraEspecie(p, especie)) && (!etapa || p.etapa === etapa))
    .filter((p) => !busqueda.trim() || normalizar(busqueda).split(/\s+/).every((q) => normalizar(`${p.nombre} ${p.descripcion}`).includes(q)))
    .sort((a, b) => Number(b.id === alimento?.producto.id) - Number(a.id === alimento?.producto.id))
  const conFiltros = paraMascota || !!filtro.especie || !!filtro.etapa

  function quitarFiltros() {
    setParaMascota(false)
    setFiltro({ especie: "", etapa: "" })
  }

  const chip = (texto: string, activo: boolean, onClick: () => void, icono?: string) => <Chip texto={texto} icono={icono} activo={activo} onClick={onClick} />

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 pb-10">
      <EncabezadoTienda actual="alimentos" cuenta={cuenta} />
      <Busqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar alimento" onFiltros={() => setVerFiltros(true)} filtrosActivos={conFiltros} />
      <div className="sin-barra-desplazamiento -mx-pantalla flex gap-2 overflow-x-auto px-pantalla">
        {chip(`Para ${mascota.nombre}`, paraMascota, () => setParaMascota((x) => !x), "pets")}
        {chip("Perro adulto", !paraMascota && filtro.especie === "perro" && filtro.etapa === "adulto", () => {
          setParaMascota(false)
          setFiltro({ especie: "perro", etapa: "adulto" })
        })}
        {chip("Cachorro", !paraMascota && filtro.etapa === "cachorro", () => {
          setParaMascota(false)
          setFiltro({ especie: "perro", etapa: "cachorro" })
        })}
        {chip("Gato", !paraMascota && filtro.especie === "gato", () => {
          setParaMascota(false)
          setFiltro({ especie: "gato", etapa: "" })
        })}
      </div>

      {lista.length === 0 ? (
        <>
          <div className="pt-4">
            <Estado tono="error" icono="search_off" titulo="No encontramos eso" mensaje="Prueba con otro nombre o quita los filtros." />
          </div>
          {conFiltros && (
            <button type="button" onClick={quitarFiltros} className="self-center p-2 texto-etiqueta-fuerte text-primario">
              Quitar los filtros
            </button>
          )}
          <BarraAccion>
            <Boton
              onClick={() => {
                quitarFiltros()
                setBusqueda("")
              }}
              className="px-2 texto-cuerpo-fuerte"
            >
              Ver todo el alimento
            </Boton>
            <BotonEnlace href={`/ajustes/escribenos?tema=producto&q=${encodeURIComponent(busqueda)}`} variante="secundario" className="px-2 texto-cuerpo-fuerte">
              Pedir un producto
            </BotonEnlace>
          </BarraAccion>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {lista.map((p) => (
            <TarjetaProducto
              key={p.id}
              producto={p}
              rotulo={p.id === alimento?.producto.id ? "Recomendado" : undefined}
              href={`/tienda/producto?id=${p.id}`}
              onAgregar={() => agregarAlimento(p, 1, carrito.find((i) => i.producto_id === p.id)?.cantidad)}
            />
          ))}
        </div>
      )}

      <Hoja abierta={verFiltros} onCerrar={() => setVerFiltros(false)} titulo="Filtrar alimento">
        <div className="flex flex-col gap-3.5">
          <span className="texto-micro text-texto-secundario">Especie</span>
          <Selector
            etiqueta="Especie"
            valor={especie || "todas"}
            onCambio={(v) => {
              setParaMascota(false)
              setFiltro((f) => ({ ...f, especie: v === "todas" ? "" : (v as Filtro["especie"]) }))
            }}
            opciones={[
              { valor: "todas", etiqueta: "Todas" },
              { valor: "perro", etiqueta: "Perro" },
              { valor: "gato", etiqueta: "Gato" },
            ]}
          />
          <span className="texto-micro text-texto-secundario">Etapa</span>
          <Selector
            etiqueta="Etapa"
            valor={etapa || "todas"}
            onCambio={(v) => {
              setParaMascota(false)
              setFiltro((f) => ({ ...f, etapa: v === "todas" ? "" : (v as Filtro["etapa"]) }))
            }}
            opciones={[
              { valor: "todas", etiqueta: "Todas" },
              { valor: "cachorro", etiqueta: "Cachorro" },
              { valor: "adulto", etiqueta: "Adulto" },
            ]}
          />
          <div className="mt-2 flex gap-2.5">
            <Boton variante="secundario" onClick={quitarFiltros}>
              Limpiar
            </Boton>
            <Boton onClick={() => setVerFiltros(false)}>Ver {lista.length}</Boton>
          </div>
        </div>
      </Hoja>
    </main>
  )
}
