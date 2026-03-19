# Changelog

All notable changes to lot-notte are documented here.

Format: [MAJOR.MINOR.PATCH.MICRO] — Added / Changed / Fixed / Removed

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
