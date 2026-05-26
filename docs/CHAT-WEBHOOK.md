# Website chat ↔ WhatsApp AI webhook alignment

The in-site chat (`/api/chat`) forwards messages to your **same automation** as WhatsApp **+233 530 453 400** using `CHAT_WEBHOOK_URL`.

Pick the payload format that matches your workflow.

---

## Environment variables

```env
# Required — paste your n8n/Make/webhook URL (same brain as WhatsApp AI)
CHAT_WEBHOOK_URL=https://your-host/webhook/xxxxxxxx

# Optional auth
CHAT_WEBHOOK_SECRET=your-shared-secret

# Payload shape (default: meta = Meta WhatsApp Cloud API envelope)
CHAT_WEBHOOK_FORMAT=meta

# Only for CHAT_WEBHOOK_FORMAT=meta
CHAT_META_PHONE_NUMBER_ID=your_meta_phone_number_id
CHAT_META_BUSINESS_ACCOUNT_ID=your_waba_id
CHAT_META_DISPLAY_NUMBER=233530453400
```

| `CHAT_WEBHOOK_FORMAT` | Use when |
|------------------------|----------|
| `meta` (default) | Flow built on **Meta WhatsApp Cloud API** / “WhatsApp Trigger” in n8n or Make |
| `n8n` | **n8n AI Agent** / Chat Trigger (`chatInput` + `sessionId`) |
| `flowise` | **Flowise** / Langflow (`question` + `overrideConfig.sessionId`) |
| `bwi` | Simple JSON (custom webhook you control) |

---

## Format 1 — `meta` (recommended for WhatsApp Business AI)

Mirrors an incoming **text message** webhook from Meta.

**Example POST body:**

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "buildwithinnocent",
      "changes": [
        {
          "field": "messages",
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "233530453400",
              "phone_number_id": "WEBSITE_CHAT_CHANNEL"
            },
            "contacts": [
              {
                "profile": { "name": "Website Visitor" },
                "wa_id": "123456789012345"
              }
            ],
            "messages": [
              {
                "from": "123456789012345",
                "id": "wamid.website.1710000000.123456",
                "timestamp": "1710000000",
                "type": "text",
                "text": { "body": "I need a website for my shop" }
              }
            ]
          }
        }
      ]
    }
  ],
  "_buildwithinnocent": {
    "channel": "website",
    "sessionId": "uuid-from-browser",
    "history": [],
    "pageUrl": "https://buildwithinnocent.com/"
  }
}
```

**n8n tip:** Add an **IF** node after the webhook:

- WhatsApp: `{{ $json.entry }}` exists  
- Website: `{{ $json._buildwithinnocent.channel }}` equals `website`

Route both into the **same AI Agent** node. Use `_buildwithinnocent.sessionId` (or `messages[0].from`) as conversation memory key.

**Expected response JSON** (any of these fields):

```json
{ "reply": "Thanks! What kind of business do you run?" }
```

Also supported: `message`, `text`, `output`, `answer`, `response`, or n8n array `[{ "json": { "output": "..." } }]`.

---

## Format 2 — `n8n` (AI Agent / Chat Trigger)

**Example POST body:**

```json
{
  "action": "sendMessage",
  "sessionId": "uuid-from-browser",
  "chatInput": "I need a website for my shop",
  "metadata": {
    "channel": "website",
    "source": "buildwithinnocent.com",
    "history": [
      { "role": "user", "content": "Hi" },
      { "role": "assistant", "content": "Hello! How can I help?" }
    ],
    "pageUrl": "https://buildwithinnocent.com/",
    "referrer": ""
  }
}
```

Point your **n8n Webhook** or **Chat Trigger** URL to `CHAT_WEBHOOK_URL`.

---

## Format 3 — `flowise`

**Example POST body:**

```json
{
  "question": "I need a website for my shop",
  "overrideConfig": {
    "sessionId": "uuid-from-browser",
    "vars": {
      "channel": "website",
      "source": "buildwithinnocent.com",
      "historyJson": "[{\"role\":\"user\",\"content\":\"Hi\"}]",
      "pageUrl": "https://buildwithinnocent.com/"
    }
  }
}
```

---

## Format 4 — `bwi` (simple / custom)

**Example POST body:**

```json
{
  "message": "I need a website for my shop",
  "sessionId": "uuid-from-browser",
  "history": [],
  "source": "website",
  "channel": "website_chat",
  "metadata": {
    "pageUrl": "https://buildwithinnocent.com/"
  },
  "assistant": {
    "phone_e164": "233530453400",
    "phone_display": "+233 530 453 400",
    "name": "Build With Innocent AI Sales Assistant"
  }
}
```

---

## How to find your format

1. Open your **working WhatsApp AI** workflow (n8n / Make / other).
2. Open the **first node** that receives the user message (Webhook or WhatsApp Trigger).
3. Run **Test workflow** and send a WhatsApp message to **+233 530 453 400**.
4. Inspect the **incoming JSON**:
   - Has `entry[].changes[].value.messages` → use `CHAT_WEBHOOK_FORMAT=meta`
   - Has `chatInput` → use `n8n`
   - Has `question` + `overrideConfig` → use `flowise`
   - Otherwise → use `bwi` and map fields in your automation

5. Set env on **Vercel** and `.env.local`, redeploy, test the site chat widget.

---

## Test locally

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello\",\"sessionId\":\"test-1\",\"history\":[]}"
```

You should get `{ "reply": "..." }`.

---

## Still stuck?

Paste a **sample incoming WhatsApp JSON** (redact tokens) into your next message — we can set `CHAT_WEBHOOK_FORMAT` or add a dedicated mapper for your exact shape.
