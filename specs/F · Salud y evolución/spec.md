# F · Salud y evolución

## Quién y para qué

El dueño ve la salud de su mascota organizada por tema, en vez de evento por evento:
- el estado de las vacunas y desparasitaciones,
- los exámenes y tratamientos,
- la evolución del peso,
- las alergias y condiciones.

Importa porque responde de un vistazo las preguntas que hace una clínica: ¿está al día con las vacunas?, ¿qué exámenes tiene?, ¿ha subido o bajado de peso?, ¿qué alergias tiene? También es donde el dueño mantiene las alergias y condiciones, que aparecen primero en la vista rápida y en lo que se comparte.

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| F1 | Panel de salud | "Salud de Luna": fichas de Vacunas ("Al día"), Exámenes (2) y Kilos (28,4). Accesos a Carnet de vacunas ("Próxima: antirrábica en 2 días"), Desparasitaciones, Exámenes y tratamientos, Evolución del peso y Medicamentos ("2 vigentes"), y una barra de alergias. Lleva la barra de navegación inferior. |
| F2 | Carnet de vacunas | Selector Vacunas / Desparasitación, tarjetas con el nombre, el refuerzo, la fecha de aplicación y los soportes, la barra "Próxima dosis: antirrábica · 25 sep (en 2 días)", el botón compartir y "Agregar vacuna". |
| F3 | Exámenes y tratamientos | Chips Todos / Exámenes / Tratamientos y la lista de tarjetas con resultado o duración, fecha y soporte. |
| F4 | Evolución del peso | Selector 3 meses / 6 meses / 1 año, gráfica de barras, peso actual, diferencia con el mes anterior, el aviso "Sin cambios bruscos. Te avisaremos si varía más de 10 % en un mes." y "Registrar peso". |
| F5 | Alergias y condiciones | Aviso "Esto aparece primero en la vista rápida y en el reporte que compartes.", chips de alergias, lista de condiciones (Dermatitis atópica, Medicación vigente) y "Editar". |
| F6 | Editar alergias y condiciones | Campo "Agregar alergia" con chips que se pueden quitar y sugerencias, campo Condiciones, "Diagnosticada por", la nota "Guarda solo lo que te confirmó un veterinario." y los botones "Guardar" / "Cancelar". |
| F7 | Detalle de examen | Cabecera con el nombre del examen, la fecha y la veterinaria, y fichas Normal / PDF / Anual. Debajo: Solicitado por, Resultado, Próximo control, el archivo, el resultado principal y los botones "Compartir" / "Editar". |

## Paso a paso

Caso: antes de un control, Samuel revisa cómo está Luna.

1. **Entrada (F1).** En Inicio toca **Accesos rápidos › Salud** → F1. Ve que las vacunas están al día, que tiene 2 exámenes y que pesa 28,4 kg.
2. **Vacunas (F2).** Toca **Carnet de vacunas**. Ve Antirrábica, Múltiple DHPPi+L y Tos de las perreras con sus refuerzos, y la barra "Próxima dosis: antirrábica · 25 sep (en 2 días)". Toca una tarjeta y se abre **D4 · Detalle de evento**.
3. **Exámenes (F3 → F7).** Vuelve a F1 y toca **Exámenes y tratamientos**. Filtra por **Exámenes** y toca "Hemograma completo" → F7: Normal, solicitado por la Dra. Pérez, próximo control el 18 ago 2027. El ojo del archivo abre **D5**.
4. **Peso (F4).** En F1 toca **Evolución del peso**. Elige "6 meses": 28,4 kg actual, +0,3 vs. agosto, sin cambios bruscos.
5. **Alergias (F5 → F6).** Toca la barra de alergias → F5 → **Editar** → F6.
   - Agrega "Res": la escribe y la confirma, o la toca en "Sugerido". Queda como chip.
   - Completa *Condiciones* con "Dermatitis atópica diagnosticada en septiembre de 2026" y *Diagnosticada por* con "Clínica Veterinaria Norte".
   - Toca **Guardar** y vuelve a F5 con los cambios.

### Variantes del paso a paso

- **Desparasitaciones.** El acceso "Desparasitaciones" de F1 abre F2 con la pestaña *Desparasitación* activa.
- **Agregar desde F.**
  - "Agregar vacuna" (F2) abre **E2**; en la pestaña Desparasitación, el botón dice "Agregar desparasitación" y abre **E10**.
  - "Registrar peso" (F4) abre **E6**.
  - Al guardar (E9 → "Listo"), el dueño vuelve a la pantalla de F de donde salió.
- **Tratamientos.** En F3, una tarjeta de tratamiento abre **G2 · Detalle de tratamiento**. "Medicamentos" en F1 y "Medicación vigente" en F5 abren **G1**.
- **Compartir.**
  - El ícono de F2 abre **L1** con "Carnet de vacunas" marcado.
  - "Compartir" y el ícono de F7 abren **L1** con ese examen marcado.
