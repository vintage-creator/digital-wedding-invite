-- Require phone/WhatsApp contact details for new RSVP and gift-card pledge records.
--
-- These constraints are NOT VALID so existing rows without phone numbers do not
-- block the migration, but all new/updated records must include usable contact
-- details going forward.

begin;

alter table public.rsvps
drop constraint if exists rsvps_phone_required_chk;

alter table public.rsvps
add constraint rsvps_phone_required_chk
check (phone is not null and char_length(trim(phone)) between 5 and 40)
not valid;

alter table public.gift_reservations
drop constraint if exists gift_reservations_contact_required_chk;

alter table public.gift_reservations
add constraint gift_reservations_contact_required_chk
check (contact_no is not null and char_length(trim(contact_no)) between 5 and 40)
not valid;

commit;
