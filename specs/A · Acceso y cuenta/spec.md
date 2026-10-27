# A · Acceso y cuenta

## Quién y para qué

Es el flujo por el que entra el dueño de la mascota: la primera vez que abre Balto (bienvenida y registro) y cada vez que vuelve sin sesión (inicio de sesión y recuperación de contraseña).

Importa porque es la primera impresión del producto. El registro tiene que ser corto (3 pasos) y llevar al dueño cuanto antes a crear su mascota, que es donde empieza el valor. Balto no cobra por usarse: no hay suscripción, prueba gratis ni modo consulta.

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| A1 | Splash | Logo de Balto sobre fondo verde mientras carga la app. |
| A2 | Bienvenida | Carrusel 1 de 3: "Su historia, sin papeles". Botones "Ya tengo cuenta" y "Crear cuenta gratis". |
| A2.2 | Bienvenida | Carrusel 2 de 3: "Cada dosis a tiempo". Mismos botones. |
| A2.3 | Bienvenida | Carrusel 3 de 3: "Su veterinario, al tanto". Mismos botones. |
| A3 | Crear cuenta | Paso 1 de 3 · Tu cuenta: correo, contraseña, confirmar contraseña y "Acepto los términos y la política de datos". Botones "Ya tengo cuenta" y "Continuar". |
| A4 | Verificar correo | Paso 2 de 3 · Verificación: "Revisa tu correo", 6 casillas para el código, "Reenviar código en 0:45" y botón "Verificar". |
| A5 | Datos del dueño | Paso 3 de 3 · Datos del dueño: nombre completo, ciudad, teléfono de contacto y la nota "Tu teléfono aparece en la vista rápida de tu mascota por si alguien la encuentra." Botón "Confirmar". |
| A6 | Inicio de sesión | "Bienvenido de nuevo": correo, contraseña con botón para mostrarla, "¿Olvidaste tu contraseña?" y botón "Iniciar sesión". |
| A7 | Error de credenciales | A6 con los dos campos en error: "El correo o la contraseña no coinciden" y "Revisa tu contraseña e inténtalo de nuevo". |
| A8 | Recuperar contraseña | "¿Olvidaste tu contraseña?": campo de correo, nota "Si el correo está registrado, el enlace llega en unos minutos." y botón "Enviar enlace". |
| A9 | Crear contraseña nueva | Nueva contraseña, confirmación y lista de reglas: 8+ caracteres, mayúscula y número. Botón "Guardar contraseña". |
| A12 | Código incorrecto | "El código no coincide", casillas en error, "Te quedan 2 intentos antes de bloquear el código.", "Reenviar código" y "Volver a intentar". |
| A13 | Código vencido | "El código venció. Los códigos duran 10 minutos." Botones "Enviar código nuevo" y "Cambiar de correo". |
| A14 | Enlace enviado | "Revisa tu correo", "El enlace vence en 30 minutos.", "No me llegó el correo" y botones "Ya tengo el enlace" / "Iniciar sesión". |
| A15 | Contraseña actualizada | Confirmación, "Si no fuiste tú, escríbenos desde Ayuda." y botón "Iniciar sesión". |
| A16 | Enlace vencido | "Este enlace ya venció. Por seguridad los enlaces duran 30 minutos." Botones "Pedir enlace nuevo" e "iniciar sesión". |

## Paso a paso

Caso: Samuel abre Balto por primera vez y crea su cuenta con samuel@correo.com.

1. **Splash (A1).** Mientras carga, Balto revisa si hay una sesión guardada. Como no la hay, pasa a A2.
2. **Bienvenida (A2 → A2.2 → A2.3).** Samuel desliza las tres tarjetas; los puntos indican en cuál va. Puede tocar "Crear cuenta gratis" desde cualquiera de las tres.
3. **Crear cuenta (A3).** Escribe su correo y dos veces la contraseña, y marca los términos. Debajo de la contraseña ve las mismas reglas que en A9 (8+ caracteres, mayúscula, número), que se marcan a medida que escribe. "Continuar" se habilita cuando todo es válido y las dos contraseñas coinciden.
4. **Verificar correo (A4).** Balto envía un código de 6 dígitos a samuel@correo.com. Samuel lo escribe; cada dígito pasa a la siguiente casilla, y pegar el código completo llena las 6. "Reenviar código" se activa al terminar la cuenta regresiva de 60 segundos. Toca "Verificar".
5. **Datos del dueño (A5).** Escribe "Samuel Parada", "Bogotá" y "+57 300 000 0000". Toca "Confirmar".
6. **Primera mascota.** Balto lo lleva directo a **B1 · Datos básicos** para crear su primera mascota (flujo B).

