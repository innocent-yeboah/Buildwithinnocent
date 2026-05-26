"use client";

import { track } from "@vercel/analytics/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { OPEN_CONSULT_EVENT } from "@/lib/consultation";
import { WA_HUMAN_DISPLAY, WA_PRIMARY } from "@/lib/brand";

const STORAGE_KEY = "bwi_chat_session";
const WELCOME =
  "Hello! I'm the Build With Innocent assistant. I help businesses explore websites, WhatsApp automation, dashboards, and custom software. What would you like to build?";

function getSessionId() {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(STORAGE_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s-${Date.now()}`;
    sessionStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

function ChatIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 5.147 0 9.34 3.946 9.34 8.804 0 1.73-.52 3.337-1.41 4.68-.23.34-.47.67-.72.98-1.13 1.39-2.7 2.44-4.49 3.01a1.09 1.09 0 00-.58.98v2.01c0 .55-.45 1-1 1H9.5c-5.23 0-9.5-4.06-9.5-9.04C0 6.946 4.193 3 9.34 3c.06 0 .12 0 .18.002.55.008 1.1.03 1.64.06.31.02.62.045.933.076z" />
    </svg>
  );
}

export function SiteChatWidget() {
  const dialogId = useId();
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => setConfigured(d.configured !== false))
      .catch(() => setConfigured(false));
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);
    track("site_chat_message_sent");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: getSessionId(),
          history: messages.filter((m) => m.role === "user" || m.role === "assistant"),
          metadata: {
            pageUrl: typeof window !== "undefined" ? window.location.href : "",
            referrer: typeof document !== "undefined" ? document.referrer || "" : "",
            channel: "website_chat",
          },
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const fallback =
          res.status === 503
            ? "Live chat is being connected. Please use the consultation form on this page, or check back shortly."
            : data.error || "Something went wrong. Please try again.";
        setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
        if (res.status === 503) setConfigured(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I could not reach the server. Check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const openConsult = () => {
    track("site_chat_book_consult");
    setOpen(false);
    const onHome =
      typeof window !== "undefined" &&
      (window.location.pathname === "/" || window.location.pathname === "");
    if (onHome) {
      window.dispatchEvent(new CustomEvent(OPEN_CONSULT_EVENT));
    } else {
      window.location.href = "/?book=consult";
    }
  };

  return (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-[140] bg-black/40 backdrop-blur-[1px] sm:hidden"
          aria-label="Close chat"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={`fixed z-[150] flex flex-col items-end gap-3 ${
          open ? "bottom-0 right-0 left-0 sm:bottom-6 sm:right-6 sm:left-auto" : "bottom-6 right-6"
        }`}
      >
        {open ? (
          <div
            ref={panelRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
            className="flex w-full max-h-[min(85vh,32rem)] flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:w-[min(100vw-2rem,24rem)] sm:rounded-2xl"
          >
            <header className="flex items-start justify-between gap-2 bg-brand-navy px-4 py-3 text-white">
              <div>
                <p id={`${dialogId}-title`} className="text-sm font-bold tracking-wide">
                  AI Sales Assistant
                </p>
                <p className="mt-0.5 text-xs text-slate-200">Build With Innocent · replies instantly</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-white/90 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close chat"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>
            </header>

            <div className="h-1 bg-brand-green" aria-hidden="true" />

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-brand-surface min-h-[12rem]"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.map((msg, i) => (
                <div
                  key={`${i}-${msg.role}`}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-brand-navy text-white rounded-br-md"
                        : "bg-white text-brand-body border border-slate-200 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white border border-slate-200 px-4 py-3 text-sm text-brand-body">
                    <span className="inline-flex gap-1" aria-label="Assistant is typing">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-green [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-green [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-green [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-200 bg-white p-3">
              {process.env.NODE_ENV === "development" && !configured ? (
                <p className="mb-2 rounded-lg border border-amber-100 bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
                  Add OPENAI_API_KEY or CHAT_WEBHOOK_URL in .env.local to enable AI replies.
                </p>
              ) : null}

              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage();
                }}
              >
                <label htmlFor={`${dialogId}-input`} className="sr-only">
                  Your message
                </label>
                <input
                  ref={inputRef}
                  id={`${dialogId}-input`}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about websites, automation, dashboards…"
                  disabled={loading}
                  maxLength={2000}
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-slate-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/30 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="shrink-0 rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-muted disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus:ring-brand-green/50"
                >
                  Send
                </button>
              </form>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-body">
                <button
                  type="button"
                  onClick={openConsult}
                  className="font-semibold text-brand-navy underline-offset-2 hover:underline"
                >
                  Book free consultation
                </button>
                <span className="text-slate-300" aria-hidden="true">
                  |
                </span>
                <a
                  href={WA_PRIMARY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-body hover:text-brand-green"
                  onClick={() => track("site_chat_whatsapp_human_fallback")}
                >
                  WhatsApp Innocent ({WA_HUMAN_DISPLAY})
                </a>
              </div>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            track(open ? "site_chat_close" : "site_chat_open");
          }}
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          aria-label={open ? "Close chat assistant" : "Open chat assistant"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white shadow-xl shadow-brand-green/35 ring-2 ring-white transition-transform duration-300 hover:scale-105 hover:bg-brand-green-muted focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/40 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:h-[3.75rem] sm:w-[3.75rem]"
        >
          {open ? (
            <span className="text-2xl leading-none" aria-hidden="true">
              ×
            </span>
          ) : (
            <ChatIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          )}
        </button>
      </div>
    </>
  );
}
