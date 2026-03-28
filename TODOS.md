# TODOS


## Dashboard

### Wire up newsletter subscribe button

**What:** Add a backend handler for the newsletter email form on the dashboard page.

**Why:** The dashboard has a "Join our newsletter" form with an email input and Subscribe button, but clicking Subscribe does nothing. Users will expect it to work.

**Context:** The UI is in src/app/dashboard/page.tsx (lines 241-256). Options: save to a Newsletter model in the DB, integrate with a mailing service (Mailchimp, Resend, etc.), or remove the form until ready.

**Effort:** S
**Priority:** P3
**Depends on:** None


## Activation Loop

### ~~Email notifications (entry summary)~~

**Completed:** 2026-03-28 (feat/playbill-picks)
Resend integrated in cron. Sends "Entered N lotteries today" email after each successful EntryRun. Idempotency-Key header: `{userId}-{utcDate}`. Skips when showsEntered.length === 0. Email errors caught inline and counted in response (`emailSent`, `emailFailed`) without failing the cron.

### ~~Dashboard entry timeline — empty state polish~~

**SUPERSEDED** by the unified activation flow. The setup wizard completion screen (step 4) and the dashboard's progressive empty state now show "First entries in Xh Ym" with a show list, replacing the need for a separate empty-state polish task.

### Dashboard stats: fix N+1 query pattern

**What:** Consolidate the 3 separate DB queries in `GET /api/dashboard` (totalRuns count, totalShows findMany, streak findMany) into a single aggregated query or fewer round trips.

**Why:** The `totalShows` query loads all historical `EntryRun` records to count entries. At 365 days × N users, this degrades linearly. Not a problem at beta scale, but worth fixing before launch.

**Context:** `src/app/api/dashboard/route.ts`. The `totalEntries` count can be maintained as a running total on the User model (updated after each cron run), eliminating the full scan.

**Effort:** S
**Priority:** P2
**Depends on:** None

## Shows

### Show Watchlist / Playbill Picks

**What:** Let users browse upcoming Broadway shows and star specific shows. The cron only enters lotteries for starred shows.

**Why:** Genre-level filtering is coarse. Users who care about specific shows (Hamilton, Hadestown) want precise control. This is more intuitive than "enter all musicals" and enables better notifications: "Hamilton lottery is open — entering you now."

**Context:** Requires a Show data model, a show data source (Playbill RSS/API or manual list), and a show browser UI in the dashboard. The `feat/playbill-picks` branch is the starting point. Once built, the User.genres[] column becomes redundant. Schema: `Show { id, title, genre, lotteryPlatform, nextLotteryDate }`, `UserShow { userId, showId }`.

**Effort:** L
**Priority:** P2
**Depends on:** None

## Infrastructure

### Add DB unique constraint for cron idempotency

**What:** Add a `@@unique([userId, utcDate])` constraint (or equivalent) to the `EntryRun` model so the DB itself enforces one run per user per day, rather than relying on the application-level `findFirst` check.

**Why:** The current check-then-insert in the cron has a race condition window: two concurrent cron invocations could both pass the check and create duplicate EntryRuns. A DB constraint makes it impossible at the data layer.

**Context:** `prisma/schema.prisma`. Add a `utcDate String` computed column (YYYY-MM-DD from `runAt`) and `@@unique([userId, utcDate])`. Requires a Prisma migration. The application-level `findFirst` guard can remain as a cheap early exit that avoids the Notte API call; the DB constraint is the safety net.

**Effort:** S (human: ~2h / CC: ~10 min)
**Priority:** P2
**Depends on:** None

### Cron failure notification email

**What:** Send an alert email to the admin (or the affected user) when a cron run fails for a user — i.e., `EntryRun` is created with `status: "FAILED"`.

**Why:** Currently, cron failures are silent. A user's credentials could expire or the Notte API could go down, and nobody knows. Users would just stop getting entries with no explanation.

**Context:** Can reuse the Resend client already integrated in `src/app/api/cron/route.ts`. On failure, send to admin address (env var `ADMIN_EMAIL`) with userId, error message, and timestamp. Consider rate-limiting to one alert per user per day to avoid alert storms.

**Effort:** S (human: ~2h / CC: ~10 min)
**Priority:** P1
**Depends on:** Resend integration (completed 2026-03-28)

