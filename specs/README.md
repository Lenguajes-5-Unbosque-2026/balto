# specs

Una carpeta por flujo, con el mismo nombre de su carpeta en `design/flujos/`. Cada carpeta tiene `spec.md`; `plan.md` y `tareas.md` se agregan cuando empieza el código. Todas siguen [`_plantilla.md`](_plantilla.md). La spec modelo es la del flujo core, [E · Registrar evento](E%20·%20Registrar%20evento/spec.md).

Fecha de esta versión: 27 oct 2026. Decisión de producto que afecta a todas: **no hay suscripción** (se eliminaron A11, A18–A21, M4 y M10–M12).

## 1. Flujos

| Flujo | Carpeta | Qué hace |
|---|---|---|
| A · Acceso y cuenta | [`A · Acceso y cuenta/`](A%20·%20Acceso%20y%20cuenta/spec.md) | Bienvenida, registro en 3 pasos con código por correo, inicio de sesión y recuperación de contraseña. |
| B · Perfil de mascota | [`B · Perfil de mascota/`](B%20·%20Perfil%20de%20mascota/spec.md) | Alta de la mascota en 3 pasos y emisión de la cédula animal Balto. |
| C · Carga inicial de datos (obligatoria) | [`C · Carga inicial de datos (obligatoria)/`](C%20·%20Carga%20inicial%20de%20datos%20(obligatoria)/spec.md) | El dueño sube carnet, exámenes, fórmulas y chats; Balto los lee y el dueño confirma. |
| D · Consultar datos | [`D · Consultar datos/`](D%20·%20Consultar%20datos/spec.md) | Vista rápida, línea de tiempo con búsqueda y filtros, detalle, soporte, editar y eliminar. |
| **E · Registrar evento** (core) | [`E · Registrar evento/`](E%20·%20Registrar%20evento/spec.md) | Registrar en menos de un minuto cualquiera de los 9 tipos de evento, con soporte y recordatorio. |
| F · Salud y evolución | [`F · Salud y evolución/`](F%20·%20Salud%20y%20evolución/spec.md) | Panel de salud: carnet, exámenes y tratamientos, peso, alergias y condiciones. |
| G · Medicamentos | [`G · Medicamentos/`](G%20·%20Medicamentos/spec.md) | Tratamientos, horarios de toma, recordatorios, tomas omitidas y finalizar. |
| H · Alimentación | [`H · Alimentación/`](H%20·%20Alimentación/spec.md) | Plan de alimentación, porción sugerida, recordatorios, alimento tóxico y urgencia. |
| I · Hábitos y comportamiento | [`I · Hábitos y comportamiento/`](I%20·%20Hábitos%20y%20comportamiento/spec.md) | Bitácora de paseos, sueño, deposiciones y comportamiento, exportable en PDF. |
| Inicio | [`Inicio/`](Inicio/spec.md) | Pantalla principal: mascota activa, resumen, próximo vencimiento, accesos rápidos y barra inferior. |
| J · Alertas | [`J · Alertas/`](J%20·%20Alertas/spec.md) | Centro de alertas de todas las mascotas: resolver, agendar, comprar o posponer. |
| K · Veterinarias y proveedores | [`K · Veterinarias y proveedores/`](K%20·%20Veterinarias%20y%20proveedores/spec.md) | Buscar proveedores cerca, ficha, agendar citas y calendario unificado. |
| L · Compartir perfil | [`L · Compartir perfil/`](L%20·%20Compartir%20perfil/spec.md) | Compartir el perfil por PDF o por un enlace de solo lectura con vencimiento. |
| M · Cuenta y ajustes | [`M · Cuenta y ajustes/`](M%20·%20Cuenta%20y%20ajustes/spec.md) | Datos del dueño, mascotas, notificaciones, bandeja, exportar, ayuda, cerrar sesión y eliminar la cuenta. |
| N · Tienda — alimento y vacunas | [`N · Tienda — alimento y vacunas (nuevo)/`](N%20·%20Tienda%20—%20alimento%20y%20vacunas%20(nuevo)/spec.md) | Comprar alimento con entrega en Bogotá y vacunas con aplicación en una veterinaria aliada. |
| O · Estados transversales | [`O · Estados transversales/`](O%20·%20Estados%20transversales/spec.md) | Sin mascotas, sin conexión, guardado pendiente, sesión expirada, permisos y errores. |

