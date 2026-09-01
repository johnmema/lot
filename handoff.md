# Handoff: Unified Activation Flow — Post-Sign-In Redesign

**Date:** 2026-03-23
**Branch:** `feat/playbill-picks`
**Status:** Plan complete, implementation not started

---

## What Is This Project?

**Playbill Picks** (lot-notte) is a Broadway lottery automation service. Users sign up, connect their rush.telecharge.com account, subscribe for $9/mo, and the app automatically enters them in every Broadway show lottery every day via the Notte API. Built with Next.js 16, Clerk auth, Stripe payments, Prisma/Neon DB, and AES-256 credential encryption.

## What Problem Are We Solving?

The current post-sign-in user experience has three critical problems:

1. **The onboarding collects preferences nobody uses.** A 3-step onboarding (genres, ticket count, notification pref) runs before sign-up, but the cron job doesn't filter by genres — it enters ALL lotteries. Users answer questions that have no effect.

2. **The credential form is terrifyingly vague.** The dashboard says "Lottery site email" and "Lottery site password" with zero context. Users don't know this is for rush.telecharge.com specifically. Asking for a third-party password with no explanation kills trust and conversion.

3. **The flow is a series of disconnected gates.** After sign-up, the user lands on a dashboard that says "Subscribe $9/mo" (another barrier). After paying, they see a credential form with no explanation of what happens next. There's no guided onboarding — just scattered cards.

## What Was Decided (CEO Review)

A `/plan-ceo-review` was conducted on 2026-03-23 in SCOPE EXPANSION mode. All decisions were made interactively with the user. The full design doc lives at `docs/designs/unified-activation-flow.md`.

### The New Flow

```
OLD FLOW:
Landing → Onboarding (genres/tickets/notifs) → Sign Up (Clerk)
→ Dashboard ("Subscribe $9/mo") → Pricing → Stripe Checkout
→ Dashboard → "Lottery site email/password" form → ???

NEW FLOW:
Landing → Sign Up (Clerk) → /setup (dedicated page):
  Step 1: "How Playbill Picks works" (explainer)
  Step 2: "Connect your rush.telecharge.com account"
          [branded form + trust section + live verify animation]
  Step 3: "Subscribe to automate" → Stripe Checkout
  Step 4: "You're all set!" [completion + scheduled entries]
→ /dashboard (progressive empty state → entries → history)
```

### Key Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Credentials before or after payment? | **BEFORE** | Trust-building: "we verified your account — now subscribe." No post-payment frustration if creds are wrong. |
| Setup wizard location? | **Dedicated /setup page** | Clean separation from dashboard. Easier to reason about state. |
| Remove pre-sign-up onboarding? | **YES — remove entirely** | Genres aren't used by cron. Premature preference collection before user understands the product. |
| Clean up unused schema columns? | **YES — in this PR** | Remove genres[], ticketCount, notificationPref from User model. Requires Prisma migration. |
| Fetch real show data from Notte API? | **NO — hardcoded list fine for beta** | Real show data comes with the Show Watchlist feature later. |

### 6 Accepted Scope Expansions

All proposed by CEO review, all approved by user:

1. **Live credential verification animation** — Multi-step animation (connecting → authenticating → verified) when user clicks verify. Builds trust, makes the product feel alive.
2. **rush.telecharge.com branded credential step** — Show Telecharge name prominently, link to the real site, so users immediately know which account they're connecting.
3. **"Why we need your password" expandable trust section** — Collapsible section explaining: (a) we log in on your behalf, (b) AES-256 encrypted, (c) we never change account settings, (d) delete anytime.
4. **Setup completion + "what happens next" screen** — After wizard completes: checkmarks for each step, countdown to first entries, list of shows being entered.
5. **Progressive empty-state dashboard** — Timeline showing setup complete + countdown to first cron run, instead of blank/generic empty state.
6. **Remove pre-sign-up onboarding** — Landing page CTAs go directly to sign-up.

