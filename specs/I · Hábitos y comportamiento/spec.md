# I · Hábitos y comportamiento

## Quién y para qué

El dueño lleva una bitácora de los hábitos diarios de su mascota (paseos, actividad, sueño, deposiciones, alimentación y comportamientos atípicos) y la exporta en PDF para llevarla a una consulta con el veterinario o con un etólogo.

Importa porque muchos problemas (dermatitis, ansiedad, problemas digestivos) se diagnostican mirando patrones a lo largo de semanas, y el dueño no los recuerda con precisión en la consulta. Como dice I6: "Con 2 semanas de registro ya se nota un patrón útil para la consulta."

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| I1 | Bitácora de hábitos | "Hábitos de Luna": chips Todos / Paseos / Sueño / Comportamiento, gráfica "Paseos por semana · 4 semanas" y lista de registros con tipo, detalle, fecha y soporte. Botón + arriba. |
| I2 | Registrar hábito | Cuadrícula de tipos (Paseo, Actividad, Sueño, Deposiciones, Alimentación, Atípico), Fecha, Duración, Observación, "Foto o video de apoyo" y "Guardar". |
| I3 | Exportar bitácora | "¿Qué quieres llevar a la consulta?": Paseos y actividad, Sueño, Comportamiento atípico y Deposiciones (casillas), rango Desde / Hasta, "Para: Veterinario / Etólogo" y "Generar PDF". |
| I4 | Vista previa de la bitácora | Chips de lo incluido, vista previa del PDF (2 páginas), "Hábitos de Luna · 1 al 23 sep 2026", opciones WhatsApp / Correo / Imprimir / Guardar, la nota "Quien lo recibe no necesita cuenta ni la app." y "Enviar". |
| I5 | Bitácora enviada | "Bitácora lista · Luna_habitos_sep.pdf · 2 páginas · 180 KB", "Enviado por WhatsApp · Hoy 9:41", "Guardar una copia", una nota y los botones "Volver a hábitos" / "Enviar a alguien más". |
| I6 | Bitácora vacía | "Aún no registras hábitos", la nota de las 2 semanas y "Registrar hábito". |

## Paso a paso

Caso: Luna ladra de noche y duerme poco. La veterinaria le pidió a Samuel anotar paseos, sueño y comportamiento durante 3 semanas.

1. **Entrada (I1 / I6).** En Inicio toca **Accesos rápidos › Hábitos**. La primera vez ve **I6** y toca **Registrar hábito**.
2. **Registrar (I2).** Elige **Paseo**, deja la *Fecha* en 22/09/2026, escribe la *Duración* "45 min" y la *Observación* "Paseo largo en el parque, muy activa." y toca **Guardar**. Vuelve a I1 con el registro arriba.
3. **Durante las semanas.** Registra "Ladrido nocturno" (Atípico) con una foto y "Durmió poco · 6 h" (Sueño). En I1 los chips filtran por tipo, y la gráfica muestra el tipo elegido: paseos por semana, horas de sueño por noche o atípicos por semana.
4. **Exportar (I3).** Antes de la consulta toca el ícono de exportar en I1 → I3. Marca Paseos y actividad, Sueño y Comportamiento atípico, elige del 01/08/2026 al 23/09/2026 y *Para: Veterinario*. Toca **Generar PDF**.
5. **Vista previa (I4).** Revisa el PDF de 2 páginas: resumen, gráficas por tipo y lista de registros con sus fotos. Toca **WhatsApp** (o **Enviar**, que abre el menú de compartir del teléfono) y elige el chat de la clínica.
6. **Listo (I5).** Ve "Bitácora lista". **Guardar una copia** descarga el PDF al teléfono. "Volver a hábitos" → I1. "Enviar a alguien más" → I4.

### Variantes del paso a paso

- **Correo.** "Correo" en I4 abre el correo del teléfono con el PDF adjunto.
- **Imprimir / Guardar.** "Imprimir" abre el diálogo de impresión del navegador. "Guardar" descarga el PDF.
- **Para etólogo.** Con *Etólogo*, el PDF pone primero el comportamiento atípico y el sueño, y su título dice "Bitácora de comportamiento".
- **Tipos según la duración.**
  - Paseo, Actividad y Sueño piden duración.
  - Deposiciones pide "Cómo fue": normal, blanda, líquida o con sangre. Si es "con sangre", Balto muestra "Consúltalo con tu veterinario".
  - Alimentación y Atípico piden solo la observación.
