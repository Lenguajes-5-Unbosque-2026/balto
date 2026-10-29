import { cn } from "@/lib/utils"

type IconoProps = {
  /** Nombre del ícono en Material Symbols Rounded, por ejemplo "vaccines". */
  nombre: string
  /** Tamaño y color con clases del tema: icono-s, icono-l, text-primario… */
  className?: string
}

/** Ícono de Material Symbols Rounded escrito como ligadura (design/ui-kit.md). */
export function Icono({ nombre, className }: IconoProps) {
  return (
    <span aria-hidden className={cn("material-symbols-rounded icono-l select-none", className)}>
      {nombre}
    </span>
  )
}
