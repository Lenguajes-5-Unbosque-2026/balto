# L · Compartir perfil

## Quién y para qué

El dueño comparte el perfil de salud de su mascota con quien lo necesite (veterinario, guardería, cuidador, hotel), **sin que esa persona tenga cuenta ni la app**. Puede elegir:
- **qué** comparte: el perfil completo o solo algunas secciones, y un rango de fechas;
- **cómo** lo comparte: un **PDF** por WhatsApp, por correo, impreso o guardado en el teléfono, o un **enlace** de solo lectura que vence a las 24 horas, a los 7 días o nunca.

Es la otra mitad de la propuesta de valor: "el perfil se muestra en segundos (vista rápida o PDF) a quien lo necesite". Sin L, la información se queda en el celular del dueño.

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| L1 | Selector de contenido | Paso 1 de 3 · Contenido: selector Perfil completo / Filtrado. "Incluir": Identificación y contacto, Vacunas y desparasitaciones, Medicación vigente, Consultas, Exámenes (casillas). Rango Desde / Hasta y "Ver vista previa". Botón de ayuda (?) arriba. |
| L2 | Vista previa del PDF | Paso 2 de 3: chips Perfil completo / Últimos 12 meses / filtros, vista previa de la primera página (Perfil de salud, foto, datos, microchip, alergias, medicación, últimas vacunas, "Página 1 de 3"), opciones WhatsApp / Correo / Imprimir / Guardar, la nota "Quien lo recibe no necesita cuenta ni la app" y "Generar y compartir PDF". |
| L3 | Reporte enviado | Paso 3 de 3: "Reporte listo · Luna_perfil_salud.pdf · 3 páginas · 420 KB", "Enviado por WhatsApp · Hoy 9:41" y "Listo". |
| L4 | Enlace para compartir | Paso 2 de 3 · Enlace: "Solo lectura · Incluye: identificación, vacunas y medicación", "¿Hasta cuándo sirve?" (24 horas / 7 días / Sin vencimiento), "Copiar enlace", "Ver cómo lo verá el veterinario", una nota de privacidad y los botones "Compartir enlace" / "Ver vista previa". |
| L5 | Vista pública del perfil | Página web pública: "Perfil de salud · Balto · Solo lectura · 23 sep 2026", ficha de la mascota (cédula, microchip, peso, contacto), alergias, medicación vigente, últimas vacunas y los botones "Descargar PDF" / "Volver". |
| L6 | Enlace expirado | "Este enlace ya no sirve. El dueño lo compartió por 24 horas y ese tiempo ya pasó.", "Pídele a quien te lo envió que genere uno nuevo desde la app." y "Entendido". |
| L7 | Enviado por correo | "Reporte enviado · Enviado por correo a vetnorte@correo.com · hoy 9:41", "Ver qué compartí · 3 envíos este mes" y los botones "Volver al perfil" / "Enviar a alguien más". |
| L8 | Lo que compartí | Historial: chips "Todo" / "Enlaces activos", lista de envíos (Enlace · vence en 7 días, PDF por WhatsApp, PDF por correo), "Toca el ícono de un enlace activo para desactivarlo." y "Compartir de nuevo". |

## Paso a paso

Caso: Samuel va a dejar a Luna en una guardería que le pide el carnet de vacunas y la medicación.

1. **Entrada.** En la vista rápida (**D1**) toca el ícono de compartir → **L1**. También se llega desde el ícono de compartir de Inicio, desde F2 (carnet), F7 (examen) y el ••• de D4 (evento), con esa sección o evento ya marcados.
2. **Contenido (L1).**
   - Elige **Filtrado** y marca Identificación y contacto, Vacunas y desparasitaciones y Medicación vigente.
   - Deja el rango del 23/09/2025 al 23/09/2026.
   - Las **alergias** siempre se incluyen, por seguridad, aunque no haya casilla.
   - Toca **Ver vista previa**.
3. **Vista previa (L2).** Revisa la primera página del PDF y desliza para ver las otras. Los chips muestran lo elegido; tocarlos vuelve a L1. Toca **WhatsApp**.
4. **Enviar.** Balto genera el PDF y abre el menú de compartir del teléfono con el archivo adjunto. Samuel elige el chat de la guardería.
5. **Listo (L3).** "Reporte listo · Luna_perfil_salud.pdf · 3 páginas · 420 KB". Toca **Listo** y vuelve a la pantalla desde la que abrió L.

### Variantes del paso a paso

- **Perfil completo.** Marca todas las secciones con todo el historial, sin rango.
- **Correo (L2 → L7).**
  - "Correo" pide el correo del destinatario.
  - Balto envía el PDF desde su servidor (con el nombre del dueño como remitente visible) y muestra **L7**.
  - "Enviar a alguien más" vuelve a L2. "Volver al perfil" lleva a D1.
- **Imprimir / Guardar.** "Imprimir" abre el diálogo de impresión del navegador con el PDF. "Guardar" lo descarga. Las dos terminan en L3.
- **Enlace (L2 → L4).**
  - En L2, la opción **Enlace** abre L4, que muestra lo que incluye ("Solo lectura · Incluye: …").
  - Samuel elige **7 días**. **Copiar enlace** copia `balto.app/p/<token>` y muestra "Enlace copiado".
  - **Compartir enlace** abre el menú de compartir del teléfono.
  - **Ver vista previa** o "Ver cómo lo verá el veterinario" abre **L5** en modo vista previa, con "Volver" a L4.
- **Quien recibe el enlace (L5).**
  - Abre la página en cualquier navegador, sin cuenta. Ve solo las secciones elegidas.
  - "Descargar PDF" descarga el mismo contenido en PDF. En la vista pública no aparece "Volver".
