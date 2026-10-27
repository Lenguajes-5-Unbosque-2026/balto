# C · Carga inicial de datos (obligatoria)

## Quién y para qué

Justo después de crear el perfil de una mascota (B5), el dueño sube lo que ya tiene: el carnet de vacunación, exámenes, fórmulas y el historial que guarda en chats de WhatsApp o en el correo. Balto **lee los documentos y propone los datos**; el dueño los revisa y corrige antes de guardar ("Tú tienes la última palabra"). Quien no tiene documentos registra al menos el peso y las alergias.

Importa porque un perfil vacío no sirve en una consulta. Este paso convierte años de papeles dispersos en una línea de tiempo usable desde el primer día, y por eso es obligatorio.

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| C1 | Asistente de carga inicial | "¿Qué información de Luna tienes a la mano?", con selección múltiple: Carnet de vacunación, Exámenes o laboratorios, Fórmulas o tratamientos activos, Historial en WhatsApp o correo, No tengo nada guardado. Botón "Empezar carga". |
| C2 | Subir carnet de vacunación | Paso Carnet: área de cámara ("encuadra el carnet"), lista "Vacunas etiquetadas" con lápiz para editar, "Agregar" y "Guardar y seguir". |
| C3 | Subir examen o laboratorio | Paso Exámenes: archivo cargado y campos Tipo de examen, Fecha y Resultado principal. Botón "Guardar y seguir". |
| C4 | Subir fórmula o tratamiento | Paso Tratamientos: área "Foto de la fórmula médica", Medicamento, Dosis, Frecuencia, interruptor "Activar recordatorios desde hoy" y "Guardar y seguir". |
| C5 | Transcribir historial de chats | Paso Historial: "Pega o escribe la información", chips "Clasifica este dato como" (Consulta, Vacuna, Examen, Tratamiento, Comportamiento), fecha del evento y "Agregar a la línea de tiempo". |
| C6 | Sin historial previo | "Empecemos con lo básico": peso actual y alergias conocidas ("Ninguna conocida", chips, "Agregar"). Botón "Guardar y continuar". |
| C7 | Resumen de carga inicial | "¡El perfil de Luna ya tiene historia!", contadores de Eventos, Soportes y Alertas, lista de lo guardado, "Agregar más archivos" e "Ir al perfil de Luna". |
| C8 | Revisar vacunas detectadas | "Esto encontramos en el carnet": vacunas y desparasitaciones leídas, cada una con lápiz, y "Agregar una vacuna que falte". Botones "Confirmar y guardar" / "Tomar la foto otra vez". |
| C9 | Revisar examen detectado | Archivo leído (con vista previa), Tipo, Fecha y Resultado principal propuestos, y la nota "Si algún dato quedó mal leído, corrígelo aquí". Botones "Confirmar" / "Corregir datos". |
| C10 | Revisar fórmula detectada | Medicamento, Dosis, Cada, Desde y Hasta propuestos, y la alerta "Confirma la dosis con tu veterinario antes de activar los recordatorios." Botones "Confirmar" / "Corregir datos". |
| C11 | Revisar eventos del historial | "Detectamos 3 eventos en el texto", chips de tipo y "Descartar", lista de eventos y botones "Guardar eventos" / "Revisar uno por uno". |
| C12 | Leyendo el documento | "Leyendo tu documento. Esto toma unos segundos.", progreso ("Foto recibida", "Buscando vacunas y fechas · En proceso") y "Cancelar". |
| C13 | No pudimos leer el archivo | "La foto quedó borrosa o el formato no es compatible.", "Aceptamos JPG, PNG y PDF de hasta 10 MB.", opciones "Tomar la foto otra vez" / "Escribir los datos a mano". |

## Paso a paso

Caso: Samuel acaba de crear el perfil de Luna (B5) y tiene a mano la foto del carnet y el PDF de un hemograma.

