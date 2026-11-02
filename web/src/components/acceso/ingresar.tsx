"use client"

import { BotonVolver } from "@/components/boton-volver"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent, type ReactNode } from "react"
import { toast } from "sonner"

import { Boton, BotonEnlace } from "@/components/boton"
import { Logo } from "@/components/acceso/comunes"
import { Icono } from "@/components/icono"
import { Label } from "@/components/ui/label"
import { correoValido, iniciarSesion } from "@/lib/acceso"
import { cn } from "@/lib/utils"

/** A6 · Inicio de sesión y A7 · Error de credenciales. */
export function Ingresar() {
  const router = useRouter()
  const [correo, setCorreo] = useState("")
  const [clave, setClave] = useState("")
  const [ver, setVer] = useState(false)
  const [error, setError] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function entrar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    const r = await iniciarSesion(correo, clave)
    setEnviando(false)
    if (r === "credenciales") setError(true)
    else if (r === "sin_verificar") router.push(`/registro?verificar=${encodeURIComponent(correo.trim())}`)
    else {
      toast.success("Hola de nuevo")
      router.replace("/")
    }
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="relative h-80 shrink-0 overflow-hidden rounded-b-lg bg-primario">
        <BotonVolver respaldo="/bienvenida" className="absolute top-14 left-pantalla z-10" />
        <span aria-hidden className="absolute -top-26 left-1/2 size-118 -translate-x-1/2 rounded-completo bg-acento-suave" />
        <Logo tono="oscuro" className="relative mx-auto mt-14 w-40" />
      </div>
      <form onSubmit={entrar} className="flex flex-1 flex-col gap-3 px-pantalla pt-8 pb-9">
        <h1 className="texto-titulo-pantalla text-texto">Bienvenido de nuevo</h1>
        <CampoAcceso
          etiqueta="Correo electrónico"
          icono="mail"
          type="email"
          autoComplete="email"
          valor={correo}
          onCambio={(v) => {
            setCorreo(v)
            setError(false)
          }}
          error={error ? "El correo o la contraseña no coinciden" : undefined}
          derecha={error ? <Icono nombre="error" className="icono-m text-error" /> : correoValido(correo) ? <Icono nombre="check_circle" className="icono-m text-texto-secundario" /> : null}
        />
        <CampoAcceso
          etiqueta="Contraseña"
          icono="lock"
          type={ver ? "text" : "password"}
          autoComplete="current-password"
          valor={clave}
          onCambio={(v) => {
            setClave(v)
            setError(false)
          }}
          error={error ? "Revisa tu contraseña e inténtalo de nuevo" : undefined}
          derecha={
            <button type="button" aria-label={ver ? "Ocultar contraseña" : "Ver contraseña"} onClick={() => setVer((x) => !x)} className={error ? "text-error" : "text-texto-secundario"}>
              <Icono nombre={ver ? "visibility_off" : "visibility"} className="icono-m" />
            </button>
          }
        />
        <Link href="/recuperar" className="self-center p-2 texto-etiqueta-fuerte text-primario">
          ¿Olvidaste tu contraseña?
        </Link>
        <div className="mt-auto flex flex-col gap-3 pt-6">
          <BotonEnlace href="/registro" variante="suave">
            Crear cuenta
          </BotonEnlace>
          <Boton type="submit" disabled={!correoValido(correo) || !clave || enviando}>
            Iniciar sesión
            <Icono nombre="arrow_forward" className="icono-m" />
          </Boton>
        </div>
      </form>
    </main>
  )
}

type CampoAccesoProps = {
  etiqueta: string
  icono: string
  type: string
  autoComplete: string
  valor: string
  onCambio: (v: string) => void
  error?: string
  derecha?: ReactNode
}

/** Campo con ícono, error en rojo y acción a la derecha (A6, A7). */
function CampoAcceso({ etiqueta, icono, type, autoComplete, valor, onCambio, error, derecha }: CampoAccesoProps) {
  const id = `acceso-${icono}`
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="texto-etiqueta-fuerte text-texto">
        {etiqueta}
      </Label>
      <div className={cn("flex h-14 items-center gap-3 rounded-md border bg-superficie px-4 focus-within:border-primario", error ? "border-error" : "border-borde")}>
        <Icono nombre={icono} className="icono-m text-texto-secundario" />
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent texto-cuerpo text-texto outline-none"
        />
        {derecha}
      </div>
      {error && <span className="texto-etiqueta text-error">{error}</span>}
    </div>
  )
}
