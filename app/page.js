"use client";

import Image from "next/image";
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
                className="object-cover object-center"
                sizes="100vw"
                priority={i === 0}
                quality={88}
              />
            </div>
          ))}
        </div>

        <div
          className="absolute inset-0 z-[2] bg-gradient-to-b from-slate-950/85 via-slate-900/78 to-slate-950/88 pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
          <p className="sr-only" aria-live="polite">
            Slide {heroIndex + 1} of {HERO_SLIDES.length}
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-md">
            Stop Fighting Your Business.
            <br />
            <span className="text-[#86efac] drop-shadow-md">
              Start Running a System.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mt-6 max-w-3xl mx-auto drop-shadow-sm">
            Most Ghanaian businesses are losing money, time, and customers — not because their
            products are bad, but because their{" "}
            <span className="font-semibold text-white">systems are broken</span>.
          </p>
          <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl mx-auto drop-shadow-sm">
            I build custom software that turns chaos into clarity.
            <span className="font-bold text-[#86efac]">
              {" "}
              Free prototype. No monthly USD fees. You own everything.
            </span>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-[#1E3A5F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#152c47] transition transform hover:-translate-y-1 duration-300 shadow-lg cursor-pointer ring-2 ring-white/10"
            >
              Book a Free Consultation
            </button>
            <a
              href="#work"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#1E3A5F] transition transform hover:-translate-y-1 duration-300 text-center ring-2 ring-white/10"
            >
              See My Work
            </a>
          </div>
          <div className="mt-12 inline-block bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/30">
            <p className="text-gray-600 text-sm flex flex-wrap items-center justify-center gap-2">
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
              4 live products in 6 months
            </p>
          </div>
          <div className="mt-8 max-w-md mx-auto">
            <figure className="text-gray-300 text-sm italic">
              <blockquote>
                &ldquo;Inspiring story. Let&apos;s celebrate how far you&apos;ve come.&rdquo;
              </blockquote>
              <figcaption className="block font-semibold text-gray-200 not-italic mt-1">
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
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E3A5F]/50 ${
                  i === heroIndex ? "w-9 bg-[#2E7D32]" : "w-2.5 bg-white/45 hover:bg-white/80"
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

      <section id="work" className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-[#1E3A5F]">Live Projects</h2>
        <p className="text-center text-gray-600 mt-2 mb-10">Real products I have built and shipped</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#1E3A5F]">SchoolLedger GH</h3>
            <p className="text-gray-600 mt-2">
              Multi-tenant SaaS for Ghanaian schools. Live pilot school. WhatsApp payment
              confirmations. Supabase RLS across 5 tables.
            </p>
            <p className="text-sm text-[#2E7D32] mt-3 font-semibold">
              Stack: Next.js, Supabase, WhatsApp API
            </p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#1E3A5F]">WhatsApp AI Assistant</h3>
            <p className="text-gray-600 mt-2">
              Zero-subscription AI assistant using Google Gemini API. Replaced Make.com + OpenAI with
              pure code. Client onboarding in under 30 minutes.
            </p>
            <p className="text-sm text-[#2E7D32] mt-3 font-semibold">
              Stack: Next.js, Gemini API, WhatsApp API
            </p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#1E3A5F]">My Central Bank</h3>
            <p className="text-gray-600 mt-2">
              Personal finance tracker with income, expense, and savings tracking. Real-time Supabase
              sync across devices.
            </p>
            <p className="text-sm text-[#2E7D32] mt-3 font-semibold">
              Stack: Next.js, Supabase, PostgreSQL
            </p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#1E3A5F]">FounderOS</h3>
            <p className="text-gray-600 mt-2">
              Life-business operating system with habit tracking, income pipeline, and weekly reviews.
              Deployed via GitHub CI/CD.
            </p>
            <p className="text-sm text-[#2E7D32] mt-3 font-semibold">
              Stack: Next.js, Supabase, Vercel
            </p>
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
                The results shocked me. Within weeks, I had clarity. Within months, I had 4 live products.{" "}
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

      <a
        href="https://wa.me/233530453400"
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
                    onClick={() => setShowModal(true)}
                    className="hover:text-white transition text-left text-gray-300 text-sm"
                  >
                    Book Consultation
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-[#2E7D32]">Live Projects</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>SchoolLedger GH</li>
                <li>WhatsApp AI Assistant</li>
                <li>My Central Bank</li>
                <li>FounderOS</li>
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

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Build With Innocent. All rights reserved.</p>
            <p className="mt-1">Built with Next.js &amp; Tailwind CSS. Deployed on Vercel.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
