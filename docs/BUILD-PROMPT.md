# Build prompt — Build With Innocent (one-page portfolio)

Copy everything below the line into a coding session. Follow it as spec. Do not reopen product debates. Do not add features “while you are here.”

---

You are rebuilding the **public marketing site** for **Build With Innocent** in the existing Next.js repo (`buildwithinnocent.com`). Live site stays up: rebuild **in place** on a feature branch. Domain, Vercel, logo files, `/api/leads`, Resend, `/login`, `/internal`, `/bootcamp`, `/privacy`, `/terms`, `/cookies` must keep working if someone has the URL.

## Goal

A **simple yet expensive developer portfolio** for **Innocent Golden**. Two jobs only:

1. **Trust** — a shop owner with no website believes he can handle their business.
2. **Convert** — that person starts a conversation they can pay for.

This website is **not** the shop operating system he later builds for clients. It does not take deposits, does not run checkout, does not host client admin apps.

**Tightrope:** do not look cheap; do not look like an Awwwards demo that attracts the wrong people. Wrong people = **anyone who will not pay GHS 3,500** (Ghana base).

Taste (space and editing only, not the circus): [brikken.co](https://brikken.co/), [khasiyev.com](https://khasiyev.com/). One restrained motion (fade or hover). No WebGL, no cursor-preview grids, no looping video heroes, no showreel.

A shop owner on a phone in Accra must understand the page in seconds. English only. Voice: **I**, never **we**. Home: Accra. Do **not** promise to meet in person. Remote clients including other countries are fine.

## Standing rules (a page is wrong if it breaks these)

**Rule 1 — Price is never global**

- Never print GHS 3,500, GHS 1,750, or 50% without the word **Ghana** in that same block.
- Never show the Ghana number alone. The same block must always contain, at equal visual weight:
  - **Ghana, from GHS 3,500**
  - **50% after we agree scope, 50% after you approve a private link**
  - **Outside Ghana, I send a price after we talk.**
  - **Typical time in Ghana: 2–4 weeks** (range, not a guarantee)
- Never write “starting at 3,500” / “from 3,500” as if it were a world price. Ghana must be the subject of that sentence.
- Do not add a country field to the form. The page, not IP detection, makes the two markets obvious.

**Rule 2 — The base system takes orders; it is not a payment gateway**

- Never describe the Ghana GHS 3,500 build as checkout, card payments, Paystack, or “customers pay on the site.”
- Always: **customers place orders on the site; you collect money the way you already do** (cash, personal MoMo, or a checkout you already have).
- Online checkout, delivery zones, and new payment APIs are **extra**, named in scope **before** the deposit. The site does not take the deposit.

**Rule 3 — Work is proof, not the price**

- Every work piece has one caption: what it is, and whether it **is** or **is not** the Ghana GHS 3,500 starting system.
- SchoolLedger GH (fixed): **A larger school system — not the Ghana GHS 3,500 starting build. I am not taking new school projects on this site.**
- Benizer Green Shop (fixed): **A shop on the web — this is the kind of system the starting build is for.**
- The money block may sit next to Benizer. Never present SchoolLedger as what GHS 3,500 buys.

## Locked copy

**Headline (hero):**  
I build the website and the system behind it so a business with no online presence can take orders.

**Name on the site:** Innocent Golden  
**Company:** Build With Innocent  
**Primary action:** Start a conversation  
**Secondary (optional, same page jump):** See the work  

**What the Ghana starting build includes (say this near how-we-work, without promising checkout):**

1. A public website  
2. Customers place orders on the site; you collect money the way you already do  
3. A simple admin to see orders  
4. WhatsApp alerts  
5. Staff login  

They own the software. No monthly fee to Innocent. Domain and hosting are theirs. Support only if both agree.

**How we work (three steps, on the page):**

1. We agree the scope (what is in the Ghana base vs extra, including how you collect money). Then 50% to start (GHS 1,750 at the Ghana base).  
2. You try it on a private link before it is public.  
3. You pay the remaining 50%. Then it goes live on your domain. You own it. If the second half is not paid, it does not go live.

No free prototype. No “24/7 even while you sleep.” No bootcamp on the first screen. No “meet in Accra.” Do not lead with “free.”

**Visitor email (short, human):**  
I have this. I will reply within one business day. — Innocent  

**Admin email:** alert Innocent that a new inquiry arrived (keep existing Resend admin path).

**WhatsApp (quiet, footer only):** +233 530 710 628 (human). Never +233 530 453 400 (AI). No floating WhatsApp button. No in-site chat widget on public pages.

## What to ship (simplest version)

**One public page at `/`.** Do not add `/work`, `/about`, or `/contact` in this pass. Do not link `/bootcamp` in the header or hero (leave the route alive, unlinked, unless a tiny footer link is already required by an old URL — prefer unlinked).

Page order:

1. **Hero** — one calm workspace still (reuse one existing `public/hero/` photo; no carousel). Logo. Innocent Golden. Headline. One button: Start a conversation (scrolls to the form).
2. **Work** — two blocks only, Benizer first (closer to the offer), SchoolLedger second. Short story, live link, Rule 3 caption.  
   - Benizer: https://benizergreenshop.com  
   - SchoolLedger: https://schoolledgergh.vercel.app/  
   Hide: WhatsApp AI, My Central Bank, FounderOS, any other projects.
3. **How we work + money** — the three steps + the full Rule 1 money block. List the five parts of the starting system using Rule 2 language.
4. **Form** — name, email, phone, what they want built. Nothing else. Submit → calm thank-you on the page (do not navigate away if you can help it).
5. **Footer** — small: copyright, quiet WhatsApp text link, privacy / terms / cookies. No testimonials. No emoji service grid. No FAQ. No clinic offer. No peer quotes.

**Header:** logo + maybe the company name. No four-item studio nav. Skip-to-content for a11y.

## How it works (you must implement A; B is off-site)

**A — On this website**

1. Visitor opens `/`.  
2. Reads offer, two proofs, Ghana-labeled money.  
3. Submits four fields (or uses footer WhatsApp).  
4. Sees thank-you. Receives short email. Innocent receives alert.  
5. Innocent replies within one business day (process, not code).

**B — Off this website (do not build)**

Scope in writing → 50% via MoMo / Ghana bank / Wise / card → private-link review → remaining 50% → go live on their domain.

## Structure in the repo

Keep Next.js App Router, TypeScript where you touch files, Tailwind, existing Supabase + Resend.

```
app/(marketing)/page.tsx     ← replace the 1,100-line client homepage with the one page
app/(marketing)/layout.tsx   ← header/footer for public site; no chat
app/layout.js                ← REMOVE SiteChatWidget from the root layout (public pages must not mount it)
app/api/leads/route.js       ← keep; point the new form at POST /api/leads
components/marketing/        ← small pieces: Hero, WorkList, HowWeWork, InquiryForm, SiteFooter
content/work.ts              ← the two case studies + Rule 3 captions (typed, no CMS)
lib/brand.ts                 ← single brand source; do not duplicate brand.js if you can avoid it
```

Reuse `POST /api/leads` with the existing consultation shape (`name`, `email`, `phone`, `message` or equivalent for “what they want built”). Honeypot + rate limit may stay. Do not add a second form API. Do not redesign Internal OS, cron, or proposal pages. Middleware for `/internal` and `/login` stays.

If the lead API still uses `website_leads`, keep writing there. Do not migrate CRM in this pass.

## Visual

- Navy `#1E3A5F` as cloth (type, header, footer).  
- Warm white / paper as air. Lots of space.  
- Gold `#FFC107` as a hairline, not a big fill.  
- Green `#2E7D32` only on the **one** live action (the conversation button / submit).  
- Keep existing logo assets (`/images/logo-full.png`, `/images/logo-icon.png`).  
- Headlines: a distinctive display serif **or** a refined grotesque — not Inter for everything. Body: Inter (already in the root layout) is fine.  
- Motion: fade/hover only. Honor `prefers-reduced-motion`.  
- WCAG AA. Semantic HTML. Keyboard + labels on the form.

## Do not build

- Chat widget, AI WhatsApp, extra FABs  
- Testimonials  
- Bootcamp on the homepage  
- Clinic or school **offers** (SchoolLedger is proof only, with Rule 3 caption)  
- Stripe or any payment checkout on this site  
- New CMS, Prisma, i18n, blog  
- Four-page IA (Home/Work/About/Contact) — that is a later pass  
- Internal OS screens  
- Country field, budget field, company field, “how did you hear about us”

## Done when

- `/` is the one page above, readable on a phone.  
- Rules 1–3 are visible without opening another URL.  
- Form creates a lead and sends both emails.  
- No chat bubble on `/`, `/privacy`, `/terms`, `/cookies`, `/login`, or `/internal`.  
- `/bootcamp` and `/internal` still load if you type the URL.  
- `npm run lint`, `npm run test`, and `npm run build` pass.

Ship that. Stop.
