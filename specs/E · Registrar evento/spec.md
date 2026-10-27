# E · Registrar evento

## Quién y para qué

El dueño de la mascota (Valentina, en la persona de referencia) registra algo que le pasó a su mascota: una vacuna, una desparasitación, una consulta, un examen, un tratamiento, el peso, un cambio de alimentación o de comportamiento, o cualquier otro evento.

Es el flujo core de Balto: cada evento que entra aquí alimenta la línea de tiempo (D), el panel de salud (F), los medicamentos (G), las alertas (J) y lo que se comparte (L). La promesa del producto es que **registrar un evento toma menos de un minuto**, así que el flujo tiene un solo formulario por tipo, pocos campos obligatorios y un soporte opcional.

El veterinario no participa: no necesita cuenta. Es el dueño quien registra el resultado de sus consultas.

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| E1 | Selector de tipo de evento | Foto y nombre de la mascota activa, "¿Qué quieres registrar hoy?" y una cuadrícula de 9 tipos: Vacuna, Desparasitación, Consulta, Examen, Tratamiento, Peso, Alimentación, Comportamiento, Otro. Botón X para cerrar. |
| E2 | Registrar vacuna | Formulario de vacuna con selector de mascota en el encabezado, chips de tipo, bloque de soporte (Cámara / Galería / PDF) e interruptor "Recordarme el refuerzo". |
| E3 | Consulta veterinaria | Formulario de consulta y nota "El veterinario no necesita cuenta: tú subes el resultado." |
| E4 | Examen o laboratorio | Formulario de examen con el soporte cargado (hemograma.pdf). |
| E5 | Tratamiento o medicación | Formulario de tratamiento, fila "Crear horarios de toma" y área "Foto de la fórmula (opcional)". |
| E6 | Peso | Campo de peso, fecha de la medición, gráfica "Evolución del peso · 6 meses" y comparación con el mes anterior. |
| E7 | Alimentación o comportamiento | Selector segmentado Alimentación / Comportamiento, "¿Qué cambió?", fecha y área de foto. |
| E8 | Adjuntar soporte | Hoja inferior con: Tomar foto (carnet, fórmula o examen), Elegir de la galería, Subir PDF (hasta 10 MB) y Cancelar. |
| E9 | Evento guardado | Confirmación, texto de dónde quedó el evento, aviso del recordatorio si lo hay, tarjeta del evento y botones "Registrar otro" y "Listo". |
| E10 | Registrar desparasitación | Formulario de desparasitación, interruptor "Recordarme la próxima dosis" y nota sobre la frecuencia. |
| E11 | Registrar otro evento | Formulario libre: qué pasó, fecha, lugar, detalle y área de foto. |
| E12 | Revisar la foto | Vista previa de la foto tomada, con Recortar, Girar, Repetir y los botones "Usar esta foto" / "Tomar otra". |
| E13 | Archivo muy pesado | Error de archivo de más de 10 MB, con alternativas para adjuntar y la opción "Guardar sin soporte". |

Pantalla reutilizada de otro flujo: **B8 · Salir sin guardar** (diálogo de descarte; ver Estados).

### Campos por tipo

`*` = obligatorio. Las fechas toman el día de hoy por defecto.

| Tipo | Pantalla | Campos | Soporte | Extra |
|---|---|---|---|---|
| Vacuna | E2 | Vacuna aplicada *, Fecha aplicada *, Próximo refuerzo | Foto del carnet o PDF | Recordarme el refuerzo |
| Desparasitación | E10 | Producto *, Fecha *, Vía, Próxima dosis | No lleva | Recordarme la próxima dosis; nota "Interna cada 3 meses, externa cada mes. Confirma con tu veterinario." |
| Consulta | E3 | Veterinaria que atendió *, Motivo, Fecha *, Diagnóstico, Recomendaciones | Foto o PDF (ajuste pendiente en Figma) | Nota de que el veterinario no necesita cuenta |
| Examen | E4 | Tipo de examen *, Laboratorio, Fecha *, Resultado principal | Foto o PDF | — |
| Tratamiento | E5 | Medicamento *, Dosis, Vía, Frecuencia, Duración | Foto de la fórmula (opcional) | Crear horarios de toma (abre G4) |
| Peso | E6 | Peso (kg) *, Fecha de la medición | No lleva | Gráfica de evolución y comparación con el mes anterior |
| Alimentación | E7 | ¿Qué cambió? *, Fecha | Foto (opcional) | — |
| Comportamiento | E7 | ¿Qué cambió? *, Fecha | Foto (opcional) | — |
| Otro | E11 | ¿Qué pasó? *, Fecha *, Lugar, Detalle | Foto (opcional) | — |

