/**
 * AI Sales Assistant — shared system prompt and reply providers for /api/chat.
 * Wire CHAT_WEBHOOK_URL + CHAT_WEBHOOK_FORMAT (see docs/CHAT-WEBHOOK.md).
 */

import {
  buildChatWebhookPayload,
  parseChatWebhookResponse,
} from "@/lib/chat-webhook";

export const CHAT_ASSISTANT_NAME = "Build With Innocent Assistant";

export const CHAT_SYSTEM_PROMPT = `You are the AI Sales Assistant for Build With Innocent, led by Innocent Golden in Accra, Ghana.

Your role:
- Help visitors understand digital business systems: modern websites, WhatsApp AI automation, business dashboards, custom software, and the 8-week coding bootcamp.
- Ask one clear follow-up question at a time when you need context (business type, timeline, budget range).
- Be warm, professional, and concise. Grade 7–8 reading level. No jargon walls.
- Never invent prices or guarantees. Say Innocent will confirm details on a consultation.
- Goal: qualify interest and encourage booking a free consultation or sharing name + WhatsApp for follow-up.
- If asked to speak to a human, say Innocent can follow up personally within 24 hours on WhatsApp.

Tone: trustworthy, African-enterprise focused, dignity-first. Never use guilt or high-pressure tactics.`;

const MAX_HISTORY = 12;

function trimHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }));
}

async function replyFromWebhook({ message, sessionId, history, metadata }) {
  const url = process.env.CHAT_WEBHOOK_URL?.trim();
  if (!url) return null;

  const payload = buildChatWebhookPayload({
    message,
    sessionId,
    history,
    metadata,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CHAT_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.CHAT_WEBHOOK_SECRET}` }
        : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Chat webhook failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const raw = await res.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    return raw.trim() || null;
  }

  return parseChatWebhookResponse(data);
}

async function replyFromOpenAI({ message, history }) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || apiKey.includes("sk-xxx")) return null;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const messages = [
    { role: "system", content: CHAT_SYSTEM_PROMPT },
    ...trimHistory(history),
    { role: "user", content: message.trim() },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 500,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI error ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

/**
 * @param {{
 *   message: string;
 *   sessionId: string;
 *   history?: { role: string; content: string }[];
 *   metadata?: Record<string, unknown>;
 * }} input
 * @returns {Promise<string | null>}
 */
export async function getChatReply({ message, sessionId, history, metadata }) {
  if (!message?.trim()) return null;

  if (process.env.CHAT_WEBHOOK_URL?.trim()) {
    return replyFromWebhook({ message, sessionId, history, metadata });
  }

  if (process.env.OPENAI_API_KEY?.trim()) {
    return replyFromOpenAI({ message, history });
  }

  return null;
}

export function isChatConfigured() {
  const webhook = process.env.CHAT_WEBHOOK_URL?.trim();
  const openai = process.env.OPENAI_API_KEY?.trim();
  return Boolean(
    webhook || (openai && !openai.includes("sk-xxx") && openai.length > 10)
  );
}