## 2. Cómo se conectan

### Recorrido de un dueño nuevo

```
A1 → A2 → A3 → A4 → A5 → B1 → B2 → B4 → B6 → B5 → C1 … C7 → Inicio → (O5, permiso de avisos)
```

### Barra de navegación inferior (siempre visible en las pestañas)

| Ícono | Abre |
|---|---|
| Inicio | Inicio (u O1 si no hay mascotas) |
| Línea de tiempo | D2 |
| + | E1 |
| Tienda | N1 |
| Alertas | J1 |

### Desde qué pantalla se llega a cada flujo

| Flujo | Se llega desde |
|---|---|
| A | Apertura de la app sin sesión (A1); O4 (sesión expirada); M17 (cerrar sesión); M16 (cuenta eliminada → A2); L6 ("Entendido" → A2). |
| B | A5 (registro); O1 ("Registrar una mascota"); + del selector de Inicio; M5 ("Agregar mascota"). B6 también desde la ficha "Microchip" de Inicio. |
| C | B5 (obligatorio); C7 "Agregar más archivos"; D8 "Subir documentos que ya tengas"; tarjeta "Termina de subir…" en Inicio. |
| D | D1: flecha ↗ de la tarjeta de Inicio, B6 "Ver versión digital". D2: barra inferior, G9, J5. D4: tarjetas de E9, C7, F2, F3, I1. |
| E | + de la barra inferior (E1). Directo a un formulario desde F2 (E2 / E10), F3, F4 (E6), J ("Ya lo resolví"), H7 (E11), K (después de una cita), N (confirmar una vacuna). |
| F | Inicio › Accesos rápidos › Salud (F1); ficha "Al día" (F2) y ficha de peso (F4) de Inicio. |
| G | Inicio › Accesos rápidos › Medicamentos; F1; F3 (G2); F5; E5 (G4); notificación G5. |
| H | Inicio › Accesos rápidos › Alimentación; notificación H5; alerta de alimento (J). |
| I | Inicio › Accesos rápidos › Hábitos. |
| Inicio | Barra inferior; A1 / A6 con sesión; C7 ("Ir al perfil de Luna"). |
| J | Barra inferior (J1); "Próximo a vencer" de Inicio (J2); notificación J6; M9. |
| K | J2 / J4 "Agendar cita" (K3); H6 "Ver veterinarias" (K3); Inicio › Accesos rápidos › Veterinarias (K3) y Calendario (K6); M9 (K11). |
| L | D1 e Inicio (ícono compartir); F2; F7; ••• de D4. L5 / L6: quien abre un enlace compartido. |
| M | Avatar de Inicio (M1); campana de arriba en Inicio (M9); M5 → M18 (Editar mascota); M8, O9 y N15 "Necesito ayuda" → M19 (Escríbenos). |
| N | Barra inferior (N1); H1 "Comprar alimento" (N2 / N3); J2 / J4 "Comprar la vacuna" (N5); M1 "Mis pedidos" (N9); M9 (N15). |
| O | Cualquier flujo: O1 desde Inicio; O2 / O3 / O8 al perder la conexión; O4 al abrir con la sesión vencida; O5 después de C7 o al encender un recordatorio; O9 ante un error del servidor. |

### Datos que pasan entre flujos (los principales)

| Dato | Lo guarda | Lo usan |
|---|---|---|
| Mascota y cédula | B | Todos |
| Evento (9 tipos) | E, C, D (edición), H (alimentación), I (alimentación / atípico) | D, F, J, L, Inicio |
| Soporte | E, C, G (fórmula) | D5, L |
| Tratamiento y tomas | G, E5, C, B4 | D1, F3, F5, L, H7 |
| Peso | E6, B4, C6 | F4, D1, H4, J, Inicio |
| Alergias y condiciones | B4, C6, F6 | D1, F5, L, H, H7 |
| Alerta | E2, E10, E4, C8, F4, H, automática (peso) | J, Inicio, F1, N1 |
| Preferencias de notificación | M3 | E, G, H, J, K, N |
| Plan de alimentación | H | N1, N3, J |
| Cita | K, N5 | K6, J, E |
| Veterinaria favorita | K4 | H6, E2 / E3 (sugerencias), K3 |
| Envío y enlace compartido | L | L5, L6, historial "Ver qué compartí" |
| Pedido | N | N9, N15, M9, H (bolsa nueva) |

