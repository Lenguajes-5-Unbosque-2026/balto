# N · Tienda — alimento y vacunas

## Quién y para qué

El dueño compra dentro de Balto dos tipos de producto:
- **el alimento de su mascota**, con entrega a domicilio en Bogotá;
- **sus vacunas, con la aplicación incluida** en una veterinaria aliada.

La Tienda recomienda según lo que Balto ya sabe: el alimento del plan que se está acabando (H) y las vacunas que vencen pronto (J).

Importa porque cierra el ciclo "me avisan → lo resuelvo" sin salir de la app. Ahora que no hay suscripción, también es la fuente de ingreso del producto (pendiente de confirmar en el brief).

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| N1 | Tienda | Buscador "Buscar alimento o vacuna", accesos Alimentos / Vacunas / Mis pedidos, "Recomendado para Luna" (por ejemplo, alimento que se acaba en 12 días o una vacuna que vence en 2 días) con precio y +. Lleva la barra de navegación inferior. |
| N2 | Alimentos | Buscador, filtros, chips (Para Luna, Perro adulto, Cachorro, Gato…) y una cuadrícula de productos con presentación, precio y +. Carrito arriba. |
| N3 | Detalle de alimento | Foto, nombre, descripción (Perro adulto · raza grande · 15 kg), la nota "Coincide con el plan de Luna: con 380 g al día le dura unos 39 días.", selector Compra única / Cada 5 semanas, cantidad y "Agregar · $ 00.000". |
| N4 | Vacunas | La nota "Las vacunas se compran con la aplicación incluida en una veterinaria aliada." y las secciones "Le tocan pronto" (Antirrábica · Luna, vence en 2 días; Desparasitación · Toby) y "Otras vacunas". |
| N5 | Detalle de vacuna y aplicación | Cabecera (Antirrábica · Para Luna · incluye la aplicación) con fichas 25 sep / Anual / Aliada. "Elige dónde y cuándo aplicarla" (veterinarias aliadas con distancia y primer horario), la nota "Cuando confirmes la aplicación, queda registrada en la línea de tiempo de Luna." y "Agregar · $ 00.000". |
| N6 | Carrito | Productos con precio y botón de quitar, cantidad ("Bultos de concentrado"), resumen (Subtotal, Envío, Aplicación de la vacuna: Incluida, Total) e "Ir a pagar". |
| N7 | Entrega y pago | Paso 2 de 2: resumen del total, "Entrega del alimento" (Casa, con "Cambiar"), "Método de pago" (PSE, Tarjeta terminada en 4417) y "Pagar $ 00.000". |
| N8 | Pedido confirmado | "¡Pedido confirmado! Pedido #000123", el alimento ("Llega mañana entre 8 a. m. y 12 m."), la vacuna ("Jue 25 sep, 10:00 · agregada al calendario"), la nota de avisos y los botones (izquierdo vacío) / "Listo". |
| N9 | Mis pedidos y seguimiento | Pestañas En curso / Anteriores, el pedido #000123 y el seguimiento en 4 pasos: Pedido confirmado → En preparación → En camino → Entregado. |
| N10 | Carrito vacío | "Tu carrito está vacío", "Recomendado para Luna" e "Ir a la tienda". |
| N11 | Búsqueda sin resultados | "No encontramos eso", filtros activos, "Quitar los filtros" y los botones "Ver todo el alimento" / "Pedir un producto". |
| N12 | Dirección de entrega | Direcciones guardadas (Casa, Oficina), "Agregar dirección", "Indicaciones", la nota "Entregamos en Bogotá de lunes a sábado, entre 8 a. m. y 6 p. m." y "Usar esta dirección". |
| N13 | Agregar método de pago | Pestañas Tarjeta / PSE, formulario de tarjeta (número, vencimiento, CVV, nombre), la nota "Pago seguro. No guardamos el número completo de tu tarjeta." y "Guardar y continuar". |
| N14 | Pago rechazado | "No pudimos cobrar el pedido. Guardamos tu carrito. Prueba con otra tarjeta o con PSE. Tu banco rechazó la transacción. No se hizo ningún cobro." Botones "Probar otro medio" / "Ver el carrito". |
| N15 | Detalle del pedido | "Pedido #000123 · En camino · Llega hoy entre 2 y 6 p. m.", productos, totales y los botones "Seguir el pedido" / "Necesito ayuda". Ayuda (?) arriba. |

## Paso a paso

Caso: a Luna se le acaba el concentrado en 12 días y su refuerzo de antirrábica vence en 2. Samuel resuelve las dos cosas en una sola compra.