### Variantes del paso a paso

**Volver a entrar (con cuenta)**
1. A1, sin sesión → A2. Samuel toca **"Ya tengo cuenta"** → A6.
2. Escribe su correo y contraseña → "Iniciar sesión".
3. Si son correctos, va a **Inicio**. Si no tiene mascotas, va a **O1 · Sin mascotas registradas**.
4. Si fallan, ve **A7**. Al editar cualquier campo, los errores desaparecen.

**Recuperar la contraseña**
1. En A6 o A7, toca "¿Olvidaste tu contraseña?" → **A8**, con el correo ya escrito si lo había llenado en A6.
2. Toca "Enviar enlace" → **A14**. Por seguridad, A14 se muestra aunque el correo no esté registrado.
3. "No me llegó el correo" reenvía el enlace (máximo uno por minuto). "Iniciar sesión" vuelve a A6.
4. Samuel abre el correo y toca el enlace. Se abre Balto en **A9**.
5. Escribe la nueva contraseña; las reglas se marcan a medida que escribe. "Guardar contraseña" se habilita cuando se cumplen las 3 reglas y las dos contraseñas coinciden.
6. → **A15**. "Iniciar sesión" lleva a A6.
7. Si el enlace tenía más de 30 minutos o ya se había usado, se abre **A16**. "Pedir enlace nuevo" lleva a A8 y "Iniciar sesión", a A6.

**Sesión ya iniciada**
- A1 con una sesión válida → **Inicio** (o O1 si no hay mascotas). No pasa por A2.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Formulario incompleto o inválido | A3, A5, A6, A8, A9 | El botón principal está deshabilitado. |
| Contraseñas no coinciden | A3, A9 | Error bajo "Confirmar contraseña": "Las contraseñas no coinciden". *(Falta en Figma.)* |
| Correo con formato inválido | A3, A6, A8 | Error bajo el campo: "Revisa el correo". *(Falta en Figma.)* |
| Correo ya registrado | A3 | Error bajo el correo: "Este correo ya tiene cuenta." con el enlace "Inicia sesión" → A6. *(Falta en Figma.)* |
| Contador de reenvío | A4 | "Reenviar código en 0:45", inactivo. A los 0 segundos pasa a "Reenviar código", activo. |
| Código incorrecto | A12 | Casillas en rojo, intentos restantes y "Volver a intentar", que limpia las casillas. Hay 3 intentos por código. |
| Código bloqueado | A13 (variante) | Al tercer intento fallido el código se anula y se muestra A13 con el título "Bloqueamos este código" y "Enviar código nuevo". *(Variante de texto pendiente en Figma.)* |
| Código vencido | A13 | Han pasado más de 10 minutos. "Enviar código nuevo" reenvía y vuelve a A4; "Cambiar de correo" vuelve a A3 con el correo editable. |
| Credenciales incorrectas | A7 | Los dos campos en error, con el mismo mensaje, sin decir cuál falló. |
| Cuenta sin verificar | A6 | Si el correo existe pero no se verificó, "Iniciar sesión" envía un código nuevo y lleva a A4. |
| Enlace enviado | A14 | Se muestra siempre, exista o no el correo. |
| Enlace vencido o ya usado | A16 | Pedir uno nuevo o iniciar sesión. |
| Contraseña actualizada | A15 | Se cierran las otras sesiones abiertas de esa cuenta. |
| Sin conexión | — | **O2 · Sin conexión** (flujo O). |
| Sesión expirada | — | **O4 · Sesión expirada** lleva a A6 (flujo O). |

## Qué pasa después

