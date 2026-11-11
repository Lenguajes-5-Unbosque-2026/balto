"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { OpcionCasilla } from "@/components/opcion-casilla"
import type { Evento } from "@/lib/eventos"
import { AHORA, hoy, nombreMes, normalizarNombreArchivo, sumarDias } from "@/lib/fecha"
import { GRUPOS_HABITO, paginasBitacora, textoRango, type GrupoHabito, type Habito } from "@/lib/habitos"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { hora12 } from "@/lib/medicamentos"
import { useBitacora } from "@/lib/usar-habitos"
import { useVolver } from "@/lib/usar-salud"

type ExportarProps = { mascotas: { id: string; nombre: string }[]; habitos: Habito[]; eventos: Evento[] }

const CANALES = { whatsapp: ["chat", "Enviado por WhatsApp"], correo: ["mail", "Enviado por correo"], imprimir: ["print", "Enviado a imprimir"], guardar: ["download", "Guardado en el celular"], compartir: ["ios_share", "Compartido"] } as const

type Canal = keyof typeof CANALES

/** I3 · Exportar bitácora → I4 · Vista previa → I5 · Bitácora enviada. */
export function ExportarBitacora({ mascotas, habitos, eventos }: ExportarProps) {
  const router = useRouter()
  const volver = useVolver("/habitos")
  const [mascota] = useMascotaActiva(mascotas)
  const registros = useBitacora(habitos, eventos, mascota.id)
  const [paso, setPaso] = useState<"contenido" | "previa" | "listo">("contenido")
  const [grupos, setGrupos] = useState<GrupoHabito[]>(["paseos", "sueno", "atipico"])
  const [desde, setDesde] = useState(sumarDias(hoy(), -60))
  const [hasta, setHasta] = useState(hoy())
  const [para, setPara] = useState<"veterinario" | "etologo">("veterinario")
  const [canal, setCanal] = useState<Canal>("whatsapp")

  const tipos = GRUPOS_HABITO.filter((g) => grupos.includes(g.slug)).flatMap((g) => g.tipos as readonly string[])
  const incluidos = registros.filter((r) => tipos.includes(r.tipo) && r.fecha >= desde && r.fecha <= hasta)
  const paginas = paginasBitacora(incluidos.length)
  const archivo = `${normalizarNombreArchivo(mascota.nombre).replace(/^./, (c) => c.toUpperCase())}_habitos_${nombreMes(hasta).slice(0, 3)}.pdf`

  function abrirPdf() {
    const consulta = new URLSearchParams({ mascota: mascota.id, grupos: grupos.join(";"), desde, hasta, para })
    window.open(`/habitos/pdf?${consulta}`, "_blank")
  }

  function enviar(c: Canal) {
    if (c === "imprimir" || c === "guardar" || c === "compartir") abrirPdf()
    setCanal(c)
    setPaso("listo")
  }

  if (paso === "listo") {
    const [icono, titulo] = CANALES[canal]
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Exportar bitácora" derecha={<BotonIcono icono="close" etiqueta="Cerrar" onClick={() => router.push("/habitos")} />} />
        <div className="pt-4">
          <Estado tono="exito" icono="check_circle" titulo="Bitácora lista" mensaje={`${archivo} · ${paginas} páginas`} />
        </div>
        <FilaOpcion icono={icono} titulo={titulo} detalle={`Hoy, ${hora12(AHORA)}`} />
        <FilaOpcion icono="download" titulo="Guardar una copia" detalle="En tu celular" derecha={<Icono nombre="download" className="icono-m text-texto-secundario" />} onClick={abrirPdf} />
        <Nota>Puedes volver a generarla cuando quieras.</Nota>
        <BarraAccion>
          <Boton onClick={() => router.push("/habitos")} className="px-2 texto-cuerpo-fuerte">
            Volver a hábitos
          </Boton>
          <Boton variante="secundario" onClick={() => setPaso("previa")} className="px-2 texto-cuerpo-fuerte">
            Enviar a alguien más
          </Boton>
        </BarraAccion>
      </main>
    )
  }

  if (paso === "previa") {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Exportar bitácora" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => setPaso("contenido")} />} />
        <div className="sin-barra-desplazamiento -mx-pantalla flex gap-2 overflow-x-auto px-pantalla">
          {GRUPOS_HABITO.filter((g) => grupos.includes(g.slug)).map((g) => (
            <Chip key={g.slug} texto={g.slug === "atipico" ? "Atípico" : g.nombre} icono={g.icono} activo onClick={() => setPaso("contenido")} />
          ))}
        </div>
        <button
          type="button"
          onClick={abrirPdf}
          className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg bg-acento-suave text-texto-secundario"
        >
          <Icono nombre="picture_as_pdf" className="icono-xl text-primario" />
          <span className="texto-etiqueta">
            Vista previa del PDF · {paginas} páginas
          </span>
        </button>
        <p className="texto-etiqueta-fuerte text-texto">
          {para === "etologo" ? "Comportamiento" : "Hábitos"} de {mascota.nombre} · {textoRango(desde, hasta)}
        </p>
        <div className="grid grid-cols-4 gap-2">
          <CanalBoton icono="chat" texto="WhatsApp" onClick={() => enviar("whatsapp")} />
          <CanalBoton icono="mail" texto="Correo" onClick={() => enviar("correo")} />
          <CanalBoton icono="print" texto="Imprimir" onClick={() => enviar("imprimir")} />
          <CanalBoton icono="download" texto="Guardar" onClick={() => enviar("guardar")} />
        </div>
        <Nota icono="lock">Quien lo recibe no necesita cuenta ni la app.</Nota>
        <BarraAccion>
          <Boton onClick={() => enviar("compartir")}>Enviar</Boton>
        </BarraAccion>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Exportar bitácora" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <h1 className="texto-titulo-pantalla text-texto">¿Qué quieres llevar a la consulta?</h1>
      <div className="flex flex-col gap-2.5">
        {GRUPOS_HABITO.filter((g) => g.slug !== "alimentacion").map((g) => (
          <OpcionCasilla
            key={g.slug}
            icono={g.icono}
            titulo={g.largo}
            marcada={grupos.includes(g.slug)}
            onCambio={() => setGrupos((x) => (x.includes(g.slug) ? x.filter((y) => y !== g.slug) : [...x, g.slug]))}
          />
        ))}
      </div>
      <div className="grid movil-m:grid-cols-2 gap-3">
        <Campo etiqueta="Desde" type="date" valor={desde} onCambio={setDesde} />
        <Campo etiqueta="Hasta" type="date" valor={hasta} onCambio={setHasta} />
      </div>
      <span className="texto-micro text-texto-secundario">Para</span>
      <div className="flex gap-2">
        <Chip texto="Veterinario" icono="stethoscope" activo={para === "veterinario"} onClick={() => setPara("veterinario")} />
        <Chip texto="Etólogo" icono="psychology" activo={para === "etologo"} onClick={() => setPara("etologo")} />
      </div>
      <BarraAccion>
        <Boton disabled={grupos.length === 0} onClick={() => setPaso("previa")}>
          Generar PDF
          <Icono nombre="picture_as_pdf" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}

function CanalBoton({ icono, texto, onClick }: { icono: string; texto: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5">
      <span className="grid size-14 place-items-center rounded-md bg-acento-suave text-primario">
        <Icono nombre={icono} className="icono-m" />
      </span>
      <span className="texto-etiqueta text-texto-secundario">{texto}</span>
    </button>
  )
}
