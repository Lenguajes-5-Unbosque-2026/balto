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
- `src/app/(pestanas)/`: secciones con barra inferior (Inicio, Línea de tiempo, Tienda, Alertas y Salud).
- Una carpeta de `src/app/` por flujo: `bienvenida`, `registro`, `ingresar`, `recuperar` (A), `mascotas` (B), `carga-inicial` (C), `vista-rapida`, `evento` (D), `registrar` (E), `salud` (F), `medicamentos` (G), `alimentacion` (H), `habitos` (I), `alertas` (J), `veterinarias`, `calendario` (K), `compartir` y `p/[token]` (L), `ajustes`, `notificaciones` (M), `tienda` (N) y `sin-conexion`, `pendientes`, `permisos` (O).
- `src/components/<flujo>/`: las pantallas de cada flujo. Los componentes compartidos están en `src/components/`.
- `src/lib/`: datos de `data/mock/` (`datos.ts`, solo en el servidor) y los cambios guardados en el navegador (`usar-*.ts`, `almacen-local.ts`).

## Mientras no hay Supabase

- Los cambios (eventos, alertas, tomas, pedidos, mascotas nuevas…) se guardan en el navegador.
- Cuenta de prueba para A6: `samuel@correo.com` / `Balto2026`. El código de verificación de A4 se muestra como "código de prueba".
- Tarjeta de prueba que la pasarela rechaza (N14): cualquier número que termine en `0002`.
- El PDF sale del diálogo de impresión del navegador ("Guardar como PDF").
- `src/components/ui/`: componentes de shadcn/ui. `src/components/`: componentes propios de Balto.
