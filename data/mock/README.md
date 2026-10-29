# Datos de prueba

Registros inventados pero realistas (Bogotá, octubre de 2026). Primero alimentan las pantallas en código y después se cargan tal cual a Supabase. Las columnas siguen la sección **Datos que usa** de cada spec en `specs/`.

**Formato de todos los archivos:**
- CSV en UTF-8 sin BOM, separado por comas.
- Ids de texto con prefijo (`m01`, `e14`…). Fechas `AAAA-MM-DD` y fechas con hora `AAAA-MM-DD HH:MM` (hora de Bogotá).
- Booleanos `true` / `false`. Decimales con punto (`28.4`). Precios en pesos colombianos sin separador (`289900`).
- Las listas dentro de una celda van separadas con `;` (por ejemplo, `servicios`).

La fecha de referencia ("hoy") es el **27 de octubre de 2026**: las alertas, tomas y citas están calculadas contra ese día.

## Archivos y relaciones

| Archivo | Filas | Qué es | Se relaciona con |
|---|---|---|---|
| `duenos.csv` | 3 | Dueños (A5, M2) | — |
| `mascotas.csv` | 5 | Mascotas y su cédula (B) | `dueno_id` → duenos |
| `eventos.csv` | 40 | Los 9 tipos de evento de E; una fila por evento, con las columnas propias de cada tipo | `mascota_id` → mascotas · `proveedor_id` → veterinarias (opcional) |
| `soportes.csv` | 9 | Archivos adjuntos a eventos (D5) | `evento_id` → eventos · archivo en `soportes/` |
| `veterinarias.csv` | 15 | Veterinarias y otros proveedores de Bogotá (K) | — |
| `alergias.csv` | 4 | Alergias por mascota (B4, F5) | `mascota_id` → mascotas |
| `condiciones.csv` | 2 | Condiciones diagnosticadas (F5) | `mascota_id` → mascotas |
| `tratamientos.csv` | 4 | Tratamientos (G) | `mascota_id` → mascotas · `evento_id` → eventos |
| `horarios_toma.csv` | 5 | Horas de toma de cada tratamiento (G4) | `tratamiento_id` → tratamientos |
| `tomas.csv` | 8 | Tomas registradas (G1, G2) | `tratamiento_id` → tratamientos |
| `alertas.csv` | 12 | Alertas (J) | `mascota_id` → mascotas · `evento_id` / `evento_resolucion_id` → eventos · `plan_id` → planes_alimentacion |
| `citas.csv` | 5 | Citas agendadas (K) | `dueno_id`, `mascota_id`, `proveedor_id` → veterinarias, `alerta_id`, `pedido_id` |
| `planes_alimentacion.csv` | 3 | Plan de alimentación (H) | `mascota_id` → mascotas |
| `comidas_programadas.csv` | 5 | Comidas del plan (H4) | `plan_id` → planes_alimentacion |
| `habitos.csv` | 12 | Bitácora de hábitos (I) | `mascota_id` → mascotas |
| `productos.csv` | 11 | Catálogo de la Tienda (N) | — |
| `direcciones.csv` | 3 | Direcciones de entrega (N12) | `dueno_id` → duenos |
| `metodos_pago.csv` | 2 | Tarjetas guardadas, solo últimos 4 dígitos y token (N13) | `dueno_id` → duenos |
| `pedidos.csv` | 3 | Pedidos (N8, N9, N15) | `dueno_id`, `direccion_id`, `metodo_pago_id` |
| `pedido_items.csv` | 4 | Productos de cada pedido | `pedido_id`, `producto_id`, `mascota_id`, `cita_id` |
| `envios.csv` | 5 | PDF y enlaces compartidos (L) | `mascota_id` → mascotas |
| `preferencias_notificacion.csv` | 12 | Avisos por tipo y anticipación (M3) | `dueno_id` → duenos |

En `eventos.csv`, las columnas que se llenan dependen del `tipo`:

| Tipo | Columnas |
|---|---|
| vacuna | `vacuna`, `lote`, `proximo_refuerzo`, `veterinaria`, `recordatorio` |
| desparasitacion | `producto`, `via`, `proxima_dosis`, `recordatorio` |
| consulta | `veterinaria`, `motivo`, `diagnostico`, `recomendaciones` |
| examen | `tipo_examen`, `laboratorio`, `resultado_principal`, `resultado`, `solicitado_por`, `proximo_control` |
| tratamiento | `medicamento`, `dosis`, `via`, `frecuencia`, `duracion_dias` |
| peso | `peso_kg` |
| alimentacion / comportamiento | `que_cambio` |
| otro | `titulo`, `lugar`, `detalle` |

