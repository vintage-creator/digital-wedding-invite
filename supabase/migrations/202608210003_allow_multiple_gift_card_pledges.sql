-- The couple requested removing the physical gift list and leaving only
-- account details plus a gift-card option.
--
-- Physical gifts should stay one-reservation-per-item if reintroduced later,
-- but gift cards/vouchers should allow multiple guests to pledge.

begin;

alter table public.gift_reservations
drop constraint if exists gift_reservations_gift_id_key;

drop index if exists public.gift_reservations_gift_id_key;
drop index if exists public.gift_reservations_unique_physical_gift_idx;

create unique index gift_reservations_unique_physical_gift_idx
on public.gift_reservations (gift_id)
where gift_id not in ('gift-card-voucher', 'gift-cards');

commit;
