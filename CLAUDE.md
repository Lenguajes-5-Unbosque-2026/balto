# Balto

## 1. Qué es el producto

- **Problema:** la información de salud de una mascota queda repartida entre clínicas, carnets físicos, chats de WhatsApp y la memoria del dueño. Cuando alguien la pide, hay que reconstruirla: se repiten exámenes y se decide con datos incompletos.
- **Usuario:** dueños de perro o gato en Bogotá, de 25 a 45 años y de ingreso medio o medio-alto, que fueron a consulta veterinaria particular en el último año y han pasado por más de un proveedor (persona de referencia: Valentina, 34 años, Chapinero).
- **Propuesta de valor:** un perfil único de la mascota que le pertenece al dueño. Registrar un evento toma menos de un minuto y el perfil se muestra en segundos (vista rápida o PDF) a quien lo necesite, sin que esa persona tenga cuenta.
- **Diferencial:** se usa completo antes de pagar, no exige comprar ningún dispositivo y lo que se registra no se pierde.

## 2. Stack

- **Next.js + TypeScript:** pantallas, rutas y lógica de servidor.
- **Tailwind + shadcn/ui:** estilos y componentes. Aquí viven los tokens y el kit (fuente: `design/UI-KIT-BaltoOficial.md`).
- **Supabase:** base de datos, login, fotos y soportes, y permisos.
- **Vercel:** despliegue.

## 3. Mapa del repo

| Ruta | Qué hay |
|---|---|
| `README.md` | Descripción de una línea del repositorio. |
| `CLAUDE.md` | Este archivo: contexto y reglas de trabajo. |
| `.gitignore` | Exclusiones para Next.js, Vercel y archivos `.env`. |
| `.github/CODEOWNERS` | Responsable de revisión de todo el repo. |
| `docs/` | Contexto de producto. |
| `docs/Brief.md` | Brief v5: problema, segmento, buyer persona, competencia (MIIA), modelo de ingreso, hipótesis, propuesta de valor y alcance de la aplicación (alineado con los flujos A a O), hoja de ruta y lo que queda fuera de alcance. |
| `docs/Guion de encuesta.md` | Guion de la encuesta Discovery a dueños de mascotas (10 preguntas). |
| `docs/Conclusiones encuestas.md` | Análisis de las 23 respuestas: hallazgos, contradicciones y próximos pasos. |
| `design/` | Diseño. |
| `design/UI-KIT-BaltoOficial.md` | UI kit: tokens de color, tipografía, íconos, radios, espaciado; 59 componentes y reglas de color semántico. Enlace al archivo de Figma. |
| `design/auditoria-referencias.md` | Referencias visuales, decisiones de UI que salieron de ellas y riesgos detectados en el archivo de Figma. |
| `design/flujos/` | Pantallas exportadas de Figma (JPG, 390 × 844), una carpeta por flujo. Ver sección 4. |
| `specs/` | Specs de cada flujo: una carpeta por flujo con el mismo nombre de su carpeta en `design/flujos/`, con `spec.md` (y luego `plan.md` y `tareas.md`). `specs/README.md` tiene el mapa de flujos, sus conexiones, las inconsistencias y todas las preguntas abiertas. `specs/_plantilla.md` es la plantilla. La spec modelo es la de E. |
| `data/` | Modelo de datos (`modelo-datos.md`, todavía no existe). |
| `web/` | Todo el código de la aplicación (Next.js). Hoy solo tiene el README. |

## 4. Flujos

Carpetas de `design/flujos/`. Los IDs de pantalla son los de los nombres de archivo.