1. **Elegir qué tiene (C1).** Marca *Carnet de vacunación* y *Exámenes o laboratorios* y toca **Empezar carga**. La barra de pasos muestra solo lo marcado, en orden fijo: Carnet → Exámenes → Tratamientos → Historial. Aquí queda "Paso 1 de 2 · Carnet".
2. **Carnet (C2).** Toma la foto del carnet en el área de cámara; también puede subirlo desde la galería o como PDF con la hoja **E8 · Adjuntar soporte**.
3. **Lectura (C12).** Balto muestra "Foto recibida · carnet_luna.jpg · 1,2 MB" y "Buscando vacunas y fechas". Tarda unos segundos.
4. **Revisión (C8).** Aparecen Antirrábica 12/09/2025, Múltiple DHPPi+L 03/03/2026 y una desparasitación del 18/08/2026, todas de "Vet. Norte". El lápiz de cada una abre el formulario de E2 (vacuna) o E10 (desparasitación) con los datos ya llenos. Samuel confirma con **Confirmar y guardar**.
5. **De vuelta en C2.** Las vacunas confirmadas aparecen en "Vacunas etiquetadas". Si el carnet tiene otra página, Samuel toma otra foto y repite los pasos 3 y 4. "Agregar" registra a mano una vacuna que no se leyó. Toca **Guardar y seguir**.
6. **Exámenes (C3).** Sube *hemograma_agosto.pdf* → **C12** → **C9**, que propone Tipo "Hemograma", Fecha 18/08/2026 y "Valores dentro de rangos normales". Toca **Confirmar**. Si algo quedó mal leído, **Corregir datos** abre C3 con los campos editables; ahí corrige y toca "Guardar y seguir".
7. **Resumen (C7).** Ve los contadores (por ejemplo, 6 eventos, 4 soportes, 2 alertas) y la lista de lo guardado. Cada tarjeta abre **D4 · Detalle de evento**. Toca **Ir al perfil de Luna** → **Inicio**.

### Variantes del paso a paso

- **Fórmula (C4 → C12 → C10).**
  - Toma la foto de la fórmula. C10 propone Amoxicilina 250 mg, 1 cápsula cada 12 horas, del 21/09 al 28/09.
  - "Confirmar" guarda el tratamiento; "Corregir datos" abre C4.
  - En C4, "Activar recordatorios desde hoy" crea los horarios de toma en G.
- **Historial de chats (C5 → C12 → C11).**
  - Samuel pega el texto copiado de WhatsApp o del correo. Los chips de clasificación y la fecha de C5 son opcionales: le dicen a Balto qué tipo de evento esperar cuando el texto habla de uno solo.
  - "Agregar a la línea de tiempo" lee el texto y abre C11 con los eventos detectados; por ejemplo, una consulta dermatológica, un champú medicado y un peso de 28,1 kg, todos del 05/09/2026.
  - Los chips de C11 filtran por tipo. "Descartar" activa la selección para quitar los eventos que no correspondan, y tocar una tarjeta abre su formulario de E para corregirla.
  - "Guardar eventos" guarda todos los que quedan; "Revisar uno por uno" abre cada evento en su formulario de E, en secuencia.
- **Sin documentos (C6).**
  - Si en C1 marca "No tengo nada guardado", las demás opciones se desmarcan y va a C6.
  - Peso y alergias vienen llenos si se escribieron en B4. Hay que tener peso y al menos una alergia o "Ninguna conocida".
  - "Guardar y continuar" → C7.
- **No se pudo leer (C13).**
  - Si la foto está borrosa o el formato no sirve, C12 lleva a C13.
  - "Tomar otra foto" vuelve a la cámara del paso.
  - "Escribir a mano" abre el formulario del paso: C3 o C4, o "Agregar" en C2 para las vacunas.
- **Agregar más archivos (C7).** Vuelve a C1 con lo ya cargado; los contadores se suman.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Nada elegido | C1 | "Empezar carga" deshabilitado. |
| "No tengo nada guardado" | C1 | Excluye las demás opciones; al marcarla se desmarcan. |
| Leyendo | C12 | Progreso por etapas. "Cancelar" descarta el archivo y vuelve al paso. |
| Lectura correcta | C8–C11 | Datos propuestos, siempre editables antes de guardar. |
| Lectura fallida | C13 | Foto borrosa o formato no compatible. Reintentar o escribir a mano. |
| Archivo de más de 10 MB | C2–C4 | Mismo error que **E13 · Archivo muy pesado**. |
| Nada detectado en el texto | C11 | "No encontramos eventos en el texto" con "Escribir a mano", que abre el formulario de E del tipo elegido en C5. *(Falta en Figma.)* |
| Paso sin datos | C2–C5 | "Guardar y seguir" deshabilitado hasta tener al menos un dato confirmado. |
| Datos mínimos | C6 | "Guardar y continuar" deshabilitado sin peso o sin una opción de alergias. |
| Dosis por confirmar | C10 | Alerta roja permanente: la dosis leída debe confirmarla un veterinario. |
| Volver | C2–C6 | La flecha atrás regresa al paso anterior sin perder lo guardado. En el primer paso vuelve a C1. |
| Cerrar sin terminar | Todo C | El flujo no tiene X: es obligatorio. Si el dueño cierra la app, la próxima vez que entre con esa mascota vuelve al paso pendiente. Lo confirmado ya queda guardado. |
| Cámara del teléfono | C2–C4 | El área de cámara abre la cámara nativa del teléfono, sin pedir permiso (ver la spec de O). |
| Sin conexión o error al guardar | — | **O2**, **O3**, **O8** (flujo O). La lectura necesita conexión. |

## Qué pasa después

- **C7 → Inicio**, con la mascota activa. La carga inicial queda marcada como completa para esa mascota.
- **Vacunas y desparasitaciones confirmadas:** van a **D2 · Línea de tiempo** y **F2 · Carnet de vacunas**. Si se leyó una próxima fecha, crean una alerta en **J1**.
- **Exámenes:** **D2** y **F3 · Exámenes y tratamientos**, con el archivo como soporte (**D5**).
- **Fórmulas:** tratamiento activo en **G1**. Si se activaron recordatorios, se crean los horarios de toma (**G4 / G5**).
- **Eventos del historial:** **D2**, cada uno con su tipo.
- **Peso y alergias (C6):** **F4**, **F5** y **D1**.
- Todo lo cargado aparece en lo que se comparte (**L**).

## Datos que usa

**Lee**
- **Mascota** recién creada (nombre, especie) y lo que ya se haya escrito en B4 (peso, alergias).
- **Estado de la carga inicial** de la mascota (pendiente | completa) y el último paso alcanzado.

**Guarda**
- **Documento cargado:** mascota, archivo en Supabase Storage, tipo de documento (carnet | examen | fórmula | texto de chat), estado de lectura (leyendo | leído | fallido) y fecha.
- **Datos propuestos por la lectura:** los guarda sin confirmar mientras el dueño revisa. Solo pasan a **Evento** al confirmar.
- **Eventos** con la misma estructura que E (ver la spec de E, "Datos que usa"), con un campo de origen = carga inicial y la referencia al documento como soporte.
- **Tratamiento activo** con medicamento, dosis, frecuencia, fecha de inicio, fecha de fin y recordatorios (sí/no). Lo consume G.
- **Alertas** por la próxima fecha detectada. Las consume J.
- **Peso y alergias** (C6), con la misma estructura que B4.
- **Carga inicial:** mascota, pasos elegidos, paso actual, completa (sí/no) y fecha.

## Fuera de alcance

- Registrar eventos uno a uno después del alta: **E**. C reutiliza los formularios de E para editar.
- Editar o borrar eventos ya guardados: **D**.
- Gestionar tratamientos y horarios: **G**.
- G7 · Revisar datos de la fórmula (lectura de fórmulas fuera del alta): **G**.
- Importar automáticamente desde WhatsApp o el correo. El dueño copia y pega el texto.

## Preguntas abiertas

1. **Servicio de lectura de documentos.** ¿Con qué servicio se leen fotos, PDF y texto? (pregunta 4 de `CLAUDE.md`). Debe devolver datos estructurados por tipo y no está en el stack. Una opción es un modelo de IA con visión, llamado desde una ruta de servidor de Next.js, que guarde solo propuestas sin confirmar. El equipo debe decidir el proveedor y el costo por documento.
2. **Privacidad del texto de chats.** El texto pegado puede incluir datos de terceros, como nombres o teléfonos de la veterinaria. ¿Se guarda el texto original o solo los eventos confirmados? La recomendación es guardar solo los eventos.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- Cada tipo de documento sigue la misma secuencia: subir → C12 → revisar (C8–C11) → confirmar. "Corregir datos" abre el formulario editable del paso (C3, C4).
- La barra de pasos cuenta solo los tipos marcados en C1.
- El lápiz de las vacunas detectadas abre el formulario de E2 o E10 con los datos llenos. Las tarjetas de C11 abren el formulario de E de su tipo.
- C no se puede cerrar con X. Si el dueño sale, vuelve al paso pendiente.
- C6 exige peso y una opción de alergias ("Ninguna conocida" vale).

Pendiente de ajustar en Figma:
- C12: la barra dice "PASO 2 DE 3 · PROCESANDO". Debe mostrar el paso real del documento que se está leyendo.
- C11: diseñar el estado "No encontramos eventos en el texto".
- C2: mostrar las opciones Galería / PDF además de la cámara, como en E8.

**2026-10-27 · Ajustes aplicados en Figma** (pantallas exportadas a `design/flujos/`)

Hecho:
- C2: botones Cámara / Galería / PDF.
- C2, C3, C8, C9 y C12: la barra cuenta 2 pasos (Carnet y Exámenes, como en el ejemplo de C1).

Sigue pendiente: estado "No encontramos eventos en el texto" de C11.
