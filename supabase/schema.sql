-- Brawl Stars Coach - Supabase schema
-- Ejecuta este script en el SQL Editor de Supabase.

create extension if not exists pgcrypto;

-- Perfiles de usuario (extiende auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  favorite_brawler text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Progreso por lección
create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  score numeric(5,2),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- Intentos de pruebas/quizzes
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id text not null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Estadísticas personales del jugador (opcional, ingresadas por el usuario)
create table if not exists public.user_brawler_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brawler text not null,
  mode text,
  map_name text,
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  trophies integer,
  notes text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Índices útiles
create index if not exists course_progress_user_idx on public.course_progress(user_id);
create index if not exists quiz_attempts_user_idx on public.quiz_attempts(user_id, created_at desc);
create index if not exists user_brawler_stats_user_idx on public.user_brawler_stats(user_id, updated_at desc);

-- Timestamp updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_course_progress_updated_at on public.course_progress;
create trigger set_course_progress_updated_at
before update on public.course_progress
for each row execute function public.set_updated_at();

drop trigger if exists set_user_brawler_stats_updated_at on public.user_brawler_stats;
create trigger set_user_brawler_stats_updated_at
before update on public.user_brawler_stats
for each row execute function public.set_updated_at();

-- Crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.course_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.user_brawler_stats enable row level security;

-- Profiles: cada usuario ve/edita su perfil
drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles for insert
with check (auth.uid() = id);

-- Course progress
drop policy if exists "Course progress owner select" on public.course_progress;
create policy "Course progress owner select"
on public.course_progress for select
using (auth.uid() = user_id);

drop policy if exists "Course progress owner insert" on public.course_progress;
create policy "Course progress owner insert"
on public.course_progress for insert
with check (auth.uid() = user_id);

drop policy if exists "Course progress owner update" on public.course_progress;
create policy "Course progress owner update"
on public.course_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Course progress owner delete" on public.course_progress;
create policy "Course progress owner delete"
on public.course_progress for delete
using (auth.uid() = user_id);

-- Quiz attempts
drop policy if exists "Quiz attempts owner select" on public.quiz_attempts;
create policy "Quiz attempts owner select"
on public.quiz_attempts for select
using (auth.uid() = user_id);

drop policy if exists "Quiz attempts owner insert" on public.quiz_attempts;
create policy "Quiz attempts owner insert"
on public.quiz_attempts for insert
with check (auth.uid() = user_id);

-- User brawler stats
drop policy if exists "Brawler stats owner select" on public.user_brawler_stats;
create policy "Brawler stats owner select"
on public.user_brawler_stats for select
using (auth.uid() = user_id);

drop policy if exists "Brawler stats owner insert" on public.user_brawler_stats;
create policy "Brawler stats owner insert"
on public.user_brawler_stats for insert
with check (auth.uid() = user_id);

drop policy if exists "Brawler stats owner update" on public.user_brawler_stats;
create policy "Brawler stats owner update"
on public.user_brawler_stats for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Brawler stats owner delete" on public.user_brawler_stats;
create policy "Brawler stats owner delete"
on public.user_brawler_stats for delete
using (auth.uid() = user_id);