1. **Entrada (N1).** Toca **Tienda** en la barra inferior. En "Recomendado para Luna" ve el Concentrado adulto salmón ("Se acaba en 12 días") y la Vacuna antirrábica ("Vence en 2 días").
2. **Alimento (N3).** Toca el concentrado. Ve que coincide con el plan de Luna ("con 380 g al día le dura unos 39 días"), deja la cantidad en 1 y toca **Agregar**.
3. **Vacuna (N5).** Vuelve a N1 y toca la antirrábica. Elige **Clínica Veterinaria Norte · jue 25, 10:00** y toca **Agregar**.
4. **Carrito (N6).** Revisa los dos productos, el envío y "Aplicación de la vacuna: Incluida", y toca **Ir a pagar**.
5. **Entrega y pago (N7).** La dirección "Casa" ya está elegida. Elige **Tarjeta terminada en 4417** y toca **Pagar**.
6. **Confirmación (N8).**
   - "Pedido #000123": el alimento llega mañana entre 8 a. m. y 12 m., y la cita de la vacuna queda el jueves 25 a las 10:00, agregada al calendario (**K6**).
   - **Ver mi pedido** → N15. **Listo** → N1.
7. **Seguimiento (N9 / N15).** Llegan notificaciones cuando el pedido sale y cuando se entrega (si "Pedidos de la tienda" está encendido en **M3**). En **N9** ve el paso actual.
8. **Después.**
   - Al entregarse el alimento, Balto pregunta "¿Abriste la bolsa nueva?" y, si dice que sí, reinicia la cuenta de días del plan (**H1**).
   - Después de la cita de la vacuna, Balto pide confirmar la aplicación. Se abre **E2** con los datos llenos; al guardar, la vacuna queda en la línea de tiempo y la alerta se resuelve (**J5**).

### Variantes del paso a paso

- **Desde otros flujos.** "Comprar alimento" (**H1**) abre N3 o N2. "Comprar la vacuna" (**J2 / J4**) abre N5. "Mis pedidos" (**M1**) abre N9.
- **Buscar (N2 → N11).**
  - Los chips y los filtros de N2 acotan la cuadrícula. El chip "Para Luna" muestra lo que sirve para su especie y etapa.
  - Sin resultados se muestra N11. "Quitar los filtros", "Ver todo el alimento" (N2 sin filtros) o "Pedir un producto", que abre el formulario de Ayuda (**M8**) con el tema "Pedir un producto".
- **Otra dirección (N12).** "Cambiar" en N7 abre N12. Samuel elige una dirección guardada o escribe una nueva con indicaciones. "Usar esta dirección" vuelve a N7.
- **Nuevo método de pago (N13).**
  - En N7, "Agregar método de pago" abre N13. La tarjeta se guarda con un token de la pasarela; Balto solo guarda los últimos 4 dígitos.
  - En la pestaña PSE se eligen el banco y el tipo de persona.
  - "Guardar y continuar" vuelve a N7 con el método elegido.
- **Pago con PSE.** Al tocar "Pagar" con PSE, Balto lleva al dueño a la página de su banco. Al volver muestra "Confirmando el pago…" y después **N8** o **N14**. *(Pantalla de PSE y confirmación pendiente en Figma.)*
- **Pago rechazado (N14).** "Probar otro medio" vuelve a N7 con el carrito intacto. "Ver el carrito" → N6.
- **Carrito vacío (N10).** El + de una recomendación la agrega al carrito. "Ir a la tienda" → N1.
- **Solo vacunas.** Si el carrito no tiene alimento, N7 no muestra "Entrega del alimento" ni cobra envío.
- **Ayuda con un pedido (N15).** "Necesito ayuda" y "?" abren el formulario de **M8** con el número del pedido.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Sin recomendaciones | N1 | Si no hay plan de alimentación ni vacunas próximas, se muestran los más vendidos. |
| Producto agregado | N2, N3, N5 | Mensaje "Agregado al carrito" y contador en el ícono del carrito. |
| Producto agotado | N2, N3 | "Agotado" y el botón deshabilitado. *(Falta en Figma.)* |
| Vacuna para otra especie | N4 | Solo se muestran las vacunas que sirven para la especie de cada mascota ("Triple felina · Para Michi"). |
| Sin cupo en aliadas | N5 | "No hay horarios esta semana" y la opción de ver la semana siguiente. |
| Carrito vacío | N10 | Recomendaciones e "Ir a la tienda". |
| Sin resultados | N11 | Quitar filtros, ver todo o pedir un producto. |
| Dirección fuera de cobertura | N12 | "Por ahora solo entregamos en Bogotá." y no deja usarla. |
| Sin método de pago | N7 | "Pagar" deshabilitado y "Agregar método de pago" resaltado. |
| Procesando pago | N7 | Indicador de carga. El botón no se puede tocar dos veces. |
| Pago aprobado | N8 | Confirmación. |
| Pago rechazado | N14 | Carrito guardado y ningún cobro. |
| Pedido en curso | N9, N15 | Paso actual del seguimiento. |
| Pedido entregado | N9 (Anteriores) | Con la fecha de entrega. |
| Sin pedidos | N9 | "Aún no tienes pedidos" con "Ir a la tienda". *(Falta en Figma.)* |
| Sin conexión | — | **O2**. El carrito se conserva en el dispositivo. |