- **Registro completo (A5)** → **B1 · Datos básicos** (flujo B) para crear la primera mascota. Si el dueño sale de B sin terminar, la próxima vez entra a **O1**.
- **Inicio de sesión correcto (A6)** → **Inicio**, con la última mascota activa, u **O1** si no tiene mascotas.
- **Datos del dueño (A5)**: el teléfono se muestra en **D1 · Vista de acceso rápido** y en **L5 · Vista pública del perfil**. El nombre y el correo aparecen en **M1 · Ajustes** y se editan en **M2**.
- **"Si no fuiste tú, escríbenos desde Ayuda" (A15)** remite a **M8 · Ayuda**.

## Datos que usa

**Guarda**
- **Usuario (Supabase Auth):** correo, contraseña (la guarda Supabase, no Balto), fecha de verificación del correo y fecha de creación.
- **Dueño (perfil):** id del usuario, nombre completo, ciudad, teléfono de contacto, fecha de aceptación de términos y versión de los términos aceptados.
- **Códigos de verificación y enlaces de recuperación:** los gestiona Supabase Auth (código de 6 dígitos válido 10 minutos; enlace válido 30 minutos y de un solo uso). Balto lleva la cuenta de intentos fallidos por código (máximo 3).

**Lee**
- **Sesión activa:** decide qué se muestra después de A1.
- **Mascotas del dueño:** decide si después de iniciar sesión va a Inicio o a O1.

**Reglas de validación**
- Correo: formato válido y único.
- Contraseña: al menos 8 caracteres, una mayúscula y un número.
- Nombre completo, ciudad y teléfono son obligatorios en A5. El teléfono va con indicativo (+57 por defecto).

## Fuera de alcance

- Crear la mascota: **B · Perfil de mascota**.
- Editar los datos del dueño, cerrar sesión, eliminar la cuenta y confirmar identidad: **M** (M2, M7, M15, M16, M17).
- Sin conexión y sesión expirada: **O** (O2, O4).
- Inicio de sesión con Google, Apple u otros proveedores.
- Suscripción, prueba gratis, pagos y modo consulta: **eliminados del producto** (27 oct 2026).

## Preguntas abiertas

1. **Términos y política de datos.** A3 pide aceptarlos, pero el documento no existe en el repo. ¿Quién lo redacta y dónde se publica? La Ley 1581 de 2012 de protección de datos aplica porque se guardan datos personales del dueño.
2. **Modelo de ingreso.** Sin suscripción, el botón "Crear cuenta gratis" de A2 sigue siendo cierto. Falta actualizar `docs/Brief.md` con el nuevo modelo de ingreso (pregunta 7 de `CLAUDE.md`).
3. **Ciudad.** ¿Es texto libre o una lista? Hoy el producto es solo para Bogotá, y K (veterinarias cercanas) y N (entregas) dependen de la ubicación.

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisión de producto:
- **Se elimina la suscripción.** Se borraron A11 · Modo consulta, A18 · Datos de la tarjeta, A19 · Pago con PSE, A20 · Pago aprobado y A21 · Pago rechazado (y M4, M10, M11, M12 del flujo M). Ya no existen A10 · Activar suscripción ni A17 · Prueba gratis activada.

Decisiones tomadas:
- Después de A5 el dueño va directo a B1 para crear su primera mascota (O1 queda para quien no termina B).
- A3 usa las mismas reglas de contraseña que A9 y muestra la misma lista de verificación.
- 3 intentos por código. Al tercer error, el código se anula y se muestra A13 con texto de bloqueo.
- "Reenviar código" se activa a los 60 segundos.
- A14 se muestra exista o no el correo, para no revelar qué correos están registrados.
- Cambiar la contraseña cierra las demás sesiones.

Pendiente de ajustar en Figma:
- A6: el botón secundario "Ya tengo cuenta" pasa a decir "Crear cuenta" y lleva a A3 (pregunta 16 de `CLAUDE.md`).
- A7: usar el mismo encabezado de A6 (hoy tiene flecha atrás y título "Iniciar sesión"), porque es el mismo formulario en error.
- A14: quitar el botón "Ya tengo el enlace" (en la web, el enlace del correo abre A9) y dejar "Iniciar sesión" como botón principal.
- A16: corregir la mayúscula de "iniciar sesión".
- A3: agregar la lista de reglas de contraseña y los estados de error (formato, correo ya registrado, contraseñas distintas).
- A13: variante de texto para el código bloqueado.
