-- Multi-tenant wedding partitioning migration
-- Enables separate RSVP, gift pledge, photo wall, and dashboard tracking per wedding.

begin;

-- 1. Add wedding_slug column to rsvps, gift_reservations, guest_photos, and dashboard_passcodes
alter table public.rsvps 
add column if not exists wedding_slug text not null default 'deborah-tom';

alter table public.gift_reservations 
add column if not exists wedding_slug text not null default 'deborah-tom';

alter table public.guest_photos 
add column if not exists wedding_slug text not null default 'deborah-tom';

alter table public.dashboard_passcodes 
add column if not exists wedding_slug text not null default 'deborah-tom';

-- Index for fast filtered lookups
create index if not exists rsvps_wedding_slug_idx on public.rsvps (wedding_slug);
create index if not exists gift_reservations_wedding_slug_idx on public.gift_reservations (wedding_slug);
create index if not exists guest_photos_wedding_slug_idx on public.guest_photos (wedding_slug);

-- Ensure existing couple passcode maps to deborah-tom
update public.dashboard_passcodes 
set wedding_slug = 'deborah-tom' 
where id = 'couple';

-- Insert default passcode for Opeyemi & Temilayojesu (passcode: OT2026)
insert into public.dashboard_passcodes (id, wedding_slug, passcode_hash)
values ('opeyemi-temilayojesu', 'opeyemi-temilayojesu', extensions.crypt('OT2026', extensions.gen_salt('bf')))
on conflict (id) do update
set wedding_slug = excluded.wedding_slug,
    passcode_hash = excluded.passcode_hash,
    updated_at = now();

-- 2. Update public_gift_reservations view to include wedding_slug
drop view if exists public.public_gift_reservations;
create view public.public_gift_reservations as
select id, gift_id, gift_title, giver_name, wedding_slug, created_at
from public.gift_reservations
where status in ('reserved', 'contacted', 'fulfilled');

grant select on public.public_gift_reservations to anon, authenticated;

-- 3. Resolve wedding_slug from entered passcode
create or replace function public.get_wedding_slug_for_passcode(passcode text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select wedding_slug
  from public.dashboard_passcodes
  where passcode is not null
    and length(trim(passcode)) > 0
    and extensions.crypt(passcode, passcode_hash) = passcode_hash
  limit 1;
$$;

revoke all on function public.get_wedding_slug_for_passcode(text) from public;
grant execute on function public.get_wedding_slug_for_passcode(text) to anon, authenticated;

-- 4. Verify whether any dashboard passcode matches
create or replace function public.is_valid_dashboard_passcode(passcode text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.dashboard_passcodes
    where passcode is not null
      and length(trim(passcode)) > 0
      and extensions.crypt(passcode, passcode_hash) = passcode_hash
  );
$$;

revoke all on function public.is_valid_dashboard_passcode(text) from public;
grant execute on function public.is_valid_dashboard_passcode(text) to anon, authenticated;

-- 5. Return dashboard data filtered STRICTLY by that couple's wedding_slug
create or replace function public.get_couple_dashboard(passcode text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_slug text;
begin
  v_slug := public.get_wedding_slug_for_passcode(passcode);
  if v_slug is null then
    raise exception 'Invalid dashboard password' using errcode = '28000';
  end if;

  return jsonb_build_object(
    'stats', jsonb_build_object(
      'total_rsvps', (select count(*) from public.rsvps where wedding_slug = v_slug),
      'attending_rsvps', (select count(*) from public.rsvps where wedding_slug = v_slug and attendance <> 'decline'),
      'expected_guests', (select coalesce(sum(guest_count), 0) from public.rsvps where wedding_slug = v_slug and attendance <> 'decline'),
      'declined_rsvps', (select count(*) from public.rsvps where wedding_slug = v_slug and attendance = 'decline'),
      'reserved_gifts', (select count(*) from public.gift_reservations where wedding_slug = v_slug and status in ('reserved', 'contacted', 'fulfilled')),
      'uploaded_photos', (select count(*) from public.guest_photos where wedding_slug = v_slug and status = 'published')
    ),
    'rsvps', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.created_at desc)
      from (
        select
          id,
          full_name,
          phone,
          email,
          attendance,
          guest_count,
          message,
          whatsapp_link_opened,
          status,
          notes,
          created_at
        from public.rsvps
        where wedding_slug = v_slug
        order by created_at desc
        limit 200
      ) row_data
    ), '[]'::jsonb),
    'gift_reservations', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.created_at desc)
      from (
        select
          id,
          gift_id,
          gift_title,
          giver_name,
          contact_no,
          status,
          notes,
          created_at
        from public.gift_reservations
        where wedding_slug = v_slug
        order by created_at desc
        limit 200
      ) row_data
    ), '[]'::jsonb),
    'guest_photos', coalesce((
      select jsonb_agg(to_jsonb(row_data) order by row_data.created_at desc)
      from (
        select
          id,
          storage_path,
          public_url,
          uploader_name,
          caption,
          event_type,
          status,
          created_at
        from public.guest_photos
        where wedding_slug = v_slug
        order by created_at desc
        limit 200
      ) row_data
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_couple_dashboard(text) from public;
grant execute on function public.get_couple_dashboard(text) to anon, authenticated;

-- 6. Partitioned updates for RSVP status
create or replace function public.update_dashboard_rsvp_status(passcode text, rsvp_id uuid, next_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_record public.rsvps;
begin
  v_slug := public.get_wedding_slug_for_passcode(passcode);
  if v_slug is null then
    raise exception 'Invalid dashboard password' using errcode = '28000';
  end if;

  update public.rsvps
  set status = next_status
  where id = rsvp_id and wedding_slug = v_slug
  returning * into v_record;

  if not found then
    raise exception 'RSVP record not found' using errcode = 'P0002';
  end if;

  return to_jsonb(v_record);
end;
$$;

revoke all on function public.update_dashboard_rsvp_status(text, uuid, text) from public;
grant execute on function public.update_dashboard_rsvp_status(text, uuid, text) to anon, authenticated;

-- 7. Partitioned updates for Gift Pledge status
create or replace function public.update_dashboard_gift_status(passcode text, reservation_id uuid, next_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_record public.gift_reservations;
begin
  v_slug := public.get_wedding_slug_for_passcode(passcode);
  if v_slug is null then
    raise exception 'Invalid dashboard password' using errcode = '28000';
  end if;

  update public.gift_reservations
  set status = next_status
  where id = reservation_id and wedding_slug = v_slug
  returning * into v_record;

  if not found then
    raise exception 'Gift pledge record not found' using errcode = 'P0002';
  end if;

  return to_jsonb(v_record);
end;
$$;

revoke all on function public.update_dashboard_gift_status(text, uuid, text) from public;
grant execute on function public.update_dashboard_gift_status(text, uuid, text) to anon, authenticated;

-- 8. Partitioned updates for Photo status
create or replace function public.update_dashboard_photo_status(passcode text, photo_id uuid, next_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_record public.guest_photos;
begin
  v_slug := public.get_wedding_slug_for_passcode(passcode);
  if v_slug is null then
    raise exception 'Invalid dashboard password' using errcode = '28000';
  end if;

  update public.guest_photos
  set status = next_status
  where id = photo_id and wedding_slug = v_slug
  returning * into v_record;

  if not found then
    raise exception 'Photo record not found' using errcode = 'P0002';
  end if;

  return to_jsonb(v_record);
end;
$$;

revoke all on function public.update_dashboard_photo_status(text, uuid, text) from public;
grant execute on function public.update_dashboard_photo_status(text, uuid, text) to anon, authenticated;

commit;