### Post-launch monitoring checklist

**What:** Set up the minimum viable observability stack for launch: Vercel Analytics, error alerting, and a weekly cron health digest.

**Why:** Without monitoring, the first sign of a production problem is an angry user. The cron runs silently — we need to know it's running and succeeding before users ask.

**Context:** Three pieces: (1) Enable Vercel Analytics for page views / Web Vitals. (2) Add Sentry or similar for uncaught exceptions in API routes — especially the cron and webhook handlers. (3) Weekly digest: sum of `emailSent`, `emailFailed`, `success`, `failed` from cron logs, emailed to admin. The cron response already returns these counts; just need to persist and aggregate.

**Effort:** M (human: ~1 day / CC: ~30 min)
**Priority:** P1
**Depends on:** None

### Canceled subscription UX

**What:** When a user's subscription is canceled (webhook fires `customer.subscription.deleted`), show them a clear message on the dashboard explaining what happens next and offering a way to resubscribe.

**Why:** Currently, cancellation silently deactivates the account. Users land on the dashboard, see no entries, and have no path back. This is a retention failure — a clear "Your subscription ended. Resubscribe to continue." with a one-click resubscribe button recovers some of those users.

**Context:** `src/app/dashboard/page.tsx`. The dashboard API at `/api/dashboard` can check `subscription.status !== "ACTIVE"` and return a flag. If `subscriptionCanceled: true`, show a full-bleed banner or modal with resubscribe CTA pointing to `/pricing`. The `/api/billing-portal` route already handles Stripe portal sessions for active customers.

**Effort:** S (human: ~3h / CC: ~15 min)
**Priority:** P2
**Depends on:** None

### Redis rate limiting for credentials test endpoint

**What:** Replace the in-memory Map rate limit on POST /api/credentials/test with Upstash Redis, which persists across Vercel function instances.

**Why:** The in-memory Map resets on cold starts. A determined user could bypass the 3/min limit by triggering cold starts. Upstash persists state across all Vercel instances.

**Context:** The in-memory version ships in the activation loop plan (beta-appropriate). Pre-launch: `npm install @upstash/ratelimit @upstash/redis`, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars, and swap the Map in src/app/api/credentials/test/route.ts for `new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 m') })`.

**Effort:** S (human: ~2 hours / CC: ~10 min)
**Priority:** P2
**Depends on:** Credentials test endpoint (shipping in activation loop plan)

## Design

### Set Clerk app name to "Playbill Picks"

**What:** In Clerk Dashboard → Branding, change the application name from "My Application" to "Playbill Picks".

**Why:** The sign-in/sign-up pages show "Sign in to My Application" — the Clerk default. Users see this immediately on their first login.

**Context:** Not a code change — Clerk Dashboard setting only. Takes 2 minutes.

**Effort:** XS
**Priority:** P1
**Depends on:** None

## Dashboard

### ~~Re-add credential management to dashboard~~

**Completed:** 2026-03-28 (feat/playbill-picks)
Added `CredentialEditCard` component to dashboard. Shows current email, expand to edit form with show/hide toggle, verify-then-save flow using stateless `/api/credentials/test` endpoint.

## Completed

### Design review polish (feat/playbill-picks)
**Completed:** 2026-03-19
Replaced 3-column icon-in-circle feature grid with numbered list + product showcase card. Fixed footer/pricing/onboarding touch targets. Made onboarding selection state visible with accent border. Replaced `transition-all` with specific animated properties.

### Persist onboarding preferences
**Completed:** v0.1.1.0 (2026-03-18) — **REVERSED** in unified activation flow
Save genre selections, ticket count, and notification preferences via localStorage → POST /api/onboarding on dashboard mount. Schema: genres[], ticketCount, notificationPref added to User model. Cron filtering deferred to Show Watchlist.
Reversed: Onboarding removed entirely. genres/ticketCount/notificationPref columns dropped from User model. Genre filtering superseded by Show Watchlist feature.

### Add test suite
**Completed:** v0.1.1.0 (2026-03-18)
Bootstrapped Vitest with path alias. 5 tests for encryption roundtrip, random IV, missing key, byte-length key validation (regression for bug fix), and malformed ciphertext.
