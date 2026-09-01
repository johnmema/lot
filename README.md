# Playbill Picks

Automated Broadway lottery entry system. Pay $9/mo, connect your lottery account, and we enter every open show lottery for you daily at 9am ET.

## Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) recommended)
- Stripe account
- Clerk account (or use keyless mode for local dev)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the template and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...`) |
| `STRIPE_PRICE_ID` | Stripe price ID for the $9/mo plan |
| `ENCRYPTION_KEY` | 32-character random string for AES-256 |
| `NOTTE_API_URL` | anything.notte API endpoint |
| `NOTTE_API_KEY` | anything.notte API key |
| `CRON_SECRET` | Secret for cron job auth (auto-set on Vercel) |
| `RESEND_API_KEY` | Resend API key for entry confirmation emails |
| `NEXT_PUBLIC_APP_URL` | Your app URL (`http://localhost:3000`) |

Clerk runs in **keyless mode** by default — no API keys needed for local development. Temporary keys are auto-generated.

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the dev server

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### 5. Stripe webhooks (local)

To test Stripe webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret it prints and set it as `STRIPE_WEBHOOK_SECRET`.

## Deploy

Push to Vercel. The cron job (`/api/cron`) runs daily at 9am ET automatically via `vercel.json`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