- **Ver un registro.** Tocar una tarjeta de I1 abre su detalle (**D4** con el diseño del evento), con Editar y Eliminar.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Sin registros | I6 | Mensaje vacío con "Registrar hábito". |
| Pocos datos | I1 | Con menos de 2 semanas la gráfica muestra lo que hay, con la nota "Con 2 semanas de registro ya se nota un patrón." |
| Filtro sin registros | I1 | "No hay registros de Sueño todavía." |
| Formulario incompleto | I2 | "Guardar" deshabilitado sin tipo y sin fecha. Paseo, Actividad y Sueño piden también la duración. |
| Salir sin guardar | I2 (X) | Diálogo de **B8** ("Perderás este registro."). |
| Nada que exportar | I3 | "Generar PDF" deshabilitado si no hay ninguna categoría marcada o si no hay registros en el rango. En ese caso: "No hay registros en esas fechas". |
| Generando PDF | I3 → I4 | Indicador de carga en el botón. |
| Archivo muy pesado | I2 | Mismo error que **E13** (fotos de más de 10 MB). |

## Qué pasa después

- **Alimentación y Atípico** son los mismos eventos de **E7** (alimentación y comportamiento). Aparecen en **D2** bajo el chip "Hábitos" y en lo que se comparte (**L**).
- **Paseo, Actividad, Sueño y Deposiciones** solo se ven en la bitácora (I1) y en su PDF. No aparecen en la línea de tiempo, para no llenarla de registros rutinarios.
- **El PDF** se comparte como archivo; no crea un enlace público (eso es **L**).

## Datos que usa

**Guarda**
- **Registro de hábito:** mascota, tipo (paseo | actividad | sueño | deposiciones), fecha, duración (minutos), consistencia (solo deposiciones), observación y soporte (foto, en Supabase Storage).
- **Alimentación y Atípico:** se guardan como **Evento** de tipo alimentación o comportamiento (igual que E7).
- **Exportación:** mascota, categorías, rango de fechas, destinatario (veterinario | etólogo), archivo PDF generado y fecha. Se guarda para poder volver a descargarlo desde I5.

**Lee**
- Registros de hábito y eventos de alimentación y comportamiento de la mascota, en el rango elegido.
- Datos de la mascota para la portada del PDF: nombre, especie, raza, edad, peso y cédula.

**Reglas de la gráfica de I1**
- Paseos: número de paseos por semana (últimas 4 semanas).
- Sueño: horas promedio por noche.
- Comportamiento: número de registros atípicos por semana.
- Todos: igual que Paseos.

## Fuera de alcance

- Registrar alimentación o comportamiento desde Registrar evento: **E7** (los mismos datos).
- Compartir el perfil completo o con enlace: **L**.
- Detectar patrones automáticamente o hacer diagnósticos.
- Videos como soporte (decisión del flujo E: por ahora solo fotos).

## Preguntas abiertas

Ninguna pendiente del equipo para este flujo.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- I1 se abre desde **Accesos rápidos › Hábitos** en Inicio.
- Alimentación y Atípico en I2 son los mismos eventos de E7 y aparecen en D2. Los hábitos rutinarios solo se ven en la bitácora.
- La bitácora se comparte como archivo PDF, no como enlace.
- Deposiciones pide "Cómo fue" en lugar de duración.
- *Para: Etólogo* cambia el orden y el título del PDF.
- Por ahora no hay video (igual que en E). "Foto o video de apoyo" pasa a "Foto de apoyo".

Pendiente de ajustar en Figma:
- I1: agregar el botón para exportar (hoy no hay forma de llegar a I3).
- I2: cambiar "Foto o video de apoyo" por "Foto de apoyo"; los campos por tipo (duración / cómo fue).
- I1: la tarjeta "Ladrido nocturno" dice "1 video"; cambiarla a foto.
- I5: la nota dice "El enlace del PDF no caduca". Cambiarla por "Puedes volver a generarla cuando quieras.", porque no hay enlace.
- I1: el chip "Comp…" está cortado. Confirmar que dice "Comportamiento".
