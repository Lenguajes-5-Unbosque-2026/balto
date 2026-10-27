# G · Medicamentos

## Quién y para qué

El dueño lleva los tratamientos de su mascota: qué medicamentos está tomando, a qué hora toca cada dosis y cuáles ya dio. Balto le recuerda cada toma y guarda el historial (tomadas, omitidas, finalizadas).

Importa porque una dosis olvidada o duplicada tiene consecuencias clínicas, y porque la medicación vigente es uno de los datos que más pide una clínica (aparece en D1 y en lo que se comparte). Cumple la promesa de A2.2: "Cada dosis a tiempo".

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| G1 | Listado de medicamentos | Pestañas Vigentes (2) / Finalizados, tarjetas de tratamiento ("Cada 12 h · día 3 de 7"), sección "Tomas de hoy" con su estado y "Confirmar", y botón + arriba. |
| G2 | Detalle de tratamiento | Cabecera oscura con el medicamento, la presentación, la etiqueta VIGENTE, fichas (Cada 12 h, 7 días, Fórmula) y el progreso "Día 3 de 7 · 43 %". Debajo: horarios de toma (chips, Editar, Agregar), interruptor "Recordatorio de toma · 10 min antes de cada horario" y la lista de tomas del día con su estado. Menú ••• arriba. |
| G3 | Agregar medicamento | Paso 1 de 2 · Medicamento: Nombre *, Presentación, Vía, Dosis, Duración, Prescrito por y "Foto de la fórmula médica". Botón "Siguiente: horarios". |
| G4 | Definir horarios de toma | Paso 2 de 2 · Horarios: Cada 8 h / 12 h / 24 h, primera toma del día (06:00–10:00), las tomas calculadas, interruptor "Recordatorio · 10 min antes de cada toma" y "Guardar horarios". |
| G5 | Recordatorio de toma | Notificación en la pantalla de bloqueo: "Hora de la dosis de Luna · Amoxicilina 250 mg · 1 cápsula (20:00)", con los botones "Omitir" y "Ya la di". |
| G6 | Toma omitida | Hoja inferior "Marcar dosis como omitida": "Recordarme en 30 min" u "Omitir esta dosis · Quedará registrada como omitida", y "Confirmar". |
| G7 | Revisar datos de la fórmula | Paso 1 de 2: foto leída, más Medicamento, Dosis, Cada, Desde y Hasta propuestos. Alerta "Confirma la dosis con tu veterinario antes de activar recordatorios." Botones "Confirmar y seguir" / "Corregir". |
| G8 | Finalizar tratamiento | Diálogo "¿Finalizar este tratamiento? Se apagan los recordatorios y queda en Finalizados. El historial no se borra." Botones "Sí, finalizar" / "Seguir con el tratamiento". |
| G9 | Tratamiento finalizado | Confirmación con el resumen (Duración 3 de 7 días, Tomas registradas 5 de 6, Omitidas 1), la nota "puedes reactivarla desde Finalizados" y los botones "Ver medicamentos" / "Ir a la línea de tiempo". |

## Paso a paso

Caso: la veterinaria le receta a Luna Amoxicilina 250 mg, 1 cápsula cada 12 horas por 7 días. Samuel tiene la fórmula en papel.

1. **Entrada (G1).** En Inicio toca **Accesos rápidos › Medicamentos** → G1. También se llega desde F1 o desde "Medicación vigente" en F5. Toca **+**.
2. **Foto de la fórmula (G3).** Toca "Foto de la fórmula médica" → hoja **E8** → toma la foto → **E12** para revisarla → lectura (pantalla de progreso de **C12**).
3. **Revisión (G7).** Balto propone Amoxicilina 250 mg, 1 cápsula, cada 12 horas, del 21/09/2026 al 28/09/2026. Samuel revisa los datos y toca **Confirmar y seguir**. Si algo quedó mal leído, **Corregir** abre G3 con los campos llenos para editarlos.
4. **Horarios (G4).** Ya viene marcado *Cada 12 h* por la fórmula. Elige la primera toma a las **08:00**; Balto calcula Toma 1 08:00 y Toma 2 20:00. Deja el *Recordatorio* encendido y toca **Guardar horarios**.
5. **Listo.** Vuelve a **G2** con el tratamiento VIGENTE, "Día 1 de 7" y las tomas de hoy.
6. **Recordatorio (G5).** A las 19:50 llega la notificación. Samuel le da la cápsula a Luna y toca **Ya la di**; la toma de las 20:00 queda "Tomada 19:52".
7. **Seguimiento (G1 / G2).** En "Tomas de hoy" cada toma muestra su estado. "Confirmar" marca como tomada una toma pendiente, con la hora actual.
8. **Fin.** El día 7, después de la última toma, el tratamiento pasa solo a **Finalizados** y Balto avisa "Terminó el tratamiento de Amoxicilina".

