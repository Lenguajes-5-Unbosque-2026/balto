# K · Veterinarias y proveedores

## Quién y para qué

El dueño busca veterinarias y otros proveedores (estética, paseo, guardería) cerca de él, ve su ficha, los llama o llega con una ruta y **agenda citas** desde la app. Todas las citas de todas sus mascotas quedan en un **calendario unificado**.

Importa porque cierra el ciclo de las alertas: una vacuna por vencer (J) se convierte en una cita agendada en dos toques. En una urgencia (H6), permite encontrar rápido una veterinaria abierta. También responde a la persona de referencia, que pasa por más de un proveedor.

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| K1 | Buscador · permiso de ubicación | Diálogo "¿Usamos tu ubicación? Para mostrarte las veterinarias más cercanas. También puedes elegir la zona a mano." Botones "Permitir" / "Elegir manualmente". |
| K2 | Filtros de proveedores | Hoja "Filtrar": tipo de servicio (Urgencias 24 h, Consulta general, Especialista, Estética, Paseo, Guardería), distancia (1 km / 3 km / 5 km o más), "Abierto ahora" y los botones "Limpiar" / "Ver 12". |
| K3 | Listado de proveedores | Buscador "Veterinaria, servicio o zona", botón de filtros, botón de mapa, chips Cerca de mí / Urgencias / Abierto y tarjetas con el nombre, la calificación, la distancia y el horario. |
| K4 | Ficha del proveedor | Foto del lugar, nombre, calificación (230 reseñas), distancia, horario, servicios (chips), dirección, teléfono, botones "Llamar" / "Ruta", corazón para marcarlo como favorito y "Agendar cita". |
| K5 | Agendar cita | Proveedor, servicio y mascota (lápiz para cambiarlos), calendario del mes con los días disponibles, "Horarios disponibles · Jue 25" y "Confirmar cita". |
| K6 | Calendario unificado | Calendario del mes con los días que tienen citas, la lista "Próximas citas" (todas las mascotas) y + arriba. |
| K7 | Ubicación denegada | "Sin acceso a tu ubicación. No pasa nada: busca por zona…", campo "Zona o dirección", zonas frecuentes (Chapinero, Usaquén) con su número de veterinarias y botones "Buscar por zona" / "Activar ubicación". |
| K8 | Sin veterinarias cercanas | "Nada cerca con esos filtros", "Ampliar a 5 km" y botones "Ampliar la búsqueda" / "Quitar filtros". |
| K9 | Cita agendada | "Cita agendada · Jueves 25 de septiembre, 10:00 a. m.", resumen (veterinaria, servicio, mascota, dirección), "Agregar al calendario · Recordatorio 1 día antes", "Cómo llegar" y los botones "Ver calendario" / "Ver la clínica". |
| K10 | Sin horarios disponibles | "No quedan horarios ese día", otros días (Vie 26, Sáb 27, Lun 29), interruptor "Avísame si se libera un cupo" y botones "Ver otro día" / "Otra veterinaria". |
| K11 | Detalle de la cita | "Vacunación · Luna · Jue 25 sep · 10:00 a. m.", fichas (Confirmada, 0,8 km, 30 min), datos de la veterinaria, "Reprogramar", "Cancelar la cita · Sin costo hasta 2 h antes" y botones "Cómo llegar" / "Llamar". Botón compartir arriba. |

## Paso a paso

Caso: el refuerzo de la antirrábica de Luna vence el 25 sep y Samuel quiere agendar la vacuna.

