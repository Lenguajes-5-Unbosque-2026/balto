# Brief de proyecto — Lenguajes Digitales 5
### Plataforma de mascotas — Colombia

**Autores:** Samuel Parada y Andrés Claros
**Versión:** 4 — reenfoque de producto a partir del análisis competitivo de MIIA y de los resultados de la encuesta

---

## 1. Contexto o problema

La información de una mascota no deja de producirse: cada consulta, vacuna, desparasitación, examen, tratamiento, cambio de alimentación, variación de peso o de comportamiento genera un dato nuevo. El problema no es que esa información no exista, sino que nunca termina de juntarse: queda archivada donde se generó —la carpeta de una clínica, el carnet físico, un chat de WhatsApp con el veterinario, la memoria del dueño— y cada pieza vive aislada de las demás, sin que nadie la conecte con el resto.

Esa fragmentación no es solo un problema de organización personal; tiene una raíz estructural. En Colombia, la Ley 576 de 2000 obliga a que toda historia clínica veterinaria quede consignada y establece que solo puede conocerla un tercero con autorización del propietario — pero, a diferencia de la salud humana, no existe una reglamentación de formato y manejo que obligue a que esa información sea portable o quede centralizada en algún punto. El resultado directo es que cada proveedor la lleva a su manera, en su propio sistema o cuaderno, y el dueño nunca termina con una versión completa y propia de la información de su mascota.

Esa brecha —entre la información que existe y la que el dueño realmente tiene a la mano— es la que se siente en el día a día, no en un caso excepcional: el dueño no puede responder con precisión qué vacuna le pusieron y cuándo, qué medicamento le cayó mal, cuánto pesaba hace seis meses o qué decía el examen del año pasado — ni en un control de rutina, ni cuando cambia de veterinaria, ni cuando lo deja en una guardería, ni cuando viaja, ni cuando lo atienden de urgencia. Y cada vez que esa información hace falta, hay que reconstruirla desde cero: en el camino se repiten exámenes, se gasta tiempo de consulta y se termina decidiendo con datos incompletos. Quien más lo sufre es el dueño; el veterinario queda en segundo lugar, al atender sin contexto.

> **"¿Cómo hago para tener toda la información de mi mascota en un solo lugar, lista para mostrar en cualquier consulta, viaje o guardería?"**

Esa es la pregunta que hoy no tiene respuesta, y es la que conecta el problema con lo que vamos a construir.

Los temas de identificación y logística (viajes, hoteles, autorización de procedimientos) quedan como un problema secundario a explorar más adelante.

---

## 2. Objetivo del producto

Que cada mascota tenga un perfil digital único, que le pertenece a su dueño, se mantenga actualizado sin esfuerzo y se pueda consultar o mostrar en segundos, en cualquier momento y con quien haga falta — no como un historial clínico que solo importa dentro del consultorio, sino como el punto de referencia al que se recurre cada vez que alguien necesita saber algo de la mascota: una cita de rutina, un cambio de veterinaria, una guardería, un viaje, una urgencia, o la pregunta que le hace un familiar que se queda cuidándola el fin de semana. El dueño gana control y deja de reconstruir información; quien recibe a la mascota por primera vez puede atenderla con contexto completo.

En el uso diario, esto se ve así: el dueño registra cada evento apenas ocurre —una vacuna recién puesta, el resultado de un examen, un cambio de alimentación, una observación de comportamiento— con el soporte correspondiente (foto del carnet, del examen o de la fórmula) y unos pocos campos asociados; es el propio dueño quien registra el resultado de cada consulta veterinaria, con lo que el veterinario no necesita cuenta ni acceso de edición. Del otro lado, cuando la información se necesita, el dueño abre el perfil de su mascota desde el celular y encuentra primero una vista rápida de lo que más se pregunta —identificación, alergias, medicación vigente, últimas vacunas, peso— y, un nivel más abajo, el detalle completo si hace falta profundizar. Mostrar esa información a alguien más —un veterinario nuevo, un cuidador, el personal de una guardería— no exige que esa persona tenga cuenta ni use la misma aplicación.

