-- Deborah & Tom wedding invite persistence schema.
-- Run this against the new Supabase project before launching the site.
--
-- What this creates:
-- 1. RSVP records
-- 2. Gift reservation / pledge tracking
-- 3. Guest photo metadata
-- 4. Public guest-photo storage bucket
-- 5. Admin-only access foundation for a future couple dashboard

begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Couple/admin users are managed with Supabase Auth.
-- Do not use the public invitation code as the dashboard password; frontend env
-- values are visible to guests. Add the couple's auth user id here after creating
-- their account in Supabase Auth.
create table if not exists public.couple_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Couple Admin',
  role text not null default 'owner' check (role in ('owner', 'planner', 'viewer')),
  created_at timestamptz not null default now()
);

alter table public.couple_admins enable row level security;

create or replace function public.is_couple_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.couple_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_couple_admin() from public;
grant execute on function public.is_couple_admin() to authenticated;

drop policy if exists "Couple admins can view admin accounts" on public.couple_admins;
create policy "Couple admins can view admin accounts"
on public.couple_admins
for select
to authenticated
using (public.is_couple_admin());

-- RSVP submissions from guests.
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 1 and 180),
  phone text not null check (char_length(trim(phone)) between 5 and 40),
  email text,
  attendance text not null default 'both'
    check (attendance in ('both', 'traditional', 'white', 'decline')),
  guest_count integer not null default 1 check (guest_count between 0 and 20),
  message text,
  source text not null default 'website',
  whatsapp_link_opened boolean not null default false,
  status text not null default 'new'
    check (status in ('new', 'seen', 'confirmed', 'needs_follow_up', 'archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rsvps_created_at_idx on public.rsvps (created_at desc);
create index if not exists rsvps_attendance_idx on public.rsvps (attendance);
create index if not exists rsvps_status_idx on public.rsvps (status);

drop trigger if exists set_rsvps_updated_at on public.rsvps;
create trigger set_rsvps_updated_at
before update on public.rsvps
for each row execute function public.set_updated_at();

alter table public.rsvps enable row level security;

drop policy if exists "Guests can submit RSVPs" on public.rsvps;
create policy "Guests can submit RSVPs"
on public.rsvps
for insert
to anon, authenticated
with check (true);

drop policy if exists "Couple admins can read RSVPs" on public.rsvps;
create policy "Couple admins can read RSVPs"
on public.rsvps
for select
to authenticated
using (public.is_couple_admin());

drop policy if exists "Couple admins can update RSVPs" on public.rsvps;
create policy "Couple admins can update RSVPs"
on public.rsvps
for update
to authenticated
using (public.is_couple_admin())
with check (public.is_couple_admin());

drop policy if exists "Couple admins can delete RSVPs" on public.rsvps;
create policy "Couple admins can delete RSVPs"
on public.rsvps
for delete
to authenticated
using (public.is_couple_admin());

grant insert on table public.rsvps to anon;
grant select, insert, update, delete on table public.rsvps to authenticated;

-- Gift reservations. gift_id is unique so two guests cannot reserve the same gift.
create table if not exists public.gift_reservations (
  id uuid primary key default gen_random_uuid(),
  gift_id text not null unique,
  gift_title text not null,
  giver_name text not null check (char_length(trim(giver_name)) between 1 and 180),
  contact_no text not null check (char_length(trim(contact_no)) between 5 and 40),
  status text not null default 'reserved'
    check (status in ('reserved', 'contacted', 'fulfilled', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gift_reservations_created_at_idx on public.gift_reservations (created_at desc);
create index if not exists gift_reservations_status_idx on public.gift_reservations (status);

drop trigger if exists set_gift_reservations_updated_at on public.gift_reservations;
create trigger set_gift_reservations_updated_at
before update on public.gift_reservations
for each row execute function public.set_updated_at();

alter table public.gift_reservations enable row level security;

drop policy if exists "Guests can reserve available gifts" on public.gift_reservations;
create policy "Guests can reserve available gifts"
on public.gift_reservations
for insert
to anon, authenticated
with check (status = 'reserved');

drop policy if exists "Couple admins can read gift reservations" on public.gift_reservations;
create policy "Couple admins can read gift reservations"
on public.gift_reservations
for select
to authenticated
using (public.is_couple_admin());

drop policy if exists "Couple admins can update gift reservations" on public.gift_reservations;
create policy "Couple admins can update gift reservations"
on public.gift_reservations
for update
to authenticated
using (public.is_couple_admin())
with check (public.is_couple_admin());

drop policy if exists "Couple admins can delete gift reservations" on public.gift_reservations;
create policy "Couple admins can delete gift reservations"
on public.gift_reservations
for delete
to authenticated
using (public.is_couple_admin());

-- Public view intentionally hides contact_no and admin notes.
create or replace view public.public_gift_reservations
with (security_invoker = false)
as
select gift_id, gift_title, giver_name, created_at
from public.gift_reservations
where status in ('reserved', 'contacted', 'fulfilled');

grant insert on table public.gift_reservations to anon;
grant select on public.public_gift_reservations to anon, authenticated;
grant select, insert, update, delete on table public.gift_reservations to authenticated;

-- Guest photo gallery metadata.
create table if not exists public.guest_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  uploader_name text not null check (char_length(trim(uploader_name)) between 1 and 180),
  caption text not null default '',
  event_type text not null default 'general'
    check (event_type in ('traditional', 'white', 'general')),
  status text not null default 'published'
    check (status in ('published', 'hidden', 'flagged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guest_photos_created_at_idx on public.guest_photos (created_at desc);
create index if not exists guest_photos_event_type_idx on public.guest_photos (event_type);
create index if not exists guest_photos_status_idx on public.guest_photos (status);

drop trigger if exists set_guest_photos_updated_at on public.guest_photos;
create trigger set_guest_photos_updated_at
before update on public.guest_photos
for each row execute function public.set_updated_at();

alter table public.guest_photos enable row level security;

drop policy if exists "Guests can view published photos" on public.guest_photos;
create policy "Guests can view published photos"
on public.guest_photos
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Guests can add photo metadata" on public.guest_photos;
create policy "Guests can add photo metadata"
on public.guest_photos
for insert
to anon, authenticated
with check (status = 'published');

drop policy if exists "Couple admins can manage guest photos" on public.guest_photos;
create policy "Couple admins can manage guest photos"
on public.guest_photos
for all
to authenticated
using (public.is_couple_admin())
with check (public.is_couple_admin());

grant select, insert on table public.guest_photos to anon;
grant select, insert, update, delete on table public.guest_photos to authenticated;

-- Dashboard-friendly aggregate view. It is protected by the same admin RLS
-- rules as the source tables because security_invoker is enabled.
create or replace view public.dashboard_wedding_stats
with (security_invoker = true)
as
select
  (select count(*)::integer from public.rsvps where attendance <> 'decline') as attending_rsvp_count,
  (select coalesce(sum(guest_count), 0)::integer from public.rsvps where attendance <> 'decline') as expected_guest_count,
  (select count(*)::integer from public.rsvps where attendance = 'decline') as declined_rsvp_count,
  (select count(*)::integer from public.gift_reservations where status in ('reserved', 'contacted', 'fulfilled')) as reserved_gift_count,
  (select count(*)::integer from public.guest_photos where status = 'published') as published_photo_count;

grant select on public.dashboard_wedding_stats to authenticated;

-- Public storage bucket for uploaded guest photos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wedding-guest-photos',
  'wedding-guest-photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Guests can upload wedding photos" on storage.objects;
create policy "Guests can upload wedding photos"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'wedding-guest-photos'
  and (storage.foldername(name))[1] = 'uploads'
);

drop policy if exists "Anyone can view wedding photos" on storage.objects;
create policy "Anyone can view wedding photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'wedding-guest-photos');

drop policy if exists "Couple admins can update wedding photos" on storage.objects;
create policy "Couple admins can update wedding photos"
on storage.objects
for update
to authenticated
using (bucket_id = 'wedding-guest-photos' and public.is_couple_admin())
with check (bucket_id = 'wedding-guest-photos' and public.is_couple_admin());

drop policy if exists "Couple admins can delete wedding photos" on storage.objects;
create policy "Couple admins can delete wedding photos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'wedding-guest-photos' and public.is_couple_admin());

commit;