- **A · Acceso y cuenta** (`A · Acceso y cuenta/`, 17 pantallas): A1 · Splash, A2 · Bienvenida, A2.2 · Bienvenida, A2.3 · Bienvenida, A3 · Crear cuenta, A4 · Verificar correo, A5 · Datos del dueño, A6 · Inicio de sesión, A7 · Error de credenciales, A8 · Recuperar contraseña, A9 · Crear contraseña nueva, A12 · Código incorrecto, A13 · Código vencido, A13.2 · Código bloqueado, A14 · Enlace enviado, A15 · Contraseña actualizada, A16 · Enlace vencido.
- **B · Perfil de mascota** (`B · Perfil de mascota/`, 6): B1 · Datos básicos, B2 · Foto de la mascota, B4 · Salud inicial, B5 · Perfil creado, B6 · Cédula de Luna, B8 · Salir sin guardar.
- **C · Carga inicial de datos (obligatoria)** (`C · Carga inicial de datos (obligatoria)/`, 13): C1 · Asistente de carga inicial, C2 · Subir carnet de vacunación, C3 · Subir examen o laboratorio, C4 · Subir fórmula o tratamiento, C5 · Transcribir historial de chats, C6 · Sin historial previo, C7 · Resumen de carga inicial, C8 · Revisar vacunas detectadas, C9 · Revisar examen detectado, C10 · Revisar fórmula detectada, C11 · Revisar eventos del historial, C12 · Leyendo el documento, C13 · No pudimos leer el archivo.
- **D · Consultar datos** (`D · Consultar datos/`, 10): D1 · Vista de acceso rápido, D2 · Línea de tiempo, D3 · Filtros de la línea de tiempo, D4 · Detalle de evento, D5 · Ver o descargar soporte, D6 · Editar evento, D7 · Eliminar evento, D8 · Línea de tiempo vacía, D9 · Resultados de búsqueda, D10 · Búsqueda sin resultados.
- **E · Registrar evento** (`E · Registrar evento/`, 13): E1 · Selector de tipo de evento, E2 · Registrar vacuna, E3 · Consulta veterinaria, E4 · Examen o laboratorio, E5 · Tratamiento o medicación, E6 · Peso, E7 · Alimentación o comportamiento, E8 · Adjuntar soporte, E9 · Evento guardado, E10 · Registrar desparasitación, E11 · Registrar otro evento, E12 · Revisar la foto, E13 · Archivo muy pesado.
- **F · Salud y evolución** (`F · Salud y evolución/`, 7): F1 · Panel de salud, F2 · Carnet de vacunas, F3 · Exámenes y tratamientos, F4 · Evolución del peso, F5 · Alergias y condiciones, F6 · Editar alergias y condiciones, F7 · Detalle de examen.
- **G · Medicamentos** (`G · Medicamentos/`, 9): G1 · Listado de medicamentos, G2 · Detalle de tratamiento, G3 · Agregar medicamento, G4 · Definir horarios de toma, G5 · Recordatorio de toma, G6 · Toma omitida, G7 · Revisar datos de la fórmula, G8 · Finalizar tratamiento, G9 · Tratamiento finalizado.
- **H · Alimentación** (`H · Alimentación/`, 7): H1 · Plan de alimentación, H2 · Registrar alimento, H3 · Alerta de alimento tóxico, H4 · Porción sugerida y horarios, H5 · Recordatorio de comida, H6 · Urgencia · ya lo comió, H7 · Llamando a la veterinaria.
- **I · Hábitos y comportamiento** (`I · Hábitos y comportamiento/`, 6): I1 · Bitácora de hábitos, I2 · Registrar hábito, I3 · Exportar bitácora, I4 · Vista previa de la bitácora, I5 · Bitácora enviada, I6 · Bitácora vacía.
- **Inicio** (`Inicio/`, 1): Inicio — Selector de mascota · Verde y arena.
- **J · Alertas** (`J · Alertas/`, 8): J1 · Centro de alertas, J2 · Detalle de alerta, J3 · Posponer aviso, J4 · Alerta vencida, J5 · Alerta resuelta, J6 · Aviso de vacuna, J7 · Sin alertas pendientes, J8 · Filtros de alertas.
- **K · Veterinarias y proveedores** (`K · Veterinarias y proveedores/`, 11): K1 · Buscador · permiso de ubicación, K2 · Filtros de proveedores, K3 · Listado de proveedores, K4 · Ficha del proveedor, K5 · Agendar cita, K6 · Calendario unificado, K7 · Ubicación denegada, K8 · Sin veterinarias cercanas, K9 · Cita agendada, K10 · Sin horarios disponibles, K11 · Detalle de la cita.
- **L · Compartir perfil** (`L · Compartir perfil/`, 8): L1 · Selector de contenido, L2 · Vista previa del PDF, L3 · Reporte enviado, L4 · Enlace para compartir, L5 · Vista pública del perfil, L6 · Enlace expirado, L7 · Enviado por correo, L8 · Lo que compartí.
- **M · Cuenta y ajustes** (`M · Cuenta y ajustes/`, 15): M1 · Ajustes, M2 · Editar datos del dueño, M3 · Configurar notificaciones, M5 · Administrar mascotas, M6 · Exportar mis datos, M7 · Eliminar cuenta, M8 · Ayuda, M9 · Notificaciones, M13 · Archivar mascota, M14 · Exportación lista, M15 · Confirmar identidad, M16 · Cuenta eliminada, M17 · Cerrar sesión, M18 · Editar mascota, M19 · Escríbenos.
- **N · Tienda — alimento y vacunas (nuevo)** (`N · Tienda — alimento y vacunas (nuevo)/`, 16): N1 · Tienda, N2 · Alimentos, N3 · Detalle de alimento, N4 · Vacunas, N5 · Detalle de vacuna y aplicación, N6 · Carrito, N7 · Entrega y pago, N8 · Pedido confirmado, N9 · Mis pedidos y seguimiento, N10 · Carrito vacío, N11 · Búsqueda sin resultados, N12 · Dirección de entrega, N13 · Agregar método de pago, N14 · Pago rechazado, N15 · Detalle del pedido, N16 · Pagar con PSE.
- **O · Estados transversales** (`O · Estados transversales/`, 9): O1 · Sin mascotas registradas, O2 · Sin conexión, O3 · Guardado pendiente, O4 · Sesión expirada, O5 · Permiso de notificaciones, O6 · Permiso de cámara, O7 · Permiso de fotos, O8 · No se pudo guardar, O9 · Algo salió mal.