Ese perfil es el punto de partida, no el techo. La ambición del producto es que sea el lugar donde se resuelve todo lo relacionado con el cuidado de la mascota —lo clínico, lo preventivo y lo cotidiano—; la hoja de ruta de la sección 6 define en qué orden se llega ahí. Pero el alcance por sí solo no es lo que diferencia este producto: el mercado ya tiene alternativas amplias y el análisis de la sección 3 muestra que ampliar la lista de funcionalidades no es lo que les falta. Lo que define el producto son dos compromisos que hoy nadie está cumpliendo:

- **Empezar a usarlo no cuesta nada ni exige comprar ningún dispositivo.** El valor se prueba antes de pagar y sin hardware de por medio.
- **La información registrada no se pierde.** No es una garantía técnica de fondo: es la funcionalidad principal. Un producto que promete que la información siempre está disponible y la pierde, falla en su razón de ser — y es exactamente la objeción que Valentina pone antes de registrarse.

**"Que la salud de tu mascota nunca dependa de dónde quedó el papel."**

---

## 3. Oportunidad de negocio

**Tamaño y dinámica del mercado.** La tenencia de mascotas en Colombia pasó de 48 % de los hogares en 2020 a un rango de 60 %–67 % en 2025, según la investigación anual del Pet Food Institute; el DANE y mediciones independientes como Kantar reportan cifras en ese mismo rango o superiores [1]. El gasto en productos y servicios para animales de compañía llegaría a **$6,1 billones de pesos en 2026**, según proyecciones de Euromonitor International [2], tras crecer cerca de 85 % en cinco años [3]. Dentro de ese gasto, la salud es el rubro que más se está encareciendo: en el año terminado en febrero de 2026 los servicios veterinarios y de cuidado subieron 9,72 %, frente a 5,29 % de la canasta familiar total, según el DANE [4].

**Público objetivo acotado.** No apuntamos a "los dueños de mascotas en Colombia". El segmento inicial es:

> Dueños de **perro o gato** en **Bogotá**, adultos entre 25 y 45 años de hogares urbanos de ingreso medio y medio-alto, que llevaron a su mascota a **por lo menos una consulta veterinaria particular en el último año** y que han pasado por **más de un proveedor** (clínica, especialista, guardería, peluquería, urgencias).

Es el segmento que efectivamente genera información clínica, ya vive la fragmentación en carne propia y es alcanzable para entrevistar y testear directamente. Estimación razonada de su tamaño, con los supuestos a la vista: Bogotá tiene alrededor de 2,8 millones de hogares (Censo DANE 2018); la tenencia reportada para la ciudad va de 40 % en la Encuesta Multipropósito 2021 del DANE a 65 % en la medición de Cifras y Conceptos de 2024 [5], lo que da un rango de **1,1 a 1,8 millones de hogares con mascota**. Si asumimos que una cuarta parte cumple el perfil completo (perro o gato + consulta particular reciente + más de un proveedor), el mercado inicial queda en el orden de **300.000 a 450.000 hogares**. *Supuesto por validar: la proporción de 1 de cada 4 es una estimación propia, no un dato de fuente.*

**Buyer persona.** Para tangibilizar ese segmento con una persona concreta:

> **Valentina, 34 años — Chapinero, Bogotá.**
> Trabaja en un cargo profesional de tiempo completo, vive con su pareja y tiene un perro y un gato. Los lleva a controles de rutina en una clínica veterinaria de barrio, pero en el último año tuvo que recurrir además a una clínica de urgencias distinta y a una guardería cuando viajó.
>
> **Cómo maneja la información hoy:** guarda las fotos de los carnets de vacunación en el rollo de su celular, mezcladas con fotos personales; el historial de exámenes vive en PDFs sueltos que le mandan por WhatsApp distintas clínicas; y para lo que no encuentra, llama a la primera veterinaria a preguntar, cuando alguien se lo recuerda.
>
> **Su dolor principal:** en la última urgencia de su perro, la clínica le preguntó si tenía alguna alergia registrada y no supo responder con certeza. En otra ocasión pagó un examen de sangre que, según le dijeron después, ya se lo habían hecho meses antes en otro lugar.
>
> **Qué la haría probar la plataforma:** que registrar un evento le tome menos de un minuto —si es más complicado que tomar una foto y guardarla, no lo va a sostener— y que, la próxima vez que la llamen de una clínica nueva o de la guardería, pueda resolver la pregunta mostrando el perfil desde su celular en vez de tratar de recordar.
>
> **Su objeción probable:** "¿y si dejo de usarla, pierdo la información de años de mis mascotas?" — la confianza en que su información queda segura y disponible es una condición para que se registre en primer lugar.

