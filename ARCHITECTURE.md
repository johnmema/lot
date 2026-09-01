# Architecture

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Auth:** Clerk (keyless mode)
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Payments:** Stripe (subscriptions + webhooks)
- **Encryption:** AES-256-CBC for credential storage
- **Cron:** Vercel Cron (daily at 9am ET)
- **Email:** Resend (daily entry confirmation emails)
- **External API:** anything.notte (lottery entry automation)

## Repo Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout (ClerkProvider, fonts)
│   ├── globals.css                       # Global styles + animations
│   ├── setup/page.tsx                    # 4-step setup wizard (explainer, credentials, subscribe, completion)
│   ├── pricing/page.tsx                  # $9/mo pricing card → Stripe checkout
│   ├── dashboard/page.tsx                # User dashboard (runs, stats, credentials)
│   ├── sign-in/[[...sign-in]]/page.tsx   # Clerk sign-in
│   ├── sign-up/[[...sign-up]]/page.tsx   # Clerk sign-up
│   └── api/
│       ├── checkout/route.ts             # POST: create Stripe checkout session
│       ├── credentials/
│       │   ├── route.ts                  # GET/POST: lottery credential management
│       │   └── test/route.ts             # POST: verify credentials via Notte API
│       ├── dashboard/route.ts            # GET: aggregated dashboard data
│       ├── cron/route.ts                 # GET: daily lottery entry job
│       └── webhooks/stripe/route.ts      # POST: Stripe event handler
├── components/
│   └── landing/
│       ├── Navbar.tsx                    # Nav with auth-aware CTA + smooth scroll
│       ├── Hero.tsx                      # Hero with floating badges + signpost
│       ├── ShowsSection.tsx              # Show cards grid
│       ├── FeaturesSection.tsx           # 6-feature grid
│       ├── AboutSection.tsx              # Team + stats
│       └── Footer.tsx                    # Footer links
├── lib/
│   ├── db.ts                             # Prisma client singleton
│   ├── encryption.ts                     # AES-256 encrypt/decrypt
│   ├── resend.ts                         # Resend client singleton
│   └── stripe.ts                         # Stripe client init
└── proxy.ts                              # Clerk middleware

prisma/
└── schema.prisma                         # Database schema

vercel.json                               # Cron schedule (0 14 * * *)
```

## Database Schema

Four models, two enums:

```
User
├── id, clerkId (unique), email (unique)
├── has one Subscription
├── has one LotteryCredential
└── has many EntryRun

LotteryCredential
├── lotteryEmail
└── encryptedPassword (AES-256, stored as "iv_hex:encrypted_hex")

Subscription
├── stripeCustomerId, stripeSubscriptionId
└── status: ACTIVE | INACTIVE | PAST_DUE | CANCELED

EntryRun
├── status: SUCCESS | FAILED | PARTIAL
├── showsEntered: String[] (show names returned by API)
├── runAt: DateTime
└── error: String (on failure)
```

## User Flow

```
Landing → Sign Up (Clerk) → Setup Wizard:
  Step 1: "How Playbill Picks works" (explainer)
  Step 2: "Connect your rush.telecharge.com account" (credentials + verify)
  Step 3: "Subscribe to automate" → Stripe Checkout ($9/mo)
  Step 4: "You're all set!" (completion + scheduled entries)
→ Dashboard (progressive empty state → entries → history)
→ [Daily cron enters lotteries] → Dashboard shows results
```

## API Architecture

### Authentication
All API routes (except webhooks and cron) use `auth()` from `@clerk/nextjs/server` to get the `clerkId`, then look up the internal user.

### Stripe Webhooks
`POST /api/webhooks/stripe` handles four events:
- `checkout.session.completed` → create subscription (ACTIVE)
- `invoice.payment_succeeded` → reactivate (ACTIVE)
- `invoice.payment_failed` → mark PAST_DUE
- `customer.subscription.deleted` → mark CANCELED

### Cron Job
`GET /api/cron` (protected by `CRON_SECRET` bearer token):
1. Query all users with ACTIVE subscription + stored credentials
2. Decrypt passwords
3. Call anything.notte API per user (batches of 10, 60s timeout each)
4. Store EntryRun records with results

### Credential Security
Passwords are encrypted at rest using AES-256-CBC. Each encryption generates a random IV. Stored as `iv_hex:encrypted_hex`. The encryption key comes from the `ENCRYPTION_KEY` env var.

## Key Design Decisions

- **Clerk keyless mode**: No API keys needed for local dev — auto-generates temporary keys
- **Next.js 16 proxy.ts**: Replaces deprecated `middleware.ts` for Clerk
- **Single API call per user**: anything.notte handles all shows in one call (~20s), so no per-show queuing needed
- **Batch processing**: Cron processes users in groups of 10 to avoid overwhelming the external API
- **Subscription gating**: Dashboard shows a reactivate prompt for lapsed users rather than blocking access entirely
