"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { ReglasClave } from "@/components/acceso/comunes"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { puedeVolver } from "@/lib/navegacion"
import { cambiarClave, correoValido, reglasClave } from "@/lib/acceso"

type Paso = "correo" | "enviado" | "nueva" | "lista" | "vencido"

/** A8 · Recuperar contraseña → A14 · Enlace enviado → A9 · Crear contraseña nueva → A15; A16 si el enlace venció (?enlace=vencido). */
export function Recuperar() {
  const router = useRouter()
  const [paso, setPaso] = useState<Paso>(useSearchParams().get("enlace") === "vencido" ? "vencido" : "correo")
  const [correo, setCorreo] = useState("")
  const [clave, setClave] = useState("")
  const [confirmar, setConfirmar] = useState("")

  const volver = () => (paso === "correo" ? (puedeVolver() ? router.back() : router.push("/ingresar")) : setPaso("correo"))
  const encabezado = (titulo: string) => <Encabezado titulo={titulo} izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />

  if (paso === "vencido") {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado("Recuperar contraseña")}
        <div className="pt-4">
          <Estado tono="error" icono="link_off" titulo="Este enlace ya venció" mensaje="Por seguridad los enlaces duran 30 minutos. Pide uno nuevo." />
        </div>
        <BarraAccion>
          <Boton onClick={() => setPaso("correo")} className="px-2 texto-cuerpo-fuerte">
            Pedir enlace nuevo
          </Boton>
          <BotonEnlace href="/ingresar" variante="secundario">
            Iniciar sesión
          </BotonEnlace>
        </BarraAccion>
      </main>
    )
  }

  if (paso === "lista") {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Contraseña" derecha={<BotonIconoEnlace href="/ingresar" icono="close" etiqueta="Cerrar" />} />
        <div className="pt-4">
          <Estado tono="exito" icono="check_circle" titulo="Contraseña actualizada" mensaje="Ya puedes entrar con tu nueva contraseña. Cerramos las otras sesiones abiertas." />
        </div>
        <Nota icono="help">Si no fuiste tú, escríbenos desde Ayuda.</Nota>
        <BarraAccion>
          <BotonEnlace href="/ingresar">Iniciar sesión</BotonEnlace>
        </BarraAccion>
      </main>
    )
  }

  if (paso === "nueva") {
    const ok = reglasClave(clave).every((r) => r.ok) && clave === confirmar
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado("Nueva contraseña")}
        <h1 className="texto-titulo-pantalla text-texto">Crea tu nueva contraseña</h1>
        <p className="-mt-2 texto-cuerpo text-texto-secundario">Usa al menos 8 caracteres, una mayúscula y un número.</p>
        <Campo etiqueta="Nueva contraseña" type="password" icono="lock" autoComplete="new-password" valor={clave} onCambio={setClave} />
        <Campo etiqueta="Confirmar contraseña" type="password" icono="lock" autoComplete="new-password" valor={confirmar} onCambio={setConfirmar} />
        {confirmar && clave !== confirmar && <span className="-mt-2 texto-etiqueta text-error">Las contraseñas no coinciden.</span>}
        <ReglasClave clave={clave} />
        <BarraAccion>
          <Boton
            disabled={!ok}
            onClick={async () => {
              await cambiarClave(correo, clave)
              setPaso("lista")
            }}
          >
            Guardar contraseña
            <Icono nombre="check" className="icono-m" />
          </Boton>
        </BarraAccion>
      </main>
    )
  }

  if (paso === "enviado") {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado("Recuperar contraseña")}
        <div className="pt-4">
          <Estado tono="exito" icono="forward_to_inbox" titulo="Revisa tu correo" mensaje={`Si ${correo.trim()} tiene cuenta, le enviamos un enlace para crear una contraseña nueva.`} />
        </div>
        <Nota icono="schedule">El enlace vence en 30 minutos.</Nota>
        <button
          type="button"
          onClick={() => toast("Te lo enviamos otra vez", { description: "Revisa también la carpeta de spam." })}
          className="self-center p-2 texto-etiqueta-fuerte text-primario"
        >
          No me llegó el correo
        </button>
        <BarraAccion>
          {/* Sin servidor de correo, "Ya tengo el enlace" abre directamente A9. */}
          <Boton onClick={() => setPaso("nueva")} className="px-2 texto-cuerpo-fuerte">
            Ya tengo el enlace
          </Boton>
          <BotonEnlace href="/ingresar" variante="secundario">
            Iniciar sesión
          </BotonEnlace>
        </BarraAccion>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      {encabezado("Recuperar contraseña")}
      <div className="pt-4">
        <Estado icono="lock_reset" titulo="¿Olvidaste tu contraseña?" mensaje="Escribe tu correo y te enviaremos un enlace para crear una nueva." />
      </div>
      <Campo etiqueta="Correo electrónico" type="email" icono="mail" autoComplete="email" valor={correo} onCambio={setCorreo} />
      {correo && !correoValido(correo) && <span className="-mt-2 texto-etiqueta text-error">Revisa el correo.</span>}
      <Nota tono="exito" icono="mark_email_read">
        Si el correo está registrado, el enlace llega en unos minutos.
      </Nota>
      <BarraAccion>
        <Boton disabled={!correoValido(correo)} onClick={() => setPaso("enviado")}>
          Enviar enlace
          <Icono nombre="send" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}
