# TODOS

## Onboarding

### Persist onboarding preferences

**What:** Save genre selections, ticket count, and notification preferences to the database and use them to filter lottery entries in the cron job.

**Why:** Users currently go through a 3-step onboarding flow that collects their preferences, but the data is lost on navigation. The cron job enters all lotteries for all users regardless. Persisting preferences enables personalized lottery entry.

**Context:** The onboarding UI is complete (src/app/onboarding/page.tsx). Needs: new columns on the User model (genres, ticketCount, notificationPref), an API endpoint to save preferences after sign-up, and cron job filtering logic. The onboarding page currently navigates to /sign-up which loses React state — may need to save to localStorage or pass via query params, then persist after user creation.

**Effort:** M
**Priority:** P2
**Depends on:** None

## Dashboard

### Wire up newsletter subscribe button

**What:** Add a backend handler for the newsletter email form on the dashboard page.

**Why:** The dashboard has a "Join our newsletter" form with an email input and Subscribe button, but clicking Subscribe does nothing. Users will expect it to work.

**Context:** The UI is in src/app/dashboard/page.tsx (lines 241-256). Options: save to a Newsletter model in the DB, integrate with a mailing service (Mailchimp, Resend, etc.), or remove the form until ready.

**Effort:** S
**Priority:** P3
**Depends on:** None

## Testing

### Add test suite

**What:** Bootstrap a test framework (Vitest) and write tests for critical paths: encryption roundtrip, API auth guards, Stripe webhook handling, cron job logic.

**Why:** The app handles user credentials (encrypted passwords) and payments (Stripe). Zero tests means zero confidence that security-critical code works correctly. Eng review identified 30 untested code paths.

**Context:** No test framework exists yet. Recommended: Vitest + @testing-library/react. Priority test targets: src/lib/encryption.ts (roundtrip, key validation), src/app/api/cron/route.ts (auth, batch processing, error handling), src/app/api/webhooks/stripe/route.ts (all 4 event types), src/app/api/credentials/route.ts (auth, validation, upsert).

**Effort:** M
**Priority:** P1
**Depends on:** None

## Completed