**Qué existe hoy y por qué no alcanza.** El competidor directo más relevante del mercado colombiano es MIIA: un agente de IA que responde por WhatsApp, con aplicación propia y un chip NFC para el collar que se vende en Cruz Verde, Farmatodo y Rappi por alrededor de $46.500 [7]. Su caso sostiene esta sección mejor que cualquier estimación, porque demuestra dos cosas al tiempo.

Demuestra que **la demanda existe**: la app supera las 5.000 descargas en Google Play [8] y el producto llegó a distribución en droguerías y domicilios. Hay dueños dispuestos a pagar por resolver esto.

Y demuestra **dónde está el hueco**: la app tiene 2.2 de 5 en la App Store de Colombia sobre 50 calificaciones [9], y en Google Play no acumula reseñas suficientes para que la tienda muestre un promedio [8]. Al leer el contenido de las reseñas, ninguna cuestiona el concepto ni pide funcionalidades nuevas. Todas describen el mismo bloqueo: códigos de activación que no sirven, registros que no se completan, perfiles que aparecen vacíos una semana después de haberlos llenado, formularios que obligan a declarar condiciones médicas inexistentes y soporte que no responde. Ese mismo problema aparece en reseñas fechadas entre diciembre de 2024 y septiembre de 2026 [9]: casi dos años bloqueando a usuarios que ya habían pagado.

**Qué se deduce de esto.** En este mercado no gana quien tenga más funcionalidades, sino quien logre que el dueño entre sin fricción y confíe en que su información sigue ahí. De ahí salen tres decisiones que atraviesan todo el brief:

1. **Sin hardware de por medio.** No vendemos ni emitimos dispositivo. El identificador es un dato que el dueño escribe (sección 6), no un objeto que debe comprar y activar — precisamente el punto donde muere la conversión del competidor. Esto confirma la decisión ya tomada de dejar la emisión de identificador propio fuera de alcance.
2. **La permanencia del dato como funcionalidad.** Es la objeción que la buyer persona formula antes de registrarse, y el competidor demuestra que es un riesgo real y no una preocupación hipotética.
3. **Rigor verificable.** El competidor incorporó a su aplicación un módulo de "análisis bioenergético", una práctica sin respaldo científico, dentro de un producto de salud animal [9]. En un mercado regido por la Ley 576 [6], sostener el producto únicamente sobre información trazable y aportada por profesionales es un diferencial de credibilidad disponible.

*Salvedad metodológica: 50 calificaciones es una muestra pequeña y las tiendas de aplicaciones sesgan hacia lo negativo, porque quien tiene un problema reseña más que quien queda satisfecho. Lo que sostiene el diagnóstico no es el promedio aislado, sino la consistencia del mismo patrón a lo largo de dos años y el hecho de que, con más de 5.000 descargas, la app no acumule reseñas suficientes en Google Play para mostrar promedio.*

**De dónde sale el ingreso.** El producto se ofrece como una única versión, pagada por el dueño mediante suscripción: perfil completo por mascota, historial con archivos adjuntos, múltiples mascotas, generación de reportes para compartir y alertas de vacunas y controles. No hay una versión gratuita limitada ni un segundo nivel de pago — todo dueño que se registra accede desde el inicio a la misma funcionalidad completa, lo que simplifica la decisión de compra y evita fragmentar la base de datos entre usuarios con información parcial y usuarios con información completa.

Lo único que cambia respecto de la versión anterior de este brief es **el momento del cobro**: el registro y el uso completo arrancan sin pago, durante un periodo de prueba, y la suscripción se activa después. Esto no contradice el modelo de un solo nivel —todos los usuarios tienen la misma funcionalidad completa desde el primer día, que es justamente el punto— pero elimina la barrera que hunde al competidor: nadie tiene que pagar para averiguar si el producto le sirve.

**Cómo escala.** Con una base de dueños activos, el modelo se extiende a las veterinarias, mediante un plan por clínica para recibir y actualizar perfiles con autorización del dueño: menos tiempo de consulta gastado en reconstruir antecedentes y más retención de clientes. Las aseguradoras entran solo después y con un rol acotado y explícito: verificar información al momento de suscribir una póliza o de sustentar una reclamación, siempre con datos que el dueño autoriza. No hacen parte del alcance inicial del producto.