### Variantes del paso a paso

- **Sin fórmula (G3 a mano).** Samuel escribe Nombre "Amoxicilina", Presentación "Cápsula 250 mg", Vía "Oral", Dosis "1 cápsula", Duración "7 días" y Prescrito por "Dra. Gómez · Vet. Norte". Toca **Siguiente: horarios** → G4.
- **Desde Registrar evento (E5).** "Crear horarios de toma" en E5 abre G4. Al guardar el evento, el tratamiento aparece en G1 (ver la spec de E).
- **Omitir una toma (G6).**
  - Se abre con "Omitir" en la notificación G5 o al tocar una toma pendiente (no su botón "Confirmar") en G1 o G2.
  - "Recordarme en 30 min" reprograma el aviso; la toma queda "Pospuesta".
  - "Omitir esta dosis" la registra como "Omitida".
- **Finalizar antes (G8 → G9).**
  - En G2, ••• → "Finalizar tratamiento" → G8 → "Sí, finalizar" → G9.
  - "Ver medicamentos" → G1. "Ir a la línea de tiempo" → **D2**.
- **Reactivar.** En G1 › Finalizados, el ••• de G2 ofrece "Reactivar". Abre **G4** con fecha de inicio hoy y la misma duración.
- **Editar horarios.** "Editar" o "Agregar" en G2 abre G4 con los horarios actuales. Los cambios valen desde la próxima toma.
- **Frecuencia semanal.** Para tratamientos como "Champú medicado · 2 veces por semana", G4 ofrece una cuarta opción, *Días de la semana*: se eligen los días y la hora.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Toma pendiente | G1, G2 | "Pendiente" con el botón "Confirmar" y la hora del aviso. |
| Toma tomada | G1, G2 | "Tomada 8:05 a. m." con un chulo verde. |
| Toma pospuesta | G2 | "Aviso reprogramado" con la nueva hora. |
| Toma omitida | G2 | Chip oscuro "Omitida". |
| Toma vencida sin respuesta | G2 | Si pasan 2 horas desde la hora de la toma sin confirmar ni omitir, queda "Sin registrar" (cuenta como omitida en el resumen). *(Falta en Figma.)* |
| Sin tratamientos vigentes | G1 | "No hay medicamentos vigentes" con el botón "Agregar medicamento". *(Falta en Figma.)* |
| Sin tomas hoy | G1 | La sección "Tomas de hoy" no se muestra. |
| Leyendo la fórmula | G3 → G7 | Pantalla de progreso de **C12**. Si falla, **C13** con "Tomar otra foto" / "Escribir a mano" (→ G3). |
| Dosis por confirmar | G7 | Alerta roja fija: la dosis leída debe confirmarla un veterinario. |
| Recordatorios apagados | G2, G4 | Si el interruptor está apagado, o "Tomas de medicamentos" está apagado en **M3**, no llega G5. Las tomas se siguen mostrando en G1 y G2. |
| Sin permiso de notificaciones | G4 | Al encender el recordatorio se pide el permiso con **O5 · Permiso de notificaciones**. |
| Formulario incompleto | G3 | "Siguiente: horarios" deshabilitado sin Nombre. |
| Salir sin guardar | G3 (X) | Diálogo de **B8** ("Perderás los datos de este medicamento."). |
| Tratamiento finalizado | G2 | Etiqueta FINALIZADO en lugar de VIGENTE, sin recordatorios y con ••• → "Reactivar". |

