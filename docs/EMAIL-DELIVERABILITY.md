# Email Deliverability — Build With Innocent

Professional transactional email via [Resend](https://resend.com) on **buildwithinnocent.com**, DNS managed in **Namecheap**.

Until your domain is verified, emails send from `onboarding@resend.dev` and often land in spam. Follow this guide end-to-end.

---

## Part 1 — Verify domain in Resend

1. Sign in at [resend.com/domains](https://resend.com/domains).
2. Click **Add Domain** → enter `buildwithinnocent.com` → **Add**.
3. Resend shows **exact** DNS records (copy values from the dashboard — they are unique to your account).
4. Add each record in Namecheap (Part 4 below).
5. Back in Resend, click **Verify DNS Records**.
6. Status should become **Verified** (often 5–30 minutes; up to 72 hours).
7. In Resend → **Domains** → your domain → **Configuration**:
   - Enable **Open tracking** (optional — recommended for lead ack emails).
   - Enable **Click tracking** (optional).

8. Set Vercel / local env (remove sandbox after verify):

```env
RESEND_USE_SANDBOX=false
RESEND_FROM_CUSTOMER=Build With Innocent <hello@buildwithinnocent.com>
RESEND_FROM_ADMIN=Innocent Golden <innocent@buildwithinnocent.com>
RESEND_REPLY_TO=innocent@buildwithinnocent.com
RESEND_ADMIN_TO=igtechgh@gmail.com
```

---

## Part 2 — Recommended “From” addresses

| Purpose | Address | Display name |
|--------|---------|----------------|
| Customer acknowledgement | `hello@buildwithinnocent.com` | Build With Innocent |
| Admin lead alert (to you) | `innocent@buildwithinnocent.com` | Innocent Golden |
| Reply-To (customer emails) | `innocent@buildwithinnocent.com` | — |
| Reply-To (admin alert) | Lead’s email (set in code) | — |

Avoid `notifications@` for primary mail — it reads automated and hurts trust. Use `hello@` for clients and `innocent@` for personal follow-up.

**Namecheap email forwarding (optional):** In Namecheap → **Domain** → **Redirect Email**, forward `hello@` and `innocent@` to `igtechgh@gmail.com` if you do not use a mailbox host yet.

---

## Part 3 — DMARC (prevent spoofing)

After SPF + DKIM show **Verified** in Resend:

### Phase 1 — Monitor (start here)

| Host | Type | Value |
|------|------|--------|
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:dmarc@buildwithinnocent.com; ruf=mailto:dmarc@buildwithinnocent.com; fo=1; adkim=s; aspf=s;` |

Forward `dmarc@buildwithinnocent.com` to your Gmail in Namecheap, or use `rua=mailto:igtechgh@gmail.com` temporarily.

### Phase 2 — Quarantine (after 2–4 weeks of clean reports)

`v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@buildwithinnocent.com; adkim=s; aspf=s;`

### Phase 3 — Reject (mature sending)

`v=DMARC1; p=reject; rua=mailto:dmarc@buildwithinnocent.com; adkim=s; aspf=s;`

---

## Part 4 — Namecheap DNS records (exact steps)

1. [Namecheap](https://www.namecheap.com) → **Domain List** → **Manage** next to `buildwithinnocent.com`.
2. **Advanced DNS** tab.
3. For each record below, click **Add New Record**. Use values from **your Resend domain page** when they differ from examples.

### Record A — MX (sending subdomain)

| Field | Value |
|-------|--------|
| Type | `MX Record` |
| Host | `send` |
| Value | *(from Resend — e.g. `feedback-smtp.us-east-1.amazonses.com`)* |
| Priority | `10` |
| TTL | Automatic |

### Record B — TXT SPF (on `send` subdomain)

| Field | Value |
|-------|--------|
| Type | `TXT Record` |
| Host | `send` |
| Value | *(from Resend — typically starts with `v=spf1 include:amazonses.com`)* |
| TTL | Automatic |

### Record C — TXT DKIM

| Field | Value |
|-------|--------|
| Type | `TXT Record` |
| Host | `resend._domainkey` |
| Value | *(long `p=MIGf...` string from Resend — paste entire value)* |
| TTL | Automatic |

**Important:** In Namecheap **Host**, enter only `resend._domainkey` — not the full FQDN.

### Record D — DMARC (root)

| Field | Value |
|-------|--------|
| Type | `TXT Record` |
| Host | `_dmarc` |
| Value | `v=DMARC1; p=none; rua=mailto:dmarc@buildwithinnocent.com; adkim=s; aspf=s;` |
| TTL | Automatic |

### Optional — Root SPF (if Resend asks)

Some setups also want a root TXT:

| Host | `@` |
| Value | `v=spf1 include:amazonses.com ~all` |

Only add if Resend’s checklist shows it; duplicate SPF at root + `send` can conflict — follow Resend’s UI.

### Do not break existing records

- Keep **Vercel** / **www** A/CNAME records.
- If you use **Google Workspace** or other MX on `@`, do **not** change root MX — Resend uses the `send` subdomain only.

---

## Part 5 — Verify DNS is correct

### Online

- [Resend Domains](https://resend.com/domains) → **Verify DNS Records**
- [MXToolbox SPF](https://mxtoolbox.com/spf.aspx) → `send.buildwithinnocent.com`
- [MXToolbox DKIM](https://mxtoolbox.com/dkim.aspx) → `resend._domainkey.buildwithinnocent.com`
- [MXToolbox DMARC](https://mxtoolbox.com/dmarc.aspx) → `buildwithinnocent.com`

### Command line

```bash
nslookup -type=TXT send.buildwithinnocent.com
nslookup -type=TXT resend._domainkey.buildwithinnocent.com
nslookup -type=TXT _dmarc.buildwithinnocent.com
```

---

## Part 6 — Test deliverability

1. Set `RESEND_USE_SANDBOX=false` on Vercel after domain is verified.
2. Submit the contact form on [buildwithinnocent.com](https://buildwithinnocent.com).
3. Check **igtechgh@gmail.com** (admin) and the test lead inbox (customer).
4. In Gmail → open message → **⋮** → **Show original**:
   - `SPF: PASS`
   - `DKIM: PASS`
   - `DMARC: PASS` (after DMARC is published)
5. Send to [mail-tester.com](https://www.mail-tester.com) — aim for **9+/10**.
6. Resend → **Emails** → confirm **Delivered** (not Bounced).

### If mail still goes to spam

1. Confirm domain **Verified** in Resend (not sandbox).
2. Warm up: low volume first; avoid sudden bursts.
3. Keep HTML/text ratio healthy (templates include plain-text fallback).
4. Avoid spam trigger words in subject lines.
5. Ask new contacts to move your message to Primary once.

---

## Part 7 — Open tracking

Resend tracks opens when enabled on the domain (recommended). The app also sends a `category` tag (`lead-admin`, `lead-customer`) for filtering in Resend logs.

Optional env for a custom pixel URL (rarely needed):

```env
RESEND_OPEN_TRACKING_PIXEL_URL=
```

Leave empty to rely on Resend domain-level open tracking.

---

## Quick checklist

- [ ] Domain added in Resend
- [ ] MX + TXT SPF on `send` in Namecheap
- [ ] TXT DKIM on `resend._domainkey` in Namecheap
- [ ] TXT DMARC on `_dmarc` in Namecheap
- [ ] Resend shows **Verified**
- [ ] `RESEND_USE_SANDBOX=false` in production
- [ ] From addresses use `@buildwithinnocent.com`
- [ ] Test form → inbox (not spam)
- [ ] Gmail “Show original” shows SPF/DKIM pass
