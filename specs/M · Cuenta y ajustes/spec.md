# M · Cuenta y ajustes

## Quién y para qué

El dueño administra su cuenta:
- sus datos de contacto;
- sus mascotas (agregar, editar, archivar sin borrar el historial);
- qué avisos recibe y cuándo;
- sus pedidos de la Tienda;
- la bandeja de notificaciones;
- la ayuda;
- exportar todos sus datos, cerrar sesión o eliminar la cuenta.

Importa porque responde a la objeción principal de la persona de referencia: "¿y si dejo de usarla, pierdo la información de años?". Con M el dueño puede **llevarse sus datos cuando quiera** (M6) y decidir qué pasa con ellos.

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| M1 | Ajustes | Tarjeta del dueño (nombre, correo, ciudad) y accesos: Mis mascotas (3 registradas), Notificaciones, Mis pedidos (Tienda), Exportar mis datos y Ayuda. Al final, "Cerrar sesión". |
| M2 | Editar datos del dueño | "Mis datos": nombre completo, correo, ciudad y teléfono, la nota "El teléfono aparece en la vista rápida y en los reportes PDF." y "Guardar cambios". |
| M3 | Configurar notificaciones | Interruptores por tipo con su anticipación (Vacunas y desparasitaciones · 7 días antes, Tomas de medicamentos · 10 min antes, Comidas, Citas · 1 día antes, Pedidos de la tienda) y "No molestar" Desde 22:00 / Hasta 07:00. |
| M5 | Administrar mascotas | "Mis mascotas": lista (Luna, Toby, Michi) con especie, raza y edad, botón + arriba, "Agregar mascota" y la nota "Archivar una mascota guarda su historial sin borrarlo." |
| M6 | Exportar mis datos | "Tus datos son tuyos": Todas las mascotas / Solo Luna, formato PDF / ZIP con soportes y "Descargar". |
| M7 | Eliminar cuenta | Diálogo "¿Eliminar tu cuenta? Se borrarán tus mascotas, eventos y soportes. Antes, descarga tu información." Botones "Descargar mi información" / "Eliminar cuenta" / "Cancelar". |
| M8 | Ayuda | Buscador "¿Con qué necesitas ayuda?", Preguntas frecuentes, Escríbenos (respondemos en 1 día hábil), Términos y política de datos (versión 23 sep 2026), Reportar un problema, la nota "Si es una urgencia de salud, llama directo a tu veterinaria." y "Escribirnos". |
| M9 | Notificaciones | Bandeja: Todas / Sin leer (2), lista de avisos (Refuerzo antirrábica, Dosis de las 20:00, Tu pedido salió) con la hora, botón "marcar todo como leído" arriba, una nota hacia Ajustes y "Ver todas las alertas". |
| M13 | Archivar mascota | Diálogo "¿Archivar a Toby? Su historial se guarda completo, pero deja de aparecer en Inicio y no genera alertas." Botones "Archivar a Toby" / "Cancelar". |
| M14 | Exportación lista | "Tu archivo está listo · balto_datos_samuel.zip · 3 mascotas · 24,6 MB", "Descargar ahora · El enlace sirve por 7 días", "Enviar a mi correo", la nota "Incluye fichas, eventos y todos los soportes originales." y los botones "Descargar" / "Volver a ajustes". |
| M15 | Confirmar identidad | "Confirma que eres tú": contraseña, la nota "Antes de seguir, considera exportar tus datos. Después no hay vuelta atrás." y los botones "Eliminar mi cuenta" / "Exportar primero". |
| M16 | Cuenta eliminada | "Tu cuenta fue eliminada. Borramos tus mascotas, eventos y soportes.", "Si fue un error, escríbenos en los próximos 30 días." y "Volver al inicio". |
| M17 | Cerrar sesión | Diálogo "¿Cerrar sesión? Tus datos quedan guardados." Botones "Cerrar sesión" / "Cancelar". |

M4 · Gestionar suscripción, M10 · Historial de pagos, M11 · Cancelar suscripción y M12 · Suscripción cancelada se eliminaron (no hay suscripción).

## Paso a paso

Caso: Samuel quiere llevarse una copia de todo lo que tiene en Balto.

