"use client"

import Image from "next/image"
import { useRef } from "react"

import { Icono } from "@/components/icono"
import { reglasClave } from "@/lib/acceso"
import { cn } from "@/lib/utils"

/** Logo de Balto (perro en círculo y "Balto."), en claro sobre verde o en verde sobre claro. */
export function Logo({ tono = "claro", className }: { tono?: "claro" | "oscuro"; className?: string }) {
  return (
    <span className={cn("relative block aspect-[245/282]", className)}>
      <Image src={`/marca/logo-${tono}.png`} alt="Balto" fill sizes="240px" priority className="object-contain" />
    </span>
  )
}

/** Reglas de la contraseña con chulo o equis (A3, A9). */
export function ReglasClave({ clave }: { clave: string }) {
  return (
    <ul className="flex flex-col gap-2.5 px-4">
      {reglasClave(clave).map((r) => (
        <li key={r.texto} className="flex items-center gap-2.5 texto-etiqueta-fuerte text-texto">
          <Icono nombre={r.ok ? "check" : "close"} className={cn("icono-m", r.ok ? "text-primario" : "text-error")} />
          {r.texto}
        </li>
      ))}
    </ul>
  )
}

/** Seis casillas del código de verificación (A4, A12). */
export function CasillasCodigo({ valor, onCambio, error }: { valor: string; onCambio: (v: string) => void; error?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const digitos = valor.padEnd(6, " ").slice(0, 6).split("")

  function escribir(i: number, texto: string) {
    const limpio = texto.replace(/\D/g, "")
    if (limpio.length > 1) {
      // Pegar el código completo.
      onCambio(limpio.slice(0, 6))
      refs.current[Math.min(limpio.length, 5)]?.focus()
      return
    }
    const nuevo = (valor.slice(0, i) + limpio + valor.slice(i + 1)).slice(0, 6)
    onCambio(nuevo.replace(/\s/g, ""))
    if (limpio && i < 5) refs.current[i + 1]?.focus()
  }

  return (
    <div className="flex justify-center gap-2 movil-m:gap-2.5">
      {digitos.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          aria-label={`Dígito ${i + 1}`}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          value={d.trim()}
          onChange={(e) => escribir(i, e.target.value)}
          onKeyDown={(e) => e.key === "Backspace" && !d.trim() && i > 0 && refs.current[i - 1]?.focus()}
          className={cn(
            "h-14 w-11 rounded-md border bg-superficie text-center texto-titulo-tarjeta text-texto outline-none focus:border-2 focus:border-primario movil-m:w-12",
            error ? "border-2 border-error" : "border-borde-fuerte",
          )}
        />
      ))}
    </div>
  )
}
