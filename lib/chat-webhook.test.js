import { describe, expect, it } from "vitest";

import {
  buildBwiPayload,
  buildMetaWhatsAppPayload,
  buildN8nPayload,
  parseChatWebhookResponse,
} from "./chat-webhook.js";

describe("chat webhook payloads", () => {
  const base = {
    message: "I need a website",
    sessionId: "sess-abc-123",
    history: [{ role: "user", content: "Hi" }],
    metadata: { pageUrl: "https://buildwithinnocent.com/" },
  };

  it("builds BWI canonical payload", () => {
    const body = buildBwiPayload(base);
    expect(body.message).toBe("I need a website");
    expect(body.sessionId).toBe("sess-abc-123");
    expect(body.source).toBe("website");
    expect(body.assistant.phone_e164).toBe("233530453400");
  });

  it("builds n8n AI Agent payload", () => {
    const body = buildN8nPayload(base);
    expect(body.action).toBe("sendMessage");
    expect(body.chatInput).toBe("I need a website");
    expect(body.sessionId).toBe("sess-abc-123");
    expect(body.metadata.channel).toBe("website");
  });

  it("builds Meta WhatsApp webhook envelope", () => {
    const body = buildMetaWhatsAppPayload(base);
    expect(body.object).toBe("whatsapp_business_account");
    const msg = body.entry[0].changes[0].value.messages[0];
    expect(msg.type).toBe("text");
    expect(msg.text.body).toBe("I need a website");
    expect(body._buildwithinnocent.sessionId).toBe("sess-abc-123");
  });

  it("parses varied webhook responses", () => {
    expect(parseChatWebhookResponse({ reply: "Hello" })).toBe("Hello");
    expect(parseChatWebhookResponse({ output: "From n8n" })).toBe("From n8n");
    expect(parseChatWebhookResponse([{ json: { text: "Nested" } }])).toBe("Nested");
  });
});
