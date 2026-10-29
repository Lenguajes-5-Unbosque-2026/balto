# web

Código de Balto: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.

## Correr en local

```
cd web
npm install
npm run dev
```

Abre http://localhost:3000. Para verla como celular: clic derecho → Inspeccionar → ícono de celular.

## Dónde está cada cosa

- `src/app/globals.css`: el tema. Todos los tokens de `design/tokens.md` viven aquí y en ningún otro lugar.
- `src/app/(pestanas)/`: secciones con barra inferior (Inicio, Línea de tiempo, Tienda, Alertas).
- `src/app/registrar/`: flujo E · Registrar evento.
- `src/components/ui/`: componentes de shadcn/ui. `src/components/`: componentes propios de Balto.
