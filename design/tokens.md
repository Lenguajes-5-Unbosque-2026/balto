# Balto · Tokens de diseño

Valores base del sistema de diseño con un nombre fijo. En código, cada pantalla usa estos nombres y nunca valores sueltos (regla de `CLAUDE.md`, sección 5).

**Fuentes:**
- `design/ui-kit.md`.
- Las variables de Figma: *Paleta · Verde y arena*, *Radio* y *Espaciado*. Son las únicas colecciones que quedan.
- Un conteo de los valores que usan de verdad las 156 pantallas de *Casos de uso* (27 oct 2026). La columna **Usos** es ese conteo de capas.

**Convención de nombres:** `categoría-rol-variante`, en español y sin tildes, para que se puedan usar tal cual como variables CSS y clases de Tailwind (por ejemplo `--color-primario` o `bg-primario`).

Los duplicados que había se resolvieron el 27 oct 2026 en Figma y en el kit. La [sección 7](#7-decisiones-sobre-duplicados) cuenta qué se decidió.

---

## 1. Colores

### Marca y neutros

| Token | Valor | En Figma | Dónde se usa |
|---|---|---|---|
| `color-primario` | `#2E5955` | `primario/900` | Íconos, enlaces, texto destacado, tarjetas destacadas, bordes de foco |
| `color-primario-relleno` | → `color-primario` | `primario/800` (alias) | Relleno del botón primario, chip activo, interruptor encendido |
| `color-acento` | `#C7D0D5` | `acento/300` | Botón suave, segmentos pendientes del progreso, rasgos |
| `color-acento-suave` | `#DCE2E5` | `acento/100` | Contenedores de ícono, notas informativas, fondo de campos |
| `color-texto` | `#262626` | `neutro/900` | Texto principal, barra de navegación inferior, tarjetas oscuras |
| `color-texto-secundario` | `#77737F` | `neutro/500` | Subtítulos, ayudas, íconos finales, texto inactivo |
| `color-fondo` | `#F9F9F9` | `fondo/pantalla` | Fondo de todas las pantallas |
| `color-superficie` | `#FFFFFF` | `neutro/0` | Tarjetas, campos, hojas inferiores, diálogos; texto e íconos sobre color |

### Semánticos

| Token | Valor | En Figma | Dónde se usa |
|---|---|---|---|
| `color-exito` | `#2E8B57` | `semántico/éxito` | Ícono y texto de algo que salió bien (toma tomada, pago aprobado, paso cumplido) |
| `color-exito-suave` | `#DFF3E6` | `semántico/éxito-suave` | Fondo de estados, notas y etiquetas de éxito |
| `color-error` | `#C8475B` | `semántico/error` | Errores, advertencias, acciones destructivas |
| `color-error-suave` | `#FBE3E7` | `semántico/error-suave` | Fondo de estados, notas y etiquetas de error |

### Alias

No tienen valor propio: apuntan a otro token. Existen para que el código diga qué significa el color.

| Token | Apunta a | Dónde se usa |
|---|---|---|
| `color-advertencia` | `color-error` | «Te quedan 2 intentos», «cambios pendientes». No hay ámbar. |
| `color-advertencia-suave` | `color-error-suave` | Fondo de esas advertencias |
| `color-info` | `color-primario` | Notas informativas |
| `color-info-suave` | `color-acento-suave` | Fondo de notas informativas |
| `color-borde` | `color-acento-suave` | Bordes de tarjetas, filas y campos |
| `color-borde-fuerte` | `color-acento` | Bordes de botón secundario y chips inactivos |
| `color-oscuro` | `color-texto` | Barra de navegación inferior y tarjetas oscuras |

Las variables `categoría/*` de Figma (vacuna, medicamento, examen, consulta, bienestar, alimentación) apuntan todas a `primario/900` y `acento/100`. **En código no se crean**, porque las categorías no llevan color propio (regla 6 de color semántico del kit).

### Translúcidos

| Token | Valor | Dónde se usa |
|---|---|---|
| `color-fondo-modal` | `color-texto` al 45 % | Capa detrás de diálogos y hojas inferiores |
| `color-sobre-oscuro-secundario` | `color-superficie` al 70 % | Texto secundario sobre tarjetas oscuras o verdes (H1, H4, J2, N5, N9) |
| `color-sobre-oscuro-icono` | `color-superficie` al 55 % | Íconos atenuados sobre fondo oscuro |
| `color-sobre-oscuro-halo` | `color-superficie` al 22 % | Halo decorativo sobre fondo oscuro |
| `color-exito-borde` | `color-exito` al 28 % | Borde de la nota de éxito |
| `color-error-borde` | `color-error` al 28 % | Borde de la nota de error |

### Retirados (no usar)

Morado, lavanda y arena (`acento/400` `#ECD3AB`). Morado y lavanda se borraron con la colección *Paleta*. La arena sigue en *Paleta · Verde y arena*, pero ninguna pantalla la usa.

---

## 2. Tipografía

### Familias

| Token | Valor | Dónde se usa |
|---|---|---|
| `fuente-titulos` | Outfit | Títulos de pantalla, tarjeta y sección, y números grandes |
| `fuente-texto` | Plus Jakarta Sans | Cuerpo, botones, etiquetas, microcopia |
| `fuente-iconos` | Material Symbols Rounded (Regular) | Íconos escritos como ligaduras (`vaccines`, `pets`…) |

Cómo se cargan (Google Fonts o alojadas en el proyecto) sigue abierto: pregunta 18 de `CLAUDE.md`.

### Pesos

| Token | Valor |
|---|---|
| `peso-regular` | 400 |
| `peso-medio` | 500 |
| `peso-seminegrita` | 600 |
| `peso-negrita` | 700 |

### Estilos de texto

| Token | Familia | Peso | Tamaño | Interlineado | Espaciado entre letras | Dónde se usa |
|---|---|---|---|---|---|---|
| `texto-display` | Outfit | 600 | 40 | 44 | −2 % | Reloj de pantalla bloqueada (solo maqueta) |
| `texto-titulo-pantalla` | Outfit | 600 | 28 | 34 | −1 % | Título de pantalla y de bloque de estado |
| `texto-titulo-tarjeta` | Outfit | 600 | 22 | 28 | −0,5 % | Título de tarjeta destacada y de diálogo |
| `texto-titulo-seccion` | Outfit | 500 | 18 | 24 | 0 | Título del encabezado y de sección |
| `texto-boton` | Plus Jakarta Sans | 700 | 16 | 20 | 0 | Botones |
| `texto-cuerpo-fuerte` | Plus Jakarta Sans | 600 | 15 | 22 | 0 | Título de fila, valor de campo destacado |
| `texto-cuerpo` | Plus Jakarta Sans | 400 | 15 | 22 | 0 | Párrafos, valor de campo |
| `texto-etiqueta-fuerte` | Plus Jakarta Sans | 600 | 13 | 18 | 0 | Etiqueta de campo, chip, texto de rasgo |
| `texto-etiqueta` | Plus Jakarta Sans | 400 | 13 | 18 | 0 | Subtítulos, ayudas, notas |
| `texto-micro` | Plus Jakarta Sans | 500 | 11 | 14 | +0,5 % | Microcopia y etiquetas en MAYÚSCULAS («PASO 1 DE 3», «VENCE EN 2 DÍAS») |

**Excepciones de ilustración** (no son tokens, son parte de la imagen):
- El lema «Más cuidado, menos vueltas.» del carrusel de bienvenida: Outfit 600 a 16, −2 %.
- La hora grande de la pantalla bloqueada: Outfit 600 a 80, solo maqueta.

### Tamaños de ícono

| Token | Valor | Dónde se usa |
|---|---|---|
| `icono-xs` | 14 | Íconos en metadatos («1 soporte») |
| `icono-s` | 18 | Ícono de chips, campos y botones |
| `icono-m` | 22 | Ícono en contenedores de fila y botones ícono |
| `icono-l` | 24 | Íconos en tarjetas |
| `icono-xl` | 32 | Íconos de marcadores (foto, cámara) |
| `icono-estado` | 48 | Ícono del bloque de estado |

Quedan en Figma algunos íconos de 36 px y tamaños con decimales que salen de instancias escaladas. En código se usa el token más cercano.

---

## 3. Espaciados

Variables `espacio/*` de Figma:

| Token | Valor | En Figma | Dónde se usa |
|---|---|---|---|
| `espaciado-2xs` | 2 | `espacio/2xs` | Entre título y subtítulo de una fila |
| `espaciado-xs` | 4 | `espacio/xs` | Entre ícono y texto pequeño; relleno de selectores segmentados |
| `espaciado-xs-s` | 6 | `espacio/xs-sm` | Entre ícono y texto en chips y botones |
| `espaciado-s` | 8 | `espacio/sm` | Entre chips, entre etiqueta y campo |
| `espaciado-s-m` | 10 | `espacio/sm-md` | Entre filas de una lista, entre botones de la barra |
| `espaciado-m` | 12 | `espacio/md` | Entre campos de una fila, relleno de filas |
| `espaciado-m-l` | 14 | `espacio/md-lg` | Relleno de tarjetas de evento, filas y notas |
| `espaciado-l` | 16 | `espacio/lg` | Entre bloques de una pantalla (separación vertical estándar) |
| `espaciado-l-xl` | 20 | `espacio/lg-xl` | Relleno de tarjetas destacadas |
| `espaciado-xl` | 24 | `espacio/xl` | Margen lateral de pantalla, relleno de la barra de acción |
| `espaciado-xl-2xl` | 28 | `espacio/xl-2xl` | Relleno de diálogos y bloques de estado |
| `espaciado-2xl` | 32 | `espacio/2xl` | Relleno de diálogos y tarjetas grandes |

En Tailwind corresponden a `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `3.5`, `4`, `5`, `6`, `7` y `8`.

---

## 4. Radios

Variables `radio/*` de Figma:

| Token | Valor | En Figma | Dónde se usa |
|---|---|---|---|
| `radio-xs` | 8 | `radio/xs` | Contenedores de ícono muy pequeños |
| `radio-s` | 14 | `radio/sm` | Etiquetas de estado, dígito de código, imágenes de producto |
| `radio-m` | 20 | `radio/md` | Campos, filas de lista, notas, tarjeta de evento, rasgo, estadística, acceso rápido |
| `radio-bloque` | 24 | `radio/bloque` | Marcadores (cámara, foto, documento), cédula, gráfica, calendario, ficha |
| `radio-l` | 28 | `radio/lg` | Tarjetas destacadas, tarjeta de alerta |
| `radio-dialogo` | 32 | `radio/dialogo` | Diálogo, tarjeta de tratamiento, tarjeta de mascota en Inicio |
| `radio-xl` | 44 | `radio/xl` | Hojas inferiores (esquinas superiores) |
| `radio-completo` | 999 | `radio/full` | Botones, chips, interruptores, búsqueda (píldora) |

Quedan en Figma unos pocos radios sueltos (3, 4, 10, 12, 26, 29, 50 y decimales) en decoraciones. En código se usa el token más cercano.

---

## 5. Sombras

| Token | Valor (CSS) | Dónde se usa |
|---|---|---|
| `sombra-tarjeta` | `0 8px 24px rgba(38, 38, 38, 0.08)` | Tarjeta de evento, formulario de E2, barra de acción, selector activo, tarjeta de producto |
| `sombra-flotante` | `0 12px 32px rgba(38, 38, 38, 0.22)` | Barra de navegación inferior |

---

## 6. Medidas de layout y de componentes

No están como variables en Figma, pero se repiten en todo el kit. En código conviene tenerlas con nombre (pregunta 13 de `CLAUDE.md`).

| Token | Valor | Dónde se usa |
|---|---|---|
| `ancho-lienzo` | 390 | Ancho del teléfono de diseño |
| `alto-lienzo` | 844 | Alto del teléfono de diseño |
| `ancho-contenido` | 342 | Ancho del contenido (390 − 2 × 24) |
| `margen-pantalla` | 24 (= `espaciado-xl`) | Margen lateral de todas las pantallas |
| `alto-boton` | 56 | Botón |
| `alto-campo` | 80 (con etiqueta) · 56 (caja) | Campo |
| `alto-busqueda` | 52 | Búsqueda |
| `alto-encabezado` | 44 | Encabezado de pantalla |
| `tamano-boton-icono` | 44 | Botón ícono |
| `alto-selector` | 44 | Selector y selector triple |
| `alto-chip` | 38 | Chip |
| `alto-fila` | 66–68 | Fila de lista, fila con interruptor, fila de toma |
| `alto-tarjeta-evento` | 80 | Tarjeta de evento |
| `alto-barra-accion` | 108 | Barra de acción fija abajo |
| `alto-navegacion` | 72 (ancho 358) | Navegación inferior flotante |
| `tamano-interruptor` | 52 × 32 | Interruptor |
| `tamano-digito` | 48 × 58 | Dígito de código |
| `tamano-rasgo` | 76 | Rasgo |
| `tamano-foto-mascota` | 160 | Foto de mascota grande |
| `tamano-icono-estado` | 104 | Círculo del ícono en el bloque de estado |
| `tamano-contenedor-icono` | 40 · 48 | Cuadro del ícono en filas y tarjetas |

---

## 7. Decisiones sobre duplicados

El 27 oct 2026 se encontraron 15 duplicados o valores parecidos y se aplicó en Figma la propuesta de cada uno. Las 151 pantallas que cambiaron se reexportaron a `design/flujos/`.

| # | Qué pasaba | Qué se decidió |
|---|---|---|
| 1 | Dos `neutro/900` (`#262626` y `#180D08`) | `#262626`. |
| 2 | Dos `neutro/500` (`#77737F` y `#6A797A`) | `#77737F`. |
| 3 | Dos verdes de marca casi iguales (`#2E5955` y `#2F5F5F`) | Un solo verde, `#2E5955`. `primario/800` queda como alias de `primario/900`. |
| 4 | `F9` era `#F9F9F9` al 70 % y el nombre no decía qué era | Nueva variable `fondo/pantalla`, `#F9F9F9` opaco. `F9` se borró. |
| 5 | `neutro/50` (`#F2F2F2`) sin uso | Se borró. |
| 6 | 262 bordes con `#DCE2E5` o `#C7D0D5` escritos a mano | Se conectaron a `acento/100` y `acento/300`. |
| 7 | Dos fondos de modal | `#262626` al 45 %. |
| 8 | La sombra de tarjeta usaba el morado retirado | `#262626` al 8 %. |
| 9 | Dos sombras flotantes | `#262626` al 22 %. |
| 10 | Radios fuera de la escala | Se agregaron 8, 24 y 32 a la escala. Se unificaron 16 → 14, 18 → 20 y 22 → 20. |
| 11 | Espaciados fuera de la escala | Se agregaron 6, 10, 14, 20 y 28 a la escala. Se unificaron 18 → 16 y 40 → 32. |
| 12 | Dos etiquetas de 13 px con distinto interlineado | Interlineado 18 en las dos. |
| 13 | Estilos de texto sueltos | Outfit 16 → `texto-titulo-seccion`; Plus Jakarta 800 / 700 a 11 → `texto-micro`; Plus Jakarta 600 a 16 → `texto-boton`. El lema de la bienvenida quedó como estaba (es ilustración). |
| 14 | Tamaños de ícono parecidos | Escala 14 · 18 · 22 · 24 · 32 · 48. Los de 20 pasaron a 22 dentro de contenedores de 40 o más, y a 18 en los demás. Los de 28 y 30 pasaron a 32. |
| 15 | Colecciones de color repetidas | Queda solo *Paleta · Verde y arena*. Se borraron *Paleta* y *Paleta · Cálida*, y todas las capas se reconectaron. Las páginas de portada y respaldo conservan sus colores, pero ya no atados a variables. |

El orden de cambio se mantiene para lo que venga: primero el kit y las variables de Figma, después este archivo y por último el código (`CLAUDE.md`, sección 5).
