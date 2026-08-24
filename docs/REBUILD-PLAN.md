# Rebuild Plan — Build With Innocent

**Status:** Proposal for review. No rebuild code until this document is accepted.  
**Audience:** Innocent Yeboah  
**Live site:** [buildwithinnocent.com](https://buildwithinnocent.com)

This plan has two halves:

1. **Design** — the original idea, how the site should feel, and what a visitor should do.
2. **Implementation** — how we rebuild without taking the live site down.

---

## North Star (the original idea)

Build a **simple yet expensive portfolio website** for Innocent as a **developer**.

It has two jobs only:

1. **Build trust** — so a serious client believes you can handle their business.
2. **Convert** — so that client starts a conversation.

“Simple” means few pages, one offer, one primary action, and lots of air.  
“Expensive” means craft: photography, type, spacing, and proof — not more features, not more CTAs, not a second product on the homepage.

If a section does not help a client **trust you** or **start a conversation**, it does not belong on the public site.

---

## What we built instead

The live site drifted into a small software company homepage:

| Original idea | What shipped |
|---|---|
| One person, one portfolio | “Digital Business Systems for African Enterprises” |
| Work as the proof | Work buried under services, bootcamp, FAQ, and two forms |
| One calm ask | Hero: consult + see work + bootcamp + AI chat + human WhatsApp |
| Quiet luxury | Emoji service cards, green checkmarks, gradient badges, competing FABs |
| Client results | Encouragement quotes from peers, not project outcomes |
| A form that feels private | Consult modal *and* bootcamp registration on the same page |
| Developer site | Public site + Internal OS + cron + four chat payload formats |

None of that is wasted. Leads, email, and the private CRM can stay **behind** the portfolio. They are not the product the client should see.

---

## Decision we need from you

**Recommended: rebuild the public site as a premium developer portfolio, in place.**

Keep the domain, Vercel project, brand marks, and existing lead data.  
Change the **job of the website**: it is a portfolio that converts, not an operating system that also happens to have a homepage.

Internal OS, bootcamp, and website chat stay in the repo only if they serve you privately or as clearly secondary pages. They do not drive the homepage, the nav, or the first impression.

---

# Part 1 — Design

## 1.1 Who this is for

A business owner who can pay for custom software. They are busy, slightly skeptical, and judging taste in the first five seconds.

They are not looking for a coding bootcamp, a chatbot, or a SaaS dashboard. They are looking for **someone who looks like they already do this at a high level.**

You are positioned as:

> Innocent Golden — developer in Accra. I design and build software for businesses that need to own what they run.

Not:

> Build With Innocent — digital business systems, bootcamp, WhatsApp AI, Internal OS.

The company name can stay. The **feeling** must be a person with a serious practice, not a product suite.

## 1.2 What “simple yet expensive” means

**Simple (structure)**

- Four public destinations: Home, Work, About, Contact
- One primary action everywhere: **Start a conversation**
- Secondary action: **See the work**
- No bootcamp, no chat widget, no second WhatsApp FAB on the first screen
- No emoji, no “✓ Trusted by…” pills, no three competing buttons in the hero

**Expensive (craft)**

- Space. Fewer things, larger type, slower scroll
- One photography language (real work, real rooms, real face) — not a stock carousel fighting a glass card
- Type that looks commissioned, not default Inter-on-everything
- Color used like jewelry: navy as the cloth, gold as a thin line, green only on the one live action
- Motion that is almost invisible: fades, not bounce and `-translate-y-1`
- Case studies that read like a studio, not feature cards with stack chips

**Converts**

- The ask is quiet and specific: a consultation, not a funnel
- The form is short: name, email, phone, what you want built
- Success copy is human: “Thank you. I will write back personally.”
- No urgency, no scarcity, no “24/7 even while you sleep” (that line sells automation, not trust)

**Builds trust**

- Work first, story second
- Each project: the client’s problem, what you built, the outcome, a link or a private walkthrough
- A short, dignified about: Accra, free prototype, they own the software, you can meet in person
- Testimonials only if they are **from people who hired you or used the work**. Peer encouragement can live on LinkedIn, not the homepage
- Process in three steps, not a long FAQ wall

## 1.3 Brand (keep the marks, raise the taste)

Keep logo, domain, and the navy / green / gold family. Change **how much** of it is on screen.

| Token | Value | Expensive use |
|---|---|---|
| Navy `#1E3A5F` | Cloth | Type, header, footer. Most of the site. |
| White / warm paper | Air | Large fields of rest. Prefer off-white over gray-50 chrome. |
| Gold `#FFC107` | Jewelry | Hairline rules, a single overline, never a fill on a big button |
| Green `#2E7D32` | The one action | Primary button only. Not badges, not checkmarks, not section borders |
| Maroon `#710628` | Unused on marketing | Too loud for this site |

**Type (proposal)**

- Headlines: a display serif or a refined grotesque with real contrast (e.g. Newsreader or Instrument Serif, or a strong sans with tight tracking). Inter for *everything* is why the site feels like a template.
- Body: Inter or a similar readable sans, 18px+, long line-height.
- UI labels: small, tracked, navy — not green uppercase pills.

**Imagery**

- Prefer one still hero (your work, your desk, your city) over a four-photo carousel.
- Case studies need a frame (screenshot or photo), not only a summary paragraph.
- If we keep Unsplash, treat it as a placeholder until you have real project frames.

**WhatsApp**

- One number on the public site: human sales `+233 530 710 628`, as a text link in the footer and on Contact — not a floating button that fights the consult CTA.
- AI line `+233 530 453 400` is a product you sell, not the way the portfolio answers the door.

## 1.4 Public information architecture

Four pages. That is the whole public product.

```
/                 Home — atmosphere, selected work, one ask
/work             Index of case studies
/work/[slug]      One project, told properly
/about            Who you are, how you work, Accra
/contact          Private inquiry form (+ WhatsApp as alternative)

/privacy  /terms  /cookies     Required, linked in footer only
```

**Not in the primary nav**

| URL | Role after rebuild |
|---|---|
| `/bootcamp` | Keep the URL if people already have it; do not promote it from Home or nav. Footer “Other work” at most. |
| `/login`, `/internal/*` | Invisible. Your tools, not the portfolio. |
| `/proposal/[id]` | Private link you send. Not advertised. |
| In-site AI chat | Off the public site. It makes the studio feel like a helpdesk. |

**Homepage (short on purpose)**

1. **Hero** — your name, one sentence of what you do, two actions: See work · Start a conversation
2. **Selected work** — three projects, large, with a still. Link to `/work`
3. **How we work** — three lines: prototype, you own it, Accra
4. **Close** — one sentence + the same conversation button (form on `/contact` or a single overlay)

No services grid with emoji.  
No bootcamp underline.  
No FAQ chapter.  
No second form.  
Story belongs on `/about`, not as four green-bordered essays on Home.

## 1.5 Conversion design

One public inbound path:

```
Contact form  (or WhatsApp text link)
        │
        ▼
   Inquiry email to you
        │
        ▼
   You reply like a person
```

The CRM can still receive the row. The **visitor** should not feel a pipeline.

Rules:

- One form. Name, email, phone, what they want built. Optional company.
- Calm success. No “lead magnet.” No bootcamp upsell on thank-you.
- You get an email. They get a short acknowledgement that sounds like you, not a department.
- Honeypot + rate limit + optional Turnstile stay. Invisible to a real client.
- Attribution can be stored. It must not appear in the UI.

## 1.6 Trust design (the actual portfolio)

Each case study is a **story with evidence**, not a card of tech tags.

Minimum fields:

- Title (the product or the client, as they would say it)
- One-line result
- Problem
- What you built
- Outcome (even qualitative: “parents pay from WhatsApp,” “store launched”)
- Live URL or “private — walkthrough on request”
- One image

Live projects already worth that treatment: SchoolLedger GH, Benizer Green Shop, then one more (WhatsApp assistant **or** a private product, not five equal cards).

Three strong pieces beat five equal tiles. Expensive portfolios edit.

**Testimonials:** only quotes about the **work**. If we do not have client-result quotes yet, omit the section. Empty space is more trustworthy than peer congratulations.

## 1.7 What happens to everything else

The rebuild is allowed to be small because the original idea is small.

| Existing piece | Public portfolio | Your operations |
|---|---|---|
| Homepage, work, about, contact | Rebuild to the North Star | — |
| Lead API + Resend | Quiet backend for `/contact` | Keep |
| Internal OS | Hidden | Keep as-is for now; do not expand during the portfolio rebuild |
| Bootcamp page | Demote | Your choice later; not part of trust for paying clients |
| Site chat widget | Remove from public | Optional later, never on first impression |
| WhatsApp AI number | Not in header/hero | Mention only if it is a case study |
| Cron, proposals, referrals | Invisible | Keep running |

Internal OS is **not** a second public product. We do not redesign it in the same pass as the portfolio. That was the scope explosion.

## 1.8 What success looks like

A client on a phone:

1. Feels they have entered a serious practice (not a startup landing page)
2. Understands you build software, in Accra, for businesses
3. Can open real work in two taps
4. Can start a conversation without hunting

You:

1. Get fewer, better inquiries
2. Are not competing with yourself (bootcamp vs consult vs chat)
3. Can still see inquiries in email and Internal OS

---

# Part 2 — Implementation

Implementation exists to serve the North Star. It is not a license to rebuild Internal OS, chat adapters, and a services CMS in the same effort.

## 2.1 Why the current code cannot express “simple yet expensive”

| Debt | Why it fights the idea |
|---|---|
| 1,100-line client homepage | A luxury page cannot be one file of hero + two modals + FAQ |
| Bootcamp CTA in the hero | Splits the offer; cheapens the consult |
| Chat widget + WhatsApp FAB + consult button | Three front doors |
| Emoji + badges + green rules | Template energy, not studio energy |
| Peer quotes as social proof | Trust for a **developer hire** comes from shipped work |
| Internal OS in the same mental model | Made the marketing site a product suite |
| JS/TS duplicates, four Supabase clients | Fine to clean, but not the reason visitors bounce |

## 2.2 Stack

Keep Next.js 16, TypeScript, Tailwind, Supabase, Resend, Vercel.

Do not add a CMS, Stripe, Prisma, or a chatbot to “make it premium.” Premium here is layout, type, photography, and editing.

## 2.3 Target public shape

```
app/(marketing)/
  page.tsx              Home
  work/page.tsx
  work/[slug]/page.tsx
  about/page.tsx
  contact/page.tsx
  bootcamp/page.tsx     Kept, unlinked from primary nav
  privacy|terms|cookies

content/
  work.ts               Case studies (the real product)
  home.ts               Hero sentence, how-we-work lines
  about.ts

components/marketing/
  SiteHeader.tsx        Home, Work, About, Contact
  Hero.tsx
  SelectedWork.tsx
  InquiryForm.tsx
```

`/internal` stays where it is. We do not fold it into this pass.

## 2.4 Phases (portfolio first)

Each phase stays deployable. Do not start the next until the previous is accepted.

### Phase 0 — Agree the Design (this document)

- Confirm North Star: simple, expensive, portfolio, convert, trust
- Confirm what is **out** of the public site: bootcamp in nav, chat widget, AI WhatsApp FAB, emoji services, peer-quote wall
- Pick three case studies that deserve `/work/[slug]`
- Decide hero: one still vs a restrained carousel
- Decide headline font

**Exit:** Decisions log filled. Still no marketing-code rewrite.

### Phase 1 — Quiet foundation (no visual redesign yet)

Only what the portfolio rebuild will need:

- One `brand.ts`, one Supabase factory, `lib/env.ts`
- Chat widget **off** root layout (and off marketing once Phase 2 starts)
- TypeScript path for new pages

**Exit:** same look, cleaner internals. Optional; can merge with Phase 2 if you prefer one visible jump.

### Phase 2 — The actual rebuild (the only phase that matters)

Rebuild Home, Work, About, Contact to the Design above.

- New header: four links
- Home as described in 1.4
- `/work` + at least three case-study pages
- `/about` gets the founder story (edited down)
- `/contact` gets the one form (current `/api/leads` is fine at first)
- Bootcamp and Internal OS URLs keep working; they are simply not featured
- Remove public chat widget and extra FAB from the portfolio layouts

**Exit:** a visitor would describe the site as a developer’s studio, not a SaaS landing page. Consult still emails you.

### Phase 3 — Inquiry backend (only if Phase 2 is live)

Keep the form working; then tidy `website_leads` / CRM dual sync. Invisible to visitors.

### Phase 4 — Internal OS (later, separate plan)

Not part of “expensive portfolio.” Schedule only after the public site is something you are proud to send.

### Phase 5 — Chat / bootcamp / AI WhatsApp

Revisit only if they still serve you. Default: stay demoted.

## 2.5 What we will not do in this rebuild

- A new company brand or logo
- Stripe, blogs, or a second chatbot
- Expanding Internal OS screens
- Adding more homepage sections “while we are here”
- Keeping bootcamp in the hero as a compromise

## 2.6 Risks

| Risk | Mitigation |
|---|---|
| Site feels “empty” after editing | That is the expensive part. Fill with **work**, not widgets |
| SEO from dropping hash sections | Keep `/`; add `/work`, `/about`, `/contact`; 301 only if we retire `/bootcamp` later |
| Losing bootcamp signups | Page remains at `/bootcamp`; it is just not the front door |
| Building Internal OS instead | Phase 2 has no CRM tickets |

## 2.7 First code after approval

Phase 2: the four public pages, designed to this North Star.  
Not a types-only PR that leaves the current homepage in place for months.

If you want a tiny technical PR first (Phase 1), say so. The default after Design approval is to **show the new portfolio**.

---

## Decisions log

Fill before any code.

| Decision | Recommendation | Your call |
|---|---|---|
| What the public site is | A simple, expensive developer portfolio that converts | |
| Primary action | Start a conversation (`/contact` or one overlay) | |
| Primary nav | Home, Work, About, Contact | |
| Bootcamp | Keep URL, remove from hero and nav | |
| In-site chat widget | Remove from public pages | |
| Floating WhatsApp | Remove; text link on Contact + footer only | |
| Homepage services/FAQ/story essays | Move or cut; work leads | |
| Testimonials | Only client-result quotes; otherwise omit | |
| Hero | One still + one sentence, not a carousel + glass card | |
| Headline type | Display serif + Inter body | |
| Case studies in v1 | SchoolLedger GH, Benizer Green Shop, + one | |
| Internal OS | Hidden; no redesign in this pass | |
| Rebuild style | In-place, public pages first | |

---

## How we work after approval

1. You accept this North Star (or write what you want different in the Decisions log).
2. You name the three case studies and whether bootcamp/chat stay buried.
3. Then we implement **Phase 2** — the portfolio itself.
4. Backend and Internal OS wait.

Until you accept this, **no rebuild code will be written.**
