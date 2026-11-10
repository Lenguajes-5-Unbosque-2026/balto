-- Balto · Tabla `habitos` (I2 · Registrar hábito, I1 · Bitácora de hábitos).
-- Mismas columnas que data/mock/habitos.csv.

create table if not exists public.habitos (
  id           text primary key default gen_random_uuid()::text,
  mascota_id   text not null,
  tipo         text not null check (tipo in ('paseo', 'actividad', 'sueno', 'deposiciones')),
  fecha        date not null,
  duracion_min integer,
  consistencia text,
  observacion  text,
  imagen       text,
  creado_en    timestamptz not null default now()
);

alter table public.habitos enable row level security;

-- Cualquiera puede registrar un hábito.
drop policy if exists "habitos_insertar_cualquiera" on public.habitos;
create policy "habitos_insertar_cualquiera"
  on public.habitos for insert to anon, authenticated
  with check (true);

-- Cualquiera puede leer la bitácora (hace falta para verla en I1 tras guardar).
drop policy if exists "habitos_leer_cualquiera" on public.habitos;
create policy "habitos_leer_cualquiera"
  on public.habitos for select to anon, authenticated
  using (true);