1. **Entrada (M1).** En Inicio toca su avatar (arriba a la izquierda) → M1.
2. **Exportar (M6).** Toca **Exportar mis datos**. Elige **Todas las mascotas** y **ZIP con soportes** y toca **Descargar**.
3. **Preparando.** El botón muestra que está preparando el archivo. Para cuentas grandes, Balto avisa "Te avisamos cuando esté listo" y envía una notificación (M9) al terminar.
4. **Listo (M14).** "balto_datos_samuel.zip · 3 mascotas · 24,6 MB".
   - **Descargar** baja el archivo; el enlace sirve por 7 días.
   - **Enviar a mi correo** manda el enlace a samuel@correo.com.
   - **Volver a ajustes** → M1.

### Variantes del paso a paso

- **Editar mis datos (M2).**
  - La tarjeta del dueño en M1 abre M2. Samuel cambia el teléfono y toca **Guardar cambios**; el nuevo teléfono se ve en D1, L5 y los PDF.
  - Si cambia el **correo**, Balto envía un código al nuevo correo (pantalla **A4**). El cambio solo se aplica cuando lo verifica.
- **Mascotas (M5).**
  - **Agregar mascota** o **+** → **B1**.
  - Tocar una mascota abre **Editar mascota** (los campos de B1, la foto de B2 y la salud de B4 en una pantalla), con "Archivar mascota" al final. *(Pantalla pendiente en Figma.)*
  - **Archivar (M13):** "Archivar a Toby" lo quita de Inicio y de las alertas, y lo pasa a la sección "Archivadas" de M5. Ahí, "Restaurar" lo vuelve a activar.
- **Notificaciones (M3).**
  - Cada interruptor enciende o apaga un tipo de aviso. Tocar el texto de la fila cambia la anticipación:
    - vacunas: 1, 3, 7 o 15 días;
    - tomas: a la hora, 5, 10 o 15 min antes;
    - citas: 1 hora o 1 día antes.
  - "No molestar" retrasa los avisos que caen en esa franja hasta la hora "Hasta".
  - Al encender un tipo sin permiso del navegador, se muestra **O5**.
- **Bandeja (M9).**
  - Se abre con la campana de arriba en Inicio. Muestra todas las notificaciones enviadas, con las no leídas resaltadas.
  - Tocar una abre su destino: alerta → **J2**, toma → **G2**, pedido → **N15**, cita → **K11**, exportación → **M14**.
  - El botón de arriba marca todas como leídas. "Ver todas las alertas" → **J1**.
- **Pedidos.** "Mis pedidos" → **N9 · Mis pedidos y seguimiento**.
- **Ayuda (M8).**
  - El buscador filtra las preguntas frecuentes.
  - "Escríbenos" y "Escribirnos" abren un formulario (tema y mensaje). "Reportar un problema" abre el mismo formulario con el tema "Problema" y la opción de adjuntar una captura.
  - "Términos y política de datos" abre el documento vigente.
- **Cerrar sesión (M17).** "Cerrar sesión" (M1) → M17 → "Cerrar sesión" → **A6**. Si hay cambios pendientes de subir (**O3**), M17 lo advierte y ofrece "Intentar subir ahora" antes de cerrar.
- **Eliminar la cuenta (M7 → M15 → M16).**
  - "Eliminar cuenta", al final de M1, abre M7. "Descargar mi información" → M6.
  - "Eliminar cuenta" → M15. Samuel escribe su contraseña y toca **Eliminar mi cuenta** → M16. "Exportar primero" → M6.
  - "Volver al inicio" (M16) → **A2**.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Datos sin cambios | M2 | "Guardar cambios" deshabilitado. |
| Correo por verificar | M2 | "Te enviamos un código a nuevo@correo.com" → A4. Mientras tanto se sigue usando el correo anterior. |
| Teléfono inválido | M2 | Error bajo el campo. |
| Una sola mascota | M5 | Al archivarla, Inicio pasa a **O1**. |
| Mascotas archivadas | M5 | Sección "Archivadas" con "Restaurar". *(Falta en Figma.)* |
| Preparando exportación | M6 | Indicador de carga. Para archivos grandes se avisa al terminar. |
| Enlace de exportación vencido | M14 | Pasados 7 días, "Este enlace venció. Genera la exportación de nuevo." |
| Contraseña incorrecta | M15 | Error bajo el campo, igual que **A7**. |
| Sin notificaciones | M9 | "No tienes notificaciones." |
| Tipo apagado | M3 | Interruptor apagado y sin texto de anticipación (como "Comidas"). |
| Sin permiso del navegador | M3 | Aviso arriba: "Las notificaciones están bloqueadas en tu navegador" con instrucciones (**O5**). |

