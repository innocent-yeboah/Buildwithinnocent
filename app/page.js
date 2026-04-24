export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1E3A5F]">
          Build With Innocent
        </h1>
        <p className="text-xl md:text-2xl text-[#2E7D32] mt-4 font-semibold">
          I build custom software for Ghanaian businesses
        </p>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
          From landing pages to WhatsApp automation — I build live products, not tutorials.
          <br />
          4 products shipped in 6 months.
        </p>
        <div className="mt-8 space-x-4">
          <a href="#work" className="bg-[#1E3A5F] text-white px-6 py-3 rounded-lg hover:bg-[#152c47] transition">
            View My Work
          </a>
          <a href="https://wa.me/233530710628" className="bg-[#2E7D32] text-white px-6 py-3 rounded-lg hover:bg-[#1b5e20] transition">
            WhatsApp Me
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-[#1E3A5F]">What I Build</h2>
        <p className="text-center text-gray-600 mt-2 mb-10">Services I offer to help businesses grow</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">🖥️</div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">Modern Websites</h3>
            <p className="text-gray-600 mt-2">Professional landing pages that attract customers and build trust.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">WhatsApp Automation</h3>
            <p className="text-gray-600 mt-2">Auto-replies and instant customer responses. Save hours every week.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">Business Dashboards</h3>
            <p className="text-gray-600 mt-2">Inventory and payment tracking tools. Know your business in real-time.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="work" className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-[#1E3A5F]">Live Projects</h2>
        <p className="text-center text-gray-600 mt-2 mb-10">Real products I have built and shipped</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#1E3A5F]">SchoolLedger GH</h3>
            <p className="text-gray-600 mt-2">Multi-tenant SaaS for Ghanaian schools. Live pilot school. WhatsApp payment confirmations. Supabase RLS across 5 tables.</p>
            <p className="text-sm text-[#2E7D32] mt-3 font-semibold">Stack: Next.js, Supabase, WhatsApp API</p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#1E3A5F]">WhatsApp AI Assistant</h3>
            <p className="text-gray-600 mt-2">Zero-subscription AI assistant using Google Gemini API. Replaced Make.com + OpenAI with pure code. Client onboarding in under 30 minutes.</p>
            <p className="text-sm text-[#2E7D32] mt-3 font-semibold">Stack: Next.js, Gemini API, WhatsApp API</p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#1E3A5F]">My Central Bank</h3>
            <p className="text-gray-600 mt-2">Personal finance tracker with income, expense, and savings tracking. Real-time Supabase sync across devices.</p>
            <p className="text-sm text-[#2E7D32] mt-3 font-semibold">Stack: Next.js, Supabase, PostgreSQL</p>
          </div>
          <div className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold text-[#1E3A5F]">FounderOS</h3>
            <p className="text-gray-600 mt-2">Life-business operating system with habit tracking, income pipeline, and weekly reviews. Deployed via GitHub CI/CD.</p>
            <p className="text-sm text-[#2E7D32] mt-3 font-semibold">Stack: Next.js, Supabase, Vercel</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-[#1E3A5F]">My Story</h2>
        <div className="max-w-3xl mx-auto mt-8 text-center">
          <p className="text-gray-700 text-lg mb-4">
            From Uber driver to full-stack developer. Self-taught. Single father. 4 products in 6 months.
          </p>
          <p className="text-gray-600 mb-4">
            I built SchoolLedger GH for a private school in Accra while learning to code. No degree. No mentor. Just debugging, shipping, and consistency.
          </p>
          <p className="text-gray-600">
            Now I help Ghanaian businesses build the tools they need — without expensive subscriptions or months of waiting.
          </p>
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 inline-block">
            <p className="text-[#2E7D32] italic">
              "I don't build tutorials. I build live products."
            </p>
            <p className="text-gray-500 text-sm mt-1">— Innocent Golden</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-[#1E3A5F]">What People Say</h2>
        <div className="max-w-2xl mx-auto mt-8 bg-gray-50 p-6 rounded-lg border-l-4 border-[#2E7D32]">
          <p className="text-gray-700 italic">
            "It's so inspiring to hear your story! This is a great achievement. Let's celebrate how far you've come. And you are just getting started."
          </p>
          <p className="text-[#1E3A5F] font-semibold mt-3">— Clementina Aina</p>
          <p className="text-gray-500 text-sm">Founder & CEO, 6Cs (#48 EdTech Globally)</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-[#1E3A5F] text-white text-center">
        <h2 className="text-3xl font-bold">Ready to Build?</h2>
        <p className="mt-4 text-lg">Let's discuss your project. Free consultation.</p>
        <div className="mt-8 space-x-4">
          <a href="https://wa.me/233530710628" className="bg-[#2E7D32] text-white px-6 py-3 rounded-lg hover:bg-[#1b5e20] transition inline-block">
            WhatsApp Me
          </a>
          <a href="mailto:igtechgh@gmail.com" className="bg-white text-[#1E3A5F] px-6 py-3 rounded-lg hover:bg-gray-100 transition inline-block">
            Email Me
          </a>
        </div>
        <div className="mt-8 text-gray-300">
          <p>📞 Call/WhatsApp: +233 530 710 628</p>
          <p>📧 Email: igtechgh@gmail.com</p>
          <p className="mt-4 text-sm">📍 Based in Accra, Ghana. Available for remote work worldwide.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-gray-500 text-sm border-t">
        <p>© 2026 Build With Innocent. All rights reserved.</p>
        <p className="mt-1">Built with Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
}