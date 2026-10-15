# UI kit de Balto

Página «⚙️ Componentes / Ui kit», sección «🧩 Componentes del flujo real»: 28 componentes (21 con variantes y 7 individuales, 70 símbolos en total) más la paleta de color y la iconografía. Leído del Figma el 15 oct 2026. Todos los tamaños están en px.

## 1. Tokens

### Color (12 variables)

| Variable | Hex | En la paleta del kit |
|---|---|---|
| primario/900 | #2E5955 | Sí, rotulada «principal/800» |
| primario/800 | #2F5F5F | Sí, rotulada «principal/900» |
| acento/300 | #C7D0D5 | Sí, rotulada «acento/400» |
| acento/100 | #DCE2E5 | Sí, rotulada «acento/300» |
| neutro/900 | #262626 | Sí, rotulada «Negro» |
| neutro/500 | #77737F | Sí |
| neutro/50 | #F2F2F2 | Sí |
| neutro/0 | #FFFFFF | No |
| lavanda/300 | #BEB6F2 | No |
| lavanda/100 | #E0DFF2 | No |
| morado/900 | #4E458C | No |
| semántico/error | #C8475B | No |

### Tipografía (9 estilos)

Títulos en Outfit; cuerpo y botones en Plus Jakarta Sans.

| Estilo | Familia | Peso | Tamaño | Interlineado | Espaciado de letra |
|---|---|---|---|---|---|
| Título 1 | Outfit | SemiBold | 28 | 34 | -1 |
| Título 2 | Outfit | SemiBold | 22 | 28 | -0.5 |
| Título 3 | Outfit | Medium | 18 | 24 | 0 |
| Cuerpo fuerte | Plus Jakarta Sans | SemiBold | 15 | 22 | 0 |
| Cuerpo | Plus Jakarta Sans | Regular | 15 | 22 | 0 |
| Etiqueta | Plus Jakarta Sans | SemiBold | 13 | 16 | 0 |
| Pequeño | Plus Jakarta Sans | Regular | 13 | 18 | 0 |
| Micro | Plus Jakarta Sans | Medium | 11 | 14 | 0.5 |
| Botón | Plus Jakarta Sans | Bold | 16 | 20 | 0 |

### Radios

| Variable | Valor |
|---|---|
| radio-sm | 14 |
| radio-md | 20 |
| radio-lg | 28 |
| radio-full | 999 |

### Espaciado

| Variable | Valor |
|---|---|
| espacio-2xs | 2 |
| espacio-xs | 4 |
| espacio-sm | 8 |
| espacio-md | 12 |
| espacio-lg | 16 |
| espacio-xl | 24 |
| espacio-2xl | 32 |

### Sombras

| Estilo | Color | Desplazamiento | Desenfoque |
|---|---|---|---|
| Sombra/Suave | #4E458C con 10 % de opacidad | 0, 8 | 24 |
| Sombra/Flotante | #262626 con 22 % de opacidad | 0, 12 | 32 |

### Iconografía

Material Symbols Rounded. El kit muestra 8 íconos: `pets`, `home`, `vaccines`, `notifications`, `medication`, `share`, `calendar_month` y `add`.

## 2. Componentes

Los componentes están sueltos en el lienzo; los agrupé por función solo para esta lectura. En «Tamaño», cuando hay una sola medida es la misma para todas las variantes.

### Estructura de pantalla

| Componente | Variantes | Tamaño | Tokens que usa |
|---|---|---|---|
| Barra de estado | Sin variantes | 390×50 | neutro/900; Cuerpo fuerte; espacio-xs, espacio-md, espacio-2xl |
| Encabezado | Izquierda = Atrás o Vacío; Derecha = Vacío o Cerrar (4 combinaciones) | 342×44 | neutro/900, neutro/0; Título 3; radio-full |
| Barra de acción | Botones = 1, 2 | 390×108 | neutro/0, primario/800; Botón; radio-full; espacio-lg, espacio-xl |
| Navegación inferior | Activo = Inicio, Línea de tiempo, Alertas, Tienda | 358×72 | neutro/0, neutro/900, neutro/50, primario/900, lavanda/300, morado/900; Sombra/Flotante; radio-full; espacio-md |
| Progreso | Pasos = 2, 3, 4; Actual = 1 hasta el número de pasos (9 variantes) | 342×28 | primario/900, acento/300; Micro; radio-full; espacio-sm |
| Indicador de página | Actual = 1, 2, 3 | 52×8 | primario/900, acento/300; radio-full |
| Encabezado de sección | Sin variantes | 342×24 | neutro/900, primario/900; Título 3, Etiqueta |

### Acciones y controles