1. **Entrada.** En **J2** toca **Agendar cita**. Se abre K3 con el filtro de servicio "Vacunación"; si Samuel tiene una veterinaria favorita, aparece primero.
2. **Ubicación (K1).** Es la primera vez que usa K, así que Balto pregunta "¿Usamos tu ubicación?". Toca **Permitir** y el navegador pide el permiso. Samuel acepta y la lista se ordena por distancia ("Cerca de mí").
3. **Elegir (K3 → K4).** Toca "Clínica Veterinaria Norte · ★ 4,8 · 0,8 km · Abierto 24 h" → K4. Ve los servicios (Urgencias, Vacunación, Cirugía, Laboratorio), la dirección y el teléfono. Toca el corazón para marcarla como su veterinaria de confianza.
4. **Agendar (K5).** Toca **Agendar cita**. K5 viene con "Vacunación · Luna" lleno. Elige el **jueves 25**; los días con cupo se ven sombreados. Elige las **10:00** y toca **Confirmar cita**.
5. **Confirmación (K9).**
   - **Agregar al calendario** descarga un evento (.ics) para el calendario del teléfono.
   - **Cómo llegar** abre la ruta en la app de mapas del teléfono.
   - **Ver calendario** → K6. **Ver la clínica** → K4.
6. **Recordatorio.** Un día antes (según **M3**, "Citas · 1 día antes") llega una notificación con la cita.
7. **Después de la cita.** Al día siguiente, Balto pregunta "¿Cómo te fue en la cita de Luna?" y ofrece registrar lo que pasó. El formulario de E depende del servicio: Vacunación → E2, Consulta → E3, otros → E11, con los datos de la cita ya llenos. Si la cita venía de una alerta, al guardar se resuelve (**J5**).

### Variantes del paso a paso

- **Sin permiso de ubicación (K7).**
  - Si Samuel toca "Elegir manualmente" en K1 o niega el permiso, se abre K7.
  - Escribe una zona o dirección, o elige una zona frecuente, y toca "Buscar por zona" → K3 ordenado por distancia a esa zona.
  - "Activar ubicación" explica cómo darle el permiso al navegador.
- **Filtros (K2).** El botón de filtros de K3 abre K2. "Ver 12" aplica los filtros y dice cuántos resultados hay. Los chips de K3 son atajos (Urgencias = "Urgencias 24 h"; Abierto = "Abierto ahora").
- **Sin resultados (K8).** "Ampliar a 5 km" o "Ampliar la búsqueda" sube la distancia un nivel. "Quitar filtros" deja solo la búsqueda.
- **Sin horarios (K10).**
  - Si el día elegido en K5 no tiene cupos, se muestra K10. Los chips de días cercanos con cupo eligen otro día.
  - "Avísame si se libera un cupo" crea un aviso para ese día.
  - "Ver otro día" vuelve a K5. "Otra veterinaria" vuelve a K3.
- **Mapa.** El ícono de mapa de K3 cambia la lista por un mapa con los proveedores. Tocar un punto muestra su tarjeta.
- **Calendario (K6).**
  - Se abre desde **Accesos rápidos › Calendario** en Inicio o desde "Ver calendario" (K9).
  - Tocar un día muestra solo sus citas. Una cita abre **K11**.
  - "+" abre K3 para agendar una nueva.
- **Reprogramar o cancelar (K11).**
  - "Reprogramar" abre K5 con el mismo proveedor, servicio y mascota.
  - "Cancelar la cita" abre una confirmación ("¿Cancelar la cita? · Sí, cancelar / Volver"); la cita queda cancelada y sale de K6.
  - El botón compartir arriba envía los datos de la cita con el menú de compartir del teléfono.
- **Desde otros flujos.**
  - **H6** "Ver veterinarias" → K3 con "Urgencias 24 h" y "Abierto ahora".
  - **Accesos rápidos › Veterinarias** en Inicio → K3 sin filtros.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Primera vez | K1 | Diálogo propio antes del permiso del navegador. Solo se muestra una vez. |
| Ubicación denegada | K7 | Búsqueda por zona. |
| Con resultados | K3 | Ordenados por distancia. Si hay una veterinaria favorita y cumple los filtros, va primero. |
| Sin resultados | K8 | Ampliar la búsqueda o quitar filtros. |
| Filtros activos | K3 | Chips activos y el botón de filtros marcado. |
| Cerrado ahora | K3, K4 | "Cierra 8 p. m." o "Abre 8 a. m." según la hora. |
| Sin horarios | K10 | Otros días, aviso de cupo u otra veterinaria. |
| Cita confirmada | K11 | Ficha verde "Confirmada". |
| Cita pendiente de confirmar | K11 | Ficha amarilla "Por confirmar", si la veterinaria confirma por su lado. *(Falta en Figma.)* |
| Cita cancelada | K11 | Ficha roja "Cancelada"; las acciones se ocultan. *(Falta en Figma.)* |
| Sin citas | K6 | "No tienes citas próximas" con "Agendar cita" (→ K3). *(Falta en Figma.)* |
| Proveedor sin agenda en línea | K4 | "Agendar cita" se cambia por "Llamar para agendar". |
| Sin conexión | K3, K5 | **O2**. |

