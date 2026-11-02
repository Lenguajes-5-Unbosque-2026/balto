"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Busqueda } from "@/components/busqueda"
import { Campo } from "@/components/campo"
import { Chip } from "@/components/chip"
import { Dialogo } from "@/components/dialogo"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Hoja } from "@/components/hoja"
import { Interruptor } from "@/components/interruptor"
import { Nota } from "@/components/nota"
import { Selector } from "@/components/selector"
import type { Veterinaria } from "@/lib/datos"
import { normalizar } from "@/lib/eventos"
import {
  SERVICIOS,
  ZONAS,
  distanciaKm,
  estadoHorario,
  iconoProveedor,
  ofrece,
  puntoDe,
  serviciosDe,
  textoKm,
  type Servicio,
} from "@/lib/proveedores"
import { guardarUbicacion, puntoReferencia, useFavorita, useUbicacion } from "@/lib/usar-proveedores"
import { useVolver } from "@/lib/usar-salud"

type Filtros = { servicios: Servicio[]; distancia: "1" | "3" | "5"; abierto: boolean }

const DISTANCIAS = { "1": 1, "3": 3, "5": Infinity }

/** K3 · Listado de proveedores, con K1 (ubicación), K2 (filtros), K7 (buscar por zona) y K8 (sin resultados). */
export function BuscadorProveedores({ proveedores }: { proveedores: Veterinaria[] }) {
  const volver = useVolver("/")
  const p = useSearchParams()
  const ubicacion = useUbicacion()
  const favorita = useFavorita()
  const [busqueda, setBusqueda] = useState("")
  const [filtros, setFiltros] = useState<Filtros>(() => ({
    servicios: [p.get("servicio"), p.get("urgencias") && "urgencias"].filter(Boolean) as Servicio[],
    distancia: "5",
    abierto: p.get("abierto") === "1",
  }))
  const [verFiltros, setVerFiltros] = useState(false)
  const [porZona, setPorZona] = useState(false)
  const [pidiendo, setPidiendo] = useState(false)
  // K1 se muestra una sola vez por sesión mientras no haya ubicación guardada.
  const [primeraVez, setPrimeraVez] = useState(() => {
    try {
      return typeof window !== "undefined" && !window.sessionStorage.getItem("balto:k1")
    } catch {
      return false
    }
  })

  function cerrarK1() {
    try {
      window.sessionStorage.setItem("balto:k1", "1")
    } catch {
      // Sin almacenamiento: K1 vuelve a salir la próxima vez.
    }
    setPrimeraVez(false)
    setPidiendo(false)
  }

  const ref = puntoReferencia(ubicacion)
  const consulta = p.toString() ? `&${p}` : ""

  function aplicar(f: Filtros, lista = proveedores) {
    return lista
      .map((v) => ({ v, km: distanciaKm(ref, puntoDe(v)), horario: estadoHorario(v) }))
      .filter(({ v, km, horario }) => {
        const texto = normalizar(`${v.nombre} ${v.barrio} ${serviciosDe(v).join(" ")}`)
        return (
          (!busqueda || normalizar(busqueda).split(/\s+/).every((q) => texto.includes(q))) &&
          f.servicios.every((s) => ofrece(v, s)) &&
          km <= DISTANCIAS[f.distancia] &&
          (!f.abierto || horario.abierto)
        )
      })
      // La veterinaria de confianza va primero; luego, por distancia.
      .sort((a, b) => Number(b.v.id === favorita) - Number(a.v.id === favorita) || a.km - b.km)
  }

  const resultados = aplicar(filtros)
  const conFiltros = filtros.servicios.length > 0 || filtros.abierto || filtros.distancia !== "5"

  function usarGps() {
    setPidiendo(false)
    if (!navigator.geolocation) {
      setPorZona(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const punto = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        // Fuera de Bogotá las distancias no sirven: se usa la zona de la casa.
        if (distanciaKm(punto, ZONAS.Chapinero) > 60) {
          guardarUbicacion({ ...ZONAS.Chapinero, modo: "zona", zona: "Chapinero" })
          toast("Estás fuera de Bogotá", { description: "Te mostramos lo que hay cerca de Chapinero." })
        } else {
          guardarUbicacion({ ...punto, modo: "gps", zona: "" })
        }
        setPorZona(false)
      },
      () => setPorZona(true),
    )
  }

  if (porZona) return <BuscarPorZona proveedores={proveedores} onVolver={() => setPorZona(false)} onActivar={usarGps} />

  const alternarServicio = (s: Servicio) =>
    setFiltros((f) => ({ ...f, servicios: f.servicios.includes(s) ? f.servicios.filter((x) => x !== s) : [...f.servicios, s] }))

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 pb-10">
      <Encabezado
        titulo="Veterinarias"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={
          <BotonIcono
            icono="map"
            etiqueta="Ver en el mapa"
            onClick={() => window.open(`https://www.google.com/maps/search/veterinaria/@${ref.lat},${ref.lng},14z`, "_blank")}
          />
        }
      />
      <Busqueda valor={busqueda} onCambio={setBusqueda} placeholder="Veterinaria, servicio o zona" onFiltros={() => setVerFiltros(true)} filtrosActivos={conFiltros} />
      <div className="sin-barra-desplazamiento -mx-pantalla flex gap-2 overflow-x-auto px-pantalla">
        <Chip
          texto={ubicacion?.modo === "zona" ? ubicacion.zona : "Cerca de mí"}
          icono="near_me"
          activo={!!ubicacion}
          onClick={() => (ubicacion ? setPorZona(true) : setPidiendo(true))}
        />
        <Chip texto="Urgencias" icono="emergency" activo={filtros.servicios.includes("urgencias")} onClick={() => alternarServicio("urgencias")} />
        <Chip texto="Abierto" icono="schedule" activo={filtros.abierto} onClick={() => setFiltros((f) => ({ ...f, abierto: !f.abierto }))} />
        {filtros.servicios
          .filter((s) => s !== "urgencias")
          .map((s) => (
            <Chip key={s} texto={SERVICIOS.find((x) => x.slug === s)!.nombre} icono={SERVICIOS.find((x) => x.slug === s)!.icono} activo onClick={() => alternarServicio(s)} />
          ))}
        {filtros.distancia !== "5" && <Chip texto={`${filtros.distancia} km`} icono="near_me" activo onClick={() => setFiltros((f) => ({ ...f, distancia: "5" }))} />}
      </div>

      {resultados.length === 0 ? (
        <>
          <div className="pt-4">
            <Estado tono="error" icono="search_off" titulo="Nada cerca con esos filtros" mensaje='Prueba ampliando la distancia o quitando "abierto ahora".' />
          </div>
          {filtros.distancia !== "5" && (
            <button type="button" onClick={() => setFiltros((f) => ({ ...f, distancia: f.distancia === "1" ? "3" : "5" }))} className="self-center p-2 texto-etiqueta-fuerte text-primario">
              Ampliar a {filtros.distancia === "1" ? "3" : "5"} km
            </button>
          )}
          <BarraAccion>
            <Boton
              onClick={() => setFiltros((f) => ({ ...f, distancia: "5", abierto: false }))}
              className="px-2 texto-cuerpo-fuerte"
            >
              Ampliar la búsqueda
            </Boton>
            <Boton
              variante="secundario"
              onClick={() => {
                setFiltros({ servicios: [], distancia: "5", abierto: false })
              }}
            >
              Quitar filtros
            </Boton>
          </BarraAccion>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          {resultados.map(({ v, km, horario }) => (
            <FilaOpcion
              key={v.id}
              borde
              icono={iconoProveedor(v)}
              titulo={v.nombre}
              detalle={[v.calificacion && `★ ${v.calificacion.replace(".", ",")}`, textoKm(km), horario.texto, v.id === favorita && "De confianza"].filter(Boolean).join(" · ")}
              href={`/veterinarias/ficha?id=${v.id}${consulta}`}
            />
          ))}
        </div>
      )}

      {/* K1 · Buscador · permiso de ubicación (solo la primera vez) */}
      <Dialogo
        abierto={pidiendo || (ubicacion === null && primeraVez)}
        onCerrar={cerrarK1}
        icono="location_on"
        titulo="¿Usamos tu ubicación?"
        mensaje="Para mostrarte las veterinarias más cercanas. También puedes elegir la zona a mano."
      >
        <Boton
          onClick={() => {
            cerrarK1()
            usarGps()
          }}
        >
          Permitir
        </Boton>
        <Boton
          variante="secundario"
          onClick={() => {
            cerrarK1()
            setPorZona(true)
          }}
        >
          Elegir manualmente
        </Boton>
      </Dialogo>

      {/* K2 · Filtros de proveedores */}
      <Hoja abierta={verFiltros} onCerrar={() => setVerFiltros(false)} titulo="Filtrar">
        <HojaFiltros
          inicial={filtros}
          contar={(f) => aplicar(f).length}
          onAplicar={(f) => {
            setFiltros(f)
            setVerFiltros(false)
          }}
        />
      </Hoja>
    </main>
  )
}