## 5. Cómo trabajamos

- Cambios de experiencia (pantallas nuevas o eliminadas, accesos,
conexiones entre pasos, estados, textos funcionales) se documentan
primero en la spec del flujo y en Figma. No implementes un cambio
de experiencia sin que esté en la spec; si te lo piden, avisa y
propón actualizar la spec primero.
- Ajustes visuales (color, espaciado, imagen decorativa, tamaños) se
hacen directo en código, siempre con los tokens del UI kit. Nunca
escribas valores sueltos como colores hex o tamaños en px.
- Si un ajuste necesita un token que no existe, se agrega primero
al kit.
- Todo el código vive dentro de web/.

## Preguntas abiertas

Puntos que no se pueden resolver con lo que hay en el repo. Hay que resolverlos con el equipo antes de escribir la spec o el código que dependa de ellos.

**Alcance y producto**

Ya resuelto: los flujos de `design/flujos/` son la versión final de la aplicación y `docs/Brief.md` (v5) está alineado con ellos, incluidas la cédula animal Balto, el enlace con vencimiento, la lectura de documentos y la Tienda. La aplicación es web móvil. **No hay suscripción** (decisión del 27 oct 2026): se eliminaron A11 · Modo consulta, A18–A21 (pago de la suscripción), M4, M10, M11 y M12. Usar la app no depende de ningún pago.

1. **Orden de construcción.** Todos los flujos (A a O) están en alcance. ¿En qué orden se construyen?
2. **Pantallas que ya no están.** El commit anterior tenía B3 · Identificador, B7 · Placa grabada y B9 · Identificador duplicado. La exportación actual no las trae. ¿Se eliminaron a propósito? Si es así, ¿dónde escribe el dueño el número de microchip y qué pasa al pedir la placa grabada desde B6? (A10 y A17 eran de la suscripción, que ya no existe.)
3. **Placa grabada.** B6 ofrece pedirla. ¿Se vende por la Tienda, tiene costo, quién la fabrica y cómo se entrega?
4. **Servicio de lectura de documentos.** C8–C12 y G7 leen el carnet, los exámenes y las fórmulas. ¿Con qué servicio? No está en el stack.
5. **Tienda.** ¿Con qué proveedores de alimento y veterinarias aliadas se trabaja, y de dónde salen el catálogo, los precios y el seguimiento de pedidos?
6. **Borrado y permanencia.** D7 borra un evento "sin vuelta atrás" y M16 habla de 30 días para recuperar la cuenta, pero el brief promete que "nada que se registre se pierde". ¿El borrado es definitivo o reversible? ¿Cuál es la política de retención?
7. **Modelo de ingreso y pagos de la Tienda.** Sin suscripción, ¿el ingreso sale solo de la Tienda? `docs/Brief.md` todavía describe la suscripción y hay que actualizarlo. ¿Qué pasarela procesa los pagos con tarjeta y PSE de la Tienda (N7, N13, N14)? No está en el stack.
8. **Nombre visible.** Las notificaciones G5 y H5 y el componente Notificación push dicen "MASCOTAS"; J6 dice "BALTO". ¿El nombre es Balto en todas partes? *Resuelto en las specs: Balto en todas partes (ajuste pendiente en Figma para G5 y H5).*