## Quién es quién

- **Samuel Parada (`d01`)**, el dueño de las pantallas de Figma.
  - **Luna (`m01`):** 20 eventos. Es la mascota de casi todos los ejemplos: antirrábica, hemograma, amoxicilina, dermatitis, peso de 28,4 kg, plan de alimentación con salmón.
  - **Toby (`m02`):** 9 eventos, con un tratamiento vigente.
  - **Michi (`m03`):** 7 eventos, sin alergias.
- **Valentina Rojas (`d02`)**, la persona de referencia del brief.
  - **Canela (`m04`):** archivada, con 4 eventos.
  - **Señor Bigotes… (`m05`):** sin eventos.
- **Juan Esteban Martínez (`d03`):** acaba de registrarse y no tiene mascotas (pantalla O1).

## Casos difíciles incluidos

| Caso | Dónde |
|---|---|
| Nombre muy largo | Mascota `m05` (y su cédula `BAL-0005-SENORBIGOTESDELAMONTANACORONADOPEREZ`), veterinaria `v06`, producto `pr05` |
| Sin foto | Mascota `m05`; todas las veterinarias y productos (ver Imágenes) |
| Sin fecha de nacimiento ni microchip | Mascota `m05` (raza "Mestizo / no sé") |
| Lista vacía | `m05` sin eventos (D8), `d03` sin mascotas (O1), Michi sin alergias (F5), Michi sin tratamientos (G1), Valentina sin pedidos (N9) |
| Carga inicial pendiente | Mascota `m05` (`carga_inicial = pendiente`) |
| Mascota archivada | `m04`: no genera alertas aunque su antirrábica venció el 5 oct |
| Valores en cero | Producto `pr04` con `stock = 0` (agotado), pedido `pd01` con `envio = 0`, veterinaria `v13` con 0 reseñas y sin calificación, envío `en05` con 0 visitas |
| Datos que faltan | Veterinaria `v15` sin teléfono; consulta `e33` sin recomendaciones; evento `e29` sin detalle |
| Texto muy largo | Detalle del evento `e17` ("Comió uvas") |
| Evento eliminado | `e20` (peso de 284 kg escrito por error, con `eliminado_en`); no debe verse en la app |
| Varios soportes en un evento | `e06` tiene 2 soportes; `carnet_luna.jpg` sirve a `e01` y `e02` |
| Resultados alterados | Examen `e38` (perfil renal de Canela) |
| Estados de todo tipo | Tomas tomada, omitida, pospuesta, sin registrar y pendiente; alertas próxima, vencida, resuelta y pospuesta; citas realizada, confirmada, por confirmar y cancelada; pedidos aprobado, en camino y rechazado; enlaces activo, vencido (`en04`) y desactivado (`en05`) |
| Deposiciones con sangre | Hábito `hb12` (Michi) |

## Imágenes

- **`imagenes/`**: fotos de mascotas (`luna.png`, `toby.png`, `michi.png`, `canela.png`), 512 × 512, recortadas a la cara y con fondo transparente.
  - Se exportaron de las fotos que el equipo ya usa en Figma (Inicio y bienvenida), sin fondo: la app pone el círculo detrás.
  - Los nombres de capa de Figma (`38079689_8595615`…) sugieren que vienen de Freepik. **Hay que confirmar la licencia** y, si exige atribución, agregarla o cambiar las fotos por unas de Unsplash o propias.
  - `habitos.csv` (`hb09`) reutiliza `luna.png` como foto del paseo.
- **`soportes/`**: los archivos de `soportes.csv`.
  - Carnets, fórmula y receta en JPG; exámenes e indicaciones en PDF.
  - Son documentos dibujados para la prueba y dicen "Documento de prueba · datos inventados".
- **Pendiente:** fotos de las veterinarias (K4) y de los productos (N1–N3). La columna `imagen` existe en `veterinarias.csv` y `productos.csv`, pero está vacía hasta conseguir fotos libres o propias. Las pantallas deben verse bien sin foto, igual que con la mascota `m05`.

## Lo que estos datos no deciden

Los nombres de columna son una propuesta a partir de las specs. El modelo de datos definitivo (tipos, llaves, tablas de Supabase) va en `data/modelo-datos.md`, que todavía no existe (pregunta 11 de `CLAUDE.md`).
