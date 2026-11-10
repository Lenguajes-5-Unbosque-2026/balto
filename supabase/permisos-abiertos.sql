-- Balto · Permisos abiertos para las 22 tablas (prototipo).
--
-- La app lee y escribe con la llave pública (anon) y todavía no tiene inicio de
-- sesión real, así que cualquiera con la app puede leer, crear, cambiar y borrar
-- filas de estas tablas. Usar solo con datos de prueba: nunca datos personales
-- reales ni números de tarjeta (metodos_pago guarda solo franquicia y últimos 4).
-- Cuando llegue Supabase Auth, estas políticas se reemplazan por unas por dueño.
--
-- Se puede correr más de una vez: borra y vuelve a crear la política de cada tabla.
--
-- También deja opcionales (sin NOT NULL) todas las columnas menos la llave
-- primaria. Al importar los CSV, Supabase marcó como obligatoria cada columna
-- que nunca venía vacía, pero la app deja varias vacías a propósito (la alerta
-- recién creada, el alimento que no es de una mascota, el medicamento sin
-- evento…). Las reglas de qué es obligatorio las aplica la app.

do $$
declare
  t text;
  c record;
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

    for c in
      select col.column_name
      from information_schema.columns col
      where col.table_schema = 'public'
        and col.table_name = t
        and col.is_nullable = 'NO'
        and col.column_name not in (
          select kcu.column_name
          from information_schema.table_constraints tc
          join information_schema.key_column_usage kcu
            on kcu.constraint_name = tc.constraint_name and kcu.table_schema = tc.table_schema
          where tc.table_schema = 'public' and tc.table_name = t and tc.constraint_type = 'PRIMARY KEY'
        )
    loop
      execute format('alter table public.%I alter column %I drop not null', t, c.column_name);
    end loop;
  end loop;
end $$;
