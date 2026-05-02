"use client";

import { track } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const HERO_SLIDES = [
  {
    src: "/hero/hero-1.jpg",
    alt: "Professional laptop on desk with programming environment visible on screen",
  },
  {
    src: "/hero/hero-2.jpg",
    alt: "Developer workspace with laptop showing application code on display",
  },
  {
    src: "/hero/hero-3.jpg",
    alt: "Software source code on a large monitor in a focused workspace",
  },
  {
    src: "/hero/hero-4.jpg",
    alt: "Hands typing on laptop keyboard with coding tutorial on screen",
  },
];

const LIVE_PROJECTS = [
  {
    title: "SchoolLedger GH",
    summary:
      "Multi-tenant school operating system for Ghana's private schools — tuition and feeding fees, student records, parent messaging, and WhatsApp payment confirmations with row-level security.",
    stack: ["Next.js", "Supabase", "WhatsApp"],
    href: "https://schoolledgergh.vercel.app/",
    status: "Live",
  },
  {
    title: "Benizer Green Shop",
    summary:
      "Full e-commerce launch for sustainable retail — product storytelling, streamlined checkout, and a polished storefront aligned with the client's green brand.",
    stack: ["Next.js", "Tailwind CSS", "Commerce"],
    href: "https://benizergreenshop.com",
    status: "Live",
  },
  {
    title: "WhatsApp AI Assistant",
    summary:
      "Subscription-free AI assistant powered by Gemini — replaced Make.com and OpenAI glue code with a single codebase and sub-30-minute onboarding.",
    stack: ["Next.js", "Gemini API", "WhatsApp"],
    href: null,
    status: "Production",
  },
  {
    title: "My Central Bank",
    summary:
      "Personal finance tracker for income, expenses, and savings goals — real-time sync across devices on PostgreSQL via Supabase.",
    stack: ["Next.js", "Supabase", "PostgreSQL"],
    href: null,
    status: "Live",
  },
  {
    title: "FounderOS",
    summary:
      "Life-business operating system — habits, income pipeline, and weekly reviews — shipped with GitHub Actions CI/CD on Vercel.",
    stack: ["Next.js", "Supabase", "Vercel"],
    href: null,
    status: "Live",
  },
];