## Qué pasa después

- **Datos del dueño** → D1, L5, PDF de L, H7 (contacto).
- **Notificaciones** → controlan los avisos de J (J6), G (G5), H (H5), K (citas) y N (pedidos).
- **Archivar** → la mascota sale del selector de Inicio y deja de generar alertas en J. Su historial sigue completo y se incluye en M6.
- **Eliminar cuenta** → cierra la sesión, desactiva los enlaces compartidos (L6) y borra los datos (ver Datos que usa).

## Datos que usa

**Lee**
- **Dueño:** nombre, correo, ciudad, teléfono.
- **Mascotas** (activas y archivadas), con todos sus datos, eventos y soportes (M6).
- **Notificaciones enviadas** (M9) y **pedidos** (N).

**Guarda**
- **Dueño:** los mismos campos de A5. El correo cambia en Supabase Auth después de verificarlo.
- **Preferencias de notificación:**
  - por tipo (vacunas_desparasitaciones | tomas | comidas | citas | pedidos | salud): activo (sí/no) y anticipación;
  - no molestar desde / hasta.
  - Valores por defecto: los de M3 (7 días, 10 min, comidas apagado, 1 día, pedidos encendido, 22:00–07:00) y salud encendido (7 días).
  - "Comidas" incluye el aviso de alimento por acabarse (H). "Salud" incluye el control de peso, el cambio brusco de peso (F4) y el próximo control de examen (F7).
- **Mascota archivada:** estado = archivada y fecha.
- **Exportación:** dueño, alcance (todas | una mascota), formato (pdf | zip), archivo (Supabase Storage), tamaño, fecha y vencimiento del enlace (7 días).
- **Notificación** (bandeja M9): dueño, tipo, título, texto, destino, fecha y leída (sí/no).
- **Mensaje de ayuda:** dueño, tema, mensaje, captura opcional y fecha.
- **Cuenta eliminada:** se marca como eliminada (la sesión se cierra y los enlaces se desactivan). A los 30 días se borran del todo los datos y los archivos. En ese plazo se puede recuperar escribiendo a soporte.

## Fuera de alcance

- Suscripción, pagos e historial de pagos: **eliminados del producto** (27 oct 2026).
- Crear la mascota: **B**. Pedidos de la Tienda: **N**.
- Varios dueños para una mascota o permisos por persona (fuera de alcance del brief).
- Cambiar la contraseña con sesión iniciada. Por ahora se hace con "¿Olvidaste tu contraseña?" (**A8**).

## Preguntas abiertas

1. **Retención al eliminar la cuenta.** M16 promete 30 días para recuperarla. Hay que confirmar que esa política cumple la Ley 1581 de 2012 (derecho a suprimir los datos) y anotarla en la política de datos.
2. **Canal de soporte.** ¿Quién responde "Escríbenos" en 1 día hábil, y en qué buzón o herramienta llegan los mensajes?

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisión de producto:
- **Se elimina la suscripción.** Se borraron M4, M10, M11 y M12.

Decisiones tomadas:
- M1 se abre desde el avatar de Inicio. M9 (bandeja) se abre desde la campana de arriba en Inicio. La campana de la barra inferior es J1 (alertas).
- "Eliminar cuenta" va al final de M1, debajo de "Cerrar sesión".
- Cambiar el correo exige verificar el nuevo con un código (A4).
- Tocar una mascota en M5 abre "Editar mascota". Las archivadas se pueden restaurar.
- Cerrar sesión lleva a A6. Eliminar la cuenta lleva a A2.
- La anticipación de cada aviso se cambia tocando la fila en M3.
- Ayuda usa un solo formulario para "Escríbenos" y "Reportar un problema".
- La exportación grande se prepara en segundo plano y avisa al terminar.

Pendiente de ajustar en Figma:
- M1: quitar la fila "Suscripción · Plan completo · activo" y agregar "Eliminar cuenta" al final.
- Nueva pantalla: "Editar mascota" (desde M5).
- M5: sección "Archivadas" con "Restaurar".
- M8: quitar el botón de filtros junto al buscador de ayuda (no tiene función); diseñar el formulario de ayuda.
- M3: selector de anticipación por tipo.
- M3: agregar el interruptor "Salud · 7 días antes" (control de peso, cambio brusco de peso, controles de examen).
- M17: variante con cambios pendientes de subir.
