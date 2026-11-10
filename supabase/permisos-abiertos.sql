-- Balto · Permisos abiertos para las 22 tablas (prototipo).
--
-- La app lee y escribe con la llave pública (anon) y todavía no tiene inicio de
-- sesión real, así que cualquiera con la app puede leer, crear, cambiar y borrar
-- filas de estas tablas. Usar solo con datos de prueba: nunca datos personales
-- reales ni números de tarjeta (metodos_pago guarda solo franquicia y últimos 4).
-- Cuando llegue Supabase Auth, estas políticas se reemplazan por unas por dueño.
--
-- Se puede correr más de una vez: borra y vuelve a crear la política de cada tabla.

do $$
declare
  t text;
begin
  foreach t in array array[
    'alergias', 'alertas', 'citas', 'comidas_programadas', 'condiciones', 'direcciones',
    'duenos', 'envios', 'eventos', 'habitos', 'horarios_toma', 'mascotas', 'metodos_pago',
    'pedido_items', 'pedidos', 'planes_alimentacion', 'preferencias_notificacion',
    'productos', 'soportes', 'tomas', 'tratamientos', 'veterinarias'
  ]
  loop
    execute format('grant select, insert, update, delete on public.%I to anon, authenticated', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "acceso_abierto" on public.%I', t);
    execute format(
      'create policy "acceso_abierto" on public.%I for all to anon, authenticated using (true) with check (true)',
      t
    );
  end loop;
end $$;
