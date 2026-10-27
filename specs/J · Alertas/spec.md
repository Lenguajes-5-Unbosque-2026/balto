# J · Alertas

## Quién y para qué

El dueño ve en un solo lugar lo que vence pronto para todas sus mascotas: refuerzos de vacunas, desparasitaciones, controles y otros avisos de salud. Balto avisa **antes** del vencimiento, no después. Desde cada alerta el dueño puede:
- resolverla registrando el evento;
- agendar una cita;
- comprar la vacuna;
- posponer el aviso.

Importa porque convierte el registro en prevención: una vacuna que no se vence es el beneficio más tangible de tener el historial al día. También es la puerta de entrada a K (citas) y N (Tienda).

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| J1 | Centro de alertas | "Alertas" con el contador, pestañas Próximas (3) / Resueltas, fichas 1 Urgente / 2 Esta semana / 5 Al día, y las alertas agrupadas ("Esta semana", "Más adelante"). Cada alerta muestra cuándo vence, el título y la mascota, más "Ya lo resolví", posponer y agendar. Arriba, el botón de filtros. Lleva la barra de navegación inferior. |
| J2 | Detalle de alerta | Cabecera con el título, la mascota, la fecha de vencimiento y fichas (fecha, frecuencia, veterinaria). Texto de la última dosis y "¿Qué quieres hacer?": Ya lo resolví, Agendar cita, Comprar la vacuna, Posponer aviso. |
| J3 | Posponer aviso | Hoja inferior: Mañana / En 3 días / Elegir fecha y "Posponer". |
| J4 | Alerta vencida | "Refuerzo antirrábica vencido. Venció hace 3 días, el 25 sep." Nota legal "La antirrábica es obligatoria en Colombia (Ley 576)." Opciones Ya lo resolví / Agendar cita / Comprar la vacuna, y botones "Ya lo resolví" / "Agendar cita". |
| J5 | Alerta resuelta | "Alerta resuelta. La antirrábica quedó registrada y programamos el próximo refuerzo.", la tarjeta del evento, el aviso del próximo refuerzo y los botones "Volver a alertas" / "Ver línea de tiempo". |
| J6 | Aviso de vacuna | Notificación: "A Luna le toca el refuerzo · Antirrábica · vence en 2 días (25 sep)", con "Ver alerta" / "Más tarde". La nota "Puedes cambiar cuándo te avisamos en Ajustes › Notificaciones" y "Abrir la app". |
| J7 | Sin alertas pendientes | "Todo al día. Luna y Toby no tienen nada pendiente esta semana.", "Ver alertas resueltas · 8 este año" y "Próxima: control de peso · 5 oct". |

## Paso a paso

Caso: el refuerzo de la antirrábica de Luna vence el 25 sep. Samuel la registró en E2 con el recordatorio encendido.

1. **Aviso (J6).** El 18 sep (7 días antes, según **M3**) llega la notificación "A Luna le toca el refuerzo". Samuel toca **Ver alerta** → **J2**.
2. **Detalle (J2).** Ve "vence el 25 sep (en 2 días) · Anual · Vet. Norte" y "La última dosis fue el 25 sep 2025 en Clínica Veterinaria Norte".
3. **Agendar (K).** Toca **Agendar cita** → **K3 · Listado de proveedores**, filtrado por el servicio "Vacunación" y con Vet. Norte primero. Agenda la cita (K5 → K9).
4. **Resolver (E2 → J5).**
   - El día de la cita vuelve a J1 y toca **Ya lo resolví** en la tarjeta. Se abre **E2** con la vacuna (Antirrábica), la mascota (Luna) y la fecha (hoy) ya llenos.
   - Samuel adjunta la foto del carnet y toca **Guardar evento**.
   - En lugar de E9 se muestra **J5**: "Alerta resuelta", la tarjeta del evento y "Te avisaremos 7 días antes del refuerzo, el 18 sep 2027".
5. **Después.** "Volver a alertas" → J1, donde la alerta ya está en la pestaña Resueltas. "Ver línea de tiempo" → **D2**.

### Variantes del paso a paso

- **Posponer (J3).** El ícono de reloj de la tarjeta, o "Posponer aviso" en J2, abre J3. Las opciones son "Mañana", "En 3 días" o "Elegir fecha" (abre un calendario). Solo se mueve el aviso; la fecha de vencimiento no cambia. La tarjeta muestra "Aviso pospuesto al 26 sep".
- **"Más tarde" en la notificación (J6).** Pospone el aviso hasta mañana a la misma hora, igual que J3 con "Mañana".
- **Comprar la vacuna.** Abre **N5 · Detalle de vacuna y aplicación** con esa vacuna (flujo N).
- **Vencida (J4).** Si pasa la fecha de vencimiento sin resolverla, la alerta cambia a J4 y cuenta como "Urgente". Llega una notificación el día siguiente al vencimiento. Las acciones son las mismas de J2, sin Posponer.
- **Ícono de calendario en la tarjeta.** Hace lo mismo que "Agendar cita".
- **Filtros.** El botón de filtros de J1 abre una hoja con Mascota (todas, Luna, Toby…) y Tipo (vacunas, desparasitación, controles, alimento, salud).
- **Sin pendientes (J7).** "Ver alertas resueltas" abre la pestaña Resueltas. "Próxima: …" abre el J2 de esa alerta.

## Tipos de alerta