En los tipos que lo aceptan, el soporte siempre es opcional. Por ahora no se aceptan videos.

## Paso a paso

Caso: Valentina registra la vacuna antirrábica que le pusieron a Luna el 12/09/2026, con foto del carnet y recordatorio del refuerzo.

1. **Entrada.** En Inicio, con Luna seleccionada, Valentina toca el botón **+** de la barra de navegación inferior. Se abre **E1** con la foto y el nombre de Luna.
2. **Tipo.** Toca **Vacuna**. Se abre **E2** con el chip "Vacuna" activo y el selector de mascota mostrando "Luna" en el encabezado.
3. **Campos.** Escribe "Antirrábica · Nobivac Rabies" en *Vacuna aplicada*, deja *Fecha aplicada* en 12/09/2026 y pone *Próximo refuerzo* en 12/09/2027. Mientras falten campos obligatorios, el botón "Guardar evento" está deshabilitado.
4. **Soporte.** Toca **Cámara** en el bloque de soporte. Se abre la cámara del dispositivo; si el navegador no tiene permiso, se muestra **O6 · Permiso de cámara**. Las opciones *Galería* y *PDF* del bloque, y cualquier área de soporte de los otros tipos, abren la hoja **E8**, que ofrece las mismas tres opciones.
5. **Revisión de la foto.** Después de tomar la foto se abre **E12**. Valentina puede recortar, girar o repetir. Toca **Usar esta foto** y vuelve a E2 con la tarjeta "carnet_luna.jpg · Foto · 1,2 MB · Cargado". La X de la tarjeta quita el soporte.
6. **Recordatorio.** Como hay fecha de *Próximo refuerzo*, el interruptor "Recordarme el refuerzo" está disponible. Lo deja encendido; debajo se lee "7 días antes · 5 sep 2027". La anticipación sale de M3 (ver Qué pasa después).
7. **Guardar.** Toca **Guardar evento**. Se abre **E9** con:
   - "La vacuna antirrábica quedó en la línea de tiempo de Luna."
   - "Te avisaremos 7 días antes del refuerzo (5 sep 2027)."
   - La tarjeta del evento: Vacuna antirrábica · Refuerzo anual · Vet. Norte · 12 SEP 2026 · 1 soporte.
8. **Salida.** Toca **Listo** y sale del flujo; si toca **Registrar otro**, vuelve a E1.

### Variantes del paso a paso

- **Cambiar de tipo dentro del formulario.** Los chips de arriba (E2–E6, E10, E11) cambian el formulario sin volver a E1. El chip del tipo actual aparece primero y activo. En E7, el selector segmentado cambia entre Alimentación y Comportamiento.
- **Tratamiento (E5).** La fila "Crear horarios de toma" abre **G4 · Definir horarios de toma**. Al confirmar, vuelve a E5 con los horarios en la fila (por ejemplo, "08:00 · 20:00").
- **Peso (E6).** Mientras escribe el peso, el dueño ve la gráfica de los últimos 6 meses (la última barra es la medición nueva) y la diferencia con el mes anterior ("+0,3 kg frente al mes anterior").
- **Galería.** "Elegir de la galería" en E8 abre la galería del dispositivo; si no hay permiso, se muestra **O7 · Permiso de fotos**.
- **PDF.** "Subir PDF" en E8 abre el selector de archivos. El archivo queda en el formulario como tarjeta con nombre, tipo y tamaño, igual que en E4.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Formulario incompleto | E2–E7, E10, E11 | "Guardar evento" deshabilitado hasta que estén todos los campos `*`. |
| Formulario completo | E2–E7, E10, E11 | "Guardar evento" habilitado. |
| Soporte cargado | E2, E4 (y los demás tipos con soporte) | Tarjeta con miniatura o ícono, nombre, tipo, tamaño y "Cargado", más una X para quitarlo. |
| Archivo de más de 10 MB | E13 | "El archivo pesa más de 10 MB", con el nombre y el peso del archivo y el texto "Aceptamos JPG, PNG y PDF de hasta 10 MB." Opciones: *Tomar una foto del documento* (lleva a la cámara y E12), *Elegir otro archivo* (galería o archivos) y *Guardar sin soporte*. La flecha atrás vuelve al formulario. |
| Recordatorio disponible | E2, E10 | Interruptor activo cuando *Próximo refuerzo* / *Próxima dosis* tiene fecha; muestra "N días antes · fecha del aviso". |
| Recordatorio no disponible | E2, E10 | Sin fecha de próximo refuerzo o dosis, el interruptor está apagado y no se puede activar. |
| Avisos apagados en ajustes | E2, E10 | Si "Vacunas y desparasitaciones" está apagado en M3, el interruptor aparece apagado con la nota "Activa los avisos en Ajustes › Notificaciones". *(Falta en Figma.)* |
| Salir con datos | Formularios | La X abre el diálogo de **B8** con el texto adaptado: "¿Salir sin guardar?" · "Perderás los datos que escribiste de este evento." · [Seguir editando] · [Salir y descartar]. |
| Salir sin datos | Formularios y E1 | La X cierra sin preguntar y vuelve a la pantalla desde la que se abrió el flujo. |
| Cancelar adjunto | E8 | "Cancelar" cierra la hoja y vuelve al formulario sin cambios. |
| Evento guardado | E9 | Confirmación. El aviso del recordatorio solo aparece si se activó. |
| Sin permiso de cámara o fotos | — | **O6** / **O7** (flujo O). |
| Sin conexión al guardar | — | **O3 · Guardado pendiente** (flujo O). |
| Error al guardar | — | **O8 · No se pudo guardar** (flujo O). |

