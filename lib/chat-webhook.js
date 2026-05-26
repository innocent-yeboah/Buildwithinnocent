/**
 * Outbound webhook payloads for /api/chat → WhatsApp AI automation.
 * Set CHAT_WEBHOOK_FORMAT to match your stack (see docs/CHAT-WEBHOOK.md).
 */

import { WA_AI_DISPLAY, WA_AI_E164 } from "@/lib/brand";

const MAX_HISTORY = 12;

export const WEBHOOK_FORMATS = ["bwi", "n8n", "meta", "flowise"];

function trimHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }));
}

function webWaId(sessionId) {
  const safe = String(sessionId).replace(/\D/g, "").slice(0, 15);
  return safe.length >= 8 ? safe : `web${Date.now()}`.slice(0, 15);
}

/** Default — simple JSON (backward compatible). */
export function buildBwiPayload({ message, sessionId, history, metadata }) {
  return {
    message: message.trim(),
    sessionId,
    history: trimHistory(history),
    source: "website",
    channel: "website_chat",
    metadata: metadata ?? {},
    assistant: {
      phone_e164: WA_AI_E164,
      phone_display: WA_AI_DISPLAY,
      name: "Build With Innocent AI Sales Assistant",
    },
  };
}

/**
 * n8n AI Agent / Chat Trigger style
 * @see https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.chattrigger/
 */
export function buildN8nPayload({ message, sessionId, history, metadata }) {
  return {
    action: "sendMessage",
    sessionId,
    chatInput: message.trim(),
    metadata: {
      channel: "website",
      source: "buildwithinnocent.com",
      history: trimHistory(history),
      ...metadata,
    },
  };
}

/**
 * Meta WhatsApp Cloud API — incoming message webhook shape.
 * Use when your n8n/Make flow starts from a WhatsApp "messages" trigger.
 */
export function buildMetaWhatsAppPayload({ message, sessionId, history, metadata }) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const visitorId = webWaId(sessionId);

  return {
    object: "whatsapp_business_account",
    entry: [
      {
        id: process.env.CHAT_META_BUSINESS_ACCOUNT_ID?.trim() || "buildwithinnocent",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: {
                display_phone_number:
                  process.env.CHAT_META_DISPLAY_NUMBER?.trim() || WA_AI_DISPLAY.replace(/\s/g, ""),
                phone_number_id:
                  process.env.CHAT_META_PHONE_NUMBER_ID?.trim() || "WEBSITE_CHAT_CHANNEL",
              },
              contacts: [
                {
                  profile: { name: metadata?.visitorName || "Website Visitor" },
                  wa_id: visitorId,
                },
              ],
              messages: [
                {
                  from: visitorId,
                  id: `wamid.website.${timestamp}.${visitorId.slice(-6)}`,
                  timestamp,
                  type: "text",
                  text: { body: message.trim() },
                },
              ],
            },
          },
        ],
      },
    ],
    _buildwithinnocent: {
      channel: "website",
      sessionId,
      history: trimHistory(history),
      pageUrl: metadata?.pageUrl ?? null,
    },
  };
}

/** Flowise / Langflow prediction API style */
export function buildFlowisePayload({ message, sessionId, history, metadata }) {
  return {
    question: message.trim(),
    overrideConfig: {
      sessionId,
      vars: {
        channel: "website",
        source: "buildwithinnocent.com",
        historyJson: JSON.stringify(trimHistory(history)),
        pageUrl: metadata?.pageUrl ?? "",
      },
    },
    metadata: metadata ?? {},
  };
}

/**
 * @param {{ message: string; sessionId: string; history?: object[]; metadata?: object }} input
 */
export function buildChatWebhookPayload(input) {
  const format = (process.env.CHAT_WEBHOOK_FORMAT?.trim() || "meta").toLowerCase();

  switch (format) {
    case "bwi":
    case "simple":
      return buildBwiPayload(input);
    case "n8n":
      return buildN8nPayload(input);
    case "flowise":
      return buildFlowisePayload(input);
    case "meta":
    case "whatsapp":
    case "meta_whatsapp":
      return buildMetaWhatsAppPayload(input);
    default:
      throw new Error(
        `Unknown CHAT_WEBHOOK_FORMAT "${format}". Use: ${WEBHOOK_FORMATS.join(", ")}, meta, flowise`
      );
  }
}

/**
 * Parse automation response — supports n8n, Flowise, Meta-adjacent, and BWI shapes.
 * @param {unknown} data
 * @returns {string | null}
 */
export function parseChatWebhookResponse(data) {
  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (!data || typeof data !== "object") return null;

  /** n8n often returns [{ json: { ... } }] */
  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (first?.json) {
      return parseChatWebhookResponse(first.json);
    }
  }

  const obj = /** @type {Record<string, unknown>} */ (data);

  const direct =
    pickString(obj, "reply") ||
    pickString(obj, "message") ||
    pickString(obj, "text") ||
    pickString(obj, "output") ||
    pickString(obj, "answer") ||
    pickString(obj, "response");

  if (direct) return direct;

  /** n8n AI Agent nested */
  if (obj.data && typeof obj.data === "object") {
    return parseChatWebhookResponse(obj.data);
  }

  /** Flowise */
  if (typeof obj.text === "string") return obj.text.trim();
  if (typeof obj.answer === "string") return obj.answer.trim();

  /** OpenAI-shaped proxy */
  const choices = obj.choices;
  if (Array.isArray(choices) && choices[0]?.message?.content) {
    return String(choices[0].message.content).trim();
  }

  return null;
}

function pickString(obj, key) {
  const v = obj[key];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}
