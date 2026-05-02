# Build With Innocent — Marketing Site

Next.js (App Router) landing page for [buildwithinnocent.com](https://buildwithinnocent.com) with a lead form backed by Supabase and optional Resend email notifications.

## Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in Supabase URL and anon key. Add `RESEND_API_KEY` if you want notification and acknowledgment emails.

3. Install and run locally:

   ```bash
   npm install
   npm run dev
   ```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Production server        |
| `npm run lint` | ESLint                   |
| `npm run test` | Vitest unit tests        |

## Lead API (`POST /api/leads`)

- Persists to Supabase table `leads` (same shape as before).
- **Rate limiting:** in-process sliding window per IP (see `lib/rate-limit.js`). On multi-instance hosts, add a shared limiter or edge firewall for strict guarantees.
- **Honeypot:** hidden `website` field; submissions with it filled return success without storing (bot trap).
- **Turnstile:** if `TURNSTILE_SECRET_KEY` is set, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and complete verification server-side.
- **Email HTML:** user-supplied fields are escaped before interpolation (`lib/escape-html.js`).

## Hero imagery

The homepage hero uses a full-viewport carousel of workspace photos stored under `public/hero/` ([Unsplash License](https://unsplash.com/license)). See `public/hero/credits.txt` for source photo IDs. Images auto-advance and pause on hover or keyboard focus; auto-play is disabled when the visitor prefers reduced motion.

## Generated metadata

Open Graph image, favicon, Apple touch icon, and web app manifest are generated from `app/opengraph-image.js`, `app/icon.js`, `app/apple-icon.js`, and `app/manifest.js` (no manual `og-image.jpg` in `public/` required).

## Deployment

Configured for Vercel; set the same env vars in the project dashboard. Ensure Resend sender domains (`notifications@…`, `hello@…`) are verified in Resend.