## Qué pasa después

Desde **E9**:
- **Registrar otro** vuelve a E1, con la misma mascota.
- **Listo** sale del flujo (destino por definir, ver Preguntas abiertas).
- La **tarjeta del evento** abre **D4 · Detalle de evento**.

Efectos de guardar un evento en el resto de la app:

| Evento | Dónde aparece |
|---|---|
| Todos | **D2 · Línea de tiempo** de la mascota, con su soporte (ver o descargar en D5). También en lo que se comparte desde L. |
| Vacuna, desparasitación | **F2 · Carnet de vacunas**. En Inicio, el estado de vacunas y el "Próximo a vencer". |
| Recordatorio activado | Una alerta pendiente en **J1 · Centro de alertas**. El día del aviso (fecha − anticipación de M3) llega la notificación **J6**. |
| Examen | **F3 · Exámenes y tratamientos**. |
| Tratamiento | **F3** y tratamiento activo en **G1 · Listado de medicamentos**. Si tiene horarios, genera los recordatorios de toma (**G5**). |
| Peso | **F4 · Evolución del peso**, el peso de Inicio y la vista rápida (**D1**). |
| Alimentación, comportamiento | Línea de tiempo (D2). |

La anticipación de los recordatorios no se elige en este flujo: se toma de **M3 · Configurar notificaciones** ("Vacunas y desparasitaciones · 7 días antes").

## Datos que usa

**Lee**
- **Mascota activa:** id, nombre, foto. Sale del selector de Inicio y de E1, y se puede cambiar en el encabezado de E2.
- **Pesos anteriores de la mascota:** para la gráfica de E6 y la comparación con el mes anterior.
- **Preferencias de notificación del dueño (M3):** si los avisos de vacunas y desparasitaciones están encendidos y con cuántos días de anticipación.

**Guarda**
- **Evento:** id, mascota, tipo (vacuna | desparasitación | consulta | examen | tratamiento | peso | alimentación | comportamiento | otro), fecha, fecha de creación, campos propios del tipo:
  - vacuna: nombre de la vacuna, fecha del próximo refuerzo
  - desparasitación: producto, vía, fecha de la próxima dosis
  - consulta: veterinaria (texto), motivo, diagnóstico, recomendaciones
  - examen: tipo de examen, laboratorio, resultado principal
  - tratamiento: medicamento, dosis, vía, frecuencia, duración
  - peso: valor en kg
  - alimentación / comportamiento: qué cambió
  - otro: título, lugar, detalle
- **Soporte** (0 o más por evento): evento, archivo en almacenamiento (Supabase Storage), nombre, tipo (JPG | PNG | PDF), tamaño (≤ 10 MB).
- **Recordatorio / alerta** (si se activó): mascota, evento de origen, tipo, fecha de vencimiento, fecha del aviso, estado (pendiente). Lo consume J.
- **Tratamiento activo** (si el tipo es tratamiento): medicamento, dosis, vía, frecuencia, duración, horarios de toma (de G4), estado (activo). Lo consume G.

