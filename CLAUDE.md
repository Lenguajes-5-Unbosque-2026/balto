# Balto

## 1. Qué es el producto

- **Problema:** la información de salud de una mascota queda repartida entre clínicas, carnets físicos, chats de WhatsApp y la memoria del dueño, y hay que reconstruirla cada vez que alguien la pide.
- **Usuario:** dueños de perro o gato en Bogotá, de 25 a 45 años, que van a consulta veterinaria particular y han pasado por más de un proveedor.
- **Propuesta de valor:** un perfil único de la mascota que el dueño controla y puede mostrar en segundos (consulta, guardería, viaje, urgencia), sin comprar ningún dispositivo y con la garantía de que lo registrado no se pierde.

Fuente: [docs/Brief.md](docs/Brief.md).

**Fuentes de verdad.** El brief está desactualizado respecto a las funciones de la app: cuando el brief y las pantallas de [design/flujos/](design/flujos/) no coinciden, mandan las pantallas. Todos los flujos de la sección 4 hacen parte del producto, incluidos los que el brief deja para fases posteriores o fuera de alcance (identificador propio, enlaces con vencimiento, tienda, etc.). Para colores y demás tokens manda [design/ui-kit.md](design/ui-kit.md); los hex de [design/auditoria-referencias.md](design/auditoria-referencias.md) son de las referencias, no de Balto.

## 2. Stack

- **Next.js + TypeScript:** pantallas, rutas y lógica de servidor.
- **Tailwind + shadcn/ui:** estilos y componentes; aquí viven los tokens y el UI kit.
- **Supabase:** base de datos, login, almacenamiento de fotos y permisos.
- **Vercel:** despliegue.

## 3. Mapa del repo

| Carpeta | Contenido |
|---|---|
| `.github/` | `CODEOWNERS` (todo el repo es de @BartoUEB). |
| `docs/` | Contexto de producto: `Brief.md` (problema, segmento, value prop, alcance del MVP y hoja de ruta), `Guion de encuesta.md` y `Conclusiones encuestas.md` (discovery con 23 respuestas). |
| `design/` | `ui-kit.md` (tokens de color, tipografía, radios, espaciado, sombras, íconos y los 28 componentes del kit de Figma), `auditoria-referencias.md` (referencias visuales y decisiones de UI) y `flujos/` (pantallas exportadas de Figma, una carpeta por flujo). |
| `specs/` | Una carpeta por caso de uso con `spec.md`, `plan.md` y `tareas.md`. Hoy está vacía. |
| `data/` | Modelo de datos (`modelo-datos.md`, pendiente). |
| `web/` | Todo el código de la app (Next.js). Aún no está creado. |

## 4. Flujos

Pantallas en [design/flujos/](design/flujos/). Los IDs se conservan tal como aparecen en los nombres de archivo.

