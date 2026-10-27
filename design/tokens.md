# Balto · Tokens de diseño

Valores base del sistema de diseño con un nombre fijo. En código, cada pantalla usa estos nombres y nunca valores sueltos (regla de `CLAUDE.md`, sección 5).

**Fuentes:**
- `design/UI-KIT-BaltoOficial.md`.
- Las variables de Figma (colecciones *Paleta*, *Paleta · Verde y arena*, *Radio* y *Espaciado*).
- Un conteo de los valores que usan de verdad las 156 pantallas de *Casos de uso* (27 oct 2026). La columna **Usos** es ese conteo de capas.

**Convención de nombres:** `categoría-rol-variante`, en español y sin tildes, para que se puedan usar tal cual como variables CSS y clases de Tailwind (por ejemplo `--color-primario` o `bg-primario`).

> Los valores marcados con ⚠️ tienen un duplicado o un valor parecido. No están unificados. La decisión está pendiente y la propuesta está en la sección [7. Duplicados y valores por decidir](#7-duplicados-y-valores-por-decidir).

---

## 1. Colores

### Marca y neutros

| Token | Valor | En Figma | Dónde se usa | Usos |
|---|---|---|---|---|
| `color-primario` | `#2E5955` | `primario/900` | Íconos, enlaces, texto destacado, tarjetas destacadas, bordes de foco | 778 |
| `color-primario-relleno` ⚠️ | `#2F5F5F` | `primario/800` | Relleno del botón primario, chip activo, interruptor encendido, borde de campo en foco | 394 |
| `color-acento` | `#C7D0D5` | `acento/300` | Botón suave, segmentos pendientes del progreso, rasgos, bordes | 330 |
| `color-acento-suave` | `#DCE2E5` | `acento/100` | Contenedores de ícono, notas informativas, bordes de tarjetas y campos | 744 |
| `color-texto` ⚠️ | `#262626` | `neutro/900` (*Paleta*) | Texto principal, barra de navegación inferior, tarjetas oscuras (alerta urgente, tratamiento) | 1.787 |
| `color-texto-alterno` ⚠️ | `#180D08` | `neutro/900` (*Verde y arena*) | Texto principal en algunas pantallas (mismo rol que `color-texto`) | 124 |
| `color-texto-secundario` ⚠️ | `#77737F` | `neutro/500` (*Paleta*) | Subtítulos, ayudas, íconos finales, texto inactivo | 694 |
| `color-texto-secundario-alterno` ⚠️ | `#6A797A` | `neutro/500` (*Verde y arena*) | Mismo rol que `color-texto-secundario` | 126 |
| `color-fondo` ⚠️ | `#F9F9F9` | `F9` | Fondo de todas las pantallas | 147 pantallas |
| `color-fondo-sutil` ⚠️ | `#F2F2F2` | `neutro/50` | Fondos sutiles (definido en el kit, ninguna pantalla lo usa) | 0 |
| `color-superficie` | `#FFFFFF` | `neutro/0` | Tarjetas, campos, hojas inferiores, diálogos; texto e íconos sobre color | 1.131 |

### Semánticos

| Token | Valor | En Figma | Dónde se usa | Usos |
|---|---|---|---|---|
| `color-exito` | `#2E8B57` | `semántico/éxito` | Ícono y texto de algo que salió bien (toma tomada, pago aprobado, paso cumplido) | 39 |
| `color-exito-suave` | `#DFF3E6` | `semántico/éxito-suave` | Fondo de estados, notas y etiquetas de éxito | 31 |
| `color-error` | `#C8475B` | `semántico/error` | Errores, advertencias, acciones destructivas | 64 |
| `color-error-suave` | `#FBE3E7` | `semántico/error-suave` | Fondo de estados, notas y etiquetas de error | 35 |

### Alias

No tienen valor propio: apuntan a otro token. Existen para que el código diga qué significa el color.

| Token | Apunta a | Dónde se usa |
|---|---|---|
| `color-advertencia` | `color-error` | «Te quedan 2 intentos», «cambios pendientes». No hay ámbar. |
| `color-advertencia-suave` | `color-error-suave` | Fondo de esas advertencias |
| `color-info` | `color-primario` | Notas informativas |
| `color-info-suave` | `color-acento-suave` | Fondo de notas informativas |
| `color-borde` | `color-acento-suave` | Bordes de tarjetas, filas y campos (en Figma hay 171 bordes con `#DCE2E5` escrito a mano) |
| `color-borde-fuerte` | `color-acento` | Bordes de botón secundario y chips inactivos (91 bordes con `#C7D0D5` escrito a mano) |
| `color-oscuro` | `color-texto` | Barra de navegación inferior y tarjetas oscuras |

Las variables `categoría/*` de Figma (vacuna, medicamento, examen, consulta, bienestar, alimentación) apuntan todas a `primario/900` y `acento/100`. **En código no se crean**, porque el kit dice que las categorías no llevan color propio (regla 6 de color semántico).

### Translúcidos

| Token | Valor | Dónde se usa | Usos |
|---|---|---|---|
| `color-fondo-modal` ⚠️ | `#262626` al 45 % | Capa detrás de diálogos y hojas inferiores | 9 |
| `color-fondo-modal-alterno` ⚠️ | `#170D08` al 55 % | Misma capa, en otras pantallas | 5 |
| `color-sobre-oscuro-secundario` | `#FFFFFF` al 70 % | Texto secundario sobre tarjetas oscuras o verdes (H1, H4, J2, N5, N9) | 6 |
| `color-sobre-oscuro-icono` | `#FFFFFF` al 55 % | Íconos atenuados sobre fondo oscuro | 6 |
| `color-sobre-oscuro-halo` | `#FFFFFF` al 22 % | Halo decorativo sobre fondo oscuro | 13 |
| `color-exito-borde` | `#2E8B57` al 28 % | Borde de la nota de éxito | 1 |
| `color-error-borde` | `#C8475B` al 28 % | Borde de la nota de error | — |

### Retirados (no usar)

`morado/900` `#4E458C`, `lavanda/400` `#ADA2F2`, `lavanda/300` `#BEB6F2`, `lavanda/100` `#E0DFF2` y la arena `acento/400` `#ECD3AB`. Siguen en las colecciones de Figma, pero ninguna pantalla los usa como relleno. **Excepción:** la sombra de tarjeta usa el morado (ver Sombras).

---

## 2. Tipografía

### Familias

| Token | Valor | Dónde se usa |
|---|---|---|
| `fuente-titulos` | Outfit | Títulos de pantalla, tarjeta, sección y números grandes |
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

| Token | Familia | Peso | Tamaño | Interlineado | Espaciado entre letras | Dónde se usa | Usos |
|---|---|---|---|---|---|---|---|
| `texto-display` | Outfit | 600 | 40 | 44 | −2 % | Reloj de pantalla bloqueada (solo maqueta) | 2 |
| `texto-titulo-pantalla` | Outfit | 600 | 28 | 34 | −1 % | Título de pantalla y de bloque de estado | 64 |
| `texto-titulo-tarjeta` | Outfit | 600 | 22 | 28 | −0,5 % | Título de tarjeta destacada y de diálogo | 63 |
| `texto-titulo-seccion` | Outfit | 500 | 18 | 24 | 0 | Título del encabezado y de sección | 169 |
| `texto-boton` | Plus Jakarta Sans | 700 | 16 | 20 | 0 | Botones | 207 |
| `texto-cuerpo-fuerte` | Plus Jakarta Sans | 600 | 15 | 22 | 0 | Título de fila, valor de campo destacado | 420 |
| `texto-cuerpo` | Plus Jakarta Sans | 400 | 15 | 22 | 0 | Párrafos, valor de campo | 211 |
| `texto-etiqueta-fuerte` ⚠️ | Plus Jakarta Sans | 600 | 13 | 16 | 0 | Etiqueta de campo, chip, texto de rasgo | 544 |
| `texto-etiqueta` ⚠️ | Plus Jakarta Sans | 400 | 13 | 18 | 0 | Subtítulos, ayudas, notas | 370 |
| `texto-micro` | Plus Jakarta Sans | 500 | 11 | 14 | +0,5 % | Microcopia y etiquetas en MAYÚSCULAS («PASO 1 DE 3», «VENCE EN 2 DÍAS») | 302 |

Hay valores sueltos que no entran en ningún estilo: Outfit 600 a 80 px (2 capas, reloj de maqueta), Outfit 600 a 16 px (3), Plus Jakarta Sans 800 a 11 px (2), 700 a 11 px (1) y 600 a 16 px (1). Ver la sección 7.

### Tamaños de ícono

| Token | Valor | Dónde se usa | Usos |
|---|---|---|---|
| `icono-xs` | 14 | Íconos dentro de chips pequeños y metadatos («1 soporte») | 27 |
| `icono-sm` ⚠️ | 18 | Ícono de chips y de campos | 612 |
| `icono-md` ⚠️ | 20 | Ícono de botón y de filas | 333 |
| `icono-lg` ⚠️ | 22 | Ícono en contenedores de fila y botones ícono | 467 |
| `icono-xl` | 24 | Íconos en tarjetas | 117 |
| `icono-2xl` ⚠️ | 32 | Íconos de marcadores (foto, cámara) | 18 |
| `icono-estado` | 48 | Ícono del bloque de estado | 49 |

También aparecen 28 (11), 30 (8), 36 (6) y tamaños con decimales (13,6 · 25,6 · 30,4) que salen de instancias escaladas.

---

## 3. Espaciados

Escala del kit (variables `espacio/*` de Figma):

| Token | Valor | Dónde se usa | Usos como separación / relleno |
|---|---|---|---|
| `espaciado-2xs` | 2 | Entre título y subtítulo de una fila | 240 / 0 |
| `espaciado-xs` | 4 | Entre ícono y texto pequeño; relleno de selectores segmentados | 167 / 50 |
| `espaciado-s` | 8 | Entre chips, entre etiqueta y campo | 276 / 2 |
| `espaciado-m` | 12 | Entre campos de una fila, relleno de filas | 394 / 449 |
| `espaciado-l` | 16 | Entre bloques de una pantalla (separación vertical estándar) | 154 / 310 |
| `espaciado-xl` | 24 | Margen lateral de pantalla, relleno de la barra de acción | 1 / 274 |
| `espaciado-2xl` | 32 | Relleno de diálogos y tarjetas grandes | 0 / 156 |

Valores que se usan mucho y **no están en la escala** del kit (pregunta 13 de `CLAUDE.md`):

| Token propuesto | Valor | Dónde se usa | Usos como separación / relleno |
|---|---|---|---|
| `espaciado-3xs` ⚠️ | 6 | Entre ícono y texto en chips y botones | 295 / 11 |
| `espaciado-s-m` ⚠️ | 10 | Entre filas de una lista, entre botones de la barra | 538 / 230 |
| `espaciado-m-l` ⚠️ | 14 | Relleno de tarjetas de evento, filas y notas | 120 / 516 |
| `espaciado-l-xl` ⚠️ | 20 | Relleno de tarjetas destacadas | 2 / 45 |
| `espaciado-xl-2xl` ⚠️ | 28 | Relleno de diálogos y bloques de estado | 0 / 215 |

Aparecen además 18 (28 usos), 40 (3) y otros valores sueltos.

---

## 4. Radios

Escala del kit (variables `radio/*` de Figma):

| Token | Valor | Dónde se usa | Usos |
|---|---|---|---|
| `radio-s` | 14 | Etiquetas de estado, contenedores de ícono pequeños | 185 |
| `radio-m` | 20 | Campos, filas de lista, casilla de verificación | 246 |
| `radio-l` | 28 | Tarjetas destacadas, tarjeta de alerta, foto de mascota | 24 |
| `radio-xl` | 44 | Hojas inferiores (esquinas superiores), botones grandes | 160 |
| `radio-completo` | 999 | Botones, chips, interruptores, búsqueda (píldora) | 816 |

Radios en uso que **no están en el kit** (pregunta 12 de `CLAUDE.md`):

| Token propuesto | Valor | Dónde se usa | Usos |
|---|---|---|---|
| `radio-2xs` ⚠️ | 8 | Contenedores de ícono muy pequeños | 19 |
| `radio-s-m` ⚠️ | 16 | Dígito de código, imágenes de producto | 63 |
| `radio-nota` ⚠️ | 18 | Notas, campos internos («Caja»), días del calendario | 277 |
| `radio-tarjeta` ⚠️ | 22 | Tarjeta de evento, rasgo, estadística, tipo de evento, acceso rápido | 110 |
| `radio-bloque` ⚠️ | 24 | Marcadores (cámara, foto, documento), cédula, gráfica, calendario, ficha | 60 |
| `radio-dialogo` ⚠️ | 32 | Diálogo, tarjeta de tratamiento, tarjeta de mascota en Inicio | 19 |

Aparecen además 3, 4, 10, 12, 26, 29, 50 y radios con decimales (5,95 · 13,3 · 11,2), con menos de 10 usos cada uno.

---

## 5. Sombras

| Token | Valor (CSS) | Dónde se usa | Usos |
|---|---|---|---|
| `sombra-tarjeta` ⚠️ | `0 8px 24px rgba(78, 69, 140, 0.10)` | Tarjeta de evento, formulario de E2, barra de acción, selector activo, tarjeta de producto | 38 |
| `sombra-flotante` ⚠️ | `0 12px 32px rgba(38, 38, 38, 0.22)` | Barra de navegación inferior | 10 |
| `sombra-flotante-alterna` ⚠️ | `0 12px 32px rgba(24, 13, 8, 0.22)` | Barra de navegación inferior (una pantalla) | 1 |

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

## 7. Duplicados y valores por decidir

Son los valores parecidos que **no se unificaron**. Hay que decidir cada uno con Figma al lado; la columna **Propuesta** es una recomendación, no un cambio hecho.

| # | Qué pasa | Valores | Propuesta |
|---|---|---|---|
| 1 | Dos `neutro/900` en colecciones distintas | `#262626` (1.787 usos) y `#180D08` (124) | Quedarse con `#262626` (es el del kit) y reconectar en Figma las 124 capas. |
| 2 | Dos `neutro/500` | `#77737F` (694) y `#6A797A` (126) | Quedarse con `#77737F` (es el del kit). |
| 3 | Dos verdes de marca casi iguales | `#2E5955` (`primario/900`) y `#2F5F5F` (`primario/800`) | A la vista no se distinguen. Usar uno solo, `color-primario`, y dejar `primario/800` como alias. |
| 4 | `F9` no es opaco en Figma | El kit dice `#F9F9F9`; en Figma la variable es `#F9F9F9` al 70 %. Además el nombre no dice qué es. | En código, `#F9F9F9` opaco. En Figma, renombrar a `fondo/pantalla` y ponerle opacidad 100 %. No volver a usarlo para texto (antes estaba en el texto del botón principal). |
| 5 | `neutro/50` sin uso y muy cercano a `F9` | `#F2F2F2` y `#F9F9F9` | Quitar `neutro/50`, o dejarlo solo si algún componente lo necesita. |
| 6 | Bordes con color escrito a mano | 171 bordes `#DCE2E5` y 91 `#C7D0D5` sin variable | Son el mismo valor que `acento/100` y `acento/300`: conectarlos a la variable en Figma. En código usar `color-borde` y `color-borde-fuerte`. |
| 7 | Dos fondos de modal | `#262626` al 45 % y `#170D08` al 55 % | Quedarse con `#262626` al 45 %. |
| 8 | La sombra de tarjeta usa un color retirado | Morado `#4E458C` al 10 % | Cambiarla a `#262626` al 8–10 %, para no depender de un color retirado. |
| 9 | Dos sombras flotantes | `#262626` y `#180D08` al 22 % | Quedarse con `#262626`. |
| 10 | Radios fuera de la escala del kit | 8, 16, 18, 22, 24, 32 (además de 14, 20, 28, 44) | Agregar al kit 8, 24 y 32 (componentes distintos: ícono pequeño, bloques y diálogos). Unificar 16 → 14, 18 → 20 y 22 → 20 (la diferencia no se nota). |
| 11 | Espaciados fuera de la escala | 6, 10, 14, 20, 28 se usan cientos de veces | Agregarlos al kit. Tailwind ya los trae (`1.5`, `2.5`, `3.5`, `5`, `7`) y quitarlos cambiaría muchas pantallas. Unificar 18 → 16 y 40 → 32. |
| 12 | Dos etiquetas de 13 px con distinto interlineado | 600 con 16 de interlineado; 400 con 18 | Usar 18 en las dos. |
| 13 | Estilos de texto sueltos | Outfit 16 · Plus Jakarta 800 a 11 · 700 a 11 · 600 a 16 | Pasar a `texto-titulo-seccion`, `texto-micro` y `texto-boton`. |
| 14 | Tamaños de ícono parecidos | 18 / 20 / 22 y 28 / 30 / 32, más decimales | Escala 14 · 18 · 22 · 24 · 32 · 48. Unificar 20 → 18 o 22 según el componente, y 28 / 30 → 32. |
| 15 | Colecciones repetidas en Figma | *Paleta*, *Paleta · Verde y arena*, *Paleta · Cálida* (solo trae `semántico/error`) y variables de una librería externa con los mismos nombres | Dejar una sola colección de color (*Paleta · Verde y arena*) con los valores definitivos. |

Cuando el equipo decida, el orden es: primero el kit y las variables de Figma, después este archivo y por último el código (`CLAUDE.md`, sección 5).
