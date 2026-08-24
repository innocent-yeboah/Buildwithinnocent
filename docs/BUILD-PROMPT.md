# Build prompt — Build With Innocent (one-page portfolio)

**This file is the source of truth for the first ship.** It supersedes the four-page IA in `docs/REBUILD-PLAN.md` until that pass is opened.

Copy everything below the line into a coding session. Follow it as spec. Do not reopen product debates. Do not add features “while you are here.”

---

You are rebuilding the **public marketing site** for **Build With Innocent** in the existing Next.js repo (`buildwithinnocent.com`). Live site stays up: rebuild **in place** on a feature branch. Domain, Vercel, logo files, `/api/leads`, Resend, `/login`, `/internal`, `/bootcamp`, `/privacy`, `/terms`, `/cookies` must keep working if someone has the URL.

This pass is the **public portfolio only**. Do not rebuild Internal OS, chat, or the bootcamp product.

## Goal

A **simple yet expensive developer portfolio** for **Innocent Golden**. Two jobs only:

1. **Trust** — a shop owner with no website believes he can handle their business.
2. **Convert** — that person starts a conversation they can pay for.

This website is **not** the shop operating system he later builds for clients. It does not take deposits, does not run checkout, does not host client admin apps.

**Tightrope:** do not look cheap; do not look like an Awwwards demo that attracts the wrong people. Wrong people = **anyone who will not pay GHS 3,500** (Ghana base).

