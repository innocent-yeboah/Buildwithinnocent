import { NextResponse } from "next/server";

import { getChatReply, isChatConfigured } from "@/lib/chat-assistant";
import { WEBHOOK_FORMATS } from "@/lib/chat-webhook";
import { getClientIp } from "@/lib/leads-ip";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  return NextResponse.json({
    configured: isChatConfigured(),
    webhookFormat: process.env.CHAT_WEBHOOK_FORMAT?.trim() || "meta",
    supportedFormats: [...WEBHOOK_FORMATS, "meta", "whatsapp", "simple"],
  });
}

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`chat:${ip}`, { limit: 24, windowMs: 60_000 });
    if (!limited.success) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)) },
        }
      );
    }

    if (!isChatConfigured()) {
      return NextResponse.json(
        {
          error: "Chat assistant is not configured yet.",
          configured: false,
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const sessionId =
      typeof body.sessionId === "string" && body.sessionId.length <= 64
        ? body.sessionId
        : `anon-${ip}`;
    const history = Array.isArray(body.history) ? body.history : [];
    const metadata =
      body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
        ? body.metadata
        : {};

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    const reply = await getChatReply({ message, sessionId, history, metadata });

    if (!reply) {
      return NextResponse.json(
        { error: "No reply from assistant. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply, configured: true });
  } catch (err) {
    console.error("Chat API error:", err);
    const msg = err instanceof Error ? err.message : "Chat failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
