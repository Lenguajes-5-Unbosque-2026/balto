# H · Alimentación

## Quién y para qué

El dueño organiza la comida de su mascota:
- registra qué come (concentrado, comida casera o snacks);
- recibe una porción sugerida según peso, edad y actividad;
- programa los horarios con recordatorios;
- sabe cuántos días de alimento le quedan.

Al registrar un alimento, Balto revisa si es tóxico para la especie. Si la mascota ya lo comió, ofrece una ruta de urgencia: llamar a la veterinaria con los datos clave a la vista.

Importa porque la alimentación es diaria (genera el hábito de abrir la app) y porque una intoxicación es una urgencia en la que cada minuto cuenta. También conecta con la Tienda: "Comprar alimento" cuando se está acabando.

## Pantallas

| ID | Nombre | Qué muestra |
|---|---|---|
| H1 | Plan de alimentación | Cabecera con el alimento ("Concentrado adulto · salmón · 380 g al día · 2 comidas") y fichas 190 g / 2 veces / 12 días. Debajo: "Horarios de hoy" con su estado ("Servida" o "Servir"), la nota "Te quedan unos 12 días de alimento." y "Comprar alimento". Lápiz arriba. |
| H2 | Registrar alimento | Selector Concentrado / Casero / Snack, Marca *, Tipo, Presentación, la nota "Revisaremos que el alimento sea seguro para su especie." y "Continuar". |
| H3 | Alerta de alimento tóxico | "Este alimento es tóxico para perros", explicación (uvas y pasas: daño renal), "Alternativas seguras", "Si ya lo comió, contacta a tu veterinario de inmediato.", "Cambiar alimento" y "Buscar veterinaria de urgencia". |
| H4 | Porción sugerida y horarios | "380 g al día · Guía para 28 kg · adulta · actividad media", nota "Es una guía general. Ajústala con tu veterinario.", comidas al día (−/+), cada comida con gramos y hora, interruptor "Recordatorio de comida" y "Guardar plan". |
| H5 | Recordatorio de comida | Notificación: "Hora de la cena de Luna · 190 g de concentrado · 18:00", con los botones "Más tarde" / "Servida". |
| H6 | Urgencia · ya lo comió | "Si ya lo comió, llama ahora", la veterinaria de confianza ("Abierta 24 h · 0,8 km"), "Ver veterinarias abiertas ahora", resumen (Qué comió, Hace, Peso de Luna), "No le provoques vómito sin indicación del veterinario." y los botones "Llamar ahora" / "Ver veterinarias". |
| H7 | Llamando a la veterinaria | "Llamando a Vet. Norte · 601 000 0000 · Abierta 24 h", ficha con especie y raza, edad y peso, alergias, medicación y qué comió, "Mantén esta pantalla abierta mientras hablas." y los botones "Registrar lo que pasó" / "Volver". |

## Paso a paso

Caso: Samuel arma el plan de alimentación de Luna con un concentrado nuevo.

1. **Entrada.** En Inicio toca **Accesos rápidos › Alimentación**. Como Luna no tiene plan, se abre el estado vacío de H1 con "Crear plan" → **H2**.
2. **Alimento (H2).** Elige **Concentrado**, escribe *Marca* "Pro Salmón", *Tipo* "Adulto · salmón" y *Presentación* "15 kg", y toca **Continuar**. Balto revisa que sea seguro; un concentrado comercial pasa la revisión.
3. **Porción (H4).**
   - Balto sugiere **380 g al día**, con una guía para 28 kg, adulta y actividad media. El nivel de actividad (baja / media / alta) se puede cambiar.
   - Deja **2** comidas: Desayuno 190 g a las 07:00 y Cena 190 g a las 18:00. Tocar una comida permite cambiar la hora o los gramos.
   - Deja el *Recordatorio de comida* encendido y toca **Guardar plan**.
