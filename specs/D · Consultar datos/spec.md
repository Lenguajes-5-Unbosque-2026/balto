# D · Consultar datos

## Quién y para qué

El dueño consulta lo que ha registrado de su mascota. Hay dos formas:
- **Vista rápida (D1):** un resumen de una pantalla (identificación, contacto, peso, alergias, medicación vigente y últimas vacunas) para mostrar desde el celular en una consulta o una emergencia.
- **Línea de tiempo (D2):** todos los eventos en orden cronológico, con búsqueda, filtros, detalle, soportes, edición y eliminación.

Importa porque es la mitad de la propuesta de valor: la información sirve si el dueño la encuentra **en segundos** cuando alguien se la pide ("¿tiene alguna alergia registrada?", "¿cuándo fue el último hemograma?").

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| D1 | Vista de acceso rápido | Foto y datos de la mascota (especie, raza, sexo, edad), microchip, contacto del dueño, peso con fecha, aviso rojo de alergias, medicación vigente y últimas vacunas. Botones X y compartir. |
| D2 | Línea de tiempo | Buscador "Buscar en el historial de Luna", botón de filtros, chips de tipo (Todos, Vacunas, Consultas, Exámenes…) y eventos agrupados por mes con su contador. Cada tarjeta muestra ícono, título, subtítulo, fecha y soportes. Lleva la barra de navegación inferior. |
| D3 | Filtros de la línea de tiempo | Hoja inferior "Filtrar eventos": tipo de evento (Vacunas, Consultas, Exámenes, Medicación, Peso, Hábitos) y rango de fechas (Desde / Hasta). Botones "Limpiar" y "Aplicar". |
| D4 | Detalle de evento | Cabecera oscura con el tipo, título, fecha y lugar, y fichas resumen (por ejemplo Refuerzo, 1 dosis, 1 soporte). Debajo, los campos del evento (Producto, Lote, Próximo refuerzo, Registrado por), los soportes y los botones "Eliminar" / "Editar". Menú ••• arriba. |
| D5 | Ver o descargar soporte | Vista del documento (foto o PDF) con Compartir, Descargar y Rotar. |
| D6 | Editar evento | El formulario del tipo con los datos llenos, sin poder cambiar el tipo, con el soporte adjunto ("Cambiar") y "Guardar cambios". |
| D7 | Eliminar evento | Diálogo "¿Eliminar este evento?": "Se borrará «Vacuna antirrábica» y su soporte. No se puede deshacer." Botones "Sí, eliminar" / "Cancelar". |
| D8 | Línea de tiempo vacía | "Aún no hay eventos" y el acceso "Subir documentos que ya tengas · Carnet, exámenes o fórmulas". |
| D9 | Resultados de búsqueda | "2 resultados para «dermatitis»" con chips de tipo y la lista de coincidencias. |
| D10 | Búsqueda sin resultados | "Sin resultados. No encontramos nada con esa palabra y esos filtros." con los filtros activos como chips y "Quitar los filtros". |

## Paso a paso

Caso: en una consulta en una clínica nueva, le preguntan a Samuel cuándo le pusieron a Luna la antirrábica y si tiene alergias.

1. **Vista rápida (D1).** Desde Inicio, Samuel toca la flecha ↗ de la tarjeta de Luna y se abre D1. Le muestra el celular a la veterinaria: alergias "pollo, pulgas (DAPP)", Amoxicilina 250 mg cada 12 h hasta el 28 sep, y la antirrábica del 12/09/2026.
2. **Más detalle (D2).** La veterinaria pide el soporte de la vacuna. Samuel toca el ícono de **Línea de tiempo** en la barra inferior → D2, con los eventos de Luna agrupados por mes, del más reciente al más antiguo.
3. **Buscar (D9).** Escribe "antirrábica". La lista se filtra mientras escribe y muestra "1 resultado para «antirrábica»".
4. **Detalle (D4).** Toca la tarjeta "Vacuna antirrábica": 12 sep 2026 · Clínica Veterinaria Norte · Nobivac Rabies · Lote A1234B · Próximo refuerzo 12/09/2027 · Registrado por Samuel.
5. **Soporte (D5).** Toca "carnet_luna.jpg" y se abre la foto en pantalla completa. Con **Compartir** la envía por el menú de compartir del teléfono (por ejemplo, WhatsApp de la clínica); con **Descargar** la guarda en el teléfono.
6. **Salir.** La X de D5 vuelve a D4, y la flecha de D4 vuelve a D2 con la búsqueda que tenía.

### Variantes del paso a paso