Taste (space and editing only, not the circus): [brikken.co](https://brikken.co/), [khasiyev.com](https://khasiyev.com/). One restrained motion (fade or hover). No WebGL, no cursor-preview grids, no looping video heroes, no showreel.

A shop owner on a phone in Accra must understand the page in seconds. English only. Voice on the public site: **I**, never **we** (do not say “we received,” “we build,” “we agree” as the studio). Home: **Accra**, named on the page. Do **not** promise to meet in person. Remote clients including other countries are fine.

## Standing rules (a page is wrong if it breaks these)

**Rule 1 — Price is never global**

- Never print GHS 3,500, GHS 1,750, or 50% without the word **Ghana** in that same block.
- Never show the Ghana number alone. The same block must always contain these facts (a quiet list, not four competing banners):
  - **Ghana, from GHS 3,500**
  - **50% after you and I agree scope, 50% after you approve a private link**
  - **Outside Ghana, I send a price after we talk.**
  - **Typical time in Ghana: 2–4 weeks** (range, not a guarantee)
- Never write “starting at 3,500” / “from 3,500” as if it were a world price. Ghana must be the subject of that sentence.
- Do not add a country field to the form. The page, not IP detection, makes the two markets obvious.

**Rule 2 — The base system takes orders; it is not a payment gateway**

- Never describe the Ghana GHS 3,500 build as checkout, card payments, Paystack, or “customers pay on the site.”
- Always: **customers place orders on the site; you collect money the way you already do** (cash, personal MoMo, or a checkout you already have).
- Online checkout, delivery zones, and new payment APIs are **extra**, named in scope **before** the deposit. The site does not take the deposit.

**Rule 3 — Work is proof, not the price**

- Every work piece has a **still** (screenshot or framed capture of the real product) plus one caption: what it is, and whether it **is** or **is not** the Ghana GHS 3,500 starting system. Text-only cards are not enough.
- SchoolLedger GH (fixed): **A larger school system — not the Ghana GHS 3,500 starting build. I am not taking new school projects on this site.**
- Benizer Green Shop (fixed): **A shop on the web — this is the kind of system the starting build is for.**
- The money block may sit next to Benizer. Never present SchoolLedger as what GHS 3,500 buys.

## Locked copy

**Headline (hero):**  
I build the website and the system behind it so a business with no online presence can take orders.

**Place (hero, under the name, required):**  
Based in Accra. I work with clients remotely.

**Name on the site:** Innocent Golden  
**Company:** Build With Innocent  
**Primary action:** Start a conversation (scrolls to the form). Green may be used on this button **and** on form submit — they are the same action. No other green fills.  
**Secondary action:** See the work (same-page jump to the work section). Not a second primary button; a text link or quieter control is enough.

**What the Ghana starting build includes (say this near how-we-work, without promising checkout):**

1. A public website  
2. Customers place orders on the site; you collect money the way you already do  
3. A simple admin to see orders  
4. WhatsApp alerts  
5. Staff login  

They own the software. No monthly fee to Innocent. Domain and hosting are theirs. Support only if both agree.

**How we work (three steps, on the page — I, not we):**

1. You and I agree the scope (what is in the Ghana base vs extra, including how you collect money). Then 50% to start (GHS 1,750 at the Ghana base).  
2. You try it on a private link before it is public.  
3. You pay the remaining 50%. Then it goes live on your domain. You own it. If the second half is not paid, it does not go live.

No free prototype. No “24/7 even while you sleep.” No bootcamp in the header or hero. No “meet in Accra.” Do not lead with “free.”

**Visitor email (replace the current consultation template; I, not we):**  
Subject and body must not say “consultation,” “we have received,” “free prototype,” or “bootcamp.”  
Body: I have this. I will reply within one business day. — Innocent  

**Admin email:** alert Innocent that a new inquiry arrived. Do not title it “consultation request.” Keep the Resend admin path; change the wording to match the new offer (inquiry / conversation). Do not use the old tagline “Digital Business Systems for African Enterprises” in new email chrome if you touch the template — use Build With Innocent + the hero sentence, or no tagline.

Update `lib/lead-emails.js` (and tests) for the **consultation / website form** path. Leave bootcamp registration email copy alone if that path still exists for `/bootcamp`.

**WhatsApp (quiet, footer only):** +233 530 710 628 (human). Never +233 530 453 400 (AI). No floating WhatsApp button. No in-site chat widget on public pages.

**Bootcamp:** keep `/bootcamp` working. One quiet text link in the footer only — not in the header, not in the hero.

## What to ship (simplest version)

**One public page at `/`.** Do not add `/work`, `/about`, or `/contact` in this pass.

**Replace the marketing shell**, not only the homepage file. `app/(marketing)/layout` currently mounts the old `Navbar` (hash links, bootcamp, consult) on `/`, `/privacy`, `/terms`, `/cookies`, `/bootcamp`. That nav must go. New public header: logo + company name. New public footer: on all those routes. Skip-to-content for a11y.

Keep `CookieConsentLoader` on the marketing layout. Keep Cloudflare Turnstile on the form if `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set. Keep lead attribution if it is already wired; do not build a new attribution UI.

Page order on `/`:

1. **Hero** — one calm workspace still (reuse one existing `public/hero/` photo; no carousel). Logo. Innocent Golden. Accra line. Headline. Primary: Start a conversation. Secondary: See the work.
2. **Work** — two blocks only, Benizer first, SchoolLedger second. Each: still, short story, live link, Rule 3 caption.  
   - Benizer: https://benizergreenshop.com — still at `public/work/benizer.jpg` (add a real screenshot of the live shop; do not use a random Unsplash photo as “the work”).  
   - SchoolLedger: https://schoolledgergh.vercel.app/ — still at `public/work/schoolledger.jpg` (same rule).  
   Hide: WhatsApp AI, My Central Bank, FounderOS, any other projects.
3. **How we work + money** — the three I-voice steps + the full Rule 1 money block. List the five parts of the starting system using Rule 2 language. Ownership sentence.
4. **Form** — name, email, phone, what they want built. Nothing else. Submit → calm thank-you on the page (do not navigate away if you can help it).
5. **Footer** — copyright, quiet WhatsApp text link, quiet bootcamp text link, privacy / terms / cookies. No testimonials. No emoji service grid. No FAQ. No clinic offer. No peer quotes.

## How it works (you must implement A; B is off-site)

**A — On this website**

1. Visitor opens `/`.  
2. Reads offer, Accra, two proofs with stills, Ghana-labeled money.  
3. Submits four fields (or uses footer WhatsApp).  
4. Sees thank-you. Receives the short I-voice email. Innocent receives an inquiry alert (not “consultation”).  
5. Innocent replies within one business day (process, not code).

**B — Off this website (do not build)**

Scope in writing → 50% via MoMo / Ghana bank / Wise / card → private-link review → remaining 50% → go live on their domain.

## Structure in the repo

Keep Next.js App Router, TypeScript where you touch files, Tailwind, existing Supabase + Resend.

```
app/(marketing)/page.tsx          ← the one page (replace the 1,100-line client homepage)
app/(marketing)/layout.js|tsx     ← new simple header + footer; keep cookie consent; no old Navbar
app/layout.js                     ← REMOVE SiteChatWidget from the root layout
app/api/leads/route.js            ← keep; point the new form at POST /api/leads
lib/lead-emails.js                ← new visitor + admin wording for the website inquiry path
lib/lead-emails.test.js           ← update consultation-path assertions
components/marketing/             ← Hero, WorkList, HowWeWork, InquiryForm, SiteHeader, SiteFooter
content/work.ts                   ← two case studies, stills, Rule 3 captions
public/work/benizer.jpg           ← add
public/work/schoolledger.jpg      ← add
lib/brand.ts                      ← single brand source
```

Reuse `POST /api/leads` with the existing website-form shape (`name`, `email`, `phone`, `message` for “what they want built”). Honeypot + rate limit stay. Turnstile stays if keys exist. Do not add a second form API. Do not redesign Internal OS, cron, or proposal pages. Middleware for `/internal` and `/login` stays.

If the lead API still uses `website_leads`, keep writing there. Do not migrate CRM in this pass.

## Visual

- Navy `#1E3A5F` as cloth (type, header, footer).  
- Warm white / paper as air. Lots of space.  
- Gold `#FFC107` as a hairline, not a big fill.  
- Green `#2E7D32` only on Start a conversation and form submit.  
- Keep existing logo assets (`/images/logo-full.png`, `/images/logo-icon.png`).  
- Headlines: a distinctive display serif **or** a refined grotesque — not Inter for everything. Body: Inter (already in the root layout) is fine.  
- Motion: fade/hover only. Honor `prefers-reduced-motion`.  
- WCAG AA. Semantic HTML. Keyboard + labels on the form. Work stills need useful `alt` text.

## Do not build

- Chat widget, AI WhatsApp, extra FABs  
- Testimonials  
- Bootcamp in the header or hero (footer text link only)  
- Clinic or school **offers** (SchoolLedger is proof only, with Rule 3 caption)  
- Stripe or any payment checkout on this site  
- New CMS, Prisma, i18n, blog  
- Four-page IA (Home/Work/About/Contact) — later pass  
- Internal OS screens  
- Country field, budget field, company field, “how did you hear about us”

## Done when

- `/` is the one page above, readable on a phone.  
- Accra is visible in the hero. Each work block has a real still.  
- Rules 1–3 are visible without opening another URL.  
- Form creates a lead. Visitor email is the short I-voice note. Admin email does not say “consultation.”  
- Old marketing nav is gone from `/`, `/privacy`, `/terms`, `/cookies`, `/bootcamp`.  
- No chat bubble on `/`, `/privacy`, `/terms`, `/cookies`, `/login`, or `/internal`.  
- `/bootcamp` and `/internal` still load if you type the URL. Footer may link bootcamp quietly.  
- `npm run lint`, `npm run test`, and `npm run build` pass.

Ship that. Stop.