const FAQ_ITEMS = [
  {
    q: 'What does "free prototype" actually mean?',
    a: "We align on a small, tangible slice of your product — enough to prove the concept — you try it, then we agree on scope and pricing for the full build. Details vary by project.",
  },
  {
    q: "Will I pay recurring fees in USD?",
    a: "The goal is software you own, without open-ended USD SaaS rent for core delivery. Ongoing costs (if any) are things like hosting or SMS/WhatsApp usage — discussed upfront.",
  },
  {
    q: "How soon can we see something working?",
    a: "After a consultation, timelines depend on complexity. Many engagements start with a prototype window measured in weeks, not months — not overnight magic, but disciplined execution.",
  },
  {
    q: "Do I own the code and data?",
    a: "Client engagements are structured so you own what you pay for, subject to the written agreement. Third-party services (e.g. hosting, Supabase) have their own terms.",
  },
  {
    q: "Can we meet in person?",
    a: "Yes — Build With Innocent is based in Accra. Remote collaboration works too; we pick whatever keeps your project moving.",
  },
  {
    q: "What stacks do you build with?",
    a: "Primarily modern TypeScript/JavaScript stacks — commonly Next.js, Supabase/PostgreSQL, and integrations such as WhatsApp or email providers — chosen for maintainability and fit.",
  },
  {
    q: "What happens after launch?",
    a: "We can agree support retainers, handoffs to your team, or documentation — scoped separately so you are never locked into surprise subscriptions.",
  },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [formStatus, setFormStatus] = useState({ submitting: false, message: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);
  const [pauseHero, setPauseHero] = useState(false);

  const formRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const serviceRef = useRef(null);
  const messageRef = useRef(null);
  const honeypotRef = useRef(null);
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetId = useRef(null);

  const openConsultModal = () => {
    track("consultation_cta_click");
    setShowModal(true);
  };

  useEffect(() => {
    if (!showModal) return undefined;
    const onKey = (ev) => {
      if (ev.key === "Escape") setShowModal(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showModal]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (pauseHero) return undefined;
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(id);
  }, [pauseHero]);

  useEffect(() => {
    if (!showModal || !TURNSTILE_SITE_KEY) return undefined;

    let cancelled = false;

    const mountWidget = () => {
      if (cancelled || !turnstileContainerRef.current || typeof window === "undefined") return;
      const turnstile = window.turnstile;
      if (!turnstile) return;

      turnstileContainerRef.current.innerHTML = "";
      turnstileWidgetId.current = turnstile.render(turnstileContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    const poll = setInterval(() => {
      if (typeof window !== "undefined" && window.turnstile) {
        clearInterval(poll);
        mountWidget();
      }
    }, 40);

    return () => {
      cancelled = true;
      clearInterval(poll);
      if (typeof window !== "undefined" && window.turnstile && turnstileWidgetId.current != null) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch {
          /* ignore */
        }
      }
      turnstileWidgetId.current = null;
      setTurnstileToken("");
    };
  }, [showModal]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const name = nameRef.current?.value ?? "";
    const email = emailRef.current?.value ?? "";
    const phone = phoneRef.current?.value ?? "";
    const service = serviceRef.current?.value ?? "";
    const messageText = messageRef.current?.value ?? "";
    const website = honeypotRef.current?.value ?? "";

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setFormStatus({
        submitting: false,
        message: "Please complete the security check below.",
      });
      return;
    }

    setFormStatus({ submitting: true, message: "" });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          message: messageText,
          website,
          turnstileToken: TURNSTILE_SITE_KEY ? turnstileToken : undefined,
        }),
      });

      if (response.ok) {
        track("lead_submitted", {
          service: service.trim() || "unspecified",
        });
        setFormStatus({
          submitting: false,
          message: "Thank you! I will get back to you within 24 hours.",
        });
        setTimeout(() => {
          setShowModal(false);
          setFormStatus({ submitting: false, message: "" });
          formRef.current?.reset();
          setTurnstileToken("");
        }, 2000);
      } else {
        const errBody = await response.json().catch(() => ({}));
        setFormStatus({
          submitting: false,
          message: errBody.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setFormStatus({
        submitting: false,
        message: "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {TURNSTILE_SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      ) : null}

      <section
        id="top"
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20"
        aria-roledescription="carousel"
        aria-label="Introduction"
        onMouseEnter={() => setPauseHero(true)}
        onMouseLeave={() => setPauseHero(false)}
        onFocusCapture={() => setPauseHero(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setPauseHero(false);
        }}
      >
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
                i === heroIndex ? "opacity-100 z-[1]" : "opacity-0 z-0"
              }`}
              aria-hidden={i !== heroIndex}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover object-center brightness-[1.06] contrast-[1.03]"
                sizes="100vw"
                priority={i === 0}
                quality={88}
              />
            </div>
          ))}
        </div>

        <div
          className="absolute inset-0 z-[2] bg-gradient-to-b from-black/38 via-black/22 to-black/44 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_130%_95%_at_50%_42%,rgba(0,0,0,0)_25%,rgba(0,0,0,0.16)_55%,rgba(0,0,0,0.34)_100%)] pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center w-full px-3">
          <p className="sr-only" aria-live="polite">
            Slide {heroIndex + 1} of {HERO_SLIDES.length}
          </p>

          <div className="rounded-3xl bg-slate-950/58 backdrop-blur-md px-6 py-10 md:px-12 md:py-11 shadow-2xl ring-1 ring-white/20 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.65)]">
              Stop Fighting Your Business.
              <br />
              <span className="text-[#6EE7B7] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
                Start Running a System.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mt-6 max-w-3xl mx-auto [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
              Most Ghanaian businesses are losing money, time, and customers — not because their
              products are bad, but because their{" "}
              <span className="font-semibold text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]">
                systems are broken.
              </span>
            </p>
            <p className="text-lg md:text-xl text-gray-100 mt-4 max-w-2xl mx-auto [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
              I build custom software that turns chaos into clarity.
              <span className="font-bold text-[#6EE7B7] [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]">
                {" "}
                Free prototype. No monthly USD fees. You own everything.
              </span>
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={openConsultModal}
                className="bg-[#1E3A5F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#152c47] transition transform hover:-translate-y-1 duration-300 shadow-lg cursor-pointer ring-2 ring-white/10"
              >
                Book a Free Consultation
              </button>
              <a
                href="#work"
                onClick={() => track("hero_see_work_click")}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#1E3A5F] transition transform hover:-translate-y-1 duration-300 text-center ring-2 ring-white/10"
              >
                See My Work
              </a>
            </div>
          </div>

          <div className="mt-12 inline-block bg-white/[0.96] backdrop-blur-md rounded-full px-6 py-3 shadow-xl border border-white/40 ring-1 ring-black/10">
            <p className="text-gray-700 text-sm flex flex-wrap items-center justify-center gap-2">
              <span className="text-[#2E7D32]" aria-hidden="true">
                ✓
              </span>
              Built on The Four Laws of Atomic Habits
              <span className="text-gray-300 mx-1" aria-hidden="true">
                |
              </span>
              <span className="text-[#2E7D32]" aria-hidden="true">
                ✓
              </span>
              5 shipped platforms and tools
            </p>
          </div>
          <div className="mt-8 max-w-md mx-auto rounded-2xl bg-slate-950/55 backdrop-blur-md px-5 py-4 ring-1 ring-white/15 shadow-lg">
            <figure className="text-gray-200 text-sm italic">
              <blockquote>
                &ldquo;Inspiring story. Let&apos;s celebrate how far you&apos;ve come.&rdquo;
              </blockquote>
              <figcaption className="block font-semibold text-gray-100 not-italic mt-1">
                — Clementina Aina, Founder of 6Cs (Top 0.01% EdTech)
              </figcaption>
            </figure>
          </div>

          <div
            className="flex justify-center gap-2.5 mt-14 flex-wrap"
            role="tablist"
            aria-label="Hero workspace photos"
          >
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === heroIndex}
                aria-label={`Workspace photo ${i + 1} of ${HERO_SLIDES.length}`}
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white/90 shadow-sm ${
                  i === heroIndex
                    ? "w-9 bg-[#2E7D32] ring-2 ring-white/70 shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
                    : "w-2.5 bg-white/90 hover:bg-white shadow-[0_1px_6px_rgba(0,0,0,0.25)]"
                }`}
                onClick={() => setHeroIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-[#1E3A5F]">What I Build</h2>
        <p className="text-center text-gray-600 mt-2 mb-10">Services I offer to help businesses grow</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3" aria-hidden="true">
              🖥️
            </div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">Modern Websites</h3>
            <p className="text-gray-600 mt-2">
              Professional modern websites that serve as an engine for business growth — they attract
              customers and build trust. Mobile-friendly and fast.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3" aria-hidden="true">
              💬
            </div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">WhatsApp AI Automation</h3>
            <p className="text-gray-600 mt-2">
              Automated replies to customer messages. Save hours every week. Instant responses.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3" aria-hidden="true">
              📊
            </div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">Business Dashboards</h3>
            <p className="text-gray-600 mt-2">
              Track inventory, sales, and payments in one place. Know your business in real-time.
            </p>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="relative py-20 md:py-24 px-4 border-t-4 border-[#2E7D32] bg-gradient-to-b from-[#e8f5e9]/55 via-white to-[#f4f8fb]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2E7D32]/40 to-transparent pointer-events-none" aria-hidden />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-[#2E7D32] text-white text-[11px] font-semibold uppercase tracking-[0.2em] px-5 py-2 mb-4 shadow-md shadow-[#2E7D32]/25">
              Portfolio
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1E3A5F] tracking-tight">
            Live platforms &amp; products
          </h2>
          <p className="text-center text-[#1E3A5F]/80 mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            Production-grade builds you can open in the browser — schools, commerce, and automation,
            shipped for ownership and long-term operation.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LIVE_PROJECTS.map((project) => (
              <article
                key={project.title}
                className="group flex flex-col rounded-xl overflow-hidden border-2 border-[#1E3A5F]/18 bg-white shadow-md shadow-[#1E3A5F]/06 hover:border-[#2E7D32]/55 hover:shadow-xl hover:shadow-[#2E7D32]/12 transition-all duration-300"
              >
                <div
                  className="h-1.5 bg-gradient-to-r from-[#1E3A5F] via-[#2E7D32] to-[#1E3A5F]"
                  aria-hidden
                />
                <div className="flex flex-col flex-1 p-7 md:p-8">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-[1.05rem] md:text-lg font-bold text-[#1E3A5F] leading-snug pr-2">
                      {project.title}
                    </h3>
                    <span
                      className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white border border-transparent shadow-sm ${
                        project.status === "Production"
                          ? "bg-[#1E3A5F]"
                          : "bg-[#2E7D32]"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1">{project.summary}</p>
                  <ul className="flex flex-wrap gap-2 mt-6 list-none p-0">
                    {project.stack.map((tag) => (
                      <li key={tag}>
                        <span className="inline-block text-[11px] font-semibold text-[#1E3A5F] bg-[#e8f5e9] border border-[#2E7D32]/35 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-[#2E7D32]/20">
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          track("portfolio_visit", {
                            project: project.title,
                          })
                        }
                        className="group/link inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#256629] transition-colors shadow-md shadow-[#2E7D32]/30"
                      >
                        Visit live site
                        <span
                          aria-hidden="true"
                          className="transition-transform group-hover/link:translate-x-0.5"
                        >
                          →
                        </span>
                      </a>
                    ) : (
                      <p className="text-xs text-[#1E3A5F]/75 leading-snug border-l-[3px] border-[#2E7D32] pl-3 py-0.5 bg-[#e8f5e9]/40 rounded-r-md">
                        Private / invite-only — request a walkthrough when we speak.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1E3A5F] mb-12">
            From Uber Seat to Desk
          </h2>
          <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
            <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
              <p className="font-bold text-[#1E3A5F] mb-2">1. I noticed a pattern.</p>
              <p>
                I was driving Uber in Accra, watching the world through my windshield. But I was also
                paying attention to something else — systems. Why do some countries and companies
                thrive while others struggle? Why do some businesses grow effortlessly while others
                die slowly?
              </p>
              <p className="mt-2">
                The answer was everywhere once I started looking.{" "}
                <strong className="text-[#2E7D32]">
                  The best organizations don&apos;t rely on heroes. They rely on systems.
                </strong>{" "}
                And the worst? They rely on hope, manual work, and expensive software that doesn&apos;t
                fit.
              </p>
            </div>
            <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
              <p className="font-bold text-[#1E3A5F] mb-2">2. I had to prove it to myself.</p>
              <p>So I started building. Not tutorials. Not courses. Live products. Real users. Real problems.</p>
              <p className="mt-2">
                First, I built <strong className="text-[#2E7D32]">My Central Bank</strong> — a personal
                finance tracker. Then <strong className="text-[#2E7D32]">FounderOS</strong> — a
                life-business operating system.
              </p>
              <p className="mt-2 italic text-[#1E3A5F]">&ldquo;Will systems actually work?&rdquo;</p>
              <p className="mt-2">
                The results shocked me. Within weeks, I had clarity. Within months, I had multiple live products.{" "}
                <strong className="text-[#2E7D32]">
                  The system worked better than I ever imagined.
                </strong>
              </p>
            </div>
            <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
              <p className="font-bold text-[#1E3A5F] mb-2">3. Then I looked around at businesses in Ghana.</p>
              <p>
                Brilliant owners. Great products. But stuck. Why? Because they were fighting their own
                systems — or running on none at all.
              </p>
              <p className="mt-2">
                Paper notebooks. WhatsApp chaos. Expensive software built for other countries. Processes
                that worked against them.
              </p>
              <p className="mt-2">
                <strong className="text-[#2E7D32]">
                  I realized something: These business owners didn&apos;t need more features. They
                  needed a working system.
                </strong>{" "}
                Software that actually solved THEIR problems, not problems from Silicon Valley.
              </p>
            </div>
            <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
              <p className="font-bold text-[#1E3A5F] mb-2">4. So I decided to build differently.</p>
              <p>
                I don&apos;t just write code. I build <strong className="text-[#2E7D32]">growth systems</strong>{" "}
                for businesses. A modern website that attracts customers. AI automation systems that
                save hours every day. Dashboards that show you what is actually happening in your
                business.
              </p>
              <p className="mt-2 font-semibold">And here is what makes me different:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  I build a <strong className="text-[#2E7D32]">free prototype first</strong> — you test it
                  before you pay
                </li>
                <li>
                  You <strong className="text-[#2E7D32]">own the software</strong> — no monthly USD
                  subscriptions
                </li>
                <li>
                  I am <strong className="text-[#2E7D32]">based in Accra</strong> — we can meet in person
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 p-6 bg-[#1E3A5F] text-white rounded-lg text-center">
            <p className="text-xl md:text-2xl font-bold italic">
              &ldquo;I don&apos;t build tutorials. I build systems that grow businesses.&rdquo;
            </p>
            <p className="mt-3 text-gray-300">— Innocent Golden, Founder of Build With Innocent</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1E3A5F] mb-12">What People Are Saying</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <figure className="bg-white p-6 rounded-lg border-l-4 border-[#2E7D32] shadow-md">
              <blockquote className="text-gray-700 italic text-md">
                &ldquo;It&apos;s so inspiring to hear your story! This is a great achievement.
                Let&apos;s celebrate how far you&apos;ve come. And you are just getting started.&rdquo;
              </blockquote>
              <figcaption className="text-[#1E3A5F] font-bold mt-4">— Clementina Aina</figcaption>
              <p className="text-gray-500 text-sm">Founder &amp; CEO, 6Cs (#48 EdTech Globally)</p>
            </figure>

            <figure className="bg-white p-6 rounded-lg border-l-4 border-[#2E7D32] shadow-md">
              <blockquote className="text-gray-700 italic text-md">
                &ldquo;Great to see you getting out there and doing the groundwork. Keep exploring,
                keep asking questions, and most importantly, keep listening.&rdquo;
              </blockquote>
              <figcaption className="text-[#1E3A5F] font-bold mt-4">— John Aacht</figcaption>
              <p className="text-gray-500 text-sm">CEO, CloudFruition</p>
            </figure>

            <figure className="bg-white p-6 rounded-lg border-l-4 border-[#2E7D32] shadow-md md:col-span-2 max-w-2xl mx-auto">
              <blockquote className="text-gray-700 italic text-md">
                &ldquo;You put a smile on my face whenever I see your post. It inspires me to take more
                risks. All the best brother.&rdquo;
              </blockquote>
              <figcaption className="text-[#1E3A5F] font-bold mt-4">— Darius Asante</figcaption>
              <p className="text-gray-500 text-sm">AI Automation for Service Businesses</p>
            </figure>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 md:py-24 px-4 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2E7D32] mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1E3A5F] tracking-tight">
            Questions founders ask before we build
          </h2>
          <p className="text-center text-slate-600 mt-4 text-base leading-relaxed">
            Straight answers on prototypes, ownership, timelines, and how we work with Ghanaian
            teams — before you ever jump on WhatsApp.
          </p>

          <div className="mt-12 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200 bg-slate-50/90 hover:border-[#2E7D32]/35 open:bg-white open:shadow-md transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer font-semibold text-[#1E3A5F] px-5 py-4 flex justify-between items-center gap-4 text-left list-none">
                  <span>{item.q}</span>
                  <span
                    className="text-[#2E7D32] text-xs shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </summary>
                <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              </details>
            ))}
          </div>

          <p className="text-center mt-10">
            <button
              type="button"
              onClick={openConsultModal}
              className="inline-flex items-center rounded-lg bg-[#1E3A5F] text-white px-6 py-3 text-sm font-semibold hover:bg-[#152c47] transition shadow-md"
            >
              Still unsure? Book a free consultation
            </button>
          </p>
        </div>
      </section>

      <a
        href="https://wa.me/233530453400"
        onClick={() => track("whatsapp_fab_click")}
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 z-50 flex items-center justify-center hover:scale-110"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {showModal ? (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) setShowModal(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-title"
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 id="consultation-title" className="text-2xl font-bold text-[#1E3A5F]">
                  Book Free Consultation
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A5F]"
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>
              <form ref={formRef} className="space-y-4 relative" onSubmit={handleFormSubmit} noValidate>
                <div
                  className="absolute left-[-10000px] top-0 w-px h-px overflow-hidden opacity-0"
                  aria-hidden="true"
                >
                  <label htmlFor="lead-website">Company website</label>
                  <input
                    ref={honeypotRef}
                    type="text"
                    id="lead-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    defaultValue=""
                  />
                </div>

                <div>
                  <label htmlFor="lead-name" className="block text-gray-800 font-semibold mb-2">
                    Your Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    type="text"
                    id="lead-name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white"
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="lead-email" className="block text-gray-800 font-semibold mb-2">
                    Email Address <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="lead-email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white"
                    placeholder="john@example.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="lead-phone" className="block text-gray-800 font-semibold mb-2">
                    WhatsApp Number <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={phoneRef}
                    type="tel"
                    id="lead-phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white"
                    placeholder="+233 XX XXX XXXX"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label htmlFor="lead-service" className="block text-gray-800 font-semibold mb-2">
                    What do you need help with?
                  </label>
                  <select
                    ref={serviceRef}
                    id="lead-service"
                    name="service"
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white"
                    defaultValue=""
                  >
                    <option value="">Select a service</option>
                    <option value="website">Modern Website</option>
                    <option value="whatsapp">WhatsApp AI Automation</option>
                    <option value="dashboard">Business Dashboard</option>
                    <option value="custom">Custom Software</option>
                    <option value="other">Other / I&apos;m not sure</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="lead-message" className="block text-gray-800 font-semibold mb-2">
                    Tell me more about your business
                  </label>
                  <textarea
                    ref={messageRef}
                    id="lead-message"
                    name="message"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white"
                    placeholder="Tell me about your business, challenges, and goals..."
                  />
                </div>

                {TURNSTILE_SITE_KEY ? (
                  <div ref={turnstileContainerRef} className="flex justify-center min-h-[65px]" />
                ) : null}

                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="w-full bg-[#1E3A5F] text-white py-3 rounded-lg font-semibold hover:bg-[#152c47] transition disabled:opacity-50"
                >
                  {formStatus.submitting ? "Sending..." : "Send message"}
                </button>
                {formStatus.message ? (
                  <p
                    className={`text-center text-sm ${formStatus.message.includes("Thank you") ? "text-green-600" : "text-red-600"}`}
                    role="status"
                  >
                    {formStatus.message}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="bg-[#1E3A5F] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Build With Innocent</h3>
              <p className="text-gray-300 text-sm">
                Custom software for Ghanaian businesses. Free prototype. No monthly USD fees.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#2E7D32]">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#top" className="hover:text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#work" className="hover:text-white transition">
                    My Work
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openConsultModal}
                    className="hover:text-white transition text-left text-gray-300 text-sm"
                  >
                    Book Consultation
                  </button>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#2E7D32]">Live Projects</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a
                    href="https://schoolledgergh.vercel.app/"
                    className="hover:text-white transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SchoolLedger GH
                  </a>
                </li>
                <li>
                  <a
                    href="https://benizergreenshop.com"
                    className="hover:text-white transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Benizer Green Shop
                  </a>
                </li>
                <li>
                  <span className="text-gray-400">WhatsApp AI Assistant</span>
                </li>
                <li>
                  <span className="text-gray-400">My Central Bank</span>
                </li>
                <li>
                  <span className="text-gray-400">FounderOS</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#2E7D32]">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="tel:+233530710628" className="hover:text-white transition">
                    +233 530 710 628
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/233530453400"
                    className="hover:text-white transition"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +233 530 453 400 (WhatsApp)
                  </a>
                </li>
                <li>
                  <a href="mailto:igtechgh@gmail.com" className="hover:text-white transition">
                    igtechgh@gmail.com
                  </a>
                </li>
                <li>
                  <a href="https://buildwithinnocent.com" className="hover:text-white transition">
                    buildwithinnocent.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm space-y-2">
            <p>&copy; 2026 Build With Innocent. All rights reserved.</p>
            <p>Built with Next.js &amp; Tailwind CSS. Deployed on Vercel.</p>
            <p className="flex flex-wrap justify-center gap-x-3 gap-y-1 pt-1">
              <Link href="/privacy" className="hover:text-white underline underline-offset-2">
                Privacy
              </Link>
              <span className="text-gray-600" aria-hidden="true">
                ·
              </span>
              <Link href="/terms" className="hover:text-white underline underline-offset-2">
                Terms
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
