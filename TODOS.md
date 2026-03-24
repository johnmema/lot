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

### Email notifications (entry summary)

**What:** Send a daily email to users after the cron runs: "We entered you in X lotteries today — Hamilton, Hadestown, Sweeney Todd."

**Why:** Without this, the product is invisible. Users have no confirmation that the automation is working, leading to churn during the silent window between sign-up and first cron run.

**Context:** Skipped for MVP (no email provider set up). When ready, use Resend (3k free/month, Next.js-native). The cron already writes `EntryRun` with `showsEntered[]` — trigger the email after `db.entryRun.create`. Also update the onboarding notification preference copy if "Results only" still can't be supported.

**Effort:** S
**Priority:** P1
**Depends on:** None

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

### Re-add credential management to dashboard

**What:** Add a card or section to the dashboard that lets users view and update their rush.telecharge.com credentials (email + password) after initial setup.

**Why:** The setup wizard collects credentials in step 2, but after setup completes there's no way to update them from the dashboard. If a user changes their Telecharge password, they're stuck — the cron will silently fail with bad credentials.

**Context:** The old dashboard had a `CredentialCard` component (removed in the unified activation flow PR). The existing `GET/POST /api/credentials` and `POST /api/credentials/test` endpoints still work. Re-use the form pattern from the setup wizard's credential step, adding an "Edit credentials" option to the dashboard right column.

**Effort:** S (human: ~3h / CC: ~15 min)
**Priority:** P2
**Depends on:** Unified activation flow (setup wizard)

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