- **Editar un examen.** "Editar" en F7 abre **D6** con el formulario de examen.
- **Condición.** Tocar una condición en F5 abre F6 con esa condición para editarla.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Vacunas al día | F1 | Ficha verde "Al día": ninguna vacuna con refuerzo vencido. |
| Vacuna por vencer | F1, F2 | Si un refuerzo vence en 30 días o menos, la ficha sigue "Al día" y el acceso dice "Próxima: X en N días". |
| Vacuna vencida | F1, F2 | Ficha roja "Vencida" y la tarjeta de la vacuna con la fecha en rojo. *(Falta en Figma.)* |
| Sin vacunas | F2 | "Aún no hay vacunas registradas" con "Agregar vacuna" y "Subir el carnet" (→ C1). *(Falta en Figma.)* |
| Sin exámenes ni tratamientos | F3 | Mensaje vacío con acceso a E4 / E5. *(Falta en Figma.)* |
| Pocas mediciones de peso | F4 | Con 1 medición se muestra una sola barra y no hay comparación. Sin mediciones, "Registra el primer peso" con el botón. |
| Cambio brusco de peso | F4 | Si el peso varía más del 10 % en un mes, el aviso pasa a amarillo ("Luna cambió X % este mes. Consúltalo con tu veterinario.") y se crea una alerta en J. *(Falta en Figma.)* |
| Sin alergias | F5, F1 | "Sin alergias registradas". La barra de F1 dice lo mismo. |
| Cambios sin guardar | F6 | "Cancelar" o la flecha atrás abren el diálogo de **B8** ("Perderás los cambios."). |
| Alergia repetida | F6 | No se agrega dos veces; el chip existente parpadea. |

## Qué pasa después

- **Alergias y condiciones** (F6) actualizan en el acto el aviso rojo de **D1**, el resumen de **L** (PDF y vista pública) y la barra de F1.
- **Cambio brusco de peso** → alerta en **J1**.
- **Próximo control de un examen** (F7) → alerta en **J1**, igual que el próximo refuerzo de una vacuna.
- Las tarjetas de F2 y F3 llevan a **D4**, **F7** o **G2**. Los botones de agregar llevan a **E**.

## Datos que usa

**Lee**
- **Eventos** de la mascota por tipo: vacunas y desparasitaciones (con próximo refuerzo o dosis), exámenes, tratamientos y pesos. Son los mismos datos de E y C, sin una copia aparte.
- **Tratamientos activos** (conteo de "vigentes" en F1), de G.
- **Alergias y condiciones** de la mascota.

**Guarda**
- **Alergias:** lista de textos por mascota (la misma de B4 y C6).
- **Condición:** mascota, nombre o descripción, fecha de diagnóstico, diagnosticada por (texto) y fecha de creación.
- **Examen** (desde E4 / D6): además de los campos de E4, *solicitado por*, *resultado* (normal | alterado) y *próximo control* (fecha, opcional). Ver Cambios.

**Reglas calculadas** (no se guardan)
- Estado de vacunas: "Vencida" si algún próximo refuerzo es anterior a hoy; si no, "Al día".
- Próxima dosis: la fecha de próximo refuerzo o dosis más cercana desde hoy.
- Variación de peso: comparación de la última medición con la del mes anterior. Más del 10 % es un cambio brusco.

**Sugerencias de alergias (F6):** lista fija de alergias comunes por especie (pollo, res, cerdo, trigo, soya, lácteos, pulgas, polen, ácaros). Se sugieren las que todavía no están agregadas.

## Fuera de alcance

- Registrar o editar eventos: **E** y **D**.
- Gestionar medicamentos y horarios: **G**.
- Generar el PDF o el enlace para compartir: **L**.
- Gráficas de otras medidas (temperatura, condición corporal).

## Preguntas abiertas

Ninguna pendiente del equipo. *Resuelto en la revisión cruzada:* los avisos de cambio brusco de peso, control de peso y próximo control de examen se activan con un interruptor nuevo **"Salud"** en M3 (ver la spec de M).

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- F1 se abre desde **Accesos rápidos › Salud** en Inicio.
- F7 es el detalle de un examen (reemplaza a D4 para ese tipo). Los demás tipos usan D4.
- E4 gana tres campos opcionales: "Solicitado por", "Resultado (normal / alterado)" y "Próximo control", que F7 muestra. El próximo control crea una alerta en J.
- Las condiciones se guardan como lista. Cada una tiene nombre, fecha y quién la diagnosticó.
- Las sugerencias de alergias salen de una lista fija por especie.
- Un cambio de peso de más del 10 % en un mes crea una alerta.

Pendiente de ajustar en Figma:
- E4: agregar "Solicitado por", "Resultado (normal / alterado)" y "Próximo control".
- F1 / F2: estado de vacuna vencida.
- F2, F3: estados vacíos.
- F4: aviso de cambio brusco.
- F1: muestra la barra inferior con Inicio activo. Confirmar que F1 es una subpantalla de Inicio.

**2026-10-27 · Ajustes aplicados en Figma** (pantallas exportadas a `design/flujos/`)

Hecho: los campos nuevos de E4 que F7 muestra.

Sigue pendiente: F1 / F2 con vacuna vencida, estados vacíos de F2 y F3, y el aviso de cambio brusco de F4.
