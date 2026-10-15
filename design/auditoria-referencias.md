# Auditoría de referencias: estilo visual y decisiones de UI

Qué tomamos de cada referencia y cómo quedó aplicado en Balto. La columna «Nota del equipo» sale de los frames EXPLICACIÓN que ya estaban en esta página; las decisiones aplicadas se verificaron contra las 165 pantallas y el UI kit (15 oct 2026). La relación referencia a decisión es una propuesta: hay que confirmarla con el equipo. Cada nota se asignó a la referencia más cercana en el lienzo.

## 1. Referencias y decisiones de UI (segunda toma)

| Referencia | Nota del equipo | Decisión de UI o estilo | Dónde se ve en Balto |
|---|---|---|---|
| Phantom (iOS) · Mobbin | Animación splash inicial, dinámico y animado con el logo de la app | Splash con la marca como protagonista; la animación aún no está prototipada | A1 · Splash (Cover y Casos de uso). La página Prototipos está vacía |
| PetNova · Petcare App (Behance) | Tarjetas, tipografías y color. Plantilla para marketplace y tarjetas de selección de eventos. Plantilla para agendamiento y búsqueda de veterinarias | Tarjetas con radio grande (20 a 28 px), una sola familia de color primario sobre neutros, tarjetas de producto y de evento, calendario con búsqueda para citas | Componentes Tarjeta de evento, Tarjeta de producto, Búsqueda y Día. Secciones N (Tienda), E1 (tipo de evento) y K (Veterinarias) |
| Let's Have Pets (Behance) | Perfil de la mascota | Perfil con foto grande de la mascota y datos clave arriba | Componente Foto de mascota. Sección B (Perfil, 10 pantallas) y D1 Vista de acceso rápido |
| Pet Care App (Behance 189776403) | Verificación de dos pasos | Código de 6 dígitos, un campo por dígito, con estados vacío, foco, lleno y error | Componente Dígito de código. A4, A12 (código incorrecto) y A13 (código vencido) |
| Maawa · AI Pet Care (Behance) | Formato para subir imágenes bien logrado | Zona de cámara o carga con vista previa y lista de archivos subidos | Carga inicial C2 a C13 (carnet, examen, fórmula) con Fila de lista |
| AI Pet Care y Adopción (Behance) | Home, organización y card de imagen con texto. Primeros pantallazos, onboarding bien hecho con consejos | Home ordenado por tarjetas con imagen y texto. Onboarding de 3 pasos con indicador y un mensaje por pantalla | Inicio · Selector de mascota. A2 Bienvenida (3 versiones) con el componente Indicador de página |
| Smart Pet Care Mobile App (Behance) | Health care card para ver la información, jerarquía de elementos y no hover | Tarjeta de salud con jerarquía clara (dato principal grande, secundario pequeño). Sin estados hover porque es móvil | Componentes Estadística, Rasgo y Tarjeta de evento. Sección F (Salud y evolución) y D1 |
| Pet Care Mobile App UI/UX (Behance 229354733) | Logo, elementos dinámicos | Logo e ilustraciones de mascotas como elemento de marca recurrente | Cover, A1 y A2 (ilustraciones de perros) |

## 2. Decisiones de estilo visual (verificadas en el archivo)

| Decisión | Valor aplicado | Observación o riesgo |
|---|---|---|
| Formato de pantalla | 390 x 844, barra de estado de 50 px, margen lateral de 24 px, barra de acción inferior de 108 px | Consistente en las 165 pantallas |
| Color · paleta activa | «Verde y arena»: primario #2E5955 y #2F5F5F, arena #ECD3AB, acentos fríos #C7D0D5 y #DCE2E5, neutros #F2F2F2, #6A797A y #180D08, error #C8475B | Conviven 3 colecciones de variables (Paleta morado y lavanda, Verde y arena, Cálida) con nombres repetidos y las pantallas usan las dos primeras. Unificar en una colección con modos |
| Tipografía | Títulos en Outfit (Medium 18, SemiBold 22, 28 y 40). Cuerpo en Plus Jakarta Sans (Regular 13 y 15, SemiBold 13 y 15, Medium 11, Bold 16 en botones) | 10 estilos de texto locales: Display, Título 1 a 3, Cuerpo, Cuerpo fuerte, Pequeño, Etiqueta, Micro y Botón |
| Iconografía | Material Symbols Rounded en tamaños 20, 22, 24, 32 y 48 | El kit solo muestra 8 íconos; falta la lista completa de los usados |
| Radios | 14, 18, 20, 22, 24, 28, 32 y 44 px (los más usados: 20, 22 y 28) | No hay variables de radio. Reducir a una escala de 4 o 5 valores |
| Espaciado | Separaciones de 2, 4, 6, 8, 10, 12, 14 y 16 px | No hay variables de espaciado. Definir una escala (4, 8, 12, 16, 24) |
| Navegación | Barra inferior con Inicio, Línea de tiempo, Alertas y Tienda, más botón central de registro | Componente Navegación inferior, 4 variantes |
| Estados de interacción | Pensado para móvil: sin hover. Campo con Normal, Foco y Error. Chip con Activo e Inactivo | El Botón solo tiene variantes de tipo: faltan deshabilitado y cargando |

## Para cerrar este paso

- Confirmar con el equipo la relación referencia a decisión de la tabla 1.
- Documentar la primera toma de referencias (unas 14 imágenes y una paleta, sin notas).
- Actualizar el texto «75 pantallas en 13 módulos» de esta página: hoy son 165 pantallas en 15 secciones (A a O).
- Dejar registrada la paleta final (Verde y arena) y pasar las otras dos a modos o retirarlas.