**Plataforma**

9. **Capacidades de la web móvil.** ¿Se instala como PWA? De eso depende si se pueden enviar notificaciones push (G5, H5, J6, O5), sobre todo en iPhone. Además: ¿hasta dónde llega el modo sin conexión con cola de cambios (O2, O3, O8)? ¿Las pantallas de permisos de cámara (O6) y fotos (O7) se mantienen, si en la web los pide el navegador? ¿Qué se muestra en pantallas más anchas que un teléfono?
10. **Specs.** `specs/` está vacía y `design/flujos/README.md` habla de carpetas por caso de uso (CU-01, CU-02…), pero los flujos están nombrados con letras (A–O). ¿Va una spec por letra de flujo? ¿Cómo se nombran las carpetas? *Resuelto: una spec por carpeta de `design/flujos/`, con el mismo nombre (ver `specs/README.md`).*
11. **Modelo de datos.** `data/README.md` menciona `modelo-datos.md`, que todavía no existe. ¿Quién lo escribe y cuándo?

**Diseño y tokens**

12. **Radios.** El kit define `radio/sm` 14, `md` 20, `lg` 28, `xl` 44 y `full`, pero varios componentes usan 18 (Nota), 22 (Tarjeta de evento, Rasgo), 24 (Cédula, Calendario) y 32 (Tarjeta de tratamiento, Diálogo). ¿Se agregan como tokens o los componentes se ajustan a la escala?
13. **Espaciado y medidas.** La auditoría dice que en Figma se usan 6, 10 y 14 px, que no están en la escala de `espacio/*`. Tampoco hay tokens para los altos fijos (botón de 56, campo de 80, barra de acción de 108). ¿Cuáles se vuelven tokens?
14. **Colores.** La auditoría menciona neutros #6A797A y #180D08 y arena #ECD3AB. El kit usa `neutro/500` #77737F, retira la arena y tiene un token llamado solo `F9`. ¿La paleta definitiva es la del kit? ¿Qué nombre lleva `F9`? (En Figma, `F9` es blanco con opacidad 0,7 y estaba en el texto del botón principal, que por eso se veía deshabilitado. El 27 oct se cambió a `neutro/0` en todas las pantallas). Además, la barra de navegación inferior es casi negra: ¿qué token le corresponde?
15. **Estados que faltan.** El botón no tiene variantes deshabilitado ni cargando, pero muchas pantallas muestran el botón principal con el texto atenuado (B1, C1, E2, L1…). ¿Ese es el estado deshabilitado? Hay que agregarlo al kit.
16. **Botones sin texto.** E9 y N8 tienen un botón principal vacío a la izquierda, y A6 muestra "Ya tengo cuenta" en la propia pantalla de inicio de sesión. ¿Qué deben decir esos botones, o se quitan? *Resuelto: E9 ya dice "Registrar otro" en Figma; N8 pasa a "Ver mi pedido" y A6 a "Crear cuenta" (pendientes en Figma).*
17. **Videos.** E7, E11 e I2 aceptan "foto o video", pero E8, E13 y C13 solo aceptan JPG, PNG y PDF de hasta 10 MB. ¿Qué formatos y qué tamaño se permiten para video? *Resuelto: por ahora no hay video; solo JPG, PNG y PDF de hasta 10 MB (ver specs de E e I).*
18. **Fuentes e íconos.** Outfit, Plus Jakarta Sans y Material Symbols Rounded: ¿se cargan desde Google Fonts o se alojan en el proyecto?

**Repo**

19. **READMEs desactualizados.** `design/README.md` nombra `auditoria.md` y `ui-kit.md`, pero los archivos se llaman `auditoria-referencias.md` y `UI-KIT-BaltoOficial.md`. `docs/README.md` menciona un "documento de corte 1" que no está en el repo. ¿Se renombran los archivos o se actualizan los READMEs? ¿Falta subir ese documento?