| Tipo | Se crea desde | "Ya lo resolví" hace |
|---|---|---|
| Refuerzo de vacuna | E2 / C8, con próximo refuerzo y recordatorio encendido | Abre E2 con los datos llenos |
| Próxima desparasitación | E10 / C8, con próxima dosis y recordatorio encendido | Abre E10 con los datos llenos |
| Próximo control de examen | E4 / F7, con "Próximo control" | Abre E4 con el tipo de examen lleno |
| Control de peso | Automática: la última medición tiene más de 30 días | Abre E6 |
| Cambio brusco de peso | F4: variación de más del 10 % en un mes | "Entendido" (solo marca como vista) |
| Alimento por acabarse | H: 5 días o menos de alimento | "Ya compré" (reinicia la bolsa en H) o "Comprar" (N2) |

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Próxima | J1 | En "Más adelante" (más de 7 días) o "Esta semana" (7 días o menos). Las de esta semana se ven como tarjetas grandes con acciones. |
| Urgente (vencida) | J1, J4 | La fecha de vencimiento ya pasó. Va primero en la lista y se cuenta en "Urgente". |
| Pospuesta | J1 | "Aviso pospuesto al …". El vencimiento no cambia. |
| Resuelta | J1 (Resueltas), J5 | Con la fecha en que se resolvió y el evento que la resolvió. |
| Sin pendientes | J7 | No hay nada que venza en los próximos 7 días ni nada vencido. |
| Sin alertas | J1 | Para un dueño nuevo sin ninguna alerta: J7 sin la tarjeta "Próxima". |
| Contador | Barra inferior, Inicio | El ícono de alertas muestra un punto si hay alertas urgentes o de esta semana. |
| Notificaciones apagadas | J6 | Si el tipo está apagado en **M3**, no llega J6, pero la alerta sigue en J1. |
| Sin permiso de notificaciones | — | **O5** (flujo O). Las alertas se siguen viendo en J1. |

**Fichas de J1:** "Urgente" = vencidas; "Esta semana" = vencen en 7 días o menos; "Al día" = vencen más adelante.

## Qué pasa después

- **Ya lo resolví** → formulario de E del tipo, con los datos llenos → al guardar, **J5** en vez de E9. Si el nuevo evento tiene próxima fecha y recordatorio, crea la alerta siguiente.
- **Agendar cita** → **K3** filtrado por el servicio → **K5 / K9**. La cita queda en **K6 · Calendario unificado**.
- **Comprar la vacuna** → **N5**.
- **Editar o eliminar** el evento de origen en **D** actualiza o borra su alerta.
- La **próxima alerta** se muestra en Inicio ("Próximo a vencer") y en **F1 / F2**.

## Datos que usa

**Lee**
- **Eventos** con próximas fechas: vacunas, desparasitaciones y exámenes (de E, C y D).
- **Pesos** (F4) y **plan de alimentación** (H), para las alertas automáticas.
- **Mascotas** del dueño: nombre y foto.
- **Preferencias de notificación (M3):** anticipación por tipo y franja de no molestar.

**Guarda**
- **Alerta:**
  - mascota, tipo, evento de origen (si lo hay);
  - fecha de vencimiento, fecha del aviso (vencimiento − anticipación de M3) y fecha del aviso pospuesto;
  - estado (próxima | vencida | resuelta), fecha en que se resolvió y evento que la resolvió.
- **Notificación enviada:** alerta, fecha y tipo (aviso | vencida), para no repetirla.

**Reglas**
- La alerta pasa a vencida al día siguiente de la fecha de vencimiento.
- Las notificaciones respetan la franja de no molestar de M3 (22:00–07:00). Si un aviso cae en esa franja, se envía a las 07:00.

## Fuera de alcance

- Configurar la anticipación de los avisos: **M3**.
- Recordatorios de tomas de medicamentos (**G5**) y de comidas (**H5**): son rutinarios y no aparecen en J.
- Buscar veterinarias y agendar: **K**. Comprar: **N**.

## Preguntas abiertas

1. **Base legal de J4.** J4 dice "La antirrábica es obligatoria en Colombia (Ley 576)". La Ley 576 de 2000 es el código de ética de la profesión veterinaria. Hay que verificar con un veterinario o abogado cuál es la norma que hace obligatoria la vacuna antirrábica antes de citarla en la app.
2. **Notificaciones push en web móvil** (pregunta 9 de `CLAUDE.md`). Es la misma pregunta de G: J6 depende de que Balto se instale como PWA.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- J1 es la pestaña de alertas de la barra inferior y muestra las alertas de todas las mascotas.
- Fichas: Urgente = vencidas; Esta semana = 7 días o menos; Al día = más adelante.
- "Ya lo resolví" abre el formulario de E del tipo con los datos llenos y, al guardar, muestra J5.
- "Agendar cita" lleva a K3 filtrado por el servicio. "Comprar la vacuna" lleva a N5.
- Posponer mueve el aviso, no el vencimiento. "Más tarde" en J6 = mañana.
- El control de peso mensual es una alerta automática si no hay medición en 30 días.
- Las alertas se envían fuera de la franja de no molestar de M3.

Pendiente de ajustar en Figma:
- J1: hoja de filtros (mascota y tipo).
- J1: estado "Aviso pospuesto" en la tarjeta.
- J4: corregir la cita legal cuando se verifique.
