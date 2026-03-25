create table if not exists public.admin_credentials (
  id smallint primary key default 1 check (id = 1),
  email text not null unique,
  password_hash text not null,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.admin_credentials enable row level security;

revoke all on public.admin_credentials from anon, authenticated, public;

insert into public.admin_credentials (id, email, password_hash)
values (
  1,
  'admin@admin.com',
  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
)
on conflict (id) do update
set email = excluded.email,
    password_hash = excluded.password_hash,
    updated_at = timezone('utc'::text, now());
