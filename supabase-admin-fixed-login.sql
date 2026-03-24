create extension if not exists pgcrypto;

create table if not exists public.admin_credentials (
  id smallint primary key default 1 check (id = 1),
  email text not null unique,
  password_hash text not null,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.admin_credentials enable row level security;

revoke all on public.admin_credentials from anon, authenticated, public;

create or replace function public.verify_admin_login(login_email text, login_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.admin_credentials
    where lower(email) = lower(login_email)
      and password_hash = crypt(login_password, password_hash)
  );
end;
$$;

revoke all on function public.verify_admin_login(text, text) from public;
grant execute on function public.verify_admin_login(text, text) to anon, authenticated;

insert into public.admin_credentials (id, email, password_hash)
values (
  1,
  'admin@example.com',
  crypt('ChangeThisPassword123!', gen_salt('bf'))
)
on conflict (id) do update
set email = excluded.email,
    password_hash = excluded.password_hash,
    updated_at = timezone('utc'::text, now());
