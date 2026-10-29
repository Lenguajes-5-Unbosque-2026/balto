/** Título de una sección vacía mientras se construye su pantalla. */
export function TituloSeccion({ titulo }: { titulo: string }) {
  return (
    <header className="px-pantalla pt-14">
      <h1 className="texto-titulo-pantalla text-texto">{titulo}</h1>
    </header>
  )
}
