import { createCn } from "cn/config"

/**
 * `cn` con las clases propias del tema (globals.css). Así, al combinar clases,
 * `texto-etiqueta` reemplaza a `text-sm font-medium` de los componentes de
 * shadcn/ui y `icono-xl` reemplaza a `icono-l`.
 *
 * tsconfig.json dirige el import "cn" a este archivo, para que también lo usen
 * los componentes de src/components/ui/ (los actuales y los que se agreguen).
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "texto-balto": [
        {
          texto: [
            "display",
            "titulo-pantalla",
            "titulo-tarjeta",
            "titulo-seccion",
            "boton",
            "cuerpo-fuerte",
            "cuerpo",
            "etiqueta-fuerte",
            "etiqueta",
            "micro",
          ],
        },
      ],
      "icono-balto": [{ icono: ["xs", "s", "m", "l", "xl", "estado"] }],
    },
    conflictingClassGroups: {
      "texto-balto": ["font-size", "font-weight", "leading", "tracking", "font-family", "texto-balto"],
      "icono-balto": ["font-size", "icono-balto"],
    },
  },
})
