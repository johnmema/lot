# Changelog

All notable changes to lot-notte are documented here.

Format: [MAJOR.MINOR.PATCH.MICRO] — Added / Changed / Fixed / Removed

---

## [0.1.2.0] - 2026-03-28

### Added
- **Resend email integration** — sends daily entry confirmation email after each successful cron run; includes show list, idempotency key (`userId-utcDate`), and inline error handling that never fails the cron
- **4-step setup wizard** (`/setup`) — replaces scattered onboarding: how-it-works → credentials (verify-then-save) → payment → completion with first-entry countdown
- **Credential edit card on dashboard** — inline verify-then-save form; calls `/api/credentials/test` with request body before writing to DB
- **Billing portal button** — `POST /api/billing-portal` integration on dashboard for subscription management
- **Share button** — `navigator.share` with clipboard fallback on dashboard
- **Countdown hook** (`useCountdown`) — live ticking countdown to 14:00 UTC with double-refresh (T+0 and T+5min) on cron run
- **`/api/billing-portal`** — new POST endpoint creating Stripe billing portal sessions

### Changed
- **Dashboard** — full redesign: stats row (entries/shows/streak), entry history timeline, progressive empty state with countdown and sample shows list, settings section with credential edit + billing
- **`/api/dashboard`** — fixed N+1: replaced `totalShows` full-scan with distinct set computation; fixed streak algorithm to deduplicate by UTC calendar day with today/yesterday edge case handling
- **`/api/credentials/test`** — refactored to accept body params (`lotteryEmail`/`lotteryPassword`) for stateless pre-save verification; falls back to DB credentials when no body params supplied
- **`/api/checkout`** — passes `customer_email` from Clerk to Stripe checkout session
- **`/api/billing-portal`** — wrapped Stripe portal creation in try/catch, returns 502 with user-facing message on failure
- **Cron idempotency** — checks UTC day boundaries (`gte startOfDay, lt endOfDay`) before entering; skips if `EntryRun` already exists for that user+day
- **Setup page copy** — "Instant win notifications" → "Daily entry confirmations"

### Fixed
- **`/api/credentials/route.ts`** — converted dynamic `import("@clerk/nextjs/server")` inside `if (!user)` block to static import at file top
- **Form inputs iOS zoom** — changed `text-sm` (14px) to `text-base` (16px) on all credential form inputs in dashboard and setup pages (prevents iOS auto-zoom on focus)
- **Cron auth bypass** — added `!process.env.CRON_SECRET` guard so `CRON_SECRET=undefined` no longer admits `Authorization: Bearer undefined` requests
- **Stripe webhook type safety** — replaced `session.customer as string` / `session.subscription as string` unsafe casts with proper `typeof` narrowing to handle expanded Stripe objects

### Removed
- **Onboarding preferences** (`genres`, `ticketCount`, `notificationPref` columns) — removed from User model; genre-level filtering superseded by Show Watchlist (deferred P2)
- **`/api/onboarding`** endpoint — removed with preference columns

---

## [0.1.1.0] - 2026-03-18

### Added
- **Onboarding preference persistence** — genre selections, ticket count, and notification preference saved to localStorage at end of onboarding step 3, then POSTed to `/api/onboarding` on dashboard mount after Clerk authentication completes
- **`POST /api/onboarding`** — new authenticated endpoint that upserts user preferences (genres, ticketCount, notificationPref) into the database
- **`POST /api/credentials/test`** — new endpoint to validate saved lottery credentials against the Notte API using `dry_run: true`; includes in-memory rate limiting (3 requests/min per user)
- **Vitest test framework** — bootstrapped with path alias; 5 tests covering encryption roundtrip, random IV uniqueness, missing key error, byte-length key validation, and malformed ciphertext error
- **Prisma schema columns** — `genres String[]`, `ticketCount Int?`, `notificationPref String?` added to User model for onboarding preferences

### Changed
- **Dashboard** — reads localStorage after Clerk hydrates and fires onboarding preference sync; clears localStorage only on successful POST
- **Dashboard** — replaced silent fetch error with a friendly error card visible to the user
- **Dashboard** — changed hardcoded "9am ET tomorrow" cron copy to "scheduled for tomorrow"
- **Vercel cron function** — `maxDuration` set to 300s (was default 10s, insufficient for 60s-per-user Notte calls)

### Fixed
- **Encryption key validation** — `ENCRYPTION_KEY` is now validated by byte length (`Buffer.byteLength`) rather than character length, preventing silently broken keys for non-ASCII inputs