function HojaFiltros({ inicial, contar, onAplicar }: { inicial: Filtros; contar: (f: Filtros) => number; onAplicar: (f: Filtros) => void }) {
  const [f, setF] = useState(inicial)
  const alternar = (s: Servicio) => setF((x) => ({ ...x, servicios: x.servicios.includes(s) ? x.servicios.filter((y) => y !== s) : [...x.servicios, s] }))
  return (
    <div className="flex flex-col gap-3.5">
      <span className="texto-micro text-texto-secundario">Tipo de servicio</span>
      <div className="flex flex-wrap gap-2">
        {SERVICIOS.filter((s) => s.slug !== "vacunacion" || f.servicios.includes("vacunacion")).map((s) => (
          <Chip key={s.slug} texto={s.nombre} icono={s.icono} activo={f.servicios.includes(s.slug)} onClick={() => alternar(s.slug)} />
        ))}
      </div>
      <span className="texto-micro text-texto-secundario">Distancia</span>
      <Selector
        etiqueta="Distancia"
        valor={f.distancia}
        onCambio={(d) => setF((x) => ({ ...x, distancia: d as Filtros["distancia"] }))}
        opciones={[
          { valor: "1", etiqueta: "1 km" },
          { valor: "3", etiqueta: "3 km" },
          { valor: "5", etiqueta: "5 km o más" },
        ]}
      />
      <div className="flex items-center justify-between rounded-md bg-superficie px-3.5 py-3">
        <span className="texto-cuerpo-fuerte text-texto">Abierto ahora</span>
        <Interruptor etiqueta="Abierto ahora" activo={f.abierto} onCambio={(a) => setF((x) => ({ ...x, abierto: a }))} />
      </div>
      <div className="mt-2 flex gap-2.5">
        <Boton variante="secundario" onClick={() => onAplicar({ servicios: [], distancia: "5", abierto: false })}>
          Limpiar
        </Boton>
        <Boton onClick={() => onAplicar(f)}>Ver {contar(f)}</Boton>
      </div>
    </div>
  )
}