## Qué pasa después

- **Vacuna comprada** → **cita** en **K6** (con recordatorio según **M3**). Después de la cita, se confirma la aplicación con **E2** → **D2**, **F2** y resolución de la alerta en **J**.
- **Alimento entregado** → pregunta para reiniciar los días de la bolsa en **H1**. La alerta "Alimento por acabarse" se resuelve.
- **Cambios de estado del pedido** → notificaciones y bandeja **M9** ("Tu pedido salió").

## Datos que usa

**Lee**
- **Catálogo de productos:** tipo (alimento | vacuna), nombre, especie, etapa, presentación, precio, foto, disponibilidad y si es vacuna con aplicación.
- **Veterinarias aliadas** y sus horarios para aplicar vacunas (de **K**).
- **Plan de alimentación** (H) y **alertas** de vacunas (J) para las recomendaciones.
- **Mascotas del dueño**: especie, etapa y nombre.

**Guarda**
- **Carrito:** dueño y productos (producto, cantidad, mascota, aliada y horario si es una vacuna). Se conserva entre sesiones.
- **Dirección:** dueño, nombre (Casa, Oficina), dirección, barrio, indicaciones y si es la predeterminada.
- **Método de pago:** dueño, tipo (tarjeta | pse), token de la pasarela, últimos 4 dígitos, franquicia y si es el predeterminado. Nunca el número completo ni el CVV.
- **Pedido:**
  - número, dueño, productos con precio, subtotal, envío, total;
  - dirección, método de pago, referencia de la transacción de la pasarela;
  - estado del pago (pendiente | aprobado | rechazado);
  - estado de la entrega (confirmado | en preparación | en camino | entregado), ventana de entrega y fechas de cada estado.
- **Cita de aplicación:** la misma entidad Cita de **K**, con el pedido de origen.

## Fuera de alcance

- **Compra recurrente** ("Cada 5 semanas" en N3): se quita. Es una suscripción de compra, y la suscripción se eliminó del producto. La recompra la recuerda la alerta de alimento por acabarse (H / J).
- Medicamentos, accesorios y otros productos (solo alimento y vacunas).
- Entregas fuera de Bogotá.
- Devoluciones y cancelaciones dentro de la app (se gestionan por Ayuda).
- Cupones y descuentos.

## Preguntas abiertas

1. **Proveedores y catálogo** (pregunta 5 de `CLAUDE.md`). ¿Con qué proveedores de alimento y veterinarias aliadas se trabaja? ¿De dónde salen el catálogo, los precios, el inventario y el seguimiento de entregas?
2. **Pasarela de pagos** (pregunta 7 de `CLAUDE.md`). ¿Cuál procesa tarjeta y PSE? Debe tokenizar las tarjetas y permitir la redirección a PSE. No está en el stack.
3. **Modelo de ingreso.** Sin suscripción, ¿el ingreso es un margen sobre el alimento, una comisión de las aliadas o ambos? Hay que actualizar `docs/Brief.md`.
4. **Facturación electrónica.** En Colombia, cada venta requiere factura electrónica. ¿Quién la emite: Balto o el proveedor?

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- N1 es la pestaña Tienda de la barra inferior.
- Se quita la compra recurrente "Cada 5 semanas" (N3), por la decisión de no tener suscripciones.
- Una vacuna comprada crea la cita en K6. La aplicación se confirma con E2 y resuelve la alerta de J.
- El botón izquierdo vacío de N8 pasa a ser "Ver mi pedido" (→ N15), como en E9.
- "Pedir un producto" (N11) y "Necesito ayuda" (N15) usan el formulario de Ayuda de M8.
- Sin alimento en el carrito, N7 no pide dirección ni cobra envío.
- Las tarjetas se guardan tokenizadas en la pasarela; Balto solo guarda los últimos 4 dígitos.

Pendiente de ajustar en Figma:
- N3: quitar el selector "Compra única / Cada 5 semanas".
- N8: el botón izquierdo está vacío; debe decir "Ver mi pedido".
- N6: el control de cantidad va en cada producto (hoy dice "Bultos de concentrado" aparte).
- Nueva pantalla: redirección a PSE y "Confirmando el pago…" (A19 se borró con la suscripción).
- N2, N3: estado agotado. N9: estado sin pedidos.
