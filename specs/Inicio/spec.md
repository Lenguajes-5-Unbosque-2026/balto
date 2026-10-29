# Inicio

## Quién y para qué

Es la pantalla principal del dueño. Desde aquí:
- elige la mascota activa;
- ve su resumen y lo próximo que vence;
- entra a los accesos rápidos de salud, medicamentos, alimentación y hábitos.

La barra de navegación inferior lleva a Inicio, Línea de tiempo, Registrar, Tienda y Alertas.

Importa porque es el centro de navegación de toda la app. Todo lo que se registra en otros flujos se resume aquí, y la mascota activa que se elige aquí es la que usan los demás flujos (E, D, F, G, H, I, L).

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| Inicio | Selector de mascota · Verde y arena | Arriba: avatar del dueño (SP), "Hola, Samuel · Todo en un solo lugar", botón compartir y campana con punto de no leídas. Debajo: selector de mascotas (Luna, Toby, Michi y +), la tarjeta de la mascota activa (PERRO · GOLDEN, Luna, 3 años · Hembra, fichas Al día / Microchip / 28 kg, foto y flecha ↗), la tarjeta "Próximo a vencer · Refuerzo antirrábica · Luna · en 5 días (28 sep)", "Accesos rápidos" (Salud, Medicamentos, Alimentación, Hábitos…) con "Personalizar" y la barra de navegación inferior. |

Pantalla relacionada de otro flujo: **O1 · Sin mascotas registradas** (Inicio sin mascotas).

## Paso a paso

Caso: Samuel abre Balto para ver cómo está Luna y luego revisa a Toby.

1. **Entrada.** Al abrir la app con sesión (A1), o al iniciar sesión (A6), Balto abre Inicio con la **última mascota activa**. Si no hay mascotas activas, abre **O1**.
2. **Resumen.** Ve la tarjeta de Luna:
   - "Al día": todas sus vacunas al día.
   - "Microchip": tiene microchip registrado.
   - "28 kg": su último peso.
3. **Lo próximo.** "Próximo a vencer" muestra la alerta más cercana de la mascota activa: el refuerzo de la antirrábica en 5 días. Tocarla abre **J2**.
4. **Accesos rápidos.** Toca **Salud** → **F1**. Los demás accesos llevan a **G1** (Medicamentos), **H1** (Alimentación), **I1** (Hábitos), **K3** (Veterinarias) y **K6** (Calendario).
5. **Cambiar de mascota.** Toca el chip **Toby**. Toda la pantalla se actualiza con Toby, y Toby pasa a ser la mascota activa en los demás flujos.

### Variantes del paso a paso

- **Tarjeta de la mascota.**
  - La flecha ↗ abre **D1 · Vista de acceso rápido**.
  - La ficha "Al día" abre **F2**, la de "Microchip" abre **B6 · Cédula** y la del peso abre **F4**.
- **Agregar mascota.** El **+** al final del selector abre **B1**.
- **Encabezado.**
  - El avatar abre **M1 · Ajustes**.
  - El botón compartir abre **L1** con la mascota activa.
  - La campana abre **M9 · Notificaciones** (bandeja).
- **Personalizar.** Abre una hoja para elegir y ordenar los accesos rápidos. Por defecto: Salud, Medicamentos, Alimentación, Hábitos, Veterinarias, Calendario. *(Hoja pendiente en Figma.)*
- **Barra inferior.**

  | Ícono | Abre |
  |---|---|
  | Inicio | Esta pantalla |
  | Línea de tiempo | **D2** |
  | **+** (centro) | **E1** |
  | Tienda | **N1** |
  | Alertas | **J1**, con un punto si hay alertas urgentes o de esta semana |

## Estados