## Qué pasa después

- **Tratamiento creado** → aparece en **D2** (evento de tipo tratamiento), en **F3**, en "Medicación vigente" de **D1**, en **F5** y en lo que se comparte (**L**).
- **Tomas** → se guardan en el tratamiento. No aparecen una por una en la línea de tiempo.
- **Finalizado** → sale de D1 y de "Medicación vigente", y sigue en F3 y D2 con el estado Finalizado.
- **Recordatorios de toma** → notificaciones G5 según la anticipación de **M3** ("Tomas de medicamentos · 10 min antes"). No crean alertas en J, porque son rutinarias.

## Datos que usa

**Guarda**
- **Tratamiento:**
  - mascota, medicamento, presentación, vía, dosis, prescrito por;
  - frecuencia (cada 8 h | 12 h | 24 h | días de la semana) y días de la semana, si aplica;
  - fecha de inicio, duración en días, fecha de fin (calculada);
  - fórmula (soporte en Supabase Storage);
  - estado (vigente | finalizado), finalizado antes de tiempo (sí/no), recordatorio activo (sí/no);
  - evento de tipo tratamiento asociado (el que se ve en D2).
- **Horario de toma:** tratamiento y hora del día (por ejemplo 08:00 y 20:00).
- **Toma:** tratamiento, fecha y hora programada, estado (pendiente | tomada | pospuesta | omitida | sin registrar), hora real de la toma y hora del aviso reprogramado.
- **Lectura de la fórmula:** igual que el documento cargado de C (ver la spec de C).

**Lee**
- **Mascota activa** y su nombre (para "Hora de la dosis de Luna").
- **Preferencias de notificación (M3):** si los avisos de tomas están encendidos y con qué anticipación.
- **Permiso de notificaciones** del navegador.

**Reglas**
- Las tomas del día se generan a partir de los horarios, entre la fecha de inicio y la de fin.
- El progreso es el día actual sobre la duración (Día 3 de 7 = 43 %).
- Al pasar la fecha de fin, el tratamiento se finaliza solo.

## Fuera de alcance

- Registrar el tratamiento como evento genérico: **E5** (llega a G a través de G4).
- Ver el tratamiento en la línea de tiempo y editar el evento: **D**.
- Inventario de pastillas o aviso de que se acaba el medicamento.
- Comprar medicamentos: la Tienda (**N**) solo vende alimento y vacunas.

## Preguntas abiertas

1. **Notificaciones en web móvil** (pregunta 9 de `CLAUDE.md`). G5 necesita notificaciones push. En iPhone solo funcionan si Balto se instala como PWA (en la pantalla de inicio). La propuesta es instalar Balto como PWA y, si no hay permiso, mostrar las tomas pendientes en G1 y G2 sin notificación. Falta que el equipo la confirme.
2. **Acciones en la notificación.** "Ya la di" y "Omitir" dentro de la notificación dependen del navegador. Si no se pueden usar, tocar la notificación abre G2.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- G3 (desde Medicamentos) y E5 (desde Registrar evento) crean el mismo tratamiento. G4 es el paso de horarios de ambos.
- La foto de la fórmula en G3 se lee con la misma pantalla de progreso de C (C12 / C13) y se revisa en G7. "Corregir" abre G3.
- G6 se abre con "Omitir" en la notificación o al tocar una toma pendiente.
- Una toma sin respuesta 2 horas después queda "Sin registrar".
- Al pasar la fecha de fin, el tratamiento se finaliza solo. "Reactivar" abre G4 con inicio hoy.
- Los recordatorios de toma no crean alertas en J.
- El nombre en las notificaciones es **Balto** (pregunta 8 de `CLAUDE.md`).

Pendiente de ajustar en Figma:
- G5: el nombre de la app en la notificación dice "MASCOTAS"; debe decir "BALTO".
- G4: agregar la opción "Días de la semana".
- G1: estado sin tratamientos vigentes.
- G2: estado "Sin registrar" de una toma.
- G6: el título de la pantalla de fondo dice "Dosis de la noche" y en G2 dice "Noche". Unificar.
