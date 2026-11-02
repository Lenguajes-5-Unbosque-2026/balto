"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { OpcionRadio } from "@/components/opcion-radio"
import { puedeVolver } from "@/lib/navegacion"
import { guardarEnMapa } from "@/lib/almacen-local"
import { useEnLinea, usePendientes } from "@/lib/conexion"
import { guardarPreferencia } from "@/lib/usar-cuenta"
import { useVolver } from "@/lib/usar-salud"

/** O2 · Sin conexión. */
export function SinConexion() {
  const router = useRouter()
  const volver = useVolver("/")
  const enLinea = useEnLinea()
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Sin conexión" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <div className="pt-2">
        <Estado tono="error" icono="cloud_off" titulo="No hay internet" mensaje="Puedes consultar todo lo que ya estaba descargado. Lo que registres se sube cuando vuelva el internet." />
      </div>
      <FilaOpcion icono="visibility" titulo="Ver perfiles y línea de tiempo" detalle="Disponible sin conexión" href="/linea-de-tiempo" />
      <FilaOpcion icono="cloud_upload" titulo="Subir soportes" detalle="Se suben cuando vuelva el internet" derecha={<Icono nombre="lock" className="icono-m text-texto-secundario" />} />
      <BarraAccion>
        <Boton
          onClick={() => {
            if (!navigator.onLine) toast("Todavía no hay internet")
            else if (puedeVolver()) router.back()
            else router.push("/")
          }}
        >
          Reintentar
        </Boton>
        <Boton variante="secundario" onClick={volver} className="px-2 texto-cuerpo-fuerte">
          {enLinea ? "Volver" : "Seguir sin conexión"}
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** O3 · Guardado pendiente: lo registrado sin conexión. */
export function GuardadoPendiente() {
  const volver = useVolver("/")
  const pendientes = Object.entries(usePendientes())
  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
      <Encabezado titulo="Pendientes" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      {pendientes.length === 0 ? (
        <div className="pt-6">
          <Estado tono="exito" icono="cloud_done" titulo="Todo está guardado" mensaje="No hay cambios pendientes de subir." />
        </div>
      ) : (
        <>
          <h1 className="texto-titulo-tarjeta text-texto">Se suben solos cuando vuelva el internet</h1>
          {pendientes.map(([id, p]) => (
            <FilaOpcion
              key={id}
              icono={p.icono}
              titulo={p.titulo}
              detalle={p.detalle}
              href={p.eventoId ? `/evento?id=${p.eventoId}` : undefined}
              derecha={<Icono nombre="schedule" className="icono-m text-texto-secundario" />}
            />
          ))}
          <Nota tono="error" icono="warning">
            Si cierras sesión ahora, perderás estos cambios.
          </Nota>
        </>
      )}
      <BarraAccion>
        <Boton onClick={() => toast(navigator.onLine ? "Subiendo cambios…" : "Todavía no hay internet")} className="px-2 texto-cuerpo-fuerte">
          Intentar subir ahora
        </Boton>
        <Boton variante="secundario" onClick={volver}>
          Más tarde
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** O8 · No se pudo guardar: el evento quedó en el celular (/no-se-pudo-guardar?evento=…&titulo=…). */
export function NoSePudoGuardar() {
  const router = useRouter()
  const p = useSearchParams()
  const evento = p.get("evento")
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Registrar evento" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => router.push("/")} />} />
      <div className="pt-2">
        <Estado tono="error" icono="sync_problem" titulo="No pudimos guardar" mensaje="Se perdió la conexión mientras subíamos el evento. No se borró nada." />
      </div>
      <FilaOpcion icono={p.get("icono") ?? "event"} titulo={p.get("titulo") ?? "Evento"} detalle="Guardado en el celular" derecha={<Icono nombre="schedule" className="icono-m text-texto-secundario" />} />
      <Nota icono="sync">Lo reintentamos solos cuando vuelva el internet.</Nota>
      <BarraAccion>
        <Boton
          onClick={() => {
            if (navigator.onLine) router.replace(`/registrar/guardado?id=${evento}`)
            else toast("Todavía no hay internet")
          }}
        >
          Reintentar
        </Boton>
        <Boton variante="secundario" onClick={() => router.push("/")} className="px-2 texto-cuerpo-fuerte">
          Guardar y salir
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** O5 · Permiso de notificaciones (/permisos/notificaciones?siguiente=/). */
export function PermisoNotificaciones() {
  const router = useRouter()
  const siguiente = useSearchParams().get("siguiente") ?? "/"
  const bloqueado = typeof Notification !== "undefined" && Notification.permission === "denied"

  async function activar() {
    const r = typeof Notification === "undefined" ? "denied" : await Notification.requestPermission()
    if (r === "granted") {
      for (const tipo of ["vacunas_desparasitaciones", "tomas", "citas"]) guardarPreferencia(tipo, { activo: "true" })
      toast.success("Avisos activados")
    } else {
      toast("El navegador no dio el permiso", { description: "Puedes activarlo desde el candado de la barra de direcciones." })
    }
    router.replace(siguiente)
  }

  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
      <Encabezado titulo="Notificaciones" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => router.replace(siguiente)} />} />
      <div className="pt-2">
        <Estado icono="notifications_active" titulo="¿Te avisamos lo importante?" mensaje="Vacunas por vencer, dosis de medicamentos y citas. Tú eliges qué recibir." />
      </div>
      <FilaOpcion icono="vaccines" titulo="Vacunas y desparasitaciones" detalle="7 días antes" derecha={<span />} />
      <FilaOpcion icono="medication" titulo="Tomas de medicamentos" detalle="10 min antes" derecha={<span />} />
      <FilaOpcion icono="event" titulo="Citas" detalle="1 día antes" derecha={<span />} />
      {bloqueado && (
        <Nota tono="error" icono="block">
          Tu navegador bloqueó los avisos. Actívalos desde el candado de la barra de direcciones › Notificaciones.
        </Nota>
      )}
      <BarraAccion>
        <Boton onClick={activar}>Activar avisos</Boton>
        <Boton
          variante="secundario"
          onClick={() => {
            // No se vuelve a mostrar sola antes de 7 días.
            guardarEnMapa("balto:o5", "ultima", { fecha: Date.now() })
            router.replace(siguiente)
          }}
        >
          Ahora no
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** O6 · Permiso de cámara. */
export function PermisoCamara() {
  const volver = useVolver("/ajustes/ayuda")
  const archivo = useRef<HTMLInputElement>(null)

  async function permitir() {
    try {
      const flujo = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      for (const pista of flujo.getTracks()) pista.stop()
      toast.success("Cámara lista")
      volver()
    } catch {
      toast("No tenemos acceso a la cámara", { description: "Actívala en los ajustes del navegador o sube un archivo." })
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Cámara" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <div className="pt-2">
        <Estado icono="photo_camera" titulo="Necesitamos la cámara" mensaje="Para tomar fotos del carnet, exámenes y fórmulas de tu mascota." />
      </div>
      <Nota icono="lock">Solo usamos la cámara cuando tú abres esta pantalla.</Nota>
      <FilaOpcion icono="upload_file" titulo="Subir un archivo que ya tengas" detalle="Sin usar la cámara" onClick={() => archivo.current?.click()} />
      <input ref={archivo} type="file" accept="image/jpeg,image/png,application/pdf" hidden onChange={() => toast.success("Archivo listo para adjuntar")} />
      <BarraAccion>
        <Boton onClick={permitir} className="px-2 texto-cuerpo-fuerte">
          Permitir cámara
        </Boton>
        <Boton variante="secundario" onClick={() => archivo.current?.click()}>
          Subir archivo
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** O7 · Permiso de fotos. */
export function PermisoFotos() {
  const volver = useVolver("/ajustes/ayuda")
  const [alcance, setAlcance] = useState<"elegidas" | "todas">("elegidas")
  const galeria = useRef<HTMLInputElement>(null)
  const camara = useRef<HTMLInputElement>(null)
  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
      <Encabezado titulo="Fotos" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <div className="pt-2">
        <Estado icono="photo_library" titulo="Acceso a tus fotos" mensaje="Para adjuntar el carnet, exámenes o fórmulas que ya tienes en el celular." />
      </div>
      <div role="radiogroup" className="flex flex-col gap-3">
        <OpcionRadio icono="photo" titulo="Solo las fotos que elijas" detalle="Recomendado" activa={alcance === "elegidas"} onElegir={() => setAlcance("elegidas")} />
        <OpcionRadio icono="photo_library" titulo="Toda la galería" activa={alcance === "todas"} onElegir={() => setAlcance("todas")} />
      </div>
      <Nota icono="settings">En el navegador siempre eliges foto por foto. Puedes cambiar el acceso desde los ajustes del celular.</Nota>
      <input ref={galeria} type="file" accept="image/jpeg,image/png" multiple hidden onChange={(e) => toast.success(`${e.target.files?.length ?? 0} fotos listas para adjuntar`)} />
      <input ref={camara} type="file" accept="image/*" capture="environment" hidden onChange={() => toast.success("Foto lista para adjuntar")} />
      <BarraAccion>
        <Boton onClick={() => galeria.current?.click()}>Elegir fotos</Boton>
        <Boton variante="secundario" onClick={() => camara.current?.click()} className="px-2 texto-cuerpo-fuerte">
          Tomar una foto
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** O9 · Algo salió mal (también es la pantalla de error de la app). */
export function AlgoSalioMal({ codigo = "BAL-500", onReintentar }: { codigo?: string; onReintentar?: () => void }) {
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Balto" derecha={<BotonIconoEnlace href="/" icono="close" etiqueta="Ir a Inicio" />} />
      <div className="pt-2">
        <Estado tono="error" icono="error" titulo="Algo salió mal" mensaje="Tuvimos un problema inesperado. Tus datos están a salvo." />
      </div>
      <Nota icono="bug_report">Código del error: {codigo}. Si vuelve a pasar, mándanoslo desde Ayuda.</Nota>
      <BarraAccion>
        <Boton onClick={onReintentar ?? (() => window.location.reload())}>Reintentar</Boton>
        <BotonEnlace href={`/ajustes/escribenos?tema=problema&codigo=${codigo}`} variante="secundario">
          Ir a Ayuda
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}
