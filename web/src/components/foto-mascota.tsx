import Image from "next/image"

import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

type FotoMascotaProps = {
  nombre: string
  imagen?: string
  /** Tamaño y radio con clases del tema, por ejemplo "size-16 rounded-lg". */
  className?: string
  /** Carga la foto sin esperar, cuando es lo primero que se ve de la pantalla (E1). */
  prioritaria?: boolean
}

/** Foto de la mascota; sin foto muestra la huella (componente Foto de mascota del kit). */
export function FotoMascota({ nombre, imagen, className, prioritaria }: FotoMascotaProps) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-completo bg-primario text-superficie",
        className,
      )}
    >
      {imagen ? (
        <Image src={`/mascotas/${imagen}`} alt={`Foto de ${nombre}`} fill sizes="160px" loading={prioritaria ? "eager" : undefined} className="object-cover" />
      ) : (
        <Icono nombre="pets" className="icono-m" />
      )}
    </span>
  )
}
