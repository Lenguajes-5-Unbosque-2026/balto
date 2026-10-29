import { NavegacionInferior } from "@/components/navegacion-inferior"

/** Secciones con barra de navegación inferior: Inicio, Línea de tiempo, Tienda y Alertas. */
export default function PestanasLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <main className="flex-1 pb-28">{children}</main>
      <NavegacionInferior />
    </>
  )
}
