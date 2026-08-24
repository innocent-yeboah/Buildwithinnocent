# Rebuild Plan — Build With Innocent

**Build-from prompt (source of truth for the first ship):** [`docs/BUILD-PROMPT.md`](./BUILD-PROMPT.md) — one public page. The four-page IA in this file is a later pass only.  
**Source:** Interview with Innocent Golden (2026-08-24), folded from the original “simple yet expensive developer portfolio” brief.  
**Live site:** [buildwithinnocent.com](https://buildwithinnocent.com)

This plan has two halves:

1. **Design** — who it is for, what it says, how it feels, what a visitor does.
2. **Implementation** — how we rebuild in place without taking the live site down.

---

## Tightrope (do not miss)

The site must **not look cheap** and must **not look too fancy** in a way that attracts the wrong people.

Wrong people: **anyone who will not pay GHS 3,500** (Ghana base).

Taste references are [Brikken+Co](https://brikken.co/) and [Viskhan Khasiyev](https://khasiyev.com/) — we borrow **space, type, and editing**, plus **one restrained motion** (fade or hover). We do **not** copy Awwwards circus (reactive heroes, cursor-preview grids, looping video). A shop owner with no website must understand the page in seconds.

---

## Three weak spots (where this logic fails)

These are not reasons to throw the plan away. They are situations the **public site + the offer it sells** will get wrong, confusing, or incomplete unless we design around them.

### 1. A visitor outside Ghana still sees GHS 3,500

**Situation:** A shop owner in London (or a Ghanaian helping a cousin abroad) opens the same homepage. The page says **from GHS 3,500**, **50% / 50%**, and somewhere **I’ll send a price after we talk**.

**What goes wrong:** They treat 3,500 as *their* price and feel baited when the first reply is higher. Or a Ghanaian reads “I’ll send a price after we talk” and thinks 3,500 is not real. One URL cannot tell who is in Ghana. The form does not ask country. Your first email has to fix a number the site already printed.

**Incomplete result:** The site promised a clear Ghana price and a quiet international quote. The visitor got both messages at once.

### 2. “Pay however they already pay” when they have no rail

**Situation:** The ideal client has **no online presence**. They take cash and a personal MoMo number. The homepage promises a **way customers order or pay** and an **admin to see orders**. You “wire whatever that business already uses.”

**What goes wrong:** After the deposit they get a catalogue and “send MoMo to 024….” They thought customers would pay on the phone (card / checkout). You thought the smallest system is menu + order note + WhatsApp. The word **pay** did the damage. There is no existing Paystack/MoMo API to wire.

**Incomplete result:** They approved a private link that is a website, not the “full system” they heard. The remaining 50% fight starts here.

### 3. SchoolLedger next to “from GHS 3,500”

**Situation:** A private-school owner (or a shop owner comparing height) opens Work, sees **SchoolLedger GH**, then sees **from GHS 3,500** and 50/50.

**What goes wrong:** They believe 3,500 buys *that* kind of system, or they think the price is fake (too low → cheap). We kept SchoolLedger as proof while **not selling to schools**. The site does not say “this is a larger, different project.” Proof and offer disagree.

**Wrong result:** A school deposit for a product you put on hold — or a shop owner who feels the portfolio is advertising something they will not get at the base price.

### Standing rules (the app must never break these)

Copy, layout, and case-study pages are wrong if they violate a line below. Phase 2 is not done until these can be checked on the live pages.

**Rule 1 — Price is never global**

- Never print **GHS 3,500** (or 1,750, or 50%) without the word **Ghana** in that same block.
- Never show the Ghana number alone. The same block must always contain, at equal weight: **Ghana, from GHS 3,500** · **50% after we agree scope, 50% after you approve a private link** · **Outside Ghana, I send a price after we talk.**
- Never use “starting at,” “from,” or “plans from” next to 3,500 unless **Ghana** is the subject of that sentence.
- The contact form still does not ask country. The page, not the visitor’s IP, must make the two markets obvious.

**Rule 2 — The base system takes orders; it does not sell a payment gateway**

- Never describe the GHS 3,500 build as checkout, card payments, Paystack, or “customers pay on the site.”
- Always describe the base as: **customers place orders on the site; you collect money the way you already do** (cash, personal MoMo, or a checkout you already have).
- Online checkout, delivery zones, or a new payment API are **out of the base** until step 1 writes them down as extra.
- Step 1 (scope) must name the money rail in writing before the 50% deposit. If it is not named, do not take the deposit.

**Rule 3 — Work is proof, not the price**

- Never place SchoolLedger (or any case study) beside the price without a caption.
- Every Work piece must have one line: what it is, and whether it **is** or **is not** the GHS 3,500 starting system.
- SchoolLedger’s line is fixed: **A larger school system — not the Ghana GHS 3,500 starting build. I am not taking new school projects on this site.**
- Benizer’s line is fixed: **A shop on the web — this is the kind of system the starting build is for.**
- On Home, the price block may sit next to Benizer, never as if SchoolLedger is the thing you get for 3,500.

---

# Part 1 — Design

## 1.1 Who it is for

A **business owner with no online presence** who will pay for a **full business system**.

**Now (homepage offer):** shops and services that **take orders**.  
**Later (off homepage until there is a live example):** clinics (same system, **appointments** instead of orders).  
**On hold as an offer:** schools. **SchoolLedger GH still appears in Work** as proof you build real systems.

## 1.2 What you sell

One sentence (homepage):

> I build the website and the system behind it so a business with no online presence can take orders.

Voice: **I**, not we. Public name: **Innocent Golden**. Home: **Accra**. No promise to meet. Remote is fine, including other countries.

The system (smallest full build):

1. A public website
2. Customers **place orders** on the site. You **collect money the way you already do** unless checkout is scoped as extra (Rule 2)
3. A simple admin to see orders
4. WhatsApp alerts
5. Staff login

They **own the software**. No monthly fee to you. Domain and hosting are theirs. Ongoing support only by mutual agreement.

## 1.3 Money (on the public site)

| | Ghana | Outside Ghana |
|---|---|---|
| Starting price | **From GHS 3,500** | **I’ll send a price after we talk** (no second number) |
| Payment | **50% deposit, 50% on completion** | Same split, amount in the quote |
| Time | **2–4 weeks**, typical range, not a guarantee | Same range unless the quote says otherwise |

**Payment sequence (also on the site, in the how-we-work block):**

1. We agree the scope. Then **50%** to start (GHS 1,750 at the Ghana base).
2. They try it on a **private link** before it is public.
3. They pay the **remaining 50%**. Then it goes live on their domain. They own it.

If they do not pay the second half, it does not go live.

No free prototype. They start at 3,500 and you scope from there (what is in the base vs what costs more).

You can receive: Mobile Money, Ghana bank transfer, Wise / abroad transfer, card. That list does **not** need to be on the homepage.

## 1.4 Pages

Primary nav: **Home · Work · About · Contact**

```
/                 Home
/work             Two case studies
/work/schoolledger-gh
/work/benizer-green-shop
/about            Innocent, Accra, how we work (the three paid steps)
/contact          Form + quiet WhatsApp

/bootcamp         Quiet footer link only — not nav, not hero
/privacy /terms /cookies     Footer only (keep existing meaning)
/login /internal/*           Invisible
/proposal/[id]               Private link you send
```

**Home (short):**

1. Hero — one calm workspace still (placeholder until you send a better photo). Headline = the sentence in 1.2. Two actions: See the work · Start a conversation.
2. Selected work — SchoolLedger GH and Benizer Green Shop only, each with Rule 3 captions.
3. How we work — the three paid steps + **Rule 1 money block** (Ghana price, 50/50, outside Ghana, 2–4 weeks). Never a lone “from GHS 3,500.”
4. Close — same conversation button.

No testimonials until a client talks about **hired work**.  
No emoji service grid, no FAQ wall, no founder-essay chapter on Home (story lives on About, edited down).  
No clinics copy on Home until there is a live clinic.

**Work (only these):**

- SchoolLedger GH
- Benizer Green Shop

Hide: WhatsApp AI Assistant, My Central Bank, FounderOS.

## 1.5 Conversion

- **Form first** (Contact, and the Home overlay/button that goes there).
- **WhatsApp quiet alternative** in footer and on Contact: **+233 530 710 628** (you). Not the AI number.
- **No in-site chat widget** on public pages.
- Form fields: **name, email, phone, what they want built**. Nothing else. Ask country in your first reply if you need Ghana vs quote.
- After submit: thank-you on the page + **short email to them** (“I have this. I will reply within one business day.”) + **alert to you**.
- You **reply within one business day**.

English only.

## 1.6 Brand and craft

Keep logo and navy / green / gold. Use them quietly:

- Navy as cloth (type, header, footer)
- White / warm paper as air
- Gold as a hairline, not a fill
- Green only on the one live action
- Maroon unused on marketing

Type: a display serif (or a refined grotesque) for headlines; Inter or similar for body. Not Inter on everything.

Motion: fade or hover. Respect `prefers-reduced-motion`.

## 1.7 What stays behind the curtain

Internal OS, cron, proposal links, lead API, Resend — keep as your tools. They are not the public product. Do not redesign Internal OS in this pass.

## 1.8 Words we do not lead with

Do not put **free prototype**, **meet in Accra**, **24/7 even while you sleep**, bootcamp, or AI chat on the first screen.  
“Free” does not belong next to a paid system.

---

## How the website works (step by step)

This is the **portfolio**, not the shop system you later build for a client. Goal: a business owner trusts you and starts a conversation they can pay for.

### A. A stranger on the phone

1. They open `/`. One still, your name, one sentence: you build the website and the system behind it so a business with no online presence can take orders.
2. They see two pieces of work. Benizer is “this is the starting kind.” SchoolLedger is “larger school system — not the GHS 3,500 build; no new school projects.”
3. They see how it works: agree scope → 50% → private link → 50% → live. **Ghana, from GHS 3,500.** **Outside Ghana, I send a price after we talk.** Typical **2–4 weeks**.
4. They tap **Start a conversation**, fill four fields (name, email, phone, what they want built), submit.
5. The page says thank you. They get a short email. You get an alert. Optional: they use the quiet WhatsApp link instead of the form.
6. Within one business day you reply, confirm Ghana vs not, and name what is in the base vs extra (including how they collect money).

### B. After they want to hire you (off the website)

7. You agree scope in writing. They pay **50%** (MoMo / bank / Wise / card — not on this website).
8. You build on a private link. They click through with you.
9. They pay the **remaining 50%**. You put it on their domain. They own it. You stop unless they agree support.

The website’s job ended at step 6. Steps 7–9 are you, WhatsApp/email, and your bank. The site does not take the deposit, does not host the private link as a product, and does not run their shop.

### C. What is not strictly needed for that goal

| Extra in the current plan | Why it is extra |
|---|---|
| Separate `/work`, `/about`, `/contact` | Taste of a studio. Trust + convert can happen on **one page**. |
| Long case-study pages | A still, a short story, live link, Rule 3 caption is enough. |
| Display serif / extra type | Helps “expensive.” Inter + space + editing still works. |
| Bootcamp footer link | Different customer. Does not help a shop owner hire you. |
| WhatsApp in the footer | Useful backup. Form + email already converts. |
| Auto-email to the visitor | Polite. The on-page thank-you + your reply in one day can stand alone. |
| Cookie banner / Turnstile / attribution | Legal or spam tools. Not the conversion story. |
| Internal OS, chat, AI WhatsApp, CRM dual-sync | Your back office. Not the portfolio. |
| Phase 1 types cleanup as its own ship | Invisible. Can happen while building the page. |

### D. Simplest version that still works (ship this first)

**One public page** (`/`) plus the existing legal URLs in a tiny footer.

On that page, in order:

1. Hero (still + sentence + one button: Start a conversation)
2. Two work blocks (Benizer + SchoolLedger, Rule 3 captions, live links)
3. How we work + Rule 1 money block (Ghana 3,500, 50/50, outside Ghana, 2–4 weeks)
4. The four-field form
5. Footer: WhatsApp text link optional, privacy/terms, no bootcamp until you miss it

Behind the page: `POST /api/leads` (already exists) → save the row → email you → short email to them. Chat widget off. No new nav. `/bootcamp` and `/internal` keep working if someone has the URL; they are not linked.

**Done when:** a Ghanaian shop owner can understand the offer, see two proofs, see Ghana-labeled money, and you receive a complete four-field inquiry.

Four routes (Home / Work / About / Contact) are a **second pass** if the one page feels cramped. They are not required to reach the goal.

---

# Part 2 — Implementation

## 2.1 Approach

Rebuild **in place**. Keep domain, Vercel, logo, lead data, `/bootcamp` URL, `/internal`. Change the public site so it matches Design.

Each phase stays deployable.

## 2.2 Stack

Next.js 16, TypeScript, Tailwind, Supabase, Resend, Vercel. No CMS, no Stripe on this pass (you already take MoMo / bank / Wise / card off-site). No chatbot.

## 2.3 Phases

### Phase 0 — Accept this plan

You read this document and say it is right, or mark what to change. Still no marketing rewrite until then.

### Phase 1 — Quiet foundation (optional, can merge with Phase 2)

One brand module, one Supabase factory, env validation. Chat widget off root layout.

### Phase 2 — Simplest public page (the work that matters)

Replace the current marketing homepage with the **one-page** version in section D. Chat off. Form + emails. Rules 1–3 on that page. Do not build `/work`, `/about`, or `/contact` until the one page is live and you want the extra air.

**Exit:** a shop owner in Accra can see the offer, two proofs, Ghana-labeled GHS 3,500, 50/50, and send a four-field form. The page does not look like a template and does not look like an Awwwards demo.

### Phase 3 — Inquiry backend (after Phase 2 is live)

Keep `/api/leads` working, then tidy dual lead-sync if needed. Invisible to visitors.

### Phase 4 — Internal OS

Separate plan. Not this rebuild.

### Phase 5 — Clinics, chat, bootcamp promotion

Only if you later have a clinic case study or choose to promote bootcamp again.

## 2.4 Risks

| Risk | Rule |
|---|---|
| Looks cheap | Space, type, two case studies, no emoji/badges/peer quotes |
| Looks too fancy / wrong crowd | No Awwwards interaction; price and 50/50 on the page |
| People who will not pay 3,500 | Ghana price and deposit on the site |
| International price contradiction | Ghana number labeled; others get “I’ll send a price after we talk” |
| Scope fight at 3,500 | Step 1 is agree what is in vs extra |
| Second 50% unpaid | No go-live until paid |
| SEO | Keep `/` and `/bootcamp`; add `/work`, `/about`, `/contact` |

## 2.5 First code after you accept

**Phase 2** — the **one public page** in section D. Extra routes only after that is live.

---

## Decisions log (filled)

| Decision | Your call |
|---|---|
| Public site | Simple, expensive developer portfolio that converts |
| Client | Business owner with no online presence |
| Offer now | Full system for orders (shops/services) |
| Clinics | Off homepage until a live example |
| Schools | Not selling; SchoolLedger stays in Work |
| Work | SchoolLedger GH + Benizer Green Shop only |
| Name | Innocent Golden |
| Voice | I |
| Home | Accra, no meet promise |
| Geography | Remote, other countries OK |
| Ghana price on site | From GHS 3,500 |
| Outside Ghana | I’ll send a price after we talk |
| Payment on site | 50% after scope, 50% after private-link approval, then go live |
| Prototype | None; scope from 3,500 |
| Time on site | 2–4 weeks typical |
| Nav | One page first. Home / Work / About / Contact is a later pass |
| CTA | Form first; WhatsApp +233 530 710 628 quiet |
| Chat widget | Off public pages |
| Bootcamp | `/bootcamp`, footer only |
| Testimonials | None until hired-work quotes |
| Hero | One calm stock/workspace still until you send better |
| Motion | Quiet luxury + fade/hover |
| Language | English only |
| Form | Name, email, phone, what they want built |
| Emails | Short note to them + alert to you |
| Reply | Within one business day |
| Ownership | They own it; no monthly to you unless support agreed |
| Internal OS | Hidden; no redesign this pass |
| Fear | Not cheap, not too fancy, not people who won’t pay 3,500 |

---

Until Phase 2 starts, Rules 1–3 in this document are standing product rules, not optional copy.
