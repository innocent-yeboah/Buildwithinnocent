# Rebuild Plan — Build With Innocent

**Status:** Proposal for review. No rebuild starts until this document is accepted.  
**Audience:** Innocent Yeboah  
**Live site:** [buildwithinnocent.com](https://buildwithinnocent.com)  
**Repo today:** `main` @ `27be140` (`feat(chat): align webhook payloads with Meta, n8n, and Flowise formats`)

This plan has two halves:

1. **Design** — who the product is for, what it must do, how it should feel, and how information is structured.
2. **Implementation** — how we rebuild without taking the live site down, in what order, and what we keep.

---

## Decision we need from you

**Recommended: planned rebuild in place, not a throwaway rewrite.**

The current site already converts (leads, emails, bootcamp, CRM, chat). A greenfield repo would risk SEO, lost form data, and weeks of dark time. The rebuild should keep:

- the domain and Vercel project
- brand assets and copy that already works
- existing Supabase data (migrated, not discarded)
- current public URLs (`/`, `/bootcamp`, `/privacy`, `/terms`, `/cookies`, `/proposal/[id]`, `/login`, `/internal/*`)

What we *do* rebuild is the **architecture, information architecture, and code quality** — as if we had planned first.

If you instead want a brand-new repository and a hard cutover, say so before Phase 1. That path is slower and riskier.

---

# Part 1 — Design

## 1.1 What this product is

Build With Innocent is two products sharing one brand:

| Product | Who uses it | Job to be done |
|---|---|---|
| **Public studio site** | Ghana / Africa SME owners, school operators, founders | Trust Innocent, see proof, start a consultation or bootcamp registration |
| **Internal OS** | Innocent (and later a small team) | Capture every lead, follow up, send proposals, track projects, revenue, retainers, referrals |

The unplanned build mixed these together: a 1,100-line client homepage, four Supabase client wrappers, two lead tables that sync twice, and a CRM that talks to the database from the browser.

The rebuild treats them as **two bounded contexts** in one Next.js app, with a shared brand system and a single data layer.

## 1.2 Brand (keep, do not reinvent)

Current tokens stay. This is not a rebrand.

| Token | Value | Use |
|---|---|---|
| Navy | `#1E3A5F` | Headlines, trust, header |
| Green | `#2E7D32` | Actions, success, “live” |
| Gold | `#FFC107` | Accent, highlights |
| Maroon | `#710628` | Rare emphasis |
| Surface | `#F9FAFB` | Page background |

**Voice:** Clear, Accra-based, dignity-first. Talk to “business owners” and “schools,” not “leads.” Promise a free prototype, software the client owns, and Ghana-friendly pricing — without urgency tricks.

**Typography:** Inter for UI (already in root layout). Headlines stay bold navy. Motion stays gentle and respects `prefers-reduced-motion` (hero already does this).

**WhatsApp numbers (do not change without a reason):**

- Human / sales: `+233 530 710 628`
- AI assistant: `+233 530 453 400`

## 1.3 Public information architecture

Today almost everything lives on `/` as hash sections. That made shipping fast and made the homepage unmaintainable.

**Keep a strong homepage, but give important stories their own URLs.** Hash links remain as shortcuts.

```
/                     Home — proof, offer, contact
/#services            Jump: what I build
/#work                Jump: selected work
/#story               Jump: founder story
/#faq                 Jump: objections
/#contact             Jump: consultation form

/work                 All case studies (new)
/work/[slug]          One case study (new)
/services             Service overview (new; homepage teaser stays)
/bootcamp             Coding bootcamp (exists)
/proposal/[id]        Client-facing proposal (exists; improve)

/privacy  /terms  /cookies
```

**Homepage sections (order):**

1. Hero — one promise, two actions: “Book a consultation” and “Chat / WhatsApp”
2. Proof strip — live products (SchoolLedger GH, Benizer Green Shop, …)
3. What I build — three offers: websites, business systems, transformation
4. Selected work — 3 featured case studies, link to `/work`
5. Story — Accra, free prototype, you own the software
6. Testimonials
7. FAQ
8. Contact — consultation form (bootcamp registration stays on `/bootcamp`)

**Remove from the homepage:** the bootcamp registration form. One page, one primary form. Bootcamp keeps its own page. That alone cuts a large share of homepage complexity.

## 1.4 Conversion design

Three inbound paths, one pipeline:

```
Website form  ──┐
Bootcamp form ──┼──► Inquiry ──► CRM Lead ──► Proposal ──► Project ──► Revenue / Retainer
Chat / WA     ──┘
```

Rules:

- Every public form submits through **one API** (`POST /api/inquiries`).
- The visitor always gets a calm success state: “Thank you. Innocent will follow up.”
- Innocent always gets an admin email **and** a CRM row.
- Attribution (UTM, referrer, landing page) is stored as structured fields, not only stuffed into notes.
- Honeypot + rate limit + optional Turnstile stay. No dark patterns.

Chat and WhatsApp are the same brain. The widget is a website channel into that brain, not a second product.

## 1.5 Internal OS design

This is a **founder CRM**, not Salesforce. Screens stay few and obvious:

| Screen | Purpose |
|---|---|
| Overview | Today’s follow-ups, overdue proposals, 30-day revenue, MRR |
| Pipeline | Leads by status; log contact; set next action |
| Proposals | Draft → sent → viewed → accepted; public link |
| Projects | Stage board; deposit / balance |
| Money | Revenue entries + maintenance retainers |
| People | Referrals |

**Permissions:** only allowlisted emails (today `INTERNAL_ADMIN_EMAIL`). RLS must not be “any authenticated user can read/write everything.”

**Public proposal:** a client should open a **unguessable token URL**, not a raw database UUID if we can avoid it. View tracking stays.

**Cron (keep):** overdue proposal nudge, maintenance invoice reminder, weekly summary.

## 1.6 Content model (stop hard-coding the homepage)

Move these out of JSX into typed content files so copy can change without touching layout:

- Services
- Case studies / live projects
- Testimonials
- FAQ
- Founder story blocks
- Nav items
- WhatsApp / contact constants (already in `lib/brand.ts` — keep one source)

Suggested: `content/*.ts` with TypeScript types (no CMS until you actually need non-dev editors).

## 1.7 Data model (Design)

Today we have **two lead worlds**:

- `website_leads` — raw form rows (bigint ids)
- `leads` — CRM pipeline (UUID)
- Sync happens **twice** (Postgres trigger **and** `syncWebsiteLeadToCrm` in the API)

That is the main data design bug.

**Target model:**

```
contacts          a person (name, email, phone)
inquiries         one inbound event (website, bootcamp, chat, whatsapp, manual)
leads             pipeline record (status, next action, value) → contact
proposals         → lead
projects          → lead / contact
revenue           → project or contact
maintenance_plans → project
referrals         → contact (source) + lead (referred)
chat_sessions     optional: website chat transcript keyed by session id
```

Migration principle: **no data loss.** `website_leads` becomes the historical `inquiries` (or an archive table). Existing CRM `leads` rows stay; we backfill `contact_id`.

Until Phase 3 ships, production keeps writing to the current tables so the live site does not break.

## 1.8 What success looks like (Design)

A visitor on a phone in Accra can:

1. Understand what you build in under 10 seconds
2. See real work
3. Book a consultation or talk on WhatsApp
4. Get a confirmation email that does not land in spam

You can:

1. Open Internal OS and see every new inquiry without checking three inboxes
2. Send a proposal link and know when it was viewed
3. Know who to follow up with today

Engineering:

1. Strict TypeScript, no `any`, one Supabase client factory
2. Server Components by default; client only for forms, chat, carousels, auth
3. Tests around leads, email, chat webhook, and CRM queries
4. CI green on lint, test, and build

---

# Part 2 — Implementation

## 2.1 Why the current code feels unplanned

These are the concrete debts the rebuild pays down. They are not a criticism of shipping — they are the map.

| Debt | Where | Why it hurts |
|---|---|---|
| Homepage is one 1,100-line client component | `app/(marketing)/page.js` | Hero, forms, FAQ, portfolio all hydrate together |
| JS + TS mixed | `page.js`, `brand.js` + `brand.ts`, `supabase.js` + `supabase.ts` | Two sources of truth |
| Four Supabase entry points | `lib/supabase.ts`, `.js`, `supabase-legacy.js`, `lib/supabase/*` | Easy to use the wrong key |
| Dual lead sync | trigger + `lib/sync-website-lead.js` | Duplicates or silent skip |
| RLS is “authenticated = admin” | migration `auth_full_access` | Any signed-in user sees all CRM data |
| Internal OS CRUD from the browser | `lib/internal/hooks.ts` | Logic and auth live in the client |
| Chat widget on every route | `app/layout.js` | Appears on `/login` and `/internal` |
| Exhaustive-deps lint disabled | `eslint.config.mjs` | Hides real bugs |
| React Compiler off | `next.config.mjs` | Left disabled after a runtime scare |
| In-process rate limit | `lib/rate-limit.js` | Resets per serverless instance |
| Email still sandbox in docs | `.env.example` | Production trust gap, not a code gap |
| Chat needs env, not more formats | `docs/CHAT-WEBHOOK.md` | Four payload adapters; one live brain |

## 2.2 Stack (keep, tighten)

Do **not** add Prisma, Stripe, or a second framework for v1 of the rebuild.

| Layer | Choice | Notes |
|---|---|---|
| App | Next.js 16 App Router | Already deployed on Vercel |
| Language | TypeScript strict, `allowJs` off at end of Phase 1 | Convert, then delete `.js` |
| UI | Tailwind v4 + shared `components/ui` | Tokens only in `app/globals.css` |
| Data | Supabase Postgres + generated `Database` types | One admin / one user / one anon factory |
| Auth | Supabase Auth, middleware on `/internal` and `/login` | Allowlist by email |
| Email | Resend | Domain verify is ops, not rewrite |
| Chat | Existing `/api/chat` + one webhook format | Pick `meta` **or** `n8n`, delete the unused adapters later |
| Tests | Vitest | Expand beyond `escape-html` / `lead-emails` / `chat-webhook` |
| CI | GitHub Actions: lint, test, build | Keep |

## 2.3 Target folder shape

```
app/
  (marketing)/          # public site
  (auth)/login/
  (internal)/internal/  # CRM
  api/inquiries/        # replaces /api/leads
  api/chat/
  api/internal/cron/
  proposal/[token]/

content/                # services, work, faq, testimonials
components/
  ui/                   # Button, Modal, Field, StatusBadge
  marketing/
  internal/
lib/
  brand.ts              # single brand module
  env.ts                # zod-validated env
  supabase/             # browser.ts, server.ts, admin.ts only
  inquiries/
  email/
  chat/
  crm/

supabase/migrations/    # additive, never rewrite history
docs/                   # this plan, email, chat
```

## 2.4 Phases

Work one phase at a time. Each phase ends with `main` deployable. Do not start Phase N+1 until Phase N is on production or explicitly deferred.

### Phase 0 — Freeze and snapshot (no product rewrite)

- Freeze unrelated feature work during the rebuild.
- Export / screenshot Internal OS data; confirm migrations are applied on the live Supabase project.
- List production env vars vs `.env.example`.
- Confirm which chat format is actually used (`meta` / `n8n` / `flowise` / OpenAI).
- Keep this document as the source of truth; update a “Decisions” section when we choose.

**Exit:** we know what is live, what env is missing, and what must not break.

### Phase 1 — Foundation

Rebuild the skeleton **without** changing visitor-facing UI.

- TypeScript-only path aliases; delete duplicate `brand.js` / `supabase.js`.
- `lib/env.ts` with required vs optional secrets.
- One Supabase factory (browser / server / admin).
- Design tokens only in CSS `@theme` (stop duplicating in `tailwind.config.ts` + `brand.ts` + `globals.css` — brand.ts keeps semantic names that *read* CSS tokens or a single TS map).
- Chat widget only on marketing layout, not root layout.
- Restore `react-hooks/exhaustive-deps`.
- Generated or hand-maintained `Database` types that match migrations.

**Exit:** site looks the same; internals are typed and single-sourced.

### Phase 2 — Marketing site rebuild

- Split homepage into server-rendered sections + small client islands (hero carousel, consult modal, form).
- Move bootcamp registration fully onto `/bootcamp`.
- Extract `LeadForm` / `ConsultModal` components.
- Add `/work` and `/work/[slug]` using `content/work.ts`.
- Keep `/`, `/bootcamp`, legal pages, OG image, sitemap, robots.

**Exit:** homepage is readable, fast, and still converts. Lighthouse / a11y pass on home, bootcamp, work.

### Phase 3 — Inquiry pipeline

- Introduce `inquiries` (+ `contacts` if we split person from pipeline) via a **new** migration.
- Dual-write: new API writes inquiry + CRM lead; old `website_leads` kept until backfill is verified.
- One email module: admin alert + visitor acknowledgement (existing Fortune 500 templates, cleaned).
- Structured attribution columns.
- Then cut reads in Internal OS to the new tables and stop dual sync.

**Exit:** one inbound API, one CRM row per inquiry, emails reliable. Old table retained as archive.

### Phase 4 — Internal OS rebuild

- Server Components + Server Actions for mutations (stop browser-as-ORM).
- RLS: `authenticated` AND email in `internal_admins` (or `app_metadata.role = admin`).
- Shared table UI instead of seven copy-paste managers.
- Proposal public URL uses a `public_token`.
- Cron unchanged in behavior, typed and tested.

**Exit:** you can run the business from `/internal` with stricter auth than today.

### Phase 5 — Chat and WhatsApp

- Marketing-only widget; WhatsApp FAB stays.
- Keep **one** webhook format (the one your n8n/Meta flow actually expects).
- Optional: store transcripts on `chat_sessions` and create an inquiry when the visitor shares contact info.

**Exit:** website chat and WhatsApp hit the same assistant; unused payload formats removed or quarantined.

### Phase 6 — Hardening

- Shared rate limit (Upstash Redis or Vercel KV) if traffic needs it.
- Turnstile confirmed in production.
- Resend domain verified, sandbox off (ops checklist in `docs/EMAIL-DELIVERABILITY.md`).
- Tests for inquiry API, CRM sync, proposal token, cron.
- Accessibility pass (keyboard, labels, contrast — brand navy/green on white already close).
- Re-evaluate React Compiler after the homepage is split.

**Exit:** production checklist complete; CI is a real safety net.

## 2.5 What we will not rebuild

Leave these alone unless a phase explicitly touches them:

- Live client URLs (SchoolLedger, Benizer Green Shop)
- Logo files and hero photos
- Legal page meaning (lawyer, not a rewrite)
- Vercel Analytics events we already emit (re-map names only if a form moves)
- WhatsApp numbers and prefill text (unless you change the offer)

## 2.6 Risks

| Risk | Mitigation |
|---|---|
| SEO drop from URL changes | Keep `/` and `/bootcamp`; new pages are additive |
| Duplicate CRM leads during dual-write | Unique index on `website_lead_id` / `inquiry_id` already exists — keep it |
| Auth lock / cookie races | Stay on `@supabase/ssr` middleware pattern; Internal OS data via server after Phase 4 |
| Taking the site down | Each phase merges to `main` only when build + smoke of `/` and `/api/leads` (or successor) pass |
| Scope explosion | No Stripe, no blog, no mobile app, no multi-tenant Internal OS in this rebuild |
| “Just one more chat format” | Choose one in Phase 0; others wait |

## 2.7 Suggested first implementation PR (after this plan is accepted)

Phase 1 only:

1. `lib/env.ts`
2. collapse Supabase + brand duplicates
3. move `SiteChatWidget` to the marketing layout
4. no visual redesign yet

That is a small, safe start and proves the rebuild is a series of planned PRs, not a months-long branch.

---

## Decisions log

Fill these in before Phase 1 code. Defaults are recommendations.

| Decision | Default | Your call |
|---|---|---|
| Rebuild style | In-place, phased | |
| Chat format to keep | `meta` (WhatsApp Cloud) | |
| Bootcamp form on homepage | Remove; keep on `/bootcamp` | |
| New `/work` pages | Yes | |
| Split `contacts` vs `leads` | Yes, in Phase 3 | |
| Internal OS users | Single admin email allowlist | |
| CMS | Typed files, no CMS | |
| Stripe / payments | Out of scope | |

---

## How we work after approval

1. You accept or edit this plan (especially the Decisions log).
2. We implement **Phase 1** on a feature branch and open a PR.
3. You review on the live preview, then we merge.
4. Repeat per phase. No phase skips the previous exit criteria.

Until you accept this plan, **no rebuild code will be written.**
