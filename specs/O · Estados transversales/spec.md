# O · Estados transversales

## Quién y para qué

Son estados que pueden aparecer en cualquier flujo:
- no hay mascotas;
- no hay internet;
- hay cambios guardados en el teléfono que faltan por subir;
- la sesión expiró;
- hay que pedir un permiso;
- algo falló al guardar o de forma inesperada.

No son un recorrido propio. Son las reglas comunes que los demás flujos referencian.

Importan porque sostienen la promesa central del producto: **lo que se registra no se pierde**. Si se cae la conexión mientras el dueño registra una vacuna, el evento queda guardado en el teléfono y se sube solo después.

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| O1 | Sin mascotas registradas | Inicio vacío: "Hola, Samuel", "Aún no tienes mascotas. Registra a tu primera mascota y empieza a guardar su historial.", "Registrar una mascota · Toma 2 minutos", "Ya tengo una cédula Balto · Buscar por número" y la barra inferior. |
| O2 | Sin conexión | Banda "Sin conexión · estás viendo datos guardados", "No hay internet. Puedes consultar todo lo que ya estaba descargado. Para subir soportes necesitas conexión.", "Ver perfiles y línea de tiempo · Disponible sin conexión", "Subir soportes · Requiere internet" y los botones "Reintentar" / "Seguir sin conexión". |
| O3 | Guardado pendiente | Banda "2 cambios pendientes de subir", "Se suben solos cuando vuelva el internet", la lista de pendientes (Vacuna antirrábica, carnet_luna.jpg), la advertencia "No cierres sesión mientras haya cambios pendientes: se perderían." y los botones "Intentar subir ahora" / "Más tarde". |
| O4 | Sesión expirada | Diálogo "Tu sesión expiró. Por seguridad cerramos la sesión después de un tiempo sin uso. Tus datos están guardados." Botones "Iniciar sesión" / "Salir". |
| O5 | Permiso de notificaciones | "¿Te avisamos lo importante?", tipos de aviso (Vacunas y desparasitaciones · 7 días antes, Tomas de medicamentos · 10 min antes, Citas · 1 día antes) y los botones "Activar avisos" / "Ahora no". |
| O6 | Permiso de cámara | "Necesitamos la cámara. Para tomar fotos del carnet, exámenes y fórmulas.", "Solo usamos la cámara cuando tú abres esta pantalla.", "Subir un archivo que ya tengas" y los botones "Permitir cámara" / "Subir archivo". |
| O7 | Permiso de fotos | "Acceso a tus fotos": "Solo las fotos que elijas (recomendado)" o "Toda la galería", una nota de ajustes y los botones "Elegir fotos" / "Tomar una foto". |
| O8 | No se pudo guardar | "No pudimos guardar. Se perdió la conexión mientras subíamos el evento. No se borró nada.", el evento "Guardado en el celular", "Lo reintentamos solos cuando vuelva el internet." y los botones "Reintentar" / "Guardar y salir". |
| O9 | Algo salió mal | "Algo salió mal. Tuvimos un problema inesperado. Tus datos están a salvo.", "Código del error: BAL-500", y los botones "Reintentar" / "Ir a Ayuda". |

## Paso a paso

Caso: Samuel registra la vacuna de Luna en la clínica, donde la señal es mala.

1. **Registrar sin señal.** En **E2** llena la vacuna, toma la foto del carnet y toca **Guardar evento**.
2. **No se pudo guardar (O8).** La conexión se cae mientras sube. Balto guarda el evento y la foto en el teléfono y muestra O8: "No se borró nada".
3. **Guardar y salir.** Samuel toca **Guardar y salir**. El evento aparece en la línea de tiempo con la marca "Pendiente" y en Inicio aparece la banda "1 cambio pendiente de subir".
4. **Pendientes (O3).** Al tocar la banda ve **O3** con la vacuna y carnet_luna.jpg pendientes. "Más tarde" vuelve atrás.
5. **Vuelve el internet.** Balto sube los cambios solo, en el orden en que se hicieron. La banda desaparece, el evento pierde la marca "Pendiente" y aparece el mensaje "Cambios guardados". Si el evento tenía recordatorio, la alerta de J se crea en ese momento.

### Variantes del paso a paso

- **Sin mascotas (O1).** Aparece en Inicio cuando el dueño no tiene mascotas activas: no terminó B, o archivó la única que tenía. "Registrar una mascota" → **B1**. "Ya tengo una cédula Balto" → ver Preguntas abiertas.
- **Abrir la app sin internet (O2).**
  - La banda roja aparece arriba en cualquier pantalla.
  - Si la pantalla necesita datos que no están guardados en el teléfono, se muestra O2 completo.
  - "Ver perfiles y línea de tiempo" abre lo guardado. "Reintentar" vuelve a cargar. "Seguir sin conexión" cierra el aviso y deja la banda.
- **Sesión expirada (O4).**
  - Después de 30 días sin usar la app, al abrirla se muestra O4. "Iniciar sesión" → **A6**. "Salir" → **A2**.
  - Los cambios pendientes se conservan en el teléfono y se suben cuando el mismo dueño vuelve a entrar.
- **Permiso de notificaciones (O5).**
  - Se muestra al llegar a Inicio por primera vez (después de C7) y cada vez que el dueño enciende un recordatorio sin haber dado permiso (E2, E10, G4, H4, M3).
  - "Activar avisos" abre la solicitud de permiso del navegador. "Ahora no" vuelve atrás; O5 no se vuelve a mostrar sola antes de 7 días.
  - Si el navegador ya bloqueó el permiso, O5 explica cómo activarlo en los ajustes del navegador.