---

## 4. Hipótesis

Creemos que los dueños de perros y gatos que ya asisten a consulta veterinaria particular van a registrar a su mascota y a mantener su perfil actualizado si la plataforma les permite consultar y mostrar esa información en el momento exacto en que se la piden, porque hoy asumen un costo concreto cada vez que no la tienen: exámenes que se repiten, consultas más largas y decisiones clínicas tomadas con datos incompletos.

**Qué tendríamos que ver para confirmarla:** que una proporción significativa de los dueños contactados complete el registro de al menos una mascota con tres o más datos clínicos (adquisición y registro); que vuelvan a abrir o actualizar el perfil en las dos semanas siguientes sin que se lo pidamos (retención); y que, en una situación real —una cita, un cambio de proveedor, un viaje, una guardería— usen efectivamente el perfil para mostrar la información de su mascota, en vez de quedarse solo con el registro inicial.

**Qué la descartaría:** que registren a la mascota una vez y no vuelvan; o que consideren la necesidad ya resuelta con lo que usan hoy (fotos en el celular, carpeta física, preguntarle a la clínica) y no le atribuyan ningún costo a esa forma de hacerlo.

**Hipótesis complementaria — fricción de entrada.** Creemos que la tasa de registros completados depende más de la fricción de los primeros minutos que de la cantidad de funcionalidades que ofrezca el producto, porque el competidor con mayor distribución del mercado pierde en ese punto exacto a usuarios que ya habían pagado (sección 3). Se comprueba midiendo el tiempo y la tasa de completitud del registro inicial: si una proporción alta de quienes lo inician lo abandonan antes de terminar, el problema está en la entrada y no en el alcance. Es la métrica que hay que instrumentar primero, no al final.

**Datos que faltan (Discovery):** cuántos dueños cambiaron de veterinaria o de proveedor en el último año; cuántos llevan hoy algún registro propio y en qué formato; con qué frecuencia les han pedido información que no tenían a mano; cuánto tiempo o dinero les ha costado no tenerla; y cuánto tiempo tolera un dueño en el registro inicial antes de abandonarlo.

---

## 5. Value prop principal y secundaria

**Principal:**

> Para el dueño de un perro o un gato que reparte el cuidado de su mascota entre varios proveedores, la plataforma reúne toda su información en **un perfil único que él controla y puede mostrar en segundos** —en la consulta, en la guardería, en un viaje o donde se la pidan—, a diferencia de reconstruirla cada vez a punta de carnets, carpetas, chats y memoria, y a diferencia de las alternativas digitales que existen hoy, que exigen comprar un dispositivo físico y superar una activación antes de poder siquiera probar si el producto sirve.

Beneficios tangibles para el dueño: menos exámenes repetidos y el gasto que traen; menos minutos de consulta gastados en reconstruir antecedentes; menor riesgo por alergias no informadas o dosis calculadas sin historial; un solo lugar al que volver cuando cambia de veterinaria, viaja o deja la mascota al cuidado de alguien más; y la tranquilidad de que lo que registró hoy va a seguir estando dentro de cinco años, que es la condición que pone antes de empezar a registrar.

**Secundaria:**

> Para el veterinario, el cuidador o la guardería que reciben a la mascota por primera vez, el perfil llega ordenado y con soportes, de modo que la atención arranca con contexto en lugar de con un interrogatorio.

Refuerza la decisión del dueño —le da sentido a compartir el perfil y hace que la información valga más—, pero el producto se sostiene aunque ninguna clínica lo adopte, porque el valor central es del dueño.

---

## 6. Qué vamos a hacer

Vamos a construir una plataforma digital (web/app móvil) centrada en una capacidad núcleo: el **perfil completo de la mascota**, donde se guarda y muestra toda su información —historial médico, alimentación, comportamiento, identificación, entre otros—, con fácil acceso para quien la necesite en el momento (el dueño, un veterinario, un cuidador). La ambición declarada en la sección 2 es que la plataforma termine resolviendo todo el cuidado de la mascota; lo que sigue separa lo que se construye y valida este semestre de lo que queda como hoja de ruta, para que el alcance sea verificable y no una promesa.

**Principios que rigen cualquier cosa que se construya**, derivados del análisis de la sección 3:

- Registrar un evento tiene que tomar menos de un minuto. Si es más difícil que tomar una foto y guardarla, el dueño no lo sostiene.
- Ningún formulario obliga a declarar información que no aplica.
- El producto se usa completo antes de pagar y sin comprar nada.
- Nada que se registre se pierde, y el dueño puede llevarse su información cuando quiera.

### Núcleo del MVP

Lo que hay que construir y probar este semestre para validar la hipótesis se concreta en cinco mecanismos:

- **Perfil con línea de tiempo:** vacunas, desparasitaciones, consultas, exámenes, tratamientos, peso, alimentación y comportamiento, cada uno con su soporte adjunto (foto del carnet, PDF del examen, fórmula médica). Es el dueño quien registra cada evento, incluido el resultado de sus consultas veterinarias, con una foto del documento que le entrega el veterinario — este último no necesita cuenta ni acceso de edición.
- **Vista de acceso rápido:** identificación, alergias, medicación vigente, últimas vacunas y peso — lo primero que preguntan, sin tener que buscar.
- **Compartir mediante un reporte en PDF:** el dueño genera, desde el perfil de su mascota, un reporte en PDF con la información relevante —completa o filtrada a lo que necesite mostrar en ese momento— y lo comparte por el medio que prefiera (WhatsApp, correo, impreso), sin que quien lo reciba necesite cuenta ni la misma aplicación. Es la forma más simple de resolver el "mostrar la información ya" sin depender de infraestructura de permisos ni de vencimientos automáticos, que queda para una iteración posterior.
- **Identificador como dato del perfil:** el dueño escribe a mano el número de su microchip o el código de su placa, como un campo más del perfil — sin lectura automática ni vinculación entre sistemas.
- **Alertas de lo que vence:** vacunas, desparasitaciones, medicación en curso y próximos controles, avisando antes del vencimiento y no después. Se apoyan en los datos que ya vive el perfil, así que no exigen infraestructura adicional, y son lo que convierte el registro en un hábito en vez de un archivo muerto.

La versión mínima que demuestra la propuesta de valor es: el dueño registra a su mascota y su información en la plataforma, anota el identificador que ya tenga (microchip o placa), y puede generar y compartir el PDF de ese perfil completo con quien lo necesite —de forma inmediata— en una consulta o emergencia.

### Hoja de ruta posterior

El orden responde a una regla: primero lo que el perfil ya sostiene por sí solo, y solo después lo que exige traer proveedores, acuerdos o datos de terceros.

- **Fase 2 — Lo cotidiano.** Registro de alimentación y hábitos con porción sugerida según peso y edad, alertas de alimentos tóxicos, bitácora de comportamientos atípicos para llevar al veterinario o al etólogo, y gráfica de evolución de peso con aviso ante cambios bruscos. Todo esto se construye sobre el perfil existente, sin dependencias externas.
- **Fase 3 — Proveedores.** Directorio de veterinarias filtrable por tipo de emergencia o consulta, cercanía y calificación; extensión a estilistas (baño, corte de pelo y uñas), paseadores y guarderías; agendamiento de citas y calendario unificado que muestre juntas las citas médicas y las de estética. El valor aquí no está en tener cada tipo de cita por separado, sino en verlas todas en un solo lugar.
- **Fase 4 — Red y permisos.** Perfil compartido con otros miembros del hogar o cuidadores, permisos granulares y enlaces con vencimiento, y conexión directa con los sistemas de gestión de las veterinarias.

**Visión de producto a futuro**, fuera de lo que se construye y valida este semestre: lectura automática de microchips y códigos QR, vinculación entre los distintos sistemas de identificación existentes, una conexión directa entre la aplicación del dueño y los sistemas de gestión de las veterinarias que permita enviar o sincronizar el perfil sin pasar por el PDF intermedio, y la cédula animal de la Red Colombiana de Identificación Animal (RCIA) si esta se aprueba y entra en operación —ninguna de estas existe todavía como sistema oficial u operativo, así que no forman parte de lo que hay que probar para validar la hipótesis.

### Fuera de alcance

Queda fuera de alcance para este semestre: avatar 3D, recordatorios genéricos, IA genérica, emisión de un identificador propio (microchip o cédula), permisos granulares y vencimiento automático al compartir, y otras funciones ya comoditizadas por el software veterinario existente.

A esto se suman tres exclusiones que se desprenden directamente del análisis competitivo, y que quedan fuera no por falta de tiempo sino por decisión:

- **Agente conversacional de IA disponible 24/7.** Es el producto central del competidor. Dar orientación sobre salud animal en tiempo real exige validación clínica seria, y el costo de un consejo mal dado es alto. Entrar ahí sería competir en el terreno del otro, sin su ventaja de tiempo ni de distribución.
- **Chip NFC físico propio.** Implica manufactura, importación y logística de distribución, y es exactamente el punto donde el competidor pierde a sus usuarios. Replicarlo sería heredar su problema.
- **Rastreo GPS.** Requiere hardware con costo y autonomía que el proyecto no puede asumir, y resuelve un problema —la mascota perdida— que es secundario frente al que define este brief.

---

## Fuentes

1. Pet Food Institute, investigación anual sobre tenencia de mascotas en Colombia (2025), reseñada por *El Espectador* — tenencia entre 60 % y 67 % en 2025 frente a 48 % en 2020; Kantar (2024) reporta 70 % en hogares encuestados. https://www.elespectador.com/la-red-zoocial/hasta-el-67-de-los-hogares-en-colombia-tienen-una-mascota-segun-reciente-estudio/
2. Euromonitor International, proyección de gasto en mascotas en Colombia para 2026, citada por *El Colombiano* e *Infobae*. https://www.elcolombiano.com/negocios/dos-de-cada-tres-hogares-colombianos-tienen-mascota-cuanto-gastan-y-ahorran-HO29411402
3. Bancolombia, crecimiento del sector de productos y servicios para mascotas en los últimos cinco años, citado por *Pet Industry*. https://petindustry.co/gerencia/del-dink-al-mercado-colombiano-como-el-consumidor-pet-de-ee-uu-anticipa-la-industria-de-mascotas-en-colombia-hacia-2026/
4. DANE, variación anual de precios a febrero de 2026 — servicios veterinarios y de cuidado (9,72 %) frente a la canasta familiar total (5,29 %), reportado por *Semana*. https://www.semana.com/economia/macroeconomia/articulo/perros-y-gatos-cada-vez-mas-costosos-el-gasto-en-salud-de-las-mascotas-crece-por-encima-de-la-inflacion/202621/
5. DANE, Encuesta Multipropósito 2021 (cerca de 4 de cada 10 hogares de la cabecera de Bogotá con al menos una mascota) y Cifras y Conceptos, encuesta Polimétrica 2024 (65 % en Bogotá), ambas reseñadas por *El Espectador*. https://www.elespectador.com/la-red-zoocial/revelan-el-numero-de-mascotas-que-hay-en-colombia-son-mas-perros-que-gatos-noticias-hoy/
6. Ley 576 de 2000, artículo 61 — Código de Ética para el ejercicio de la medicina veterinaria en Colombia: la historia clínica es de consignación obligatoria y la información es privada, sometida a reserva, y solo puede ser conocida por terceros con autorización del propietario. La ausencia de una reglamentación técnica equivalente a la Resolución 1995 de 1999 (historia clínica humana) está documentada en investigación académica sobre historia clínica y consentimiento informado en medicina veterinaria en Colombia.
7. Farmatodo, ficha de producto del chip MIIA para mascotas — precio de referencia $46.500. Los canales de venta adicionales (tienda propia, Rappi y droguerías Cruz Verde) están declarados en el sitio oficial de MIIA. Consultado en septiembre de 2026. https://www.farmatodo.com.co/producto/289900594-chip-miia-para-mascotas-caja-x-1-und · https://miiacolombia.com/
8. Google Play, ficha de la aplicación MIIA Colombia — más de 5.000 descargas; la tienda no muestra calificación promedio por no alcanzar el mínimo de reseñas requerido. Consultado en septiembre de 2026. https://play.google.com/store/apps/details?id=com.miiacolombia.app
9. App Store Colombia, ficha y reseñas de MIIA Colombia — calificación de 2.2 sobre 5 con 50 calificaciones; reseñas de usuarios consultadas con fechas entre diciembre de 2024 y septiembre de 2026; historial de versiones, incluida la incorporación del módulo PetScan basado en "análisis bioenergético" (versión 1.2.0, abril de 2026). Consultado en septiembre de 2026. https://apps.apple.com/co/app/miia-colombia/id6475799833

---

*Documento vivo: se actualiza a medida que avanza la investigación y el desarrollo del producto.*
