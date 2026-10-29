"use client"

import { useId, type ComponentProps } from "react"

import { Icono } from "@/components/icono"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type CampoProps = Omit<ComponentProps<"input">, "onChange"> & {
  etiqueta: string
  requerido?: boolean
  icono?: string
  valor: string
  onCambio: (valor: string) => void
  /** Sugerencias para escribir más rápido (por ejemplo, veterinarias). */
  sugerencias?: string[]
}

/** Campo de formulario con etiqueta e ícono inicial (componente Campo del kit). */
export function Campo({ etiqueta, requerido, icono, valor, onCambio, sugerencias, className, ...props }: CampoProps) {
  const id = useId()
  const lista = sugerencias?.length ? `${id}-sugerencias` : undefined
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <Label htmlFor={id} className="texto-etiqueta-fuerte text-texto">
        {etiqueta}
        {requerido && " *"}
      </Label>
      <div className="flex h-14 items-center gap-3 rounded-md border border-borde bg-superficie px-3 transition-colors focus-within:border-primario movil-m:px-4">
        {icono && <Icono nombre={icono} className="icono-m text-primario" />}
        <Input
          id={id}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          // Las fechas abren el calendario del teléfono al tocar el campo.
          onClick={props.type === "date" ? (e) => e.currentTarget.showPicker?.() : undefined}
          required={requerido}
          list={lista}
          className="campo-fecha h-full min-w-0 flex-1 rounded-none border-0 bg-transparent p-0 texto-cuerpo text-texto shadow-none placeholder:text-texto-secundario focus-visible:ring-0"
          {...props}
        />
      </div>
      {lista && (
        <datalist id={lista}>
          {sugerencias!.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  )
}

type AreaTextoProps = Omit<ComponentProps<"textarea">, "onChange"> & {
  etiqueta: string
  requerido?: boolean
  valor: string
  onCambio: (valor: string) => void
}

/** Campo multilínea con etiqueta (componente Área de texto del kit). */
export function AreaTexto({ etiqueta, requerido, valor, onCambio, className, ...props }: AreaTextoProps) {
  const id = useId()
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="texto-etiqueta-fuerte text-texto">
        {etiqueta}
        {requerido && " *"}
      </Label>
      <Textarea
        id={id}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        required={requerido}
        className="min-h-22 rounded-md border-borde bg-superficie px-4 py-3.5 texto-cuerpo text-texto placeholder:text-texto-secundario focus-visible:border-primario focus-visible:ring-0"
        {...props}
      />
    </div>
  )
}