## Fuera de alcance

Estos temas tienen su propia spec:
- Ver, buscar, editar y eliminar eventos: **D · Consultar datos**. Lo que hace D6 · Editar evento con estos formularios se define allí.
- Carga inicial y lectura automática de documentos (carnet, exámenes, fórmulas, chats): **C**. E no lee los documentos: solo los adjunta.
- Panel de salud, carnet, exámenes y evolución del peso: **F**.
- Horarios de toma, recordatorios de toma, tomas omitidas y finalizar tratamiento: **G**.
- Alertas, posponer, resolver y notificaciones: **J**.
- Alimentos tóxicos y plan de alimentación: **H**. Bitácora de hábitos: **I**.
- Sin conexión, guardado pendiente, errores y permisos: **O**.
- Videos como soporte.

## Preguntas abiertas

1. **Cambiar de tipo con datos escritos.** Si el dueño llenó campos y toca otro chip, ¿se pierde lo escrito, se conserva lo común (fecha, soporte) o se pide confirmación?
2. **Destino de "Listo" en E9.** ¿Vuelve a Inicio o a la pantalla desde la que se abrió el flujo (por ejemplo, la línea de tiempo)?
3. **Selector de mascota en los formularios.** Solo E2 muestra "Luna ▾" en el encabezado. ¿Todos los formularios permiten cambiar la mascota, o la mascota se fija en E1?
4. **E12 desde la galería.** ¿Las fotos elegidas de la galería también pasan por "Revisar la foto", o solo las que se toman con la cámara? El botón "Tomar otra" sugiere que solo se usa con la cámara.
5. **"Guardar sin soporte" en E13.** ¿Guarda el evento de una vez (y va a E9) o vuelve al formulario sin adjunto? ¿Qué pasa si faltan campos obligatorios?
6. **Formatos de foto del teléfono.** Algunos teléfonos guardan las fotos en HEIC. ¿Se convierten a JPG o se rechazan? Si se rechazan, ¿con qué pantalla?
7. **Varios soportes por evento.** Los diseños muestran uno. ¿Se puede adjuntar más de uno (por ejemplo, las dos caras del carnet)?
8. **Veterinaria en E3.** ¿Es texto libre o se elige de los proveedores de K? La tarjeta de E9 muestra "Vet. Norte" en un evento de vacuna, pero E2 no tiene campo de veterinaria.
9. **Subtítulo "Refuerzo anual" en E9.** ¿De dónde sale? E2 no tiene un campo de frecuencia del refuerzo.
10. **Estado visual del botón deshabilitado.** Figma muestra solo el botón habilitado; el kit todavía no tiene la variante deshabilitada (pregunta 15 de `CLAUDE.md`).
11. **Estado de subida.** No hay diseño para un soporte que está subiendo ni para un error de subida que no sea por peso.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Corregido en Figma durante la escritura de la spec:
- E9: el botón izquierdo dice "Registrar otro" (antes estaba vacío) y "Listo" pasa a secundario.
- E7, E10, E11: X para cerrar, botón "Guardar evento" y campos obligatorios marcados (E7 "¿Qué cambió?", E10 Producto y Fecha, E11 "¿Qué pasó?").
- E3: se agregó "Fecha *".
- E2–E6: el botón "Guardar evento" se ve habilitado cuando los obligatorios están llenos.

Decisión de producto que afecta este flujo: **se elimina la suscripción** (y con ella el modo consulta). Registrar eventos no depende de ningún pago.

Decidido, pendiente de ajustar en Figma:
- E3: agregar el bloque de soporte (Cámara / Galería / PDF), como en E2.
- E7, E11: cambiar "Foto o video (opcional)" por "Foto (opcional)". Por ahora no hay video.
- E11: marcar "Fecha" como obligatoria (`*`).
- E4: diseñar el estado sin soporte, con el área que abre E8.
- E2, E10: estado del interruptor cuando los avisos están apagados en M3.
- B8: variante de texto para eventos ("Perderás los datos que escribiste de este evento.").

Decisiones tomadas:
- La entrada al flujo es el botón **+** de la barra de navegación inferior, que abre E1 con la mascota activa.
- La X con datos escritos reutiliza el diálogo de B8.
- Toda área de soporte abre E8. E6 y E10 no llevan soporte.
- E5 abre G4 para los horarios, y el tratamiento guardado queda activo en G1.
- Los recordatorios de E2 y E10 usan la anticipación de M3 y crean una alerta en J1.
