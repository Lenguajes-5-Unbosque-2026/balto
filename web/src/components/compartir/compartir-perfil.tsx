"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { FotoMascota } from "@/components/foto-mascota"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { Pasos } from "@/components/pasos"
import { Selector } from "@/components/selector"
import {
  SECCIONES,
  TODAS,
  VENCIMIENTOS,
  expiraEn,
  nuevoToken,
  paginasPdf,
  textoSecciones,
  type Seccion,
} from "@/lib/compartir"
import { puedeVolver } from "@/lib/navegacion"
import type { Envio } from "@/lib/datos"
import { enMinuscula, type Evento } from "@/lib/eventos"
import { AHORA, HOY, fechaNumerica, fechaTarjeta, sumarDias } from "@/lib/fecha"
import { hora12 } from "@/lib/medicamentos"
import { detalleMascota, medicacionVigente, microchipLegible, nombreVacuna, ultimasVacunas, type PerfilMascota } from "@/lib/perfil"
import { guardarEnvio, useEnvios } from "@/lib/usar-envios"
import { useMascotaYEventos, useSalud } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

type CompartirProps = { mascotas: PerfilMascota[]; eventos: Evento[]; envios: Envio[] }

type Resultado = { canal: Envio["canal"]; destinatario?: string }

const SIN_CONDICIONES: never[] = []

/** Secciones marcadas al llegar desde F2 (carnet), F7 (examen) o sin contexto (L1 de Figma). */
function seccionesIniciales(contenido: string | null): Seccion[] {
  if (contenido === "vacunas") return ["identificacion", "vacunas"]
  if (contenido === "examen") return ["identificacion", "examenes"]
  return ["identificacion", "vacunas", "medicacion"]
}