- **Enlace vencido (L6).**
  - Si el enlace pasó su vencimiento o el dueño lo desactivó, quien lo abre ve L6. El texto cambia según el caso: "El dueño lo compartió por 24 horas y ese tiempo ya pasó" o "El dueño desactivó este enlace".
  - "Entendido" lleva a la página de bienvenida de Balto (A2).
- **Ver qué compartí (L7 → L8).** Abre **L8 · Lo que compartí**: los envíos y enlaces de la mascota, con chips "Todo" / "Enlaces activos". El ícono de un enlace activo lo desactiva. "Compartir de nuevo" → L1.
- **Ayuda (?).** Explica la diferencia entre PDF y enlace y qué ve quien lo recibe.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Nada elegido | L1 | Con *Filtrado* y sin casillas marcadas, "Ver vista previa" está deshabilitado. |
| Sección vacía | L2, L5 | Si una sección elegida no tiene datos, el PDF dice "Sin registros en este periodo". |
| Generando PDF | L2 | Indicador de carga en el botón. |
| Enlace activo | L4, L5 | El enlace funciona hasta su vencimiento. |
| Enlace sin vencimiento | L4 | Aviso: "Cualquiera con el enlace podrá verlo hasta que lo desactives." |
| Enlace vencido o desactivado | L6 | Mensaje según la causa. |
| Enlace copiado | L4 | Mensaje breve "Enlace copiado". |
| Correo inválido | L2 (Correo) | Error bajo el campo. |
| Error al enviar el correo | L2 | "No pudimos enviar el correo. Intenta de nuevo." *(Falta en Figma.)* |
| Sin conexión | L2, L4 | El PDF y el enlace necesitan conexión: **O2**. |

## Qué pasa después

- **PDF:** se guarda en el historial de envíos de la mascota ("Ver qué compartí").
- **Enlace:** queda activo hasta su vencimiento. Se puede desactivar desde el historial. L5 muestra siempre los **datos actuales** de las secciones elegidas, no una copia del día en que se creó.
- **Cambios en el perfil** (alergias en F6, nuevas vacunas en E) se reflejan en los enlaces activos y en los PDF que se generen después.

## Datos que usa

**Lee**
- **Mascota:** foto, nombre, especie, raza, sexo, edad, cédula, microchip y último peso.
- **Dueño:** nombre y teléfono (contacto).
- **Alergias** (siempre), **tratamientos vigentes**, **vacunas y desparasitaciones**, **consultas** y **exámenes** en el rango elegido (de E, C, F y G).

**Guarda**
- **Envío:**
  - mascota, dueño, formato (pdf | enlace);
  - secciones incluidas, rango de fechas;
  - canal (whatsapp | correo | imprimir | guardar | enlace) y destinatario (solo el correo, si aplica);
  - archivo PDF (Supabase Storage), tamaño, páginas, fecha.
- **Enlace compartido:** envío, token aleatorio de al menos 22 caracteres (que no se pueda adivinar), vencimiento (24 h | 7 días | ninguno), fecha de expiración, activo (sí/no), fecha de desactivación y número de visitas.

**Seguridad**
- L5 se arma en el servidor a partir del token, con solo las secciones del envío. La vista pública nunca consulta las tablas directamente.
- Un token vencido o desactivado responde con L6, sin mostrar ningún dato de la mascota.

## Fuera de alcance

- Que quien recibe el enlace edite o agregue información (el brief deja fuera los permisos por persona).
- Compartir la bitácora de hábitos: **I** (tiene su propio PDF).
- Compartir un soporte suelto: **D5**.
- Exportar todos los datos de la cuenta: **M6**.

## Preguntas abiertas

1. **Servicio de correo.** Enviar el PDF por correo desde Balto (L7) necesita un servicio de envío de correos que no está en el stack.
2. **Dominio.** La spec usa `balto.app/p/<token>` como ejemplo. ¿Cuál es el dominio real?

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- L se abre desde D1, el ícono de compartir de Inicio, F2, F7 y el ••• de D4, con la sección o el evento ya marcados.
- Las alergias siempre se incluyen.
- L2 agrega la opción "Enlace", que lleva a L4.
- El correo lo envía Balto desde el servidor con el PDF adjunto (una página web no puede adjuntar archivos a un `mailto:`).
- WhatsApp usa el menú de compartir del teléfono con el PDF adjunto.
- El token del enlace es largo y aleatorio. El enlace se puede desactivar. L5 muestra los datos actuales.
- La vista pública (L5) no muestra "Volver"; la vista previa del dueño sí.
- "Entendido" en L6 lleva a la bienvenida de Balto.

Pendiente de ajustar en Figma:
- L2: agregar la opción "Enlace" junto a WhatsApp, Correo, Imprimir y Guardar.
- L2: campo para el correo del destinatario.
- Nueva pantalla: historial "Ver qué compartí", con "Desactivar enlace".
- L4: el ejemplo `balto.app/p/luna-9f2c` sugiere un enlace corto y fácil de adivinar. Usar un token largo en el diseño.
- L4: aviso para "Sin vencimiento".
- L5: ocultar "Volver" en la vista pública.
- L6: variante "El dueño desactivó este enlace".

**2026-10-27 · Ajustes aplicados en Figma** (pantallas exportadas a `design/flujos/`)

Hecho:
- L2: opción "Enlace".
- L4: enlace con token largo.
- L5: un solo botón, "Descargar PDF".
- L8 · Lo que compartí: pantalla nueva.

Sigue pendiente: campo de correo en L2, aviso de "Sin vencimiento" en L4 y variante "desactivado" de L6.
