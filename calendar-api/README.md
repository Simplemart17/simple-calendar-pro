# calendar-api

Express.js API for SimpleCalendar with Supabase/PostgreSQL persistence.

## Environment
Create `.env` from `.env.example`.

Required:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Recommended for backend privileged operations:
- `SUPABASE_SECRET_KEY`

Notes:
- Uses latest Supabase API key model (`publishable` / `secret`).
- Legacy `anon` / `service_role` key naming is intentionally not used.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`

## Implemented route
- `POST /api/scheduling/bookings`
  - requires `Idempotency-Key` header
  - checks active slot conflicts
  - persists idempotency responses
  - writes booking state audit event

## SQL bootstrap
Migration file:
- `../supabase/migrations/20260221063046_booking_core.sql`

Generate new migrations with Supabase CLI:
- `supabase migration new <name>`
