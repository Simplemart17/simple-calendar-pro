# SimpleCalendar

Project structure:
- `calendar-api`: Node.js 22 + Express 5 + Supabase/PostgreSQL backend
- `calendar-web`: Next.js 16 + React 19 frontend

## Run locally
1. Install dependencies:
   - `npm install --prefix calendar-api`
   - `npm install --prefix calendar-web`
2. Configure env files:
   - `calendar-api/.env` from `calendar-api/.env.example`
   - `calendar-web/.env.local` from `calendar-web/.env.local.example`
3. Start services:
   - API: `npm run dev:api`
   - Web: `npm run dev:web`

## Node version
- `.nvmrc` is pinned to Node `22`.

## Key endpoint implemented
- `POST /api/scheduling/bookings`
  - idempotency key support
  - slot conflict protection
  - Supabase persistence path