| Estado | Qué se ve / qué pasa |
|---|---|
| Sin mascotas activas | **O1**. |
| Mascota sin foto | La tarjeta muestra el avatar de huella. |
| Vacunas vencidas | La ficha cambia a "Vencida" en rojo. |
| Sin microchip | La ficha "Microchip" no se muestra. |
| Sin peso | La ficha muestra "Registrar peso" y abre **E6**. |
| Nada por vencer | La tarjeta "Próximo a vencer" dice "Todo al día" y abre **J1**. |
| Una sola mascota | El selector muestra esa mascota y el **+**. |
| Notificaciones sin leer | Punto en la campana de arriba. |
| Sin conexión / pendientes | Banda de **O2** u **O3** arriba (flujo O). |
| Carga inicial pendiente | Si la mascota activa no terminó C, una tarjeta "Termina de subir la información de Luna" abre el paso pendiente de **C**. |

## Qué pasa después

- **Mascota activa:** la usan E1 y E2 (encabezado), D1 y D2, F1, G1, H1, I1, L1 y las recomendaciones de N1.
- Cada acceso, ficha o ícono lleva a su flujo (ver Paso a paso).

## Datos que usa

**Lee**
- **Dueño:** nombre (saludo) e iniciales (avatar).
- **Mascotas activas:** nombre, foto, especie, raza, sexo y fecha de nacimiento (para la edad).
- **Mascota activa:** estado de vacunas (regla de F), microchip, último peso y estado de la carga inicial.
- **Próxima alerta** de la mascota activa (J).
- **Notificaciones sin leer** (M9) y **alertas urgentes o de esta semana** (J1), para los puntos.

**Guarda**
- **Última mascota activa** del dueño, para abrir Inicio con ella.
- **Accesos rápidos:** lista ordenada por dueño.

## Fuera de alcance

- Todo lo que se abre desde Inicio tiene su propia spec.
- Widgets o resúmenes de varias mascotas a la vez.

## Preguntas abiertas

1. **Variante "Verde y arena".** El nombre de la pantalla sugiere que hubo variantes de color. La auditoría menciona una arena (#ECD3AB) que el kit retiró (pregunta 14 de `CLAUDE.md`). ¿Esta es la versión final?

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- Inicio abre con la última mascota activa. Cambiar de mascota cambia la mascota activa en toda la app.
- Destinos: avatar → M1; compartir → L1; campana → M9; flecha ↗ → D1; fichas → F2 / B6 / F4; "Próximo a vencer" → J2; + del selector → B1.
- Accesos rápidos por defecto: Salud, Medicamentos, Alimentación, Hábitos, Veterinarias y Calendario (los dos últimos salen de la spec de K).
- Barra inferior: Inicio, Línea de tiempo (D2), + (E1), Tienda (N1), Alertas (J1).
- Tarjeta para retomar la carga inicial si quedó pendiente.

Pendiente de ajustar en Figma:
- Hoja "Personalizar" de los accesos rápidos.
- Agregar "Veterinarias" y "Calendario" a los accesos rápidos.
- Estados: vacunas vencidas, sin peso, nada por vencer y carga inicial pendiente.

**2026-10-27 · Ajustes aplicados en Figma** (pantallas exportadas a `design/flujos/`)

Hecho: acceso rápido "Calendario" ("Veterinarias" ya existía).

Sigue pendiente: la hoja "Personalizar" y los estados (vacunas vencidas, sin peso, nada por vencer, carga inicial pendiente).

**2026-10-29 · Construcción en código (MVP)**

Decisiones tomadas:
- Los destinos fuera del MVP (M1, L1, M9, B1, F1, G1, H1, I1, K3, K6, "Personalizar" y J) muestran el mensaje "… llega pronto" en vez de no hacer nada.
- Mientras no existen F2 y F4, los rasgos "Al día" y el del peso abren la línea de tiempo filtrada por Vacunas o por Peso. "Microchip" abre D1.
- "Próximo a vencer" abre el evento que generó la alerta (D4) mientras no existe J2. Las alertas vencidas van primero, en rojo, con "venció hace N días".
- Se construyeron los estados: vacunas vencidas (rasgo rojo "Vencida"), sin microchip (sin rasgo), sin peso ("Registrar peso" abre E6) y nada por vencer ("Todo al día").
- El círculo detrás de la foto en la tarjeta verde es `acento-suave`, como en Figma; en el resto de la app la foto va sobre `primario`.