- **Filtrar (D3).** El botón de filtros de D2 abre D3. Samuel marca Vacunas y Consultas y elige del 01/01/2026 al 23/09/2026. Al tocar **Aplicar**, los filtros se ven como chips activos arriba de la lista; **Limpiar** los quita todos. Los chips de D2 son un atajo para filtrar por un solo tipo.
- **Editar (D4 → D6).** "Editar" abre D6 con el formulario del tipo (el mismo de E) y los datos llenos. "Cambiar" en el soporte abre **E8 · Adjuntar soporte**. "Guardar cambios" vuelve a D4 con los datos nuevos y el mensaje "Cambios guardados". Si el evento tenía recordatorio y cambió la fecha del próximo refuerzo, la alerta de J se actualiza.
- **Eliminar (D4 → D7).** "Eliminar" abre D7. "Sí, eliminar" quita el evento, sus soportes y su alerta pendiente, si la tenía, y vuelve a D2 con el mensaje "Evento eliminado".
- **Compartir el perfil (D1).** El ícono de compartir de D1 abre **L1 · Selector de contenido** (flujo L).
- **Sin eventos (D8).** "Subir documentos que ya tengas" abre **C1** en modo "agregar más archivos". El **+** de la barra abre E1.
- **Sin resultados (D10).** "Quitar los filtros" deja solo el texto buscado. Si sigue sin resultados, el dueño cambia la palabra.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Con eventos | D2 | Lista por meses ("Septiembre 2026 · 3 eventos"). El evento más reciente tiene el punto relleno. |
| Sin eventos | D8 | Mensaje vacío y acceso a C1. |
| Buscando | D9 | Resultados en vivo, con un contador y la palabra buscada. |
| Sin resultados | D10 | Filtros activos visibles y "Quitar los filtros". |
| Filtros activos | D2, D9, D10 | Chips activos debajo del buscador. El botón de filtros se ve marcado. |
| Datos que faltan | D1 | Si no hay microchip, peso, alergias, medicación o vacunas, la fila o la sección no se muestra. Si no hay alergias registradas, D1 dice "Sin alergias registradas". |
| Evento sin soporte | D2, D4 | La tarjeta dice "Sin soporte". D4 no muestra el bloque de soporte. |
| Cambios sin guardar | D6 | La X abre el diálogo de **B8** con el texto "Perderás los cambios de este evento." |
| Eliminar | D7 | Confirmación destructiva. |
| Cargando soporte | D5 | Indicador de carga mientras baja el archivo. |
| Sin conexión | D2, D4, D5 | Se muestra lo último que se descargó. Los soportes no descargados muestran **O2 · Sin conexión**. |

## Qué pasa después

- **D1 → L1** (compartir). **D8 → C1** (subir documentos). **D6 → E8** (cambiar soporte).
- **Editar o eliminar** actualiza en el acto F (carnet, exámenes, peso), G (si es tratamiento), J (alertas del evento), la vista rápida D1, Inicio y lo que se comparte en L.
- Las tarjetas de eventos de otros flujos (E9, C7, F2, F3, J2) abren **D4**.

## Datos que usa

**Lee**
- **Mascota activa:** foto, nombre, especie, raza, sexo, fecha de nacimiento (para la edad), microchip.
- **Dueño:** nombre y teléfono (D1).
- **Eventos** de la mascota (todos los tipos de E y C), con sus campos, soportes, fecha, origen (registro | carga inicial) y quién los registró.
- **Último peso, alergias, tratamientos activos y últimas vacunas** (D1).
- **Soportes:** archivo en Supabase Storage, nombre, tipo y tamaño. Se descargan con una URL firmada de corta duración.

**Guarda**
- **Evento editado:** los mismos campos de E, más la fecha de la última edición.
- **Evento eliminado:** se marca como eliminado con la fecha (borrado lógico). Deja de verse en toda la app y se borra del todo, con sus soportes, a los 30 días.
- **Filtros y búsqueda:** no se guardan; viven mientras dura la sesión.

**Mapa de filtros a tipos de evento**

| Chip | Tipos de E |
|---|---|
| Vacunas | vacuna, desparasitación |
| Consultas | consulta |
| Exámenes | examen |
| Medicación | tratamiento |
| Peso | peso |
| Hábitos | alimentación, comportamiento |
| Otros | otro |

**Búsqueda:** busca en el título, el subtítulo y los campos de texto del evento (producto, veterinaria, motivo, diagnóstico, recomendaciones, resultado, detalle). No busca dentro de los archivos.

## Fuera de alcance

- Crear eventos: **E**. Carga inicial: **C**.
- Compartir el perfil completo, generar el PDF y el enlace público: **L**.
- Vistas por tema (carnet, exámenes, peso, alergias): **F**.
- Recuperar eventos eliminados desde la app (no hay papelera).

## Preguntas abiertas

1. **Borrado y permanencia** (pregunta 6 de `CLAUDE.md`). La propuesta de esta spec: el borrado se ve definitivo para el dueño, pero el evento se conserva 30 días con borrado lógico y se puede recuperar escribiendo a Ayuda (igual que M16). Falta que el equipo la confirme.


*Resuelto con la spec de I:* el chip "Hábitos" de D2 muestra solo los eventos de alimentación y comportamiento (E7, y Alimentación / Atípico de I2). Paseos, sueño, actividad y deposiciones se ven solo en la bitácora de I.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- D1 se abre desde la flecha ↗ de la tarjeta de la mascota en Inicio y desde "Ver versión digital" en B6.
- D2 se abre desde el ícono Línea de tiempo de la barra inferior.
- D6 reutiliza el formulario de E del tipo del evento; el tipo no se puede cambiar.
- Eliminar: borrado lógico con retención de 30 días (pendiente de confirmar).
- Mapa de chips a tipos de evento (tabla de Datos que usa).
- Menú ••• de D4: "Compartir este evento" (abre L1 con el evento elegido) y "Descargar soportes".

Pendiente de ajustar en Figma:
- D3: agregar el chip "Otros".
- D2, D8, D9, D10: quitar la flecha atrás cuando se llega desde la barra inferior (es una pestaña).
- D5: sobra uno de los dos botones de descarga (el de arriba o el de abajo).
- D9, D10: el chip de Exámenes usa un ícono de matraz; debe ser el mismo de E1 y D2.

**2026-10-27 · Ajustes aplicados en Figma** (pantallas exportadas a `design/flujos/`)

Hecho:
- D3: chip "Otros".
- D2, D8, D9 y D10: sin flecha atrás.
- D5: sin el botón de descarga de arriba.
- D9 y D10: el chip de Exámenes usa el mismo ícono de D2.

Sigue pendiente: nada.