---

## What Already Exists (Reuse These)

All backend infrastructure is already built and working. No new API routes needed.

| Component | File | Status |
|-----------|------|--------|
| Credential save API | `src/app/api/credentials/route.ts` | Working — POST saves, GET retrieves |
| Credential test API | `src/app/api/credentials/test/route.ts` | Working — dry_run verification with rate limiting |
| Stripe checkout API | `src/app/api/checkout/route.ts` | Working — creates Stripe checkout session |
| Stripe webhook handler | `src/app/api/webhooks/stripe/route.ts` | Working — handles checkout.session.completed, payment events |
| Dashboard data API | `src/app/api/dashboard/route.ts` | Working — returns subscription, credentials, runs, stats |
| Onboarding preferences API | `src/app/api/onboarding/route.ts` | **TO BE REMOVED** — handles genres/tickets/notifs |
| Encryption library | `src/lib/encryption.ts` | Working — AES-256-CBC encrypt/decrypt |
| CredentialCard component | `src/app/dashboard/page.tsx:64-208` | **Extract form portion** for reuse in setup wizard |
| Existing dashboard | `src/app/dashboard/page.tsx` | **Simplify** — remove credential entry + unpaid preview states |

---

## What Needs To Be Built

### File-by-File Implementation Plan

#### 1. CREATE: `src/app/setup/page.tsx` (NEW — the core deliverable)

The setup wizard. 4 steps, tracked via URL search params (`?step=1..4`).

**Step 1 — Explainer:**
- Header: "How Playbill Picks works"
- Three numbered items: (1) connect Telecharge account, (2) we enter every lottery, (3) you get notified
- "Continue" button → step 2
- Same visual style as existing onboarding (blue gradient, white cards, rounded corners)

**Step 2 — Credentials:**
- Header: "Connect your rush.telecharge.com account"
- Telecharge branding (name prominently displayed, link to rush.telecharge.com)
- Email + password form (reuse credential form pattern from CredentialCard)
- Expandable "Why do we need your password?" section with 4 trust points
- "Save & Verify" button that:
  1. POSTs to `/api/credentials` to save
  2. POSTs to `/api/credentials/test` to verify
  3. Shows multi-step animation: connecting → authenticating → verified/failed
- On success → advance to step 3
- On failure → inline error, user can retry
- Show/hide password toggle (existing pattern)

**Step 3 — Subscribe:**
- Header: "Subscribe to automate"
- Price: $9/mo, 7-day free trial, cancel anytime
- Feature list (same as existing pricing page)
- "Start winning" button → POSTs to `/api/checkout`, redirects to Stripe
- Stripe success_url: `/setup?step=4`
- Error handling: if checkout creation fails, show "Something went wrong" + retry button

**Step 4 — Completion:**
- Header: "You're all set!"
- Checklist: Account connected ✓, Subscription active ✓
- "First entries scheduled for [next cron time]" with countdown
- List of sample shows being entered (hardcoded: Hamilton, Hadestown, Lion King, Wicked, Chicago, Sweeney Todd)
- "Go to Dashboard" button → `/dashboard`
- If arriving from Stripe redirect: poll for webhook to confirm subscription (same pattern as existing dashboard polling)

**Step detection logic (on page load):**
```
if (!signedIn) → redirect to /sign-up
if (hasCredentials && hasSubscription) → redirect to /dashboard (already set up)
if (hasCredentials && !hasSubscription) → show step 3
if (!hasCredentials) → show step 1 (or step from URL param)
```

This derives step from API data, so refreshing/back works correctly.

#### 2. MODIFY: `src/app/dashboard/page.tsx`

**Remove:**
- `CredentialCard` component (moves to setup wizard)
- Unpaid preview card ("What you'll get" + "See pricing" CTA)
- "Subscribe — $9/mo" CTA from left column
- `activating` state and post-checkout polling (moves to setup)