- **A-AccesoYCuenta — Acceso y cuenta:** A1 · Splash, A2 · Bienvenida, A2.2 · Bienvenida, A2.3 · Bienvenida, A3 · Crear cuenta, A4 · Verificar correo, A5 · Datos del dueño, A6 · Inicio de sesión, A7 · Error de credenciales, A8 · Recuperar contraseña, A9 · Crear contraseña nueva, A10 · Activar suscripción, A11 · Modo consulta, A12 · Código incorrecto, A13 · Código vencido, A14 · Enlace enviado, A15 · Contraseña actualizada, A16 · Enlace vencido, A17 · Prueba gratis activada, A18 · Datos de la tarjeta, A19 · Pago con PSE, A20 · Pago aprobado, A21 · Pago rechazado.
- **B-PERFIL — Perfil de la mascota** (B6 emite la cédula de Balto, el identificador de la mascota dentro de la app): B1 · Datos básicos, B2 · Foto de la mascota, B3 · Identificador, B3 · Identificador-1, B4 · Salud inicial, B5 · Perfil creado, B6 · Cédula de Luna, B7 · Placa grabada, B8 · Salir sin guardar, B9 · Identificador duplicado.
- **C-CARGAinicial — Carga inicial:** C1 · Asistente de carga inicial, C2 · Subir carnet de vacunación, C3 · Subir examen o laboratorio, C4 · Subir fórmula o tratamiento, C5 · Transcribir historial de chats, C6 · Sin historial previo, C7 · Resumen de carga inicial, C8 · Revisar vacunas detectadas, C9 · Revisar examen detectado, C10 · Revisar fórmula detectada, C11 · Revisar eventos del historial, C12 · Leyendo el documento, C13 · No pudimos leer el archivo.
- **D-ConsultaDatos — Consulta de datos:** D1 · Vista de acceso rápido, D2 · Línea de tiempo, D3 · Filtros de la línea de tiempo, D4 · Detalle de evento, D5 · Ver o descargar soporte, D6 · Editar evento, D7 · Eliminar evento, D8 · Línea de tiempo vacía, D9 · Resultados de búsqueda, D10 · Búsqueda sin resultados.
- **E-REGISTROEventos — Registro de eventos:** E1 · Selector de tipo de evento, E2 · Registrar vacuna, E3 · Consulta veterinaria, E4 · Examen o laboratorio, E5 · Tratamiento o medicación, E6 · Peso, E7 · Alimentación o comportamiento, E8 · Adjuntar soporte, E9 · Evento guardado, E10 · Registrar desparasitación, E11 · Registrar otro evento, E12 · Revisar la foto, E13 · Archivo muy pesado.
- **F-SaludYEvolucion — Salud y evolución:** F1 · Panel de salud, F2 · Carnet de vacunas, F3 · Exámenes y tratamientos, F4 · Evolución del peso, F5 · Alergias y condiciones, F6 · Editar alergias y condiciones, F7 · Detalle de examen.
- **G-Medicamentos — Medicamentos:** G1 · Listado de medicamentos, G2 · Detalle de tratamiento, G3 · Agregar medicamento, G4 · Definir horarios de toma, G5 · Recordatorio de toma, G6 · Toma omitida, G7 · Revisar datos de la fórmula, G8 · Finalizar tratamiento, G9 · Tratamiento finalizado.
- **H-Alimentacion — Alimentación:** H1 · Plan de alimentación, H2 · Registrar alimento, H3 · Alerta de alimento tóxico, H4 · Porción sugerida y horarios, H5 · Recordatorio de comida, H6 · Urgencia · ya lo comió, H7 · Llamando a la veterinaria.
- **I-HabitosYComportamiento — Hábitos y comportamiento:** I1 · Bitácora de hábitos, I2 · Registrar hábito, I3 · Exportar bitácora, I4 · Vista previa de la bitácora, I5 · Bitácora enviada, I6 · Bitácora vacía.
- **J-Alertas — Alertas:** J1 · Centro de alertas, J2 · Detalle de alerta, J3 · Posponer aviso, J4 · Alerta vencida, J5 · Alerta resuelta, J6 · Aviso de vacuna, J7 · Sin alertas pendientes.
- **K-Veterinarias — Veterinarias:** K1 · Buscador · permiso de ubicación, K2 · Filtros de proveedores, K3 · Listado de proveedores, K4 · Ficha del proveedor, K5 · Agendar cita, K6 · Calendario unificado, K7 · Ubicación denegada, K8 · Sin veterinarias cercanas, K9 · Cita agendada, K10 · Sin horarios disponibles, K11 · Detalle de la cita.
- **L-CompartirPerfil — Compartir perfil:** L1 · Selector de contenido, L2 · Vista previa del PDF, L3 · Reporte enviado, L4 · Enlace para compartir, L5 · Vista pública del perfil, L6 · Enlace expirado, L7 · Enviado por correo.
- **M-Cuenta — Cuenta:** M1 · Ajustes, M2 · Editar datos del dueño, M3 · Configurar notificaciones, M4 · Gestionar suscripción, M5 · Administrar mascotas, M6 · Exportar mis datos, M7 · Eliminar cuenta, M8 · Ayuda, M9 · Notificaciones, M10 · Historial de pagos, M11 · Cancelar suscripción, M12 · Suscripción cancelada, M13 · Archivar mascota, M14 · Exportación lista, M15 · Confirmar identidad, M16 · Cuenta eliminada, M17 · Cerrar sesión.
- **N-Tiendas — Tienda:** N1 · Tienda, N2 · Alimentos, N3 · Detalle de alimento, N4 · Vacunas, N5 · Detalle de vacuna y aplicación, N6 · Carrito, N7 · Entrega y pago, N8 · Pedido confirmado, N9 · Mis pedidos y seguimiento, N10 · Carrito vacío, N11 · Búsqueda sin resultados, N12 · Dirección de entrega, N13 · Agregar método de pago, N14 · Pago rechazado, N15 · Detalle del pedido.
- **O-EstadosTransversales — Estados transversales:** O1 · Sin mascotas registradas, O2 · Sin conexión, O3 · Guardado pendiente, O4 · Sesión expirada, O5 · Permiso de notificaciones, O6 · Permiso de cámara, O7 · Permiso de fotos, O8 · No se pudo guardar, O9 · Algo salió mal. La carpeta también tiene archivos `Rotulo · O1` a `Rotulo · O9`, que son solo las etiquetas de texto de cada pantalla, no pantallas.
- **P-INICIO — Inicio:** INICIO (sin ID numérico): saludo al dueño, selector de mascota, tarjeta de la mascota activa, próximo vencimiento y accesos rápidos.

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

1. **Orden de implementación.** Todos los flujos hacen parte del producto. ¿En qué orden se implementan?
2. **Pantallas duplicadas o variantes.** ¿Qué diferencia hay entre A2, A2.2 y A2.3 (¿son los 3 pasos del onboarding?) y entre B3 · Identificador y B3 · Identificador-1 (estado «Sí tiene» frente a «No tiene»)? ¿Deberían tener IDs propios?
3. **Correspondencia flujo y caso de uso.** `design/flujos/README.md` habla de carpetas por caso de uso (CU-01, CU-02…), pero las carpetas usan letras (A a P). ¿Cómo se nombran las carpetas de `specs/` para que coincidan con cada flujo?
4. **Tokens incompletos.** Faltan en el kit los estados deshabilitado y cargando del Botón, la lista completa de íconos usados y el estilo Display. ¿Se agregan al kit antes de implementar?
5. **Pagos.** A18 y A19 piden tarjeta y PSE. ¿Qué pasarela se usa? No forma parte del stack definido.
6. **Lectura automática de documentos.** C8 a C12 suponen que la app «detecta» vacunas, exámenes y fórmulas a partir de una foto o PDF, y C5 transcribe chats. ¿Con qué servicio se hace?
7. **Modelo de datos.** `data/modelo-datos.md` todavía no existe. ¿Quién lo define y cuándo?
