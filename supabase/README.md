# Supabase setup for the wedding invite

Run the migration in:

`supabase/migrations/202608210001_wedding_persistence.sql`

Then run:

`supabase/migrations/202608210002_dashboard_passcode_rpc.sql`

Then run:

`supabase/migrations/202608210003_allow_multiple_gift_card_pledges.sql`

Then run:

`supabase/migrations/202608210004_require_phone_contacts.sql`

It creates the application tables, row-level security policies, public views, and the required storage bucket.

## Storage bucket to create

The migration creates this bucket automatically:

- `wedding-guest-photos`
  - Public bucket: `true`
  - Max file size: `10 MB`
  - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
  - Upload path used by the app: `uploads/{year}/{uuid}.{ext}`

## Tables created

- `rsvps`: guest RSVP details, attendance selection, guest count, message, and WhatsApp fallback marker.
- `gift_reservations`: tracks gift-card/voucher pledges now. If physical gifts return later, physical `gift_id`s stay unique, but `gift-card-voucher` allows multiple pledges.
- `guest_photos`: metadata for uploaded images. The image file itself lives in the `wedding-guest-photos` bucket.
- `couple_admins`: maps Supabase Auth users to dashboard/admin access.
- `dashboard_wedding_stats`: authenticated couple-admin metrics view for RSVP, gift, and gallery counts.
- `dashboard_passcodes`: stores the hashed dashboard password for the no-login couple dashboard.

RSVP phone numbers and gift pledge phone/WhatsApp contacts are required for new records so the couple can track and follow up from the dashboard.

## Couple dashboard security

The dashboard does not require Supabase login. The couple can enter their dashboard password in the same field guests use for the invitation code.

Do not store the dashboard password in `.env` or React. Set it inside Supabase with this SQL:

```sql
insert into public.dashboard_passcodes (id, passcode_hash)
values ('couple', extensions.crypt('CHANGE_THIS_TO_THE_REAL_DASHBOARD_PASSWORD', extensions.gen_salt('bf')))
on conflict (id) do update
set passcode_hash = excluded.passcode_hash,
    updated_at = now();
```

Replace `CHANGE_THIS_TO_THE_REAL_DASHBOARD_PASSWORD` with the actual password the couple wants to use.

The browser sends the entered password to Supabase over HTTPS. Supabase checks it against the hash and only returns dashboard data when it matches.