**Add:**
- Redirect to `/setup` if user lacks credentials OR subscription
- Progressive empty-state: timeline showing "Account connected ✓ → Subscription active ✓ → First entries: today at 2pm UTC ⏳" with countdown and sample show list

**Keep as-is:**
- Entry history list (when runs exist)
- Top nav bar with UserButton
- Date display (day/date/month)
- `getNextRunLabel()` utility

#### 3. MODIFY: `src/components/landing/Hero.tsx`

**Change:**
- CTA "Start Entering for Free" href from `/onboarding` to `/sign-up`
- Consider updating CTA copy if "for Free" is misleading (product costs $9/mo)

#### 4. DELETE: `src/app/onboarding/page.tsx`

Remove entirely. The 3-step onboarding (genres/tickets/notifications) is being replaced by the setup wizard.

#### 5. DELETE: `src/app/api/onboarding/route.ts`

Remove the API route that saved onboarding preferences. No longer needed.

#### 6. MODIFY: `prisma/schema.prisma`

Remove from User model:
```diff
- genres           String[]
- ticketCount      Int?
- notificationPref String?
```

Run `npx prisma migrate dev` to generate migration.

#### 7. MODIFY: `src/app/dashboard/page.tsx` — remove onboarding localStorage bridge

Remove the `useEffect` that reads `lot_notte_onboarding` from localStorage and POSTs to `/api/onboarding`. This code (lines 229-243) is no longer needed.

#### 8. MODIFY: `src/app/layout.tsx` (possibly)

May need to configure Clerk's `afterSignUpUrl` to `/setup` instead of `/dashboard`. Check Clerk provider props — currently no `afterSignUpUrl` is set, so Clerk defaults to `/`. This should be explicitly set to `/setup`.

#### 9. MODIFY: `src/app/pricing/page.tsx`

The standalone pricing page may still be useful for users who navigate directly to `/pricing`. But consider: is it redundant with setup step 3? Options:
- **Keep as-is** — it's a standalone page linked from the landing page footer/nav
- **Redirect to /setup?step=3** — if user is signed in but hasn't set up, push them through the wizard

Recommendation: keep as-is for now. It serves the landing page pricing section link.

#### 10. UPDATE: `ARCHITECTURE.md`

Update the User Flow section to reflect the new flow. Update the repo structure to show `/setup` and remove `/onboarding`.

---

## Error Handling Requirements

| Codepath | Failure Mode | User Sees | Notes |
|----------|-------------|-----------|-------|
| Cred save (step 2) | API 500 | "Failed to save. Please try again." + retry | Existing error path in credential API |
| Cred verify (step 2) | Wrong password | "Incorrect email or password." inline | API returns 401, handled by existing test endpoint |
| Cred verify (step 2) | Timeout (30s) | "Connection timed out. Try again." | Notte API timeout, existing handling |
| Cred verify (step 2) | Rate limited (3/min) | "Too many attempts. Wait 1 minute." | Existing rate limiting |
| Stripe checkout (step 3) | Session create fail | "Something went wrong. Please try again." + retry | **GAP in current code** — empty catch block in pricing page. Must fix. |
| Stripe return (step 4) | Webhook delayed | Polling with "Activating..." spinner | Existing pattern from dashboard |
| Dashboard load | API 500 | "Couldn't load. Retry." button | Existing |

---

## Schema Migration

A Prisma migration is needed to remove 3 columns from the User model:

```sql
ALTER TABLE "User" DROP COLUMN "genres";
ALTER TABLE "User" DROP COLUMN "ticketCount";
ALTER TABLE "User" DROP COLUMN "notificationPref";
```

This is safe because:
- The columns are not read by any API route except the onboarding route (being deleted)
- The cron job doesn't use them
- The dashboard doesn't display them
- No other code references them

Run: `npx prisma migrate dev --name remove-onboarding-preferences`

