-- Balto · Mueve 14 días las fechas de los datos (27 oct → 10 nov 2026).
--
-- El "hoy" de la app (HOY en web/src/lib/fecha.ts) pasó del 27 oct al 10 nov
-- de 2026. Para que las alertas, tomas, citas y pesos se vean igual que en el
-- diseño ("vence en 2 días", "vencida hace 3 días"…), todas las fechas se mueven
-- los mismos 14 días. No se mueven las fechas de nacimiento ni version_terminos.
-- Lo mismo se hizo en los CSV de data/mock/.
--
-- Solo se puede correr UNA vez: revisa la vacuna e01 (12 sep 2025 antes de
-- mover) y, si ya se movió, no hace nada.

do $$
declare
  cambio record;
  tipo text;
begin
  if (select left(fecha::text, 10) from public.eventos where id = 'e01') <> '2025-09-12' then
    raise notice 'Las fechas ya se habían movido: no se cambió nada.';
    return;
  end if;

  for cambio in
    select * from (values
      ('alertas', 'fecha_vencimiento'), ('alertas', 'fecha_aviso'), ('alertas', 'fecha_aviso_pospuesto'), ('alertas', 'fecha_resuelta'),
      ('citas', 'fecha_hora'),
      ('condiciones', 'fecha_diagnostico'),
      ('duenos', 'fecha_registro'), ('duenos', 'fecha_aceptacion_terminos'),
      ('envios', 'desde'), ('envios', 'hasta'), ('envios', 'expira_en'), ('envios', 'fecha'),
      ('eventos', 'fecha'), ('eventos', 'proximo_refuerzo'), ('eventos', 'proxima_dosis'), ('eventos', 'proximo_control'),
      ('eventos', 'fecha_creacion'), ('eventos', 'eliminado_en'),
      ('habitos', 'fecha'),
      ('mascotas', 'fecha_emision_cedula'), ('mascotas', 'fecha_registro'),
      ('pedidos', 'fecha'),
      ('planes_alimentacion', 'fecha_bolsa_abierta'),
      ('soportes', 'fecha_subida'),
      ('tomas', 'fecha_hora_programada'), ('tomas', 'hora_real'), ('tomas', 'aviso_reprogramado'),
      ('tratamientos', 'fecha_inicio'), ('tratamientos', 'fecha_fin')
    ) as c(tabla, columna)
  loop
    select data_type into tipo
    from information_schema.columns
    where table_schema = 'public' and table_name = cambio.tabla and column_name = cambio.columna;

    if tipo is null then
      raise notice 'No existe %.%: se salta.', cambio.tabla, cambio.columna;
    elsif tipo in ('date', 'timestamp with time zone', 'timestamp without time zone') then
      execute format('update public.%I set %I = %I + interval ''14 days'' where %I is not null',
        cambio.tabla, cambio.columna, cambio.columna, cambio.columna);
    else
      -- Columna de texto con "2026-09-12" o "2026-09-12 10:00": se mueve la fecha y se deja el resto.
      execute format(
        'update public.%I set %I = to_char(left(%I, 10)::date + 14, ''YYYY-MM-DD'') || substr(%I, 11) where %I ~ ''^\d{4}-\d{2}-\d{2}''',
        cambio.tabla, cambio.columna, cambio.columna, cambio.columna, cambio.columna);
    end if;
  end loop;

  raise notice 'Listo: fechas movidas 14 días.';
end $$;