/** L1 · Selector de contenido → L2 · Vista previa → L3 / L7 (enviado) o L4 · Enlace. */
export function CompartirPerfil({ mascotas, eventos: base, envios: enviosBase }: CompartirProps) {
  const router = useRouter()
  const parametros = useSearchParams()
  const { mascota, eventos } = useMascotaYEventos(mascotas, base)
  const envios = useEnvios(enviosBase)

  const [paso, setPaso] = useState<"contenido" | "previa" | "enlace" | "listo">("contenido")
  const [modo, setModo] = useState<"completo" | "filtrado">("filtrado")
  const [elegidas, setElegidas] = useState<Seccion[]>(() => seccionesIniciales(parametros.get("contenido")))
  const [desde, setDesde] = useState(sumarDias(HOY, -365))
  const [hasta, setHasta] = useState(HOY)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [enlace, setEnlace] = useState<{ id: string; token: string; vencimiento: Envio["vencimiento"] } | null>(null)
  const [pidiendoCorreo, setPidiendoCorreo] = useState(false)
  const [ayuda, setAyuda] = useState(false)

  const secciones = modo === "completo" ? TODAS : elegidas
  const rango = modo === "filtrado" ? { desde, hasta } : { desde: "", hasta: "" }

  function salir() {
    if (puedeVolver()) router.back()
    else router.push("/vista-rapida")
  }

  function alternar(s: Seccion) {
    setElegidas((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))
  }

  function registrar(canal: Envio["canal"], destinatario = "") {
    guardarEnvio(crypto.randomUUID(), {
      mascota_id: mascota.id,
      formato: "pdf",
      secciones: modo === "completo" ? "completo" : elegidas.join(";"),
      ...rango,
      canal,
      destinatario,
      token: "",
      vencimiento: "",
      expira_en: "",
      activo: "",
      visitas: "0",
      fecha: HOY,
    })
    setResultado({ canal, destinatario })
    setPaso("listo")
  }

  /** Imprimir, Guardar y "Generar y compartir PDF": el PDF sale del diálogo de impresión del navegador. */
  function abrirPdf(canal: Envio["canal"]) {
    const consulta = new URLSearchParams({ mascota: mascota.id, secciones: secciones.join(";"), ...rango })
    window.open(`/compartir/pdf?${consulta}`, "_blank")
    registrar(canal)
  }

  function crearEnlace() {
    const id = crypto.randomUUID()
    const token = nuevoToken()
    guardarEnvio(id, {
      mascota_id: mascota.id,
      formato: "enlace",
      secciones: modo === "completo" ? "completo" : elegidas.join(";"),
      ...rango,
      canal: "enlace",
      destinatario: "",
      token,
      vencimiento: "24_horas",
      expira_en: expiraEn("24_horas"),
      activo: "true",
      visitas: "0",
      fecha: HOY,
    })
    setEnlace({ id, token, vencimiento: "24_horas" })
    setPaso("enlace")
  }

  const url = enlace ? `${typeof window === "undefined" ? "" : window.location.origin}/p/${enlace.token}` : ""

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Enlace copiado")
    } catch {
      toast("No pudimos copiar el enlace", { description: url })
    }
  }

  async function compartirEnlace() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Perfil de salud de ${mascota.nombre}`, url })
        return
      } catch {
        // El dueño cerró el menú de compartir.
        return
      }
    }
    copiar()
  }

  const encabezado = (
    <Encabezado
      titulo="Compartir perfil"
      izquierda={
        <BotonIcono
          icono="arrow_back"
          etiqueta="Volver"
          onClick={() => (paso === "contenido" ? salir() : setPaso(paso === "enlace" ? "previa" : "contenido"))}
        />
      }
      derecha={<BotonIcono icono="help" etiqueta="Ayuda" onClick={() => setAyuda(true)} />}
    />
  )

  const hojaAyuda = (
    <Hoja abierta={ayuda} onCerrar={() => setAyuda(false)} titulo="¿PDF o enlace?">
      <div className="flex flex-col gap-3">
        <FilaOpcion borde icono="picture_as_pdf" titulo="PDF" detalle="Un archivo con lo que elegiste, como está hoy." derecha={<span />} />
        <FilaOpcion borde icono="link" titulo="Enlace" detalle="Siempre muestra los datos actuales y vence cuando digas." derecha={<span />} />
        <Nota icono="lock">Quien lo recibe solo ve lo que seleccionaste. No necesita cuenta ni la app. Las alergias siempre se incluyen.</Nota>
        <Boton onClick={() => setAyuda(false)}>Entendido</Boton>
      </div>
    </Hoja>
  )

  if (paso === "listo" && resultado) {
    const correo = resultado.canal === "correo"
    const delMes = envios.filter((e) => e.mascota_id === mascota.id && e.fecha.slice(0, 7) === HOY.slice(0, 7)).length
    const archivo = `${mascota.nombre}_perfil_salud.pdf · ${paginasPdf(secciones)} ${paginasPdf(secciones) === 1 ? "página" : "páginas"}`
    const canales: Record<string, [string, string]> = {
      whatsapp: ["chat", "Enviado por WhatsApp"],
      correo: ["mail", "Enviado por correo"],
      imprimir: ["print", "Enviado a imprimir"],
      guardar: ["download", "Guardado en el teléfono"],
      compartir: ["ios_share", "Compartido"],
    }
    const [icono, titulo] = canales[resultado.canal] ?? canales.compartir
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Compartir perfil" derecha={<BotonIcono icono="close" etiqueta="Cerrar" onClick={salir} />} />
        <Pasos paso={3} total={3} nombre="Enviado" />
        <div className="pt-4">
          <Estado tono="exito" icono={correo ? "mark_email_read" : "check_circle"} titulo={correo ? "Reporte enviado" : "Reporte listo"} mensaje={archivo} />
        </div>
        <FilaOpcion
          icono={icono}
          titulo={titulo}
          detalle={correo ? `A ${resultado.destinatario} · hoy ${AHORA}` : `Hoy, ${hora12(AHORA)}`}
          derecha={correo ? undefined : <Icono nombre="check_circle" className="icono-m text-texto-secundario" />}
          href={correo ? "/compartir/historial" : undefined}
        />
        {correo && (
          <FilaOpcion icono="history" titulo="Ver qué compartí" detalle={`${delMes} ${delMes === 1 ? "envío" : "envíos"} este mes`} href="/compartir/historial" />
        )}
        <Nota icono="lock">Quien lo recibe no necesita cuenta ni la app.</Nota>
        <BarraAccion>
          {correo ? (
            <>
              <Boton onClick={() => router.push("/vista-rapida")} className="px-2 texto-cuerpo-fuerte">
                Volver al perfil
              </Boton>
              <Boton variante="secundario" onClick={() => setPaso("previa")} className="px-2 texto-cuerpo-fuerte">
                Enviar a alguien más
              </Boton>
            </>
          ) : (
            <Boton onClick={salir}>
              Listo
              <Icono nombre="check" className="icono-m" />
            </Boton>
          )}
        </BarraAccion>
      </main>
    )
  }

  if (paso === "enlace" && enlace) {
    const cambiarVencimiento = (v: Envio["vencimiento"]) => {
      guardarEnvio(enlace.id, { vencimiento: v, expira_en: expiraEn(v) })
      setEnlace({ ...enlace, vencimiento: v })
    }
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado}
        <Pasos paso={2} total={3} nombre="Enlace" />
        <p className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="texto-micro text-texto-secundario">Solo lectura</span>
          <span className="truncate texto-etiqueta-fuerte text-primario">Incluye: {enMinuscula(textoSecciones(secciones))}</span>
        </p>
        <h2 className="texto-cuerpo-fuerte text-texto">¿Hasta cuándo sirve?</h2>
        <div className="sin-barra-desplazamiento -mx-pantalla flex gap-2 overflow-x-auto px-pantalla">
          {VENCIMIENTOS.map((v) => (
            <Chip key={v.valor} texto={v.etiqueta} icono={v.icono} activo={enlace.vencimiento === v.valor} onClick={() => cambiarVencimiento(v.valor)} />
          ))}
        </div>
        <FilaOpcion
          icono="content_copy"
          titulo="Copiar enlace"
          detalle={<span className="break-all whitespace-normal">{url.replace(/^https?:\/\//, "")}</span>}
          derecha={<Icono nombre="content_copy" className="icono-m text-texto-secundario" />}
          onClick={copiar}
        />
        <FilaOpcion icono="visibility" titulo="Ver cómo lo verá el veterinario" detalle="Vista previa" href={`/p/${enlace.token}?vista=previa`} />
        {enlace.vencimiento === "sin_vencimiento" ? (
          <Nota tono="error" icono="warning">
            Cualquiera con el enlace podrá verlo hasta que lo desactives.
          </Nota>
        ) : (
          <Nota icono="lock">Quien lo abra ve solo lo que seleccionaste. No necesita cuenta ni la app.</Nota>
        )}
        <BarraAccion>
          <Boton onClick={compartirEnlace} className="px-2 texto-cuerpo-fuerte">
            Compartir enlace
          </Boton>
          <Boton variante="secundario" onClick={() => router.push(`/p/${enlace.token}?vista=previa`)} className="px-2 texto-cuerpo-fuerte">
            Ver vista previa
          </Boton>
        </BarraAccion>
        {hojaAyuda}
      </main>
    )
  }

  if (paso === "previa") {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado}
        <Pasos paso={2} total={3} nombre="Vista previa" />
        {/* Los chips muestran lo elegido; tocarlos vuelve a L1. */}
        <div className="sin-barra-desplazamiento -mx-pantalla flex gap-2 overflow-x-auto px-pantalla">
          <Chip texto={modo === "completo" ? "Perfil completo" : "Filtrado"} icono="description" activo onClick={() => setPaso("contenido")} />
          <Chip
            texto={modo === "completo" ? "Todo el historial" : `${fechaNumerica(desde)} – ${fechaNumerica(hasta)}`}
            icono="calendar_month"
            onClick={() => setPaso("contenido")}
          />
          <Chip texto="Editar" icono="tune" onClick={() => setPaso("contenido")} />
        </div>

        <PaginaPdf mascota={mascota} eventos={eventos} paginas={paginasPdf(secciones)} />

        <div className="grid grid-cols-5 gap-1">
          <Canal icono="chat" texto="WhatsApp" onClick={() => registrar("whatsapp")} />
          <Canal icono="mail" texto="Correo" onClick={() => setPidiendoCorreo(true)} />
          <Canal icono="print" texto="Imprimir" onClick={() => abrirPdf("imprimir")} />
          <Canal icono="download" texto="Guardar" onClick={() => abrirPdf("guardar")} />
          <Canal icono="link" texto="Enlace" onClick={crearEnlace} />
        </div>
        <Nota icono="lock">Quien lo recibe no necesita cuenta ni la app</Nota>

        <BarraAccion>
          <Boton onClick={() => abrirPdf("compartir")}>
            Generar y compartir PDF
            <Icono nombre="ios_share" className="icono-m" />
          </Boton>
        </BarraAccion>

        <Hoja abierta={pidiendoCorreo} onCerrar={() => setPidiendoCorreo(false)} titulo="Enviar por correo">
          <FormularioCorreo
            onEnviar={(correo) => {
              setPidiendoCorreo(false)
              registrar("correo", correo)
            }}
          />
        </Hoja>
        {hojaAyuda}
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      {encabezado}
      <Pasos paso={1} total={3} nombre="Contenido" />
      <Selector
        etiqueta="Contenido"
        valor={modo}
        onCambio={(v) => setModo(v as typeof modo)}
        opciones={[
          { valor: "completo", etiqueta: "Perfil completo" },
          { valor: "filtrado", etiqueta: "Filtrado" },
        ]}
      />
      <span className="texto-micro text-texto-secundario">Incluir</span>
      <div className="flex flex-col gap-2.5">
        {SECCIONES.map((s) => {
          const marcada = secciones.includes(s.slug)
          return (
            <button
              key={s.slug}
              type="button"
              role="checkbox"
              aria-checked={marcada}
              disabled={modo === "completo"}
              onClick={() => alternar(s.slug)}
              className={cn(
                "flex min-h-16 items-center gap-3.5 rounded-md border bg-superficie px-3.5 py-3 text-left transition-colors disabled:opacity-100",
                marcada ? "border-primario" : "border-borde-fuerte",
              )}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
                <Icono nombre={s.icono} className="icono-m" />
              </span>
              <span className="min-w-0 flex-1 texto-cuerpo-fuerte text-texto">{s.nombre}</span>
              <Icono nombre={marcada ? "check_box" : "check_box_outline_blank"} className={cn("icono-m", marcada ? "text-primario" : "text-texto-secundario")} />
            </button>
          )
        })}
      </div>
      {modo === "filtrado" && (
        <div className="grid movil-m:grid-cols-2 gap-3">
          <Campo etiqueta="Desde" type="date" valor={desde} onCambio={setDesde} />
          <Campo etiqueta="Hasta" type="date" valor={hasta} onCambio={setHasta} />
        </div>
      )}
      <BarraAccion>
        <Boton disabled={secciones.length === 0} onClick={() => setPaso("previa")}>
          Ver vista previa
          <Icono nombre="arrow_forward" className="icono-m" />
        </Boton>
      </BarraAccion>
      {hojaAyuda}
    </main>
  )
}

function Canal({ icono, texto, onClick }: { icono: string; texto: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5">
      <span className="grid size-13 place-items-center rounded-completo bg-acento-suave text-primario movil-m:size-14">
        <Icono nombre={icono} className="icono-m" />
      </span>
      <span className="texto-etiqueta text-texto">{texto}</span>
    </button>
  )
}

/** Primera página del PDF en miniatura (L2). */
function PaginaPdf({ mascota, eventos, paginas }: { mascota: PerfilMascota; eventos: Evento[]; paginas: number }) {
  const { alergias } = useSalud(mascota, SIN_CONDICIONES)
  const medicacion = medicacionVigente(eventos)
  const vacunas = ultimasVacunas(eventos).slice(0, 2)
  return (
    <div className="rounded-xl bg-acento-suave p-5 movil-m:px-6">
      <div className="flex flex-col gap-3 rounded-md bg-superficie p-4 shadow-tarjeta">
        <div className="flex items-center gap-2 border-b border-borde pb-2.5">
          <span className="grid size-6 place-items-center rounded-completo bg-primario text-superficie">
            <Icono nombre="pets" className="icono-xs" />
          </span>
          <span className="flex-1 texto-etiqueta-fuerte text-texto">Perfil de salud</span>
          <span className="texto-micro text-texto-secundario">{fechaTarjeta(HOY)}</span>
        </div>
        <div className="flex items-center gap-3">
          <FotoMascota nombre={mascota.nombre} imagen={mascota.imagen} className="size-16" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate texto-titulo-seccion font-semibold text-texto">{mascota.nombre}</span>
            <span className="texto-micro normal-case text-texto-secundario">{detalleMascota(mascota)}</span>
            {mascota.microchip && <span className="texto-micro normal-case text-primario">Microchip {microchipLegible(mascota.microchip)}</span>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Recuadro titulo="Alergias" valor={alergias.length ? alergias.slice(0, 2).join(", ") : "Ninguna"} />
          <Recuadro titulo="Medicación" valor={medicacion[0]?.nombre ?? "Ninguna"} />
        </div>
        {vacunas.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="texto-micro text-texto-secundario">Últimas vacunas</span>
            {vacunas.map((v) => (
              <div key={v.id} className="flex justify-between texto-etiqueta">
                <span className="text-texto">{nombreVacuna(v)}</span>
                <span className="text-texto-secundario">{fechaNumerica(v.fecha)}</span>
              </div>
            ))}
          </div>
        )}
        <span className="text-center texto-micro normal-case text-texto-secundario">Página 1 de {paginas}</span>
      </div>
    </div>
  )
}

function Recuadro({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-sm bg-fondo p-2.5">
      <span className="texto-micro text-texto-secundario">{titulo}</span>
      <span className="line-clamp-2 texto-etiqueta-fuerte text-texto">{valor}</span>
    </div>
  )
}

function FormularioCorreo({ onEnviar }: { onEnviar: (correo: string) => void }) {
  const [correo, setCorreo] = useState("")
  const [error, setError] = useState(false)
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) setError(true)
        else onEnviar(correo.trim())
      }}
    >
      <Campo
        etiqueta="Correo del destinatario"
        type="email"
        icono="mail"
        placeholder="veterinaria@correo.com"
        autoComplete="email"
        valor={correo}
        onCambio={(v) => {
          setCorreo(v)
          setError(false)
        }}
      />
      {error && <span className="-mt-1 texto-etiqueta text-error">Revisa el correo: parece incompleto.</span>}
      <Boton type="submit" disabled={!correo.trim()}>
        Enviar
        <Icono nombre="send" className="icono-m" />
      </Boton>
    </form>
  )
}