---

## What Is NOT In Scope

| Item | Why deferred |
|------|-------------|
| Email notifications | P1 in TODOS.md, but separate concern (requires email provider setup) |
| Show Watchlist / pick specific shows | P2, separate feature — requires Show data model and data source |
| Multi-platform support (TodayTix, BroadwayDirect) | 12-month roadmap item |
| OAuth with rush.telecharge.com | 12-month ideal — eliminates password collection entirely |
| Fetch real show data from Notte API | Hardcoded list fine for beta |
| Set Clerk app name to "Playbill Picks" | P1 in TODOS.md, but it's a Clerk Dashboard setting, not a code change |
| Newsletter subscribe button | P3 in TODOS.md, separate concern |
| Redis rate limiting | P2 in TODOS.md, in-memory is fine for beta |
| Dashboard N+1 query fix | P2 in TODOS.md, not blocking |

---

## Existing TODOS.md Items Affected

- **"Dashboard entry timeline — empty state polish"** → SUPERSEDED by progressive empty-state dashboard in this plan
- **"Persist onboarding preferences"** → COMPLETED (v0.1.1.0) but being REVERSED — the onboarding preferences are being removed
- **"Show Watchlist / Playbill Picks"** → genre preferences removal means this becomes MORE important as the future way to filter shows

---

## Testing Strategy

### Existing tests (keep)
- 5 encryption tests in `src/__tests__/encryption.test.ts` — roundtrip, random IV, missing key, byte-length validation, malformed ciphertext

### Tests to add
- **Setup step detection logic** — given various user states (no creds, has creds + no sub, fully set up), verify correct step is shown
- **Credential save + verify flow** — mock API responses, verify animation states transition correctly
- **Stripe checkout error handling** — verify error state renders on failed session creation
- **Dashboard redirect logic** — verify redirect to /setup when incomplete, normal render when complete
- **E2E (future)** — full sign-up → setup → dashboard flow

---

## Design Language

Use the existing visual system throughout:
- **Background:** `bg-linear-to-b from-[#7a9dc2] via-[#96bdd8] to-[#c2d9e8]` (blue gradient)
- **Cards:** `bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm`
- **Primary button:** `bg-[#0f172b] text-white rounded-full` or `bg-[#202020] text-white rounded-full` with inset shadow
- **Text hierarchy:** `text-white` for headings, `text-white/60` for subtext, `text-[#314158]` for card body
- **Selected state:** `border-2 border-[#5b8fd4]` (accent border)
- **Step indicator:** pill dots like the existing onboarding
- **Transitions:** specific properties (not `transition-all`), 200ms duration

---

## Quick Reference: API Endpoints Used by Setup Wizard

```
POST /api/credentials          — Save lottery email + encrypted password
POST /api/credentials/test     — Verify credentials via Notte API dry_run
GET  /api/credentials          — Check if credentials exist (for step detection)
POST /api/checkout             — Create Stripe checkout session
GET  /api/dashboard            — Get subscription status, credentials status, runs
```

All endpoints require Clerk auth. All already exist and work. No new API routes needed.

---

## How to Verify When Done

1. **New user flow:** Sign up → see setup wizard step 1 → continue through all 4 steps → reach dashboard
2. **Returning user:** Sign in → skip setup → go straight to dashboard
3. **Partial setup:** User with credentials but no subscription → setup shows step 3
4. **Landing page:** "Start Entering" button goes to /sign-up, not /onboarding
5. **Old onboarding:** /onboarding returns 404 (page deleted)
6. **Schema:** genres, ticketCount, notificationPref columns removed from User table
7. **Trust signals:** Step 2 clearly says "rush.telecharge.com" and has expandable trust section
8. **Error handling:** Wrong password shows inline error, Stripe failure shows retry button
9. **Empty dashboard:** After setup, before first cron, shows progressive timeline with countdown
