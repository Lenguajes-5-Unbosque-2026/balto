# B · Perfil de mascota

## Quién y para qué

El dueño crea el perfil de una mascota en tres pasos (datos básicos, foto y salud inicial) y recibe la **cédula animal Balto**: un número único que identifica a la mascota dentro de la app y que sirve en consultas y emergencias.

Importa porque sin perfil no hay nada que registrar ni compartir. Es lo primero que hace un dueño nuevo después de crear su cuenta (A5 → B1), y también la forma de agregar una segunda o tercera mascota. Debe tomar unos 2 minutos, como promete O1 ("Registrar una mascota · Toma 2 minutos").

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| B1 | Datos básicos | Paso 1 de 3: selector Perro / Gato, nombre, raza (con buscador), sexo, nacimiento e interruptor "Esterilizada". Botón X y "Siguiente". |
| B2 | Foto de la mascota | Paso 2 de 3: área de cámara ("encuádrala bien"), texto "Una foto clara ayuda a reconocer a Luna en consultas y emergencias.", botones Cámara / Galería, "Omitir por ahora" y "Siguiente". |
| B4 | Salud inicial | Paso 3 de 3: peso actual (kg), alergias conocidas (chips + "Agregar"), condiciones preexistentes, medicación vigente y "Guardar perfil". |
| B6 | Cédula de Luna | Tarjeta "Cédula animal · Balto" con el número (BAL-0001-LUNA), la fecha de emisión, la especie y la raza, y los sellos Única / Digital / Física. Opciones "Ver versión digital" y "Pedir la placa grabada", y botón "Continuar". |
| B5 | Perfil creado | "¡Perfil de Luna creado!", nota "Este paso es obligatorio. Si no tienes documentos, registra al menos el peso y las alergias." y botón "Continuar a la carga inicial". |
| B8 | Salir sin guardar | Diálogo: "¿Salir sin guardar?", "Perderás los datos que escribiste de esta mascota.", "Seguir editando" y "Salir y descartar". |

Los IDs B3 (Identificador), B7 (Placa grabada) y B9 (Identificador duplicado) ya no existen en la exportación de Figma.

## Paso a paso

Caso: Samuel acaba de crear su cuenta (A5) y registra a Luna, una golden hembra de 3 años.

1. **Entrada.** Al confirmar A5, Balto abre **B1** con el paso "1 de 3".
2. **Datos básicos (B1).**
   - Elige **Perro**.
   - Escribe "Luna".
   - En *Raza* busca "Golden" y elige "Golden Retriever"; la lista cambia según la especie e incluye "Mestizo / no sé".
   - Elige *Sexo* "Hembra" y *Nacimiento* 12/03/2023.
   - Deja *Esterilizada* encendido.
   - Si la tiene, escribe el *Número de microchip* (opcional, 15 dígitos).
   - Toca **Siguiente**; se habilita cuando están Especie, Nombre y Sexo.
3. **Foto (B2).** Toca **Cámara** y encuadra a Luna, o elige una de la **Galería**. La foto se ve en el área de arriba. Toca **Siguiente**. Si no quiere poner foto, toca **Omitir por ahora**: Luna queda con el avatar de huella y la foto se agrega después desde el perfil.
4. **Salud inicial (B4).**
   - Escribe el peso, 28 kg.
   - En *Alergias conocidas* toca **+ Agregar** y escribe "Pollo" y "Pulgas (DAPP)". Cada alergia queda como un chip, que se quita tocándolo.
   - Deja *Condiciones preexistentes* en "Ninguna" y escribe la *Medicación vigente*, "Amoxicilina 250 mg".
   - Todos los campos de B4 son opcionales.
   - Toca **Guardar perfil**.
5. **Cédula (B6).** Balto crea el perfil y emite la cédula **BAL-0001-LUNA**, con la fecha de hoy. Samuel ve la tarjeta. "Ver versión digital" abre **D1 · Vista de acceso rápido**, que es lo que se muestra desde el celular. Toca **Continuar**.
6. **Perfil creado (B5).** Toca **Continuar a la carga inicial** → **C1 · Asistente de carga inicial** (flujo C, obligatorio).

### Variantes del paso a paso

- **Segunda mascota.** Desde el **+** del selector de mascotas en Inicio, desde **O1** ("Registrar una mascota") o desde **M5 · Administrar mascotas** se abre B1 con el mismo recorrido. La nueva mascota pasa a ser la activa.
- **Volver un paso.** La flecha atrás de B2 y B4 vuelve al paso anterior sin perder lo escrito.
- **Gato.** Con *Gato* elegido, la lista de razas cambia y el texto de la foto usa el nombre que se escribió.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Paso incompleto | B1 | "Siguiente" deshabilitado hasta que estén Especie, Nombre y Sexo. |
| Sin foto | B2 | "Siguiente" deshabilitado; "Omitir por ahora" disponible. |
| Foto cargada | B2 | La foto reemplaza el área de cámara. Cámara / Galería permiten cambiarla. |
| Sin permiso de cámara o fotos | B2 | **O6 · Permiso de cámara** / **O7 · Permiso de fotos** (flujo O). |
| Raza no encontrada | B1 | El buscador ofrece "Mestizo / no sé" y "Usar «texto escrito»". |
| Salir con datos | B1 (X) | Diálogo **B8**. "Salir y descartar" vuelve a donde se abrió el flujo. Si es la primera mascota, va a **O1**. |
| Salir sin datos | B1 (X) | Cierra sin preguntar. |
| Nombre repetido | B1 | Se permite: la cédula distingue a dos mascotas con el mismo nombre. |
| Guardando | B4 | "Guardar perfil" muestra que está cargando y no se puede tocar dos veces. |
| Sin conexión o error al guardar | B4 | **O3 · Guardado pendiente** / **O8 · No se pudo guardar** (flujo O). |