## Qué pasa después

- **Cita agendada** → **K6**, recordatorio según **M3** ("Citas"), y al día siguiente la invitación a registrar el evento (**E**).
- **Cita desde una alerta** → al registrar el evento, la alerta se resuelve (**J5**).
- **Veterinaria favorita** → **H6** (urgencia) y primer lugar en K3.
- **Veterinaria de la cita** → sugerida en el campo veterinaria de E2 / E3 al registrar.

## Datos que usa

**Lee**
- **Proveedor:** nombre, tipo (veterinaria | estética | paseo | guardería), servicios, dirección, ubicación (lat/long), teléfono, horario por día, urgencias 24 h (sí/no), calificación, número de reseñas, foto y si tiene agenda en línea.
- **Disponibilidad:** horarios libres por proveedor, servicio y día.
- **Ubicación del dueño:** del navegador o de la zona elegida. No se guarda la ubicación exacta.
- **Mascotas del dueño** (para elegir a cuál es la cita) y **alerta de origen**, si viene de J.

**Guarda**
- **Cita:** dueño, mascota, proveedor, servicio, fecha y hora, duración (min), estado (por confirmar | confirmada | cancelada | realizada), alerta de origen y evento registrado después.
- **Proveedor favorito:** dueño y proveedor (uno o varios; el primero es la "veterinaria de confianza").
- **Aviso de cupo:** dueño, proveedor, servicio y día.
- **Última zona buscada** (texto), para no volver a preguntarla.

## Fuera de alcance

- Pagar la cita o cobrar una penalidad por cancelarla.
- Reseñas escritas por los dueños dentro de Balto.
- Videoconsulta.
- Comprar la vacuna: **N5**.

## Preguntas abiertas

1. **Origen de los datos de proveedores.** ¿De dónde salen el listado, las calificaciones y las reseñas (230 reseñas)? ¿De un servicio de mapas o de un catálogo propio de aliados? Afecta el costo y las condiciones de uso.
2. **Disponibilidad real y confirmación.** Para mostrar horarios libres y confirmar citas hace falta una integración con la agenda de cada clínica, o un panel para que la clínica gestione sus cupos. Ninguno de los dos está en alcance. Mientras no exista, ¿las citas quedan "Por confirmar" y la clínica confirma por teléfono?
3. **"Sin costo hasta 2 h antes" (K11).** Implica una política de cancelación con costo. Sin pagos de citas en la app, ¿quién cobra y cómo? La propuesta es quitar el texto hasta definirlo.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- K se abre desde J2 ("Agendar cita"), H6 ("Ver veterinarias") y dos accesos rápidos nuevos en Inicio: "Veterinarias" (K3) y "Calendario" (K6).
- "Elegir manualmente" en K1 abre el buscador por zona de K7.
- El corazón de K4 marca la veterinaria favorita. La primera es la "veterinaria de confianza" que usa H6.
- "Agregar al calendario" descarga un archivo .ics. "Cómo llegar" y "Ruta" abren la app de mapas.
- Al día siguiente de la cita, Balto invita a registrar lo que pasó con el formulario de E del servicio.
- "Cancelar la cita" pide confirmación con el mismo diálogo destructivo de D7.

Pendiente de ajustar en Figma:
- Inicio: agregar "Veterinarias" y "Calendario" a los accesos rápidos.
- K3: vista de mapa.
- K11: estados "Por confirmar" y "Cancelada", y diálogo de cancelar.
- K6: estado sin citas.
- K11: quitar "Sin costo hasta 2 h antes" hasta definir la política.