4. **Plan (H1).** Ve el plan con los horarios de hoy y "Te quedan unos 39 días de alimento" (15 kg ÷ 380 g). Balto asume que la bolsa se abrió hoy.
5. **Recordatorio (H5).** A las 18:00 llega "Hora de la cena de Luna". Samuel sirve la comida y toca **Servida**; en H1 la cena pasa a "Servida".
6. **Se acaba.** Cuando quedan 5 días o menos, H1 lo muestra en amarillo y se crea una alerta en **J1**. "Comprar alimento" abre **N2 · Alimentos** buscando esa marca, o **N3** si el producto está en el catálogo.

### Variantes del paso a paso

**Alimento tóxico (H2 → H3 → H6 → H7)**
1. Samuel elige **Snack** y escribe "Uvas". Balto lo detecta como tóxico y abre **H3**: "Este alimento es tóxico para perros", con alternativas seguras (manzana sin semillas, zanahoria, pepino).
2. "Cambiar alimento" vuelve a H2. La X cierra sin guardar.
3. Si Luna ya se las comió, Samuel toca **Buscar veterinaria de urgencia** → **H6**.
4. H6 propone la veterinaria de confianza y muestra qué comió y su peso. Samuel elige hace cuánto lo comió: "menos de 30 min", "30–60 min", "1–2 h" o "más de 2 h".
5. **Llamar ahora** abre el marcador del teléfono con el número de la veterinaria, y Balto muestra **H7** con los datos para leerlos durante la llamada.
6. "Ver veterinarias" abre **K3 · Listado de proveedores** filtrado por "abiertas ahora" y "urgencias".
7. En H7, **Registrar lo que pasó** abre **E11 · Otro evento** con los datos llenos: "Comió uvas", la fecha y la hora, y el detalle con la cantidad de tiempo y la veterinaria. "Volver" regresa a H6.

**Otros casos**
- **Casero.** Con *Casero* el formulario pide "¿Qué le das?" (texto) y gramos por día. H4 no sugiere porción; el dueño la escribe.
- **Snack seguro.** Un snack que pasa la revisión no cambia el plan. Se guarda como evento de alimentación en la línea de tiempo y H2 se cierra con el mensaje "Snack registrado".
- **Cambiar el plan.** El lápiz de H1 abre H2 con el alimento actual. Si cambia el alimento, se registra en **D2** un evento de alimentación ("Cambió de Pro Salmón a …").
- **Bolsa nueva.** En H1, ••• → "Abrí una bolsa nueva" reinicia la cuenta de días.
- **Más tarde (H5).** Reprograma el aviso 30 minutos.

## Estados

| Estado | Dónde | Qué se ve / qué pasa |
|---|---|---|
| Sin plan | H1 | "Aún no tienes un plan de alimentación" con "Crear plan". *(Falta en Figma.)* |
| Comida servida | H1 | Chulo y "Servida". |
| Comida pendiente | H1 | "Pendiente" con el botón "Servir". |
| Comida sin servir | H1 | 2 horas después de la hora sin marcarla, queda "Sin registrar". |
| Alimento por acabarse | H1 | 5 días o menos: la nota en amarillo, "Comprar alimento" como botón principal y una alerta en J. |
| Alimento tóxico | H3 | Pantalla roja con alternativas. El alimento **no** se guarda en el plan. |
| Alimento desconocido | H2 | Si el alimento no está en la lista de tóxicos ni es un concentrado reconocido, se guarda con la nota "No lo tenemos en nuestra lista. Consulta con tu veterinario si tienes dudas." |
| Formulario incompleto | H2 | "Continuar" deshabilitado sin Marca (concentrado) o sin "¿Qué le das?" (casero o snack). |
| Sin veterinaria de confianza | H6 | La primera tarjeta no aparece y queda solo "Ver veterinarias abiertas ahora". |
| Sin ubicación | H6 | Sin permiso de ubicación no se muestra la distancia. "Ver veterinarias" lleva a **K7 · Ubicación denegada**. |
| Recordatorios apagados | H4, H5 | Si el interruptor está apagado, o "Comidas" está apagado en **M3**, no llega H5. |
| Sin permiso de notificaciones | H4 | **O5** al encender el recordatorio. |

## Qué pasa después

