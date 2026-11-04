-- Balto · Políticas de escritura (Row Level Security)
-- Acción del MVP: E · Registrar evento -> escribe en la tabla `eventos`.
-- Registrar un evento no descuenta stock ni cupos, así que no se toca otra tabla.

-- Sin RLS activado, las políticas no se aplican.
alter table public.eventos enable row level security;

-- Cualquiera (visitante anónimo o usuario con sesión) puede insertar eventos.
drop policy if exists "eventos_insertar_cualquiera" on public.eventos;
create policy "eventos_insertar_cualquiera"
  on public.eventos
  for insert
  to anon, authenticated
  with check (true);