| Componente | Variantes | Tamaño | Tokens que usa |
|---|---|---|---|
| Botón | Tipo = Primario, Secundario, Oscuro, Suave | 200×56 | neutro/0, neutro/900, primario/800, primario/900, acento/300, lavanda/300; Botón; radio-full |
| Botón ícono | Tipo = Claro, Lavanda, Primario, Oscuro | 44×44 | neutro/0, neutro/900, primario/900, acento/300, lavanda/300; radio-full |
| Chip | Estado = Activo, Inactivo | Activo 108×38; Inactivo 110×40 | neutro/0, neutro/900, primario/800, lavanda/300, lavanda/100, morado/900; Etiqueta; radio-full; espacio-lg |
| Interruptor | Estado = Encendido, Apagado | 52×32 | neutro/0, primario/800, acento/300, lavanda/300; radio-full |
| Selector | Activo = Izquierda, Derecha | 342×44 | neutro/900, neutro/500, neutro/0, acento/100; Etiqueta; Sombra/Suave; radio-full; espacio-xs |
| Enlace | Tipo = Simple, Con pregunta | Simple 342×16; Con pregunta 342×18 | primario/900, neutro/500; Etiqueta, Pequeño; espacio-xs |

### Entradas

| Componente | Variantes | Tamaño | Tokens que usa |
|---|---|---|---|
| Campo | Estado = Normal, Foco, Error | Normal 342×80; Foco 342×80; Error 342×106 | neutro/900, neutro/500, neutro/0, acento/300, primario/900, primario/800, lavanda/300, semántico/error; Etiqueta, Cuerpo, Pequeño; espacio-sm, espacio-md, espacio-lg |
| Área de texto | Estado = Normal, Foco | 342×114 | neutro/900, neutro/500, neutro/0, acento/100, primario/800; Etiqueta, Cuerpo; espacio-sm, espacio-lg |
| Búsqueda | Sin variantes | 342×52 | neutro/500, neutro/0, primario/900; Cuerpo; radio-md; espacio-lg |
| Dígito de código | Estado = Vacío, Foco, Lleno, Error | 48×58 | neutro/0, neutro/900, primario/900, acento/100, semántico/error; Título 2 |
| Día | Tipo = Encabezado, Seleccionado, Normal | Encabezado 40×24; Seleccionado 40×36; Normal 40×36 | neutro/900, neutro/500, acento/100; Micro, Pequeño; radio-full |

### Contenido y tarjetas

| Componente | Variantes | Tamaño | Tokens que usa |
|---|---|---|---|
| Foto de mascota | Sin variantes | 160×160 | neutro/0, acento/300; radio-lg |
| Tarjeta de evento | Sin variantes | 342×80 | neutro/0, neutro/900, neutro/500, primario/800, acento/300, morado/900; Cuerpo fuerte, Pequeño, Micro; Sombra/Suave; espacio-2xs |
| Rasgo | Tema = Claro, Oscuro | 76×76 | neutro/0, primario/900, primario/800, acento/300, lavanda/300; Micro |
| Fila de lista | Estado = Normal, Seleccionada | Normal 342×66; Seleccionada 342×69 | neutro/0, neutro/900, neutro/500, primario/900, acento/100; Cuerpo fuerte, Pequeño; radio-sm, radio-md; espacio-2xs, espacio-md |
| Fila de mascota | Sin variantes | 342×64 | neutro/0, neutro/900, neutro/500, acento/300; Título 2, Pequeño; espacio-2xs |
| Estadística | Tono = Primario, Acento, Claro | 107×68 | neutro/0, neutro/900, primario/900, acento/100, acento/300; Título 2, Micro; espacio-md |
| Tarjeta de producto | Sin variantes | 166×230 | neutro/0, neutro/900, neutro/500, primario/800, primario/900, acento/100; Cuerpo fuerte, Etiqueta, Micro; radio-full; espacio-md |

### Mensajes

| Componente | Variantes | Tamaño | Tokens que usa |
|---|---|---|---|
| Estado | Tono = Neutro, Error | 342×226 | neutro/900, neutro/500, primario/900, acento/100, semántico/error; Título 1, Cuerpo; radio-full; espacio-lg |
| Nota | Tono = Info, Error | 342×60 | neutro/900, primario/900, acento/100, semántico/error; Pequeño; espacio-md |
| Diálogo | Tono = Aviso, Destructivo | 334×356 | neutro/0, neutro/900, neutro/500, primario/800, acento/100, semántico/error; Título 2, Cuerpo, Botón; radio-full; espacio-xl |

## 3. Observaciones sobre el kit

- **La paleta tiene tres nombres para los mismos colores.** Las capas se llaman «morado/…» y «lavanda/…», las etiquetas visibles dicen «principal/…» y «acento/…», y las variables se llaman «primario/…» y «acento/…». Los números tampoco coinciden: la muestra rotulada «principal/900» (#2F5F5F) corresponde a la variable primario/800, y la rotulada «principal/800» (#2E5955) a primario/900. Lo mismo pasa con acento/400 y acento/300, que en las variables son acento/300 y acento/100.
- **A una etiqueta le falta el «#».** La muestra «principal/800» muestra «2E5955» sin el símbolo.
- **La paleta solo muestra 7 de los 12 colores que usan los componentes.** Faltan neutro/0, lavanda/300, lavanda/100, morado/900 y semántico/error.
- **Los estilos de texto aplicados en el kit son 9.** Display no aparece en ningún componente.
- **El Botón solo tiene variantes de tipo.** No hay estados deshabilitado ni cargando.
- **Algunas variantes miden distinto entre sí.** Chip Activo 108×38 frente a Inactivo 110×40, y Fila de lista Normal 66 frente a Seleccionada 69.