- **Plan guardado** → H1 y el acceso "Alimentación" de Inicio.
- **Cambio de alimento o snack** → evento de alimentación en **D2** (tipo alimentación, el mismo de E7).
- **Alimento por acabarse** → alerta en **J1** con la acción "Comprar" → **N2 / N3**.
- **Urgencia** → **K3** (veterinarias), marcador del teléfono, **E11** (registro de lo que pasó).
- **Porción** → usa el último peso de **F4**. Si el peso cambia más del 10 %, H1 muestra "Revisa la porción: Luna cambió de peso".

## Datos que usa

**Lee**
- **Mascota:** especie, fecha de nacimiento (edad), último peso, alergias (para no sugerir alternativas a las que es alérgica) y medicación vigente (H7).
- **Veterinaria de confianza:** la marcada como favorita en **K4**. Si no hay, la que más aparece en los eventos. Se leen el nombre, el teléfono, el horario y la ubicación.
- **Lista de alimentos tóxicos por especie:** lista fija revisada por un veterinario (uvas y pasas, chocolate, cebolla, ajo, xilitol, aguacate, nueces de macadamia, alcohol, cafeína, entre otros), con el motivo y alternativas seguras.
- **Tabla de porciones:** gramos por día según especie, peso, etapa (cachorro | adulto | senior) y actividad (baja | media | alta).
- **Preferencias de notificación (M3):** el aviso "Comidas".

**Guarda**
- **Plan de alimentación:** mascota, tipo (concentrado | casero), marca o descripción, tipo de alimento, presentación (kg), gramos por día, nivel de actividad, fecha en que se abrió la bolsa y si está activo.
- **Comida programada:** plan, nombre (Desayuno, Cena…), hora y gramos.
- **Comida servida:** comida programada, fecha, estado (pendiente | servida | sin registrar) y hora real.
- **Evento de alimentación** (cambio de alimento o snack): igual que E7.
- **Consulta de urgencia:** qué comió, hace cuánto y a qué veterinaria llamó. Solo se guarda si el dueño toca "Registrar lo que pasó" (va como evento de E11).

## Fuera de alcance

- Comprar alimento: **N**.
- Buscar y filtrar veterinarias: **K**.
- Registrar eventos genéricos: **E**.
- Análisis nutricional o calorías del producto.
- Alimentos tóxicos de plantas u objetos del hogar (solo alimentos).

## Preguntas abiertas

1. **Lista de alimentos tóxicos y tabla de porciones.** ¿Qué veterinario las revisa y aprueba? La app da una recomendación de salud y el brief exige "rigor verificable". Sin esa revisión, H3 y H4 no deben salir a producción.
2. **Línea de urgencias toxicológicas.** ¿Se agrega en H6 una línea nacional de toxicología veterinaria, además de la veterinaria de confianza?

## Cambios

**2026-10-27 · Primera versión** (sesión LD5 · Sesión 2)

Decisiones tomadas:
- H1 se abre desde **Accesos rápidos › Alimentación** en Inicio. Sin plan, muestra un estado vacío con "Crear plan".
- La revisión de toxicidad usa una lista fija por especie. Un alimento tóxico no se guarda en el plan.
- "Buscar veterinaria de urgencia" (H3) lleva a H6. "Llamar ahora" abre el marcador del teléfono y muestra H7.
- "Registrar lo que pasó" (H7) abre E11 con los datos llenos.
- Los días de alimento se calculan desde la fecha en que se abrió la bolsa. Con 5 días o menos se crea una alerta en J.
- La porción sugerida sale de una tabla por especie, peso, etapa y actividad, y se puede editar.
- Un snack seguro se registra como evento de alimentación sin cambiar el plan.
- Las notificaciones dicen **Balto**.

Pendiente de ajustar en Figma:
- H1: estado sin plan, menú ••• con "Abrí una bolsa nueva" y estado de alimento por acabarse.
- H2: campos para Casero y Snack ("¿Qué le das?", gramos).
- H4: selector de nivel de actividad.
- H5: "MASCOTAS" → "BALTO".
- H6: selector "Hace cuánto" (hoy el valor "20 minutos" es fijo).
- H3: el botón principal se ve deshabilitado; en una urgencia debe verse siempre activo.