## 3. Inconsistencias

### Resueltas en las specs durante esta revisión

| Inconsistencia | Cómo se resolvió |
|---|---|
| D4, D6, E9 y F2 muestran "Veterinaria" y "Lote" de una vacuna, pero E2 no los pedía (datos que se leen y nadie guarda). | E2 suma los campos opcionales Veterinaria y Lote. |
| F7 muestra "Solicitado por", "Resultado" y "Próximo control", pero E4 no los pedía. | E4 suma esos tres campos. El próximo control crea una alerta. |
| E dejaba abierto el destino de "Listo" (E9), y J necesita mostrar J5 al resolver. | "Listo" vuelve al origen; desde J se muestra J5 en vez de E9. |
| B, C y E mandaban a O6 / O7, pero O decide usar la cámara y el selector nativos, que no piden permiso. | Se quitaron las referencias a O6 / O7. |
| B4 guardaba las condiciones como texto, F las maneja como lista. | B4 crea una Condición en la lista de F. |
| F4 y J avisan de cambios de peso y controles, pero M3 no tenía dónde apagarlos. | M3 suma el tipo "Salud". |
| D no sabía si los hábitos de I aparecen en la línea de tiempo. | Solo alimentación y atípico (son los eventos de E7). |
| O3 pide no cerrar sesión con pendientes, pero M17 no lo advertía. | M17 advierte y ofrece subir antes de cerrar. |
| H6 usa una "veterinaria de confianza" que ningún flujo guardaba. | Es la primera favorita de K4 (corazón). |
| K se usaba desde J y H, pero no tenía una entrada propia. | Accesos rápidos "Veterinarias" y "Calendario" en Inicio. |
| L7 y C7 mostraban destinos sin definir y M1 no tenía "Eliminar cuenta" (M7 se abre sobre Ajustes). | Destinos definidos en L y M; "Eliminar cuenta" va al final de M1. |
| Varias pantallas dependían de la suscripción (A11, A18–A21, M4, M10–M12, "Cada 5 semanas" en N3). | Pantallas eliminadas; la compra recurrente de N3 se quita. |

### Ajustes aplicados en Figma (27 oct 2026)

Cada spec detalla lo que se hizo en su sección **Cambios**. Las 69 pantallas modificadas y las 6 nuevas están exportadas en `design/flujos/`. Lo que afecta a más de un flujo:

- **Botón principal:** en 27 pantallas el texto del botón estaba atado a la variable `F9` (blanco con opacidad 0,7) y se veía deshabilitado. Ahora usa `neutro/0`, como E2–E6.
- **Nombre de la app:** G5 y H5 dicen "BALTO".
- **Botones:** N8 dice "Ver mi pedido" y A6 "Crear cuenta". A14 y L5 tienen un solo botón.
- **Video:** E7, E11 e I2 dicen solo "Foto"; I1 dice "1 foto".
- **Numeración de pasos:** B8 dice "1 de 3"; C2, C3, C8, C9 y C12 cuentan 2 pasos.
- **Pestañas sin flecha atrás:** D2, D8, D9 y D10.
- **Suscripción:** se borraron de Figma A11, A18–A21, M4 y M10–M12, y la fila de M1.
- **Pantallas nuevas:** A13.2 · Código bloqueado, J8 · Filtros de alertas, L8 · Lo que compartí, M18 · Editar mascota, M19 · Escríbenos, N16 · Pagar con PSE.
- **Campos nuevos:** E2 (Veterinaria, Lote), E3 (soporte), E4 (Resultado, Solicitado por, Próximo control), B1 (Microchip), A3 (reglas de contraseña), C2 (Cámara / Galería / PDF), D3 (chip Otros), G4 ("Por días"), H4 (nivel de actividad), H6 ("Hace" con "Cambiar"), I1 ("Exportar bitácora"), L2 (Enlace), M3 (Salud), M1 (Eliminar cuenta), Inicio (Calendario) y selector de mascota en todos los formularios de E.
- **Textos:** A7, A16, E11, G6, I5, K11, L4, O2, O3 y O5.

### Sigue pendiente en Figma

Son estados y variantes que las specs describen y que todavía no tienen pantalla:

- **Estados vacíos:** C11 (sin eventos detectados), F2, F3, G1, H1, K6, N9.
- **Estados de error o de carga:** A3 (correo inválido, ya registrado, contraseñas distintas); tarjeta de soporte subiendo o con error (E); "Confirmando el pago…" (N).
- **Variantes:** vacuna vencida (F1, F2, Inicio); cambio brusco de peso (F4); toma "Sin registrar" (G2); alimento por acabarse y menú (H1); Casero / Snack (H2); campos por tipo (I2); aviso pospuesto (J1); citas por confirmar o canceladas (K11); avisos apagados (E2, E10); E4 sin soporte; L2 con campo de correo; aviso "Sin vencimiento" (L4); enlace desactivado (L6); Archivadas (M5); M17 con pendientes; producto agotado (N2, N3); B2 con foto; B8 con el texto para eventos.
- **Otros:** hoja "Personalizar" (Inicio); vista de mapa (K3); selector de anticipación (M3); la vista de cámara de B2 y C2 debe abrir la cámara del teléfono; cita legal de J4.

## 4. Preguntas abiertas (todas)

Lo que las specs no pueden resolver sin el equipo. Entre paréntesis, la spec y la pregunta de `CLAUDE.md` relacionada.

### Negocio y proveedores
1. **Modelo de ingreso sin suscripción.** ¿Margen sobre el alimento, comisión de las aliadas o ambos? Hay que actualizar `docs/Brief.md`, que todavía describe la suscripción. (A, N · CLAUDE 7)
2. **Proveedores de la Tienda.** Alimento, veterinarias aliadas, catálogo, precios, inventario y seguimiento de entregas. (N · CLAUDE 5)
3. **Datos de veterinarias y proveedores.** ¿Servicio de mapas o catálogo propio? ¿De dónde salen las calificaciones? (K)
4. **Agenda real de las clínicas.** ¿Integración con su agenda, panel para la clínica o citas "por confirmar" por teléfono? (K)
5. **Política de cancelación de citas** ("Sin costo hasta 2 h antes"). (K)
6. **Placa grabada.** ¿Se vende, cuánto cuesta, quién la fabrica? Mientras tanto se oculta. (B · CLAUDE 3)
7. **Facturación electrónica** de las ventas de la Tienda. (N)

### Stack y servicios
8. **Servicio de lectura de documentos** (fotos, PDF, texto). (C, G · CLAUDE 4)
9. **Pasarela de pagos** (tarjeta tokenizada y PSE). (N · CLAUDE 7)
10. **Servicio de envío de correos** (L7, M14, M8). (L, M)
11. **PWA:** copia local, cola sin conexión y notificaciones push (sobre todo en iPhone). Las specs lo toman como decisión; falta confirmarlo. (O, G, J · CLAUDE 9)
12. **Acciones dentro de las notificaciones** ("Ya la di", "Servida"), que dependen del navegador. (G)
13. **Dominio** de la app y de los enlaces públicos. (L)
14. **Pantallas anchas:** propuesta de centrar la columna móvil. (O · CLAUDE 9)

### Legal y salud
15. **Términos y política de datos:** quién los redacta; Ley 1581 de 2012. (A)
16. **Retención de datos:** borrado lógico de 30 días para eventos (D7) y cuentas (M16). ¿Es compatible con la promesa "nada se pierde" y con el derecho a suprimir los datos? (D, M · CLAUDE 6)
17. **Norma que obliga la antirrábica** (J4 cita la Ley 576, que es el código de ética veterinario). (J)
18. **Revisión veterinaria** de la lista de alimentos tóxicos y de la tabla de porciones antes de salir a producción. (H)
19. **Línea de toxicología veterinaria** en la pantalla de urgencia. (H)
20. **Texto de chats pegado:** guardar solo los eventos confirmados, no el texto original. (C)

### Producto y diseño
21. **"Ya tengo una cédula Balto":** transferir una mascota entre dueños. No hay pantallas para eso. (B, O)
22. **Ciudad del dueño:** ¿texto libre o lista? (A)
23. **Canal de soporte:** quién responde y dónde llegan los mensajes. (M)
24. **Botón deshabilitado en el kit.** (E · CLAUDE 15)
25. **Variante "Verde y arena" de Inicio y paleta definitiva.** (Inicio · CLAUDE 14)