/** K7 · Ubicación denegada: buscar por zona o dirección. */
function BuscarPorZona({ proveedores, onVolver, onActivar }: { proveedores: Veterinaria[]; onVolver: () => void; onActivar: () => void }) {
  const [zona, setZona] = useState("Chapinero, Bogotá")
  const cuenta = (z: string) => proveedores.filter((v) => v.tipo === "veterinaria" && distanciaKm(ZONAS[z], puntoDe(v)) <= 5).length

  function buscar(nombre: string) {
    const encontrada = Object.keys(ZONAS).find((z) => normalizar(nombre).includes(normalizar(z))) ?? "Chapinero"
    guardarUbicacion({ ...ZONAS[encontrada], modo: "zona", zona: encontrada })
    onVolver()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Veterinarias" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={onVolver} />} />
      <div className="pt-2">
        <Estado tono="error" icono="location_off" titulo="Sin acceso a tu ubicación" mensaje="No pasa nada: busca por zona y te mostramos lo que hay cerca." />
      </div>
      <Campo etiqueta="Zona o dirección" icono="location_on" valor={zona} onCambio={setZona} sugerencias={Object.keys(ZONAS).map((z) => `${z}, Bogotá`)} />
      <span className="texto-etiqueta-fuerte text-texto">Zonas frecuentes</span>
      {["Chapinero", "Usaquén"].map((z) => (
        <FilaOpcion key={z} icono="location_on" titulo={z} detalle={`${cuenta(z)} ${cuenta(z) === 1 ? "veterinaria" : "veterinarias"}`} onClick={() => buscar(z)} />
      ))}
      <Nota icono="settings">Puedes activar la ubicación cuando quieras desde Ajustes del celular.</Nota>
      <BarraAccion>
        <Boton onClick={() => buscar(zona)} className="px-2 texto-cuerpo-fuerte">
          Buscar por zona
        </Boton>
        <Boton variante="secundario" onClick={onActivar} className="px-2 texto-cuerpo-fuerte">
          Activar ubicación
        </Boton>
      </BarraAccion>
    </main>
  )
}
