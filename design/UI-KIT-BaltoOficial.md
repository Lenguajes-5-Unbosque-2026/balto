# Balto · UI kit

Sistema de diseño de **Balto**, la app de historia clínica y cuidado de mascotas. Documenta la sección **🧩 UI kit · Balto** de la página *⚙️ Componentes / Ui kit* del archivo de Figma.

- **Archivo:** [Balto en Figma](https://www.figma.com/design/nn9NNp63liXbRUEN6Lu0Pm/Balto?node-id=3-4)
- **Plataforma:** web móvil. Se diseña sobre un lienzo de teléfono de 390 × 844 con contenido de 342 px de ancho y márgenes de 24 px. En código, el ancho del contenido se adapta al del teléfono y los márgenes laterales se mantienen.
- **Solo de maqueta:** la Barra de estado, el Reloj de pantalla bloqueada y la Notificación push representan elementos que dibujan el sistema operativo o el navegador. Sirven para presentar las pantallas en Figma y no se implementan como componentes de la web.
- **Componentes:** 59, más la paleta de color, en 8 categorías.

---

## Índice

1. [Fundamentos](#1-fundamentos)
   - [Color](#color)
   - [Tipografía](#tipografía)
   - [Iconografía](#iconografía)
   - [Radios](#radios)
   - [Espaciado](#espaciado)
2. [Básicos](#2-básicos)
3. [Formularios](#3-formularios)
4. [Navegación y estructura](#4-navegación-y-estructura)
5. [Listas y filas](#5-listas-y-filas)
6. [Tarjetas](#6-tarjetas)
7. [Estados y avisos](#7-estados-y-avisos)
8. [Contenido visual](#8-contenido-visual)
9. [Reglas de uso del color semántico](#9-reglas-de-uso-del-color-semántico)

---

## 1. Fundamentos

### Color

La paleta activa es la colección **Paleta · Verde y arena**. El texto usa además dos neutros de la colección **Paleta** (modo *Claro*).

#### Marca y neutros

| Token | Hex | Uso |
|---|---|---|
| `primario/900` | `#2E5955` | Color principal: íconos, enlaces, botones activos, tarjetas destacadas |
| `primario/800` | `#2F5F5F` | Relleno del botón primario, chips activos, interruptor encendido |
| `acento/300` | `#C7D0D5` | Botón suave, barras de progreso pendientes, rasgos |
| `acento/100` | `#DCE2E5` | Contenedores de ícono, notas informativas, fondos de campos |
| `neutro/900` | `#262626` | Texto principal (colección *Paleta*) |
| `neutro/500` | `#77737F` | Texto secundario, subtítulos, íconos finales (colección *Paleta*) |
| `neutro/50` | `#F2F2F2` | Fondos sutiles |
| `F9` | `#F9F9F9` | Fondo de pantalla |
| `neutro/0` | `#FFFFFF` | Superficies, tarjetas, texto sobre color |

#### Semánticos

| Token | Hex | Uso |
|---|---|---|
| `semántico/éxito` | `#2E8B57` | Ícono y texto de algo que salió bien o se completó |
| `semántico/éxito-suave` | `#DFF3E6` | Fondo de contenedores, notas y etiquetas de éxito |
| `semántico/error` | `#C8475B` | Errores, advertencias y acciones destructivas |
| `semántico/error-suave` | `#FBE3E7` | Fondo de contenedores, notas y etiquetas de error |

#### Alias

Estos tokens existen para mantener el significado, pero apuntan a otros colores:

| Token | Apunta a | Motivo |
|---|---|---|
| `semántico/advertencia` | `semántico/error` | Las advertencias usan rojo; no hay ámbar |
| `semántico/advertencia-suave` | `semántico/error-suave` | Ídem |
| `semántico/info` | `primario/900` | Lo informativo va en el color de marca |
| `semántico/info-suave` | `acento/100` | Ídem |
| `categoría/{vacuna, medicamento, examen, consulta, bienestar, alimentación}` | `primario/900` | Las categorías no llevan color propio |
| `categoría/*-suave` | `acento/100` | Ídem |

> **Colores retirados:** morado y lavanda (`morado/900`, `lavanda/400`, `lavanda/300`, `lavanda/100`) y arena (`acento/400`). Siguen en las colecciones por compatibilidad, pero ningún componente ni pantalla los usa.

### Tipografía

| Rol | Familia | Estilo | Tamaño |
|---|---|---|---|
| Display (reloj) | Outfit | SemiBold | 40 |
| Título de pantalla / estado | Outfit | SemiBold | 28 |
| Título de tarjeta / diálogo | Outfit | SemiBold | 22 |
| Título de encabezado / sección | Outfit | Medium | 18 |
| Botón | Plus Jakarta Sans | Bold | 16 |
| Cuerpo / título de fila | Plus Jakarta Sans | SemiBold · Regular | 15 |
| Etiqueta / secundario | Plus Jakarta Sans | SemiBold · Regular | 13 |
| Microcopia / etiqueta en mayúsculas | Plus Jakarta Sans | Medium | 11 |

### Iconografía

- **Familia:** Material Symbols Rounded (Regular), escrita como texto con ligaduras. Por ejemplo, `vaccines`, `medication`, `pets`, `check_circle` o `error`.
- **Tamaños habituales:** 18–22 px en filas y botones, 24 px en tarjetas, 48 px en bloques de estado.
- **Cambiar un ícono:** se edita la propiedad de texto **Ícono** del componente.

### Radios

| Token | Valor |
|---|---|
| `radio/sm` | 14 |
| `radio/md` | 20 |
| `radio/lg` | 28 |
| `radio/xl` | 44 |
| `radio/full` | 999 (píldora) |

### Espaciado

| Token | Valor |
|---|---|
| `espacio/2xs` | 2 |
| `espacio/xs` | 4 |
| `espacio/sm` | 8 |
| `espacio/md` | 12 |
| `espacio/lg` | 16 |
| `espacio/xl` | 24 |
| `espacio/2xl` | 32 |

---

## 2. Básicos

### Barra de estado
Barra de estado del teléfono. Va arriba de cada pantalla en Figma, con fondo transparente. Solo de maqueta: en la web la dibuja el sistema y no se implementa.
- **Tamaño:** 390 × 50
- **Propiedades:** ninguna
- **Tokens:** `neutro/900`

### Botón
Botón en píldora de 56 px de alto.

| Variante `Tipo` | Uso |
|---|---|
| Primario | Acción principal de la pantalla |
| Secundario | Alternativa (contorno) |
| Oscuro | Llamado destacado |
| Suave | Acción terciaria |
| Destructivo | Confirmar algo irreversible (eliminar, cancelar suscripción) |
| Destructivo contorno | Acción destructiva secundaria (salir y descartar) |

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Texto | Texto | Continuar |
| Ícono | Texto | arrow_forward |
| Mostrar ícono | Booleano | No |

### Botón ícono
Botón circular de 44 px para volver, más opciones, notificaciones o filtros.
- **Variantes `Tipo`:** Claro · Suave · Primario · Oscuro

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | arrow_back |

### Chip
Filtros y selectores de categoría: tipo de evento, filtros de la línea de tiempo, proveedores.
- **Tamaño:** alto 38, radio 999
- **Variantes `Estado`:** Activo · Inactivo

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Texto | Texto | Vacunas |
| Ícono | Texto | vaccines |
| Mostrar ícono | Booleano | Sí |

### Interruptor
Activar o desactivar recordatorios, alertas y notificaciones.
- **Tamaño:** 52 × 32
- **Variantes `Estado`:** Encendido · Apagado

### Casilla de verificación
Aceptación o confirmación con texto largo, como términos o política de datos.
- **Tamaño:** 342 de ancho, radio 20
- **Variantes `Estado`:** Marcada · Sin marcar

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Texto | Texto | Acepto los términos y la política de datos |

### Etiqueta de estado
Insignia corta de estado.
- **Tamaño:** alto 26, radio 14

| Variante `Tono` | Uso |
|---|---|
| Neutro | Informativo (VIGENTE) |
| Éxito | Cumplido (Tomada); usa `semántico/éxito` |
| Error | Omitido o vencido; usa `semántico/error` |

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Texto | Texto | VIGENTE |

### Enlace
Enlace de texto centrado de 342 px.
- **Variantes `Tipo`:**
  - **Simple:** una sola frase en color de marca.
  - **Con pregunta:** la pregunta en gris y el enlace en color de marca.

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Texto | Texto | Texto del enlace |
| Pregunta | Texto | ¿Pregunta para el usuario? |
| Enlace | Texto | Toca aquí |

### Foto de mascota
Marcador de foto de 160 × 160 con radio 28. Reemplaza el relleno por la foto real de la mascota.
- **Propiedades:** ninguna

---

## 3. Formularios

### Campo
Campo de formulario que sirve para todos los formularios: cuenta, perfil de mascota, eventos, medicamentos y ajustes.
- **Tamaño:** 342 × 80
- **Variantes `Estado`:** Normal · Foco · Error

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Etiqueta | Texto | Correo electrónico |
| Valor | Texto | samuel@correo.com |
| Ícono inicial | Texto | mail |
| Mostrar ícono final | Booleano | Sí |
| Ayuda | Texto | Revisa este dato e inténtalo de nuevo |

### Área de texto
Campo multilínea con etiqueta. En estado Foco el borde se resalta en color primario.
- **Tamaño:** 342 × 114
- **Variantes `Estado`:** Normal · Foco

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Etiqueta | Texto | Etiqueta |
| Texto | Texto | Escribe aquí tus observaciones. |

### Búsqueda
Barra de búsqueda con campo y botón de filtro opcional.
- **Tamaño:** 342 × 52
- **Anida:** Botón ícono

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Texto | Texto | Buscar |
| Mostrar filtro | Booleano | Sí |

### Selector
Control segmentado de 2 opciones, como Perro / Gato o Sí tiene / No tiene.
- **Tamaño:** 342 × 44
- **Variantes `Activo`:** Izquierda · Derecha

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Opción izquierda | Texto | Opción 1 |
| Opción derecha | Texto | Opción 2 |

### Selector triple
Control segmentado de 3 opciones, para frecuencia, distancia o rango.
- **Tamaño:** 342 × 44
- **Variantes `Activo`:** 1 · 2 · 3

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Opción 1 | Texto | Cada 8 h |
| Opción 2 | Texto | Cada 12 h |
| Opción 3 | Texto | Cada 24 h |

### Control de cantidad
Etiqueta con controles − / + para cantidades, como comidas al día o unidades.
- **Tamaño:** 342 × 44
- **Anida:** Botón ícono

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Etiqueta | Texto | Comidas al día |
| Valor | Texto | 2 |

### Dígito de código
Casilla de un dígito para códigos de verificación.
- **Tamaño:** 48 × 58
- **Variantes `Estado`:** Vacío · Foco · Lleno · Error

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Dígito | Texto | 3 |

### Código de verificación
Grupo de 6 Dígitos de código para verificar el correo.
- **Tamaño:** 342 × 58
- **Anida:** Dígito de código

### Día
Celda de calendario de 40 px. El número se edita directamente en la instancia.

| Variante `Tipo` | Uso |
|---|---|
| Encabezado | Inicial del día (L, M, M…) |
| Normal | Día sin marca |
| Seleccionado | Día con evento (fondo gris) |
| Elegido | Día elegido por la persona (verde primario, texto blanco) |

### Calendario
Mes completo armado con el componente Día.
- **Tamaño:** 342 × 288, radio 24
- **Anida:** Día

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Mes | Texto | Septiembre 2026 |

---

## 4. Navegación y estructura

### Encabezado
Encabezado de pantalla. Tiene a la izquierda un botón de regreso o un espacio vacío, el título centrado, y a la derecha un botón de cierre o un espacio vacío.
- **Tamaño:** 342 × 44
- **Anida:** Botón ícono. Su ícono se puede cambiar, por ejemplo por `ios_share`, `more_horiz` o `add`.
- **Variantes:** `Izquierda` = Atrás · Vacío, combinada con `Derecha` = Vacío · Cerrar

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Título | Texto | Título de la pantalla |

### Encabezado de inicio
Saludo al dueño con avatar y acceso rápido. Va en la pantalla de inicio.
- **Tamaño:** 342 × 50
- **Anida:** Botón ícono

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | person |
| Saludo | Texto | Hola, Samuel |
| Subtítulo | Texto | Todo en un solo lugar |

### Encabezado con contador
Título grande de pantalla madre con contador y una acción a la derecha.
- **Tamaño:** 342 × 44
- **Anida:** Botón ícono

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Título | Texto | Alertas |
| Contador | Texto | 3 |

### Encabezado de sección
Título de sección con enlace de acción opcional a la derecha.
- **Tamaño:** 342 × 24

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Título | Texto | Título de la sección |
| Acción | Texto | Agregar |
| Mostrar acción | Booleano | Sí |

### Selector de mascota
Píldora con foto y nombre para cambiar de mascota desde un encabezado.
- **Tamaño:** 108 × 42
- **Anida:** Foto de mascota

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Nombre | Texto | Luna |

### Barra de acción
Barra inferior de acciones con un botón primario o dos botones del mismo ancho (primario + secundario).
- **Tamaño:** 390 × 108
- **Anida:** Botón
- **Variantes `Botones`:** 1 · 2

### Navegación inferior
Barra flotante oscura con Inicio, Línea de tiempo, Registrar (botón blanco), Tienda y Alertas.
- **Tamaño:** 358 × 72
- **Variantes `Activo`:** Inicio · Línea de tiempo · Alertas · Tienda

### Progreso
Indicador de pasos de un flujo. Muestra la etiqueta «PASO X DE N · ETAPA» y una barra segmentada. La etiqueta se edita en la instancia.
- **Tamaño:** 342 × 28
- **Variantes:** `Pasos` = 2 · 3 · 4, combinada con `Actual` = 1…4 (9 combinaciones)

### Indicador de página
Puntos de paginación del onboarding de 3 pantallas. El punto activo es alargado.
- **Variantes `Actual`:** 1 · 2 · 3

### Asa de hoja
Indicador de arrastre en la parte superior de las hojas inferiores.
- **Tamaño:** 342 × 5

### Hoja inferior
Hoja que sube desde abajo con asa, título, opciones y una acción. Se usa sobre el Fondo de modal.
- **Tamaño:** 390 de ancho, esquinas superiores redondeadas
- **Anida:** Fila de lista, Botón

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Título | Texto | Posponer aviso |

### Fondo de modal
Capa oscura que va detrás de los diálogos y las hojas inferiores.
- **Tamaño:** 390 × 844

---

## 5. Listas y filas

### Fila de lista
Fila con ícono en un cuadro suave, título, subtítulo opcional e ícono final (chevron, radio, check…).
- **Tamaño:** 342 de ancho, radio 20

| Variante `Estado` | Uso |
|---|---|
| Normal | Fila por defecto |
| Seleccionada | Opción elegida (borde primario) |
| Completada | Paso cumplido; ícono y check en `semántico/éxito` |

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Título | Texto | Título de la fila |
| Subtítulo | Texto | Detalle breve de la fila |
| Mostrar subtítulo | Booleano | Sí |
| Ícono | Texto | pets |
| Ícono final | Texto | chevron_right |
| Mostrar ícono final | Booleano | Sí |

### Fila con interruptor
Fila de ajuste con interruptor, como recordatorios o el dato "Esterilizada".
- **Tamaño:** 342 × 68
- **Anida:** Interruptor
- **Variantes `Ícono`:** Sí · No

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | notifications_active |
| Título | Texto | Recordatorio |
| Detalle | Texto | 10 min antes de cada toma |

### Fila de mascota
Foto, nombre y datos básicos de la mascota.
- **Tamaño:** 342 × 64
- **Anida:** Foto de mascota

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Nombre | Texto | Nombre de la mascota |
| Detalle | Texto | Especie · Raza · Sexo · Edad |

### Fila de toma
Toma programada de un medicamento, con hora, dosis y estado.
- **Tamaño:** 342 × 68, radio 22

| Variante `Estado` | Uso |
|---|---|
| Tomada | Etiqueta verde (`semántico/éxito`) |
| Pendiente | Botón «Confirmar» |
| Omitida | Etiqueta roja (`semántico/error`) |

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Hora | Texto | 08:00 |
| Periodo | Texto | AM |
| Título | Texto | Mañana |
| Detalle | Texto | Tomada 8:05 a. m. |

### Dato
Fila etiqueta–valor para resúmenes, como la ficha de la mascota, una cita o un pedido.
- **Variantes `Tipo`:**
  - **Normal:** dato estándar.
  - **Total:** cierre de un resumen de pago.

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Etiqueta | Texto | Microchip |
| Valor | Texto | 985 112 000 123 456 |

### Hora de toma
Hora y periodo (AM/PM) al inicio de una fila de toma.
- **Tamaño:** 51 × 38

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Hora | Texto | 08:00 |
| Periodo | Texto | AM |

### Tarjeta de evento
Evento de la línea de tiempo, el historial de salud, la bitácora de hábitos y el resumen de carga inicial.
- **Tamaño:** 342 × 80, radio 22

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Título | Texto | Vacuna antirrábica |
| Detalle | Texto | Refuerzo anual · Clínica Veterinaria Norte |
| Fecha | Texto | 12 SEP 2026 |
| Soportes | Texto | 1 soporte |
| Ícono | Texto | vaccines |

### Evento de línea de tiempo
Punto de la línea de tiempo con su tarjeta de evento.
- **Tamaño:** 346 × 80
- **Anida:** Tarjeta de evento

---

## 6. Tarjetas

### Tarjeta destacada
Cabecera oscura de una pantalla de detalle: evento, examen, plan o alerta.
- **Tamaño:** 342 de ancho, radio 28
- **Anida:** Rasgo
- **Variantes `Rasgos`:** Sí · No

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | vaccines |
| Título | Texto | Vacuna antirrábica |
| Detalle | Texto | 12 sep 2026 · Clínica Veterinaria Norte |

### Tarjeta de alerta
Alerta de salud con fecha de vencimiento y acciones rápidas.
- **Tamaño:** 342 × 154, radio 28
- **Anida:** Botón, Botón ícono
- **Variantes `Urgencia`:**
  - **Urgente:** oscura, vence pronto.
  - **Próxima:** verde primario.

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | vaccines |
| Vencimiento | Texto | VENCE EN 2 DÍAS · 25 SEP |
| Título | Texto | Refuerzo antirrábica |
| Detalle | Texto | Luna · última dosis 25 sep 2025 |

### Tarjeta de tratamiento
Cabecera del tratamiento activo con el progreso de días y sus rasgos.
- **Tamaño:** 342 × 232, radio 32
- **Anida:** Rasgo

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Título | Texto | Amoxicilina |
| Detalle | Texto | 250 mg · Cápsula oral |

### Tarjeta de producto
Producto de la tienda: imagen o ícono, aviso de reposición opcional, nombre, detalle y precio con botón de agregar.
- **Tamaño:** 166 × 230, radio 22

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | restaurant |
| Aviso | Texto | SE ACABA EN 12 DÍAS |
| Mostrar aviso | Booleano | Sí |
| Nombre | Texto | Nombre del producto |
| Detalle | Texto | Presentación · según su plan |
| Precio | Texto | $ 00.000 |

### Tarjeta de plan
Resumen del plan de suscripción con precio y beneficios.
- **Tamaño:** 342 × 208, radio 28

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Etiqueta | Texto | PLAN COMPLETO |
| Precio | Texto | $ 00.000 / mes |
| Beneficio 1 | Texto | Activo · se renueva el 23 oct 2026 |
| Beneficio 2 | Texto | Mascotas ilimitadas |
| Beneficio 3 | Texto | Reportes PDF para compartir |

### Cédula animal
Identificación Balto de la mascota, con número y rasgos.
- **Tamaño:** 342 × 220, radio 24
- **Anida:** Rasgo

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Etiqueta | Texto | CÉDULA ANIMAL · BALTO |
| Número | Texto | BAL-0001-LUNA |
| Detalle | Texto | Emitida el 23 sep 2026 · Perro · Golden |

### Ficha de mascota
Datos clave de la mascota para compartir con el veterinario.
- **Tamaño:** 342 × 242, radio 24
- **Anida:** Foto de mascota

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Nombre | Texto | Luna |
| Descripción | Texto | Perro · Golden · Hembra · 3 años |

### Estadística
Dato resumido con número grande y etiqueta. Se usan 3 en fila.
- **Tamaño:** 107 × 68, radio 22

| Variante `Tono` | Uso |
|---|---|
| Primario | Dato principal |
| Acento | Dato secundario |
| Claro | Dato neutro |
| Éxito | Algo al día o cumplido |
| Error | Algo urgente o pendiente |

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Valor | Texto | 6 |
| Etiqueta | Texto | Eventos |

### Rasgo
Dato corto de la mascota o del tratamiento: esterilizada, peso, microchip, frecuencia.
- **Tamaño:** 76 × 76, radio 22
- **Variantes `Tema`:** Claro · Oscuro

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Texto | Texto | Microchip |
| Ícono | Texto | verified |

### Acceso rápido
Mosaico de acceso a una sección, como en la Tienda o el Inicio.
- **Tamaño:** 107 × 96, radio 22
- **Variantes `Estado`:** Activo · Inactivo

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | restaurant |
| Texto | Texto | Alimentos |

### Tipo de evento
Mosaico de categoría para elegir qué registrar: vacuna, consulta, alimentación…
- **Tamaño:** 107 × 70, radio 22

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | restaurant |
| Texto | Texto | Alimentación |

### Acción de compartir
Botón cuadrado de canal: WhatsApp, correo, imprimir o guardar. Se usa en fila de 4.
- **Tamaño:** 57 × 76

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | chat |
| Texto | Texto | WhatsApp |

---

## 7. Estados y avisos

### Estado
Bloque de estado centrado: ícono en círculo de 104 px, título y mensaje. Se usa para confirmaciones, errores y pantallas vacías.
- **Tamaño:** 342 de ancho

| Variante `Tono` | Fondo del ícono | Color del ícono | Ejemplos |
|---|---|---|---|
| Neutro | `acento/100` | `primario/900` | Pantallas vacías, procesos en curso, permisos |
| Éxito | `semántico/éxito-suave` | `semántico/éxito` | Contraseña actualizada, pago aprobado, cita agendada |
| Error | `semántico/error-suave` | `semántico/error` | Código incorrecto, pago rechazado, sin conexión |

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | info |
| Título | Texto | Título del estado |
| Mensaje | Texto | Mensaje breve que explica qué pasó y qué hacer ahora. |
| Mostrar mensaje | Booleano | Sí |

### Nota
Nota corta con ícono y texto sobre fondo suave.
- **Tamaño:** 342 de ancho, radio 18

| Variante `Tono` | Fondo | Borde | Uso |
|---|---|---|---|
| Info | `acento/100` | — | Ayuda o contexto |
| Éxito | `semántico/éxito-suave` | éxito al 28 % | Confirmación |
| Error | `semántico/error-suave` | error al 28 % | Errores y advertencias («te quedan 2 intentos») |

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | info |
| Texto | Texto | Mensaje breve de apoyo para quien completa el paso. |

### Diálogo
Diálogo de confirmación con ícono, título, mensaje y botones apilados.
- **Tamaño:** 334 de ancho, radio 32
- **Anida:** Botón

| Variante | Uso |
|---|---|
| `Tono=Aviso, Botones=2` | Confirmaciones normales (salir, finalizar, cerrar sesión) |
| `Tono=Destructivo, Botones=2` | Eliminar o cancelar; botón principal en `semántico/error` |
| `Tono=Destructivo, Botones=3` | Destructivo con una acción previa (por ejemplo, descargar datos antes de eliminar la cuenta) |

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | warning |
| Título | Texto | ¿Confirmar esta acción? |
| Mensaje | Texto | Explica en una frase qué pasará si la persona continúa. |

### Notificación push
Vista previa de una notificación del sistema con dos acciones. Solo de maqueta: en la web la notificación la muestra el sistema; el componente sirve para presentar las pantallas de recordatorio (G5, H5, J6).
- **Tamaño:** 342 × 158, radio 24
- **Anida:** Botón

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono app | Texto | pets |
| App | Texto | MASCOTAS |
| Tiempo | Texto | ahora |
| Título | Texto | Hora de la dosis de Luna |
| Mensaje | Texto | Amoxicilina 250 mg · 1 cápsula (20:00) |

### Reloj de pantalla bloqueada
Hora y fecha grandes para mostrar notificaciones en la pantalla bloqueada. Solo de maqueta: no se implementa en la web.
- **Tamaño:** 342 × 134

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Hora | Texto | 9:41 |
| Fecha | Texto | Miércoles, 23 de septiembre |

---

## 8. Contenido visual

### Marcador
Espacio reservado para una foto, un mapa, la cámara o una ilustración. La altura se ajusta según el uso.
- **Tamaño:** 342 × 240, radio 24

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Ícono | Texto | photo_camera |
| Texto | Texto | Vista de cámara · encuadra el carnet |

### Gráfica de barras
Barras de evolución, por ejemplo de peso o paseos. La última barra resalta el periodo actual.
- **Tamaño:** 342 × 194, radio 24

| Propiedad | Tipo | Por defecto |
|---|---|---|
| Título | Texto | Evolución del peso |
| Periodo | Texto | 6 MESES |

### Vista previa de PDF
Miniatura del reporte en PDF antes de enviarlo.
- **Tamaño:** 342 × 349, radio 28
- **Anida:** Foto de mascota

---

## 9. Reglas de uso del color semántico

1. **Solo dos colores comunican estado:** verde para lo que salió bien y rojo para errores, advertencias y acciones destructivas. Todo lo demás va en el verde de marca (`primario/900`) sobre gris (`acento/100`).
2. **Las advertencias usan rojo.** No hay ámbar. Por ejemplo: «te quedan 2 intentos», «cambios pendientes de subir» o «no cierres sesión».
3. **Los estados neutros no llevan color:** pantallas vacías, permisos de cámara o notificaciones, carrito vacío y procesos en curso como «Leyendo tu documento».
4. **Las acciones destructivas** usan `Botón · Destructivo` o el diálogo `Tono=Destructivo`.
5. **Pasos cumplidos:** `Fila de lista · Completada`, `Etiqueta de estado · Éxito` o `Fila de toma · Tomada`.
6. **No se usan colores por categoría** (vacuna, medicamento, examen…): todas comparten el color de marca.
7. **No se usan morado, lavanda ni arena.**