- **Cámara y fotos (O6, O7).** En la primera versión, Balto usa el selector de archivos y la cámara nativa del teléfono. En el navegador eso no pide permiso, así que **O6 y O7 no se muestran** (ver Cambios). Si un navegador bloquea la cámara, el dueño puede usar "Subir archivo".
- **Error inesperado (O9).** Cualquier error del servidor que no sea de conexión muestra O9 con un código. "Reintentar" repite la acción. "Ir a Ayuda" abre el formulario de **M8** con el código ya escrito.
- **Cerrar sesión con pendientes.** Si hay cambios pendientes, **M17** muestra la advertencia de O3 y ofrece "Intentar subir ahora" antes de cerrar.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Sin conexión | Banda en cualquier pantalla | "Sin conexión · estás viendo datos guardados". |
| Datos no disponibles sin conexión | O2 | Pantalla completa con Reintentar / Seguir sin conexión. |
| Cambios pendientes | Banda en Inicio y D2, O3 | "N cambios pendientes de subir". Los eventos se ven con la marca "Pendiente". |
| Subiendo | O3 | Cada pendiente muestra su progreso. |
| Subido | Mensaje breve | "Cambios guardados". |
| Conflicto | O3 | Si el evento se editó en otro dispositivo mientras tanto, gana el cambio más reciente y se avisa "Actualizamos este evento con la versión más reciente". |
| Error al subir un pendiente | O3 | El pendiente queda en rojo con "Reintentar" (por ejemplo, un archivo dañado). |
| Acciones que exigen internet | — | Pagar (N7), leer documentos (C12, G7), compartir por enlace o correo (L), buscar veterinarias (K), exportar (M6) y crear la cuenta o iniciar sesión (A) muestran O2 en lugar de quedar en cola. |

## Qué pasa después

- **Los pendientes subidos** se comportan como si se hubieran guardado en línea: aparecen en D2, F, G y J, y crean sus alertas.
- **O1** lleva a B. **O4** lleva a A6 o A2. **O9** lleva a M8.

## Datos que usa

**Guarda en el teléfono** (almacenamiento del navegador, IndexedDB)
- **Copia local:** la última versión descargada de mascotas, eventos, alertas, tratamientos y plan de alimentación del dueño, para consultarla sin internet.
- **Cola de cambios pendientes:** dueño, tipo de cambio (crear | editar | eliminar), entidad, datos, archivos adjuntos (hasta 10 MB cada uno), fecha, intentos y último error.

**Guarda en el servidor**
- **Registro de errores:** código (por ejemplo BAL-500), pantalla, fecha y dueño, para soporte.

**Lee**
- **Estado de la conexión** del navegador.
- **Estado de los permisos** de notificaciones.
- **Sesión** de Supabase Auth: la sesión vence después de 30 días sin uso.

**Reglas**
- Los cambios pendientes se suben en orden. Cada uno lleva un identificador creado en el teléfono, para que un reintento no lo duplique.
- La copia local se borra al cerrar sesión, después de advertir si hay pendientes.

## Fuera de alcance

- Usar sin conexión las acciones que exigen internet (ver Estados).
- Sincronizar entre varios dispositivos en tiempo real; cada dispositivo se actualiza al abrir la app.
- O6 y O7 en la primera versión (ver Cambios).

## Preguntas abiertas

1. **PWA** (pregunta 9 de `CLAUDE.md`). La copia local, la cola de cambios y las notificaciones (G5, H5, J6) suponen que Balto se instala como PWA. Esta spec lo toma como decisión; falta que el equipo la confirme.
2. **"Ya tengo una cédula Balto" (O1).** ¿Qué pasa al buscar una cédula que ya existe? (por ejemplo, transferir la mascota de otro dueño). No hay pantallas para eso. Es la misma pregunta de la spec de B.
3. **Pantallas anchas** (pregunta 9 de `CLAUDE.md`). ¿Qué se muestra en una pantalla más ancha que un teléfono? La propuesta es centrar la columna móvil con un ancho máximo.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- Balto se instala como PWA. Sin conexión se puede consultar lo descargado, y los eventos con soportes de hasta 10 MB quedan en cola.
- Acciones que exigen internet: pagar, leer documentos, compartir por enlace o correo, buscar veterinarias, exportar, crear la cuenta e iniciar sesión.
- **O6 y O7 no se usan en la primera versión.** El selector de archivos y la cámara nativa del teléfono no piden permiso en el navegador. Las áreas de "vista de cámara" de B2 y C2 abren la cámara del teléfono en lugar de mostrarla dentro de la app.
- O5 se muestra al llegar a Inicio por primera vez y al encender un recordatorio sin permiso. "Ahora no" la silencia 7 días.
- La sesión vence a los 30 días sin uso.
- En un conflicto entre dispositivos, gana el cambio más reciente.
- M17 advierte si hay cambios pendientes antes de cerrar la sesión.

Pendiente de ajustar en Figma:
- O5: el texto de la descripción se superpone con la primera tarjeta.
- O2: el texto dice "Para subir soportes necesitas conexión". Cambiarlo por "Los soportes se suben cuando vuelva el internet" (quedan en cola, como en O3).
- O3: cambiar "No cierres sesión mientras haya cambios pendientes: se perderían" por "Si cierras sesión ahora, perderás estos cambios", porque M17 ya lo advierte.
- B2, C2: la "vista de cámara" pasa a ser un área que abre la cámara del teléfono.

**2026-10-27 · Ajustes aplicados en Figma** (pantallas exportadas a `design/flujos/`)

Hecho:
- O5: el texto ya no se superpone.
- O2: "Lo que registres se sube cuando vuelva el internet."
- O3: "Si cierras sesión ahora, perderás estos cambios."

Sigue pendiente: en B2 y C2, la vista de cámara debe pasar a ser un área que abre la cámara del teléfono.
