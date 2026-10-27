# Balto · Mapa de componentes

Cada componente de `design/ui-kit.md` con su equivalente en [shadcn/ui](https://ui.shadcn.com/docs/components), o marcado como **desde cero** si no hay uno que sirva, y las pantallas donde aparece.

**Cómo se contó:**
- Instancias de cada componente en las 156 pantallas de *Casos de uso* en Figma (27 oct 2026).
- Para los componentes que en Figma están copiados y desconectados del kit, el nombre de la capa y la revisión de las pantallas.
- La tabla va de más a menos pantallas.

**Leyenda de la columna shadcn/ui:**
- **✅ Directo:** el componente de shadcn sirve con solo aplicar los tokens.
- **🔧 Adaptar:** hay una base en shadcn, pero hay que componerla o ajustarla (íconos, variantes, estados).
- **🧱 Desde cero:** no hay equivalente; se arma con divs, tokens y, si acaso, piezas de shadcn adentro.
- **— No se implementa:** es solo de maqueta o está retirado.

## Tabla

| # | Componente | Pantallas | Dónde aparece | shadcn/ui | Notas |
|---|---|---|---|---|---|
| 1 | Barra de estado | 156 | Todas | — No se implementa | La dibuja el sistema del teléfono. |
| 2 | Botón | 136 | Casi todas (barra de acción, diálogos, hojas) | ✅ `Button` | Variantes Primario, Secundario, Oscuro, Suave, Destructivo y Destructivo contorno como `variant`. Alto 56, píldora. |
| 3 | Encabezado | 129 | Todas las pantallas internas | 🧱 Desde cero | Botón ícono + título centrado + botón ícono. Los formularios de E llevan además el Selector de mascota. |
| 4 | Botón ícono | 127 | Encabezados, búsqueda, tarjetas | ✅ `Button` (`size="icon"`) | Variantes Claro, Suave, Primario, Oscuro. 44 × 44. |
| 5 | Barra de acción | 103 | Formularios, confirmaciones, estados | 🧱 Desde cero | Contenedor fijo abajo con 1 o 2 botones. |
| 6 | Fila de lista | 74 | Listas de B, C, D, E, F, G, J, K, L, M, N, O | 🔧 `Item` | `Item` + `ItemMedia` (ícono) + `ItemContent` + `ItemActions`. Para opciones elegibles (G6, J3, N7) va dentro de `RadioGroup`. |
| 7 | Nota | 70 | A5, A8, A12–A14, B5, B6, C8–C13, D1, E3, E6, E9, E10, E12, E13, F1–F6, G7, G9, H1–H7, I4–I6, J4–J6, K7, L2–L8, M2, M5, M8, M9, M14–M16, M19, N3–N5, N8, N12–N14, N16, O2, O3, O6–O9 | ✅ `Alert` | Tonos Info, Éxito y Error como `variant`. |
| 8 | Estado | 49 | A4, A8, A12–A16, A13.2, B5, C6, C7, C12, C13, D8, D10, E9, E13, G9, H3, H6, H7, I5, I6, J4, J5, J7, K7–K10, L3, L6, L7, M6, M14–M16, N8, N10, N11, N14, N16, O1, O2, O5–O9 | ✅ `Empty` | `EmptyMedia` (ícono en círculo de 104), `EmptyTitle`, `EmptyDescription`. Tonos Neutro, Éxito y Error. |
| 9 | Chip | 47 | Chips de tipo de evento (D2, D3, D9, D10, E2–E11), filtros (F3, I1, J8, K2, K3, L2, M9, N2), reglas de contraseña (A3, A9), alergias (B4, C6, F5, F6) | 🔧 `ToggleGroup` / `Toggle` | Selección múltiple en filtros y única en tipo de evento. Las alergias de F6 se pueden quitar: `Badge` con botón. |
| 10 | Campo | 42 | Todos los formularios (A, B, C, D6, E, F6, G3, G7, H2, I2, I3, K7, L1, M2, M3, M15, M18, M19, N12, N13) | 🔧 `Input` + `Label` (+ `InputGroup` para el ícono) | Estados Normal, Foco y Error con texto de ayuda. Las fechas usan `Popover` + `Calendar`. |
| 11 | Progreso | 30 | A3–A5, A12, A13, A13.2, B1, B2, B4, B8, C2–C5, C8–C12, G3, G4, G7, L1–L4, L7, M18, N7, N9 | 🧱 Desde cero | Barra segmentada («PASO X DE N»). `Progress` de shadcn es una barra continua y no sirve. |
| 12 | Marcador | 18 | A2, B2, C2, C4, D5, E5, E7, E11, E12, G3, I2, I4, K1, K2, K4, N3 | 🔧 `AspectRatio` + desde cero | Área punteada para foto, cámara, documento o mapa. Abre la cámara o el selector de archivos del teléfono. |
| 13 | Dato | 16 | C7, D1, D4, D7, F1, F4, F7, G9, J1, K4, K9, K11, N6, N7, N15 | 🧱 Desde cero | Fila etiqueta–valor (lista de definición). Variante Total para los pagos. |
| 14 | Enlace | 15 | A4, A6, A7, A12, A14, B2, C7, C8, D10, H3, K8, L4, M1, M18, N11 | ✅ `Button` (`variant="link"`) | La variante Con pregunta lleva un texto gris antes. |
| 15 | Foto de mascota | 15 | A6, A7, D1, E1–E7, E10, E11, L2, L5, Inicio | ✅ `Avatar` | Cuadrado redondeado. `AvatarFallback` con la huella para mascotas sin foto. |
| 16 | Fondo de modal | 14 | B8, D3, D7, E8, G6, G8, J3, J8, K1, K2, M7, M13, M17, O4 | ✅ Viene incluido en `AlertDialog` y `Drawer` | Capa oscura (`color-fondo-modal`). |
| 17 | Búsqueda | 13 | D2, D3, D8–D10, K1–K3, K8, M8, N1, N2, N11 | 🔧 `InputGroup` | Campo con ícono de lupa + Botón ícono de filtro opcional. |
| 18 | Selector de mascota | 13 | E2–E7, E10, E11 (encabezado), D1, K9, L2, L5, Inicio | 🔧 `Select` o `DropdownMenu` | Disparador en píldora con Avatar + nombre. |
| 19 | Selector | 12 | B1, E4, E7, F2, G1, J1, J8, L1, M6, M18, N3, N9 | ✅ `ToggleGroup` (`type="single"`) | Dos opciones. También podría ser `Tabs` cuando cambia el contenido (F2, G1, J1, N9). |
| 20 | Área de texto | 11 | C3, C5, C9, E3, E4, E7, E11, F6, F7, I2, M19 | ✅ `Textarea` | Con `Label`. |
| 21 | Navegación inferior | 11 | Inicio, D2, D8–D10, F1, J1, J7, J8, N1, O1 | 🧱 Desde cero | Barra flotante oscura con 5 accesos y el + central. Lleva `sombra-flotante`. |
| 22 | Tarjeta destacada | 10 | D4, D7, F7, H1, H4, J2, J3, K11, N5, N9 | 🔧 `Card` | Variante oscura con ícono, título, detalle y rasgos. |
| 23 | Tarjeta de evento | 10 | C7, C11, D2, D3, D9, E9, F2, F3, I1, J5 | 🔧 `Card` o `Item` | Ícono, título, detalle, fecha y número de soportes. Es la pieza más repetida dentro de las listas. |
| 24 | Interruptor | 9 | B1, C4, E2, G2, G4, H4, K2, M3, M18 | ✅ `Switch` | 52 × 32. |
| 25 | Fila con interruptor | 9 | B1, C4, E2, E10, G2, G4, H4, M3, M18 | 🔧 `Item` + `Switch` | Con o sin ícono. |
| 26 | Rasgo | 9 | B6, D4, F7, G2, H1, J2, K11, N5, Inicio | 🧱 Desde cero | Cuadro de 76 con ícono y texto; temas Claro y Oscuro. |
| 27 | Encabezado de sección | 9 | C2, D1, G1, H1, H3, J2, K6, N1, N4 | 🧱 Desde cero | Título + enlace de acción opcional. |
| 28 | Diálogo | 8 | B8, D7, G8, K1, M7, M13, M17, O4 | ✅ `AlertDialog` | Tonos Aviso y Destructivo, 2 o 3 botones apilados. |
| 29 | Hoja inferior | 6 | D3, E8, G6, J3, J8, K2 | ✅ `Drawer` | Incluye el asa y el fondo de modal. |
| 30 | Asa de hoja | 6 | D3, E8, G6, J3, J8, K2 | ✅ Viene incluida en `Drawer` | — |
| 31 | Selector triple | 5 | F4, G4, H2, H4, K2 | ✅ `ToggleGroup` (`type="single"`) | En G4 ahora tiene 4 opciones; `ToggleGroup` admite cualquier número. |
| 32 | Estadística | 5 | C7, F1, F4, J1, J8 | 🔧 `Card` | Número grande + etiqueta; tonos Primario, Acento, Claro, Éxito, Error. |
| 33 | Casilla de verificación | 4 | A3, C1, I3, L1 | 🔧 `Checkbox` + `Label` | En una tarjeta con borde; la tarjeta entera es tocable. |
| 34 | Tarjeta de alerta | 3 | J1, J8, Inicio («Próximo a vencer») | 🧱 Desde cero | Urgencias Urgente (oscura) y Próxima (verde), con Botón y Botones ícono. |
| 35 | Ficha de mascota | 3 | D1, L5, Inicio | 🔧 `Card` + `Avatar` | Inicio la usa con fondo verde y decoración. |
| 36 | Gráfica de barras | 3 | E6, F4, I1 | ✅ `Chart` (Recharts) | La última barra resalta el periodo actual. |
| 37 | Control de cantidad | 3 | H4, N3, N6 | 🧱 Desde cero | Etiqueta + Botones ícono − / +. |
| 38 | Indicador de página | 3 | A2, A2.2, A2.3 | 🔧 `Carousel` + puntos desde cero | El carrusel de bienvenida usa `Carousel`; los puntos se dibujan aparte. |
| 39 | Fila de toma | 3 | G1, G2, G6 | 🧱 Desde cero | Estados Tomada, Pendiente (con botón) y Omitida. |
| 40 | Hora de toma | 3 | G1, G2, G6 | 🧱 Desde cero | Dentro de la Fila de toma. |
| 41 | Encabezado con contador | 3 | J1, J7, J8 | 🧱 Desde cero | Título grande + `Badge` con el número. |
| 42 | Notificación push | 3 | G5, H5, J6 | — No se implementa | La muestra el sistema. En código es una notificación web (Web Push), no un componente. |
| 43 | Reloj de pantalla bloqueada | 3 | G5, H5, J6 | — No se implementa | Solo de maqueta. |
| 44 | Dígito de código | 2 | A4, A12 | ✅ `InputOTP` (`InputOTPSlot`) | Estados Vacío, Foco, Lleno, Error. |
| 45 | Código de verificación | 2 | A4, A12 | ✅ `InputOTP` | Grupo de 6 dígitos. |
| 46 | Día | 2 | K5, K6 | ✅ Viene incluido en `Calendar` | Tipos Normal, Seleccionado (con cita), Elegido. |
| 47 | Calendario | 2 | K5, K6 | ✅ `Calendar` (react-day-picker) | Los días con cita se marcan con `modifiers`. |
| 48 | Tarjeta de producto | 2 | N1, N2 | 🔧 `Card` | Imagen o ícono, aviso de reposición, nombre, precio y botón +. |
| 49 | Acción de compartir | 2 | I4, L2 | 🧱 Desde cero | Botón cuadrado con ícono y texto, en fila de 4 o 5. |
| 50 | Vista previa de PDF | 2 | I4, L2 | 🧱 Desde cero | Miniatura del reporte. Puede ser la primera página del PDF generado. |
| 51 | Etiqueta de estado | 2 | G2, G9 | ✅ `Badge` | Tonos Neutro, Éxito, Error. |
| 52 | Encabezado de inicio | 2 | Inicio, O1 | 🧱 Desde cero | `Avatar` + saludo + Botones ícono. |
| 53 | Acceso rápido | 2 | Inicio, N1 | 🧱 Desde cero | Mosaico tocable (enlace) con ícono y texto. |
| 54 | Fila de mascota | 2 | E1, M5 | 🔧 `Item` + `Avatar` | — |
| 55 | Cédula animal | 1 | B6 | 🧱 Desde cero | Tarjeta con número, fecha y rasgos. |
| 56 | Tarjeta de tratamiento | 1 | G2 | 🔧 `Card` + `Progress` | Cabecera oscura con progreso de días. |
| 57 | Evento de línea de tiempo | 1 | D2 | 🧱 Desde cero | Punto y línea vertical + Tarjeta de evento. |
| 58 | Tipo de evento | 1 | E1 | 🧱 Desde cero | Mosaico de los 9 tipos (enlace a cada formulario). |
| 59 | Tarjeta de plan | 0 | — | — No se implementa | Retirada con la suscripción (27 oct 2026). |

## Los que se construyen desde cero

Son los que más trabajo darán en la sesión 4. Ordenados por cuántas pantallas los usan:

1. **Encabezado** (129)
2. **Barra de acción** (103)
3. **Progreso** (30)
4. **Marcador** (18)
5. **Dato** (16)
6. **Navegación inferior** (11)
7. **Rasgo** (9)
8. **Encabezado de sección** (9)
9. **Tarjeta de alerta** (3)
10. **Control de cantidad** (3)
11. **Fila de toma** y **Hora de toma** (3)
12. **Encabezado con contador** (3)
13. **Acción de compartir** (2)
14. **Vista previa de PDF** (2)
15. **Encabezado de inicio** (2)
16. **Acceso rápido** (2)
17. **Cédula animal** (1)
18. **Evento de línea de tiempo** (1)
19. **Tipo de evento** (1)

Los cinco primeros aparecen en casi todas las pantallas. Conviene hacerlos primero: con Encabezado, Barra de acción, Progreso, Campo y Botón ya se arman la mayoría de los formularios.

## Lo que piden las specs y no está en el kit

| Necesidad | Dónde | shadcn/ui |
|---|---|---|
| Mensaje breve («Cambios guardados», «Enlace copiado», «Agregado al carrito») | D6, D7, L4, N2, N3, O3 | `Sonner` (toast) |
| Selector de fecha | Todos los campos de fecha | `Popover` + `Calendar` |
| Lista para elegir con búsqueda (raza, banco, veterinaria sugerida) | B1, N16, E2, E3 | `Command` dentro de `Popover` (combobox) |
| Opciones de una sola respuesta | G6, J3, M6, N7 | `RadioGroup` |
| Cargando (botón, lectura de documento, lista) | B4, C12, I3, L2, M6, N7 | `Spinner` y `Skeleton` |
| Barra de progreso continua | G2 (tratamiento) | `Progress` |
| Botón deshabilitado | Todos los formularios | `Button disabled` (falta en el kit: pregunta 15 de `CLAUDE.md`) |

## Instalación prevista

Los componentes de shadcn/ui que usa este mapa:

```
button input label textarea switch checkbox badge avatar toggle toggle-group
alert alert-dialog drawer select dropdown-menu popover calendar command
input-otp input-group carousel chart card item empty radio-group progress
aspect-ratio sonner skeleton spinner tabs
```