## Qué pasa después

- **B5 → C1:** la carga inicial es obligatoria (flujo C). Al terminar (C7, "Ir al perfil de Luna") el dueño llega a **Inicio** con Luna activa.
- La mascota aparece en el **selector de Inicio**, en **M5 · Administrar mascotas** y como destino de todos los registros (E).
- **Peso de B4:** queda como la primera medición en **F4 · Evolución del peso**, en el peso de Inicio y en **D1**.
- **Alergias y condiciones de B4:** van a **F5 · Alergias y condiciones** y al aviso rojo de **D1**.
- **Medicación vigente de B4:** crea un tratamiento activo en **G1 · Listado de medicamentos** con solo el nombre; dosis y horarios se completan en G.
- **Microchip:** se muestra en **D1** y en la tarjeta de Inicio.
- **Cédula:** se consulta después desde la tarjeta de la mascota en Inicio y desde M5. Se muestra en **D1** y en lo que se comparte (**L**).

## Datos que usa

**Guarda**
- **Mascota:**
  - id, dueño;
  - especie (perro | gato), nombre, raza (o "mestizo"), sexo (hembra | macho);
  - fecha de nacimiento, esterilizada (sí/no), número de microchip (opcional);
  - foto (archivo en Supabase Storage, opcional);
  - estado (activa | archivada), fecha de creación.
- **Cédula:** número único con formato `BAL-NNNN-NOMBRE`, donde NNNN es un consecutivo global y NOMBRE el nombre en mayúsculas sin tildes ni espacios, más la fecha de emisión. El número no cambia si después se edita el nombre.
- **Peso inicial:** una medición (mascota, kg, fecha = hoy). Es el mismo dato que un evento de peso de E6.
- **Alergias:** lista de textos por mascota.
- **Condiciones preexistentes:** texto por mascota.
- **Medicación vigente:** un tratamiento activo (mascota, medicamento, estado = activo) que consume G.

**Lee**
- **Catálogo de razas por especie:** lista fija dentro de la app.
- **Dueño:** para asignar la mascota.

## Fuera de alcance

- Subir carnet, exámenes y fórmulas: **C · Carga inicial**.
- Editar el perfil, archivar la mascota y administrar mascotas: **M** (M5, M13).
- Mostrar y compartir el perfil: **D1** y **L**.
- Alergias y condiciones después del alta: **F5 / F6**.
- **Placa grabada física:** fuera de la primera versión (ver Preguntas abiertas).
- Emitir un microchip propio (fuera de alcance del brief).

## Preguntas abiertas

1. **Placa grabada.** ¿Se vende por la Tienda, cuánto cuesta, quién la fabrica y cómo se entrega? (pregunta 3 de `CLAUDE.md`). Mientras no se defina, la opción "Pedir la placa grabada" de B6 se oculta.
2. **"Ya tengo una cédula Balto" (O1).** ¿Qué pasa cuando alguien escribe el número de una cédula que ya existe, por ejemplo al recibir una mascota de otro dueño? Hay que definir la transferencia de la mascota entre dueños. No hay pantallas para eso.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- Orden del alta: B1 → B2 → B4 → **B6** → B5 → C1. "Guardar perfil" crea la mascota y emite la cédula; B6 la muestra antes de la confirmación y la carga obligatoria.
- Obligatorios en B1: especie, nombre y sexo. Raza, nacimiento y microchip son opcionales. B4 es todo opcional.
- El número de microchip va como campo opcional en B1, porque D1 lo muestra y ya no existe B3.
- La medicación vigente de B4 crea un tratamiento activo en G1. El peso de B4 es la primera medición de F4.
- La cédula usa el formato `BAL-NNNN-NOMBRE` y su número no cambia.
- "Ver versión digital" abre D1.

Pendiente de ajustar en Figma:
- B1: agregar el campo "Número de microchip (opcional)".
- B6: ocultar "Pedir la placa grabada" hasta definir la placa. Durante el alta, quitar la flecha atrás, porque el perfil ya se guardó.
- B8: dice "PASO 1 DE 4"; debe decir "PASO 1 DE 3" (el alta tiene 3 pasos).
- B2: diseñar el estado con la foto cargada.
