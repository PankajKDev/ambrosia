<div align="center">
  <img src="/logo.svg" alt="Ambrosia" width="120" style="background:#fff;border-radius:12px;padding:12px" />
</div>

# Ambrosia

Journaling simplified for ADHD. A calmer way to understand your days — quick
mood check-ins, one-tap thought capture, and gentle weekly insights that feel
like help, not homework.

Live at **[ambrosia.sainte.cloud](https://ambrosia.sainte.cloud)**.

## Screenshots

![Home (logged out)](/screenshots/unauth-home.png)

![Home (logged in)](/screenshots/authenticated-home.png)

## Features

- **Fast mood check-ins** — capture where you're at in a single tap, from a
  foggy afternoon to a wired, high-energy evening.
- **One-tap thought capture** — get the thought out before it slips away;
  capture is always one tap away.
- **Flexible notes, optional tags** — write what you need, add tags only when
  they help. No folders, no forced organization.
- **Weekly insights** — scattered entries become an honest weekly summary:
  dominant mood, trend, and small things to try next week. Rule-based by
  default; toggle **AI-powered insights** on in settings for generated
  summaries.
- **Explore resources** — curated ADHD communities and articles, kept separate
  from your journal and clearly educational, not a replacement for
  professional care.
- **Timeline** — review your mood history and notes over time.
- **Export your data** — one JSON file with your notes, insights, and profile.
  Private by default, portable whenever you need it.
- **Your notes, your control** — private by default, with per-note delete and
  full data export.
- **Email auth** — email/password sign-in with verification and password reset,
  plus Google OAuth.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) — React 19
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) v4
- [better-auth](https://www.better-auth.com) — auth, email verification, reset
  flows (Resend for transactional email)
- [Prisma](https://www.prisma.io) ORM v7 + PostgreSQL (via `@prisma/adapter-pg`)
- [Vercel AI SDK](https://ai-sdk.dev) — AI insights (Google Gemini & Groq)
- [Resend](https://resend.com) — email delivery

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | ✅ | Run `npx auth secret` to generate |
| `BETTER_AUTH_URL` | ✅ | e.g. `http://localhost:3000` in dev |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | ✅ | Client-facing auth URL |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google login | OAuth 2.0 credentials from Google Cloud Console |
| `OAUTH_PROXY_SECRET` | If using `oAuthProxy` | Secret for the OAuth proxy plugin |
| `GROQ_API_KEY` | AI insights | Groq API key |
| `GOOGLE_GENERATIVE_API_KEY` | AI insights | Google Gemini API key |
| `RESEND_API_KEY` | Email flows | Resend API key for verification / reset emails |

Email flows (verification, password reset) require a verified sender domain on
Resend; `trustedOrigins` in `auth.ts` must include your app URL.

### 3. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run start        # start production server
npm run lint         # eslint
```