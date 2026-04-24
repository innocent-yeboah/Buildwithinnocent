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
            <p className="text-gray-600 mt-2">A professional landing page that attracts customers, showcases your products, and includes a WhatsApp button for instant contact. Mobile-friendly and fast.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">WhatsApp Automation</h3>
            <p className="text-gray-600 mt-2">Automated replies to customer messages. Instant responses to common questions. Send product catalogs automatically. Save hours every week.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">Business Dashboards</h3>
            <p className="text-gray-600 mt-2">Track inventory, sales, and payments in one place. Know what's low in stock. Never forget who owes you. Simple view on phone or computer.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="work" className="py-16 px-4 bg-gray-50">
  <h2 className="text-3xl font-bold text-center text-[#1E3A5F]">My Work</h2>
  <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold text-[#1E3A5F]">SchoolLedger GH</h3>
      <p className="text-gray-600 mt-2">Multi-tenant SaaS for Ghanaian schools. Live pilot school. WhatsApp payment confirmations.</p>
      <p className="text-sm text-[#2E7D32] mt-2">Stack: Next.js, Supabase, WhatsApp API</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold text-[#1E3A5F]">WhatsApp AI Assistant</h3>
      <p className="text-gray-600 mt-2">Zero-subscription AI assistant using Google Gemini API. Replaced Make.com with pure code.</p>
      <p className="text-sm text-[#2E7D32] mt-2">Stack: Next.js, Gemini API, WhatsApp API</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold text-[#1E3A5F]">My Central Bank</h3>
      <p className="text-gray-600 mt-2">Personal finance tracker with real-time Supabase sync across devices.</p>
      <p className="text-sm text-[#2E7D32] mt-2">Stack: Next.js, Supabase, PostgreSQL</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold text-[#1E3A5F]">FounderOS</h3>
      <p className="text-gray-600 mt-2">Life-business operating system with habit tracking and weekly reviews.</p>
      <p className="text-sm text-[#2E7D32] mt-2">Stack: Next.js, Supabase, Vercel</p>
    </div>
  </div>
</section>

      {/* My Story Section */}
<section className="py-20 px-4 bg-white">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1E3A5F] mb-12">
      From Uber Seat to Desk
    </h2>
    
    <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
      
      {/* Make it Obvious */}
      <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
        <p className="font-bold text-[#1E3A5F] mb-2">1. I noticed a pattern.</p>
        <p>I was driving Uber in Accra, watching the world through my windshield. But I was also paying attention to something else — systems. Why do some countries and companies thrive while others struggle? Why do some businesses grow effortlessly while others die slowly?</p>
        <p className="mt-2">The answer was everywhere once I started looking. <strong className="text-[#2E7D32]">The best organizations don't rely on heroes. They rely on systems.</strong> And the worst? They rely on hope, manual work, and expensive software that doesn't fit.</p>
      </div>
      
      {/* Make it Attractive */}
      <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
        <p className="font-bold text-[#1E3A5F] mb-2">2. I had to prove it to myself.</p>
        <p>So I started building. Not tutorials. Not courses. Live products. Real users. Real problems.</p>
        <p className="mt-2">First, I built <strong className="text-[#2E7D32]">My Central Bank</strong> — a personal finance tracker. Then <strong className="text-[#2E7D32]">FounderOS</strong> — a life-business operating system.</p>
        <p className="mt-2 italic text-[#1E3A5F]">"Will systems actually work?"</p>
        <p className="mt-2">The results shocked me. Within weeks, I had clarity. Within months, I had 4 live products. <strong className="text-[#2E7D32]">The system worked better than I ever imagined.</strong></p>
      </div>
      
      {/* Make it Easy */}
      <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
        <p className="font-bold text-[#1E3A5F] mb-2">3. Then I looked around at businesses in Ghana.</p>
        <p>Brilliant owners. Great products. But stuck. Why? Because they were fighting their own systems — or running on none at all.</p>
        <p className="mt-2">Paper notebooks. WhatsApp chaos. Expensive software built for other countries. Processes that worked against them.</p>
        <p className="mt-2"><strong className="text-[#2E7D32]">I realized something: These business owners didn't need more features. They needed a working system.</strong> Software that actually solved THEIR problems, not problems from Silicon Valley.</p>
      </div>
      
      {/* Make it Satisfying */}
      <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
        <p className="font-bold text-[#1E3A5F] mb-2">4. So I decided to build differently.</p>
        <p>I don't just write code. I build <strong className="text-[#2E7D32]">growth systems</strong> for businesses. A modern website that attracts customers. WhatsApp automation that saves hours every day. Dashboards that show you what is actually happening in your business.</p>
        <p className="mt-2 font-semibold">And here is what makes me different:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>I build a <strong className="text-[#2E7D32]">free prototype first</strong> — you test it before you pay</li>
          <li>You <strong className="text-[#2E7D32]">own the software</strong> — no monthly USD subscriptions</li>
          <li>I am <strong className="text-[#2E7D32]">based in Accra</strong> — we can meet in person</li>
        </ul>
      </div>
      
    </div>
    
    {/* Closing Statement */}
    <div className="mt-12 p-6 bg-[#1E3A5F] text-white rounded-lg text-center">
      <p className="text-xl md:text-2xl font-bold italic">
        "I don't build tutorials. I build systems that grow businesses."
      </p>
      <p className="mt-3 text-gray-300">
        — Innocent Golden, Founder of Build With Innocent
      </p>
    </div>
  </div>
</section>

      {/* Testimonial Section */}
      <section className="py-16 px-4 bg-gray-50">
  <div className="max-w-3xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-[#1E3A5F] mb-8">What People Say</h2>
    <div className="bg-white p-6 rounded-lg border-l-4 border-[#2E7D32]">
      <p className="text-gray-700 italic text-lg">"It's so inspiring to hear your story! This is a great achievement. Let's celebrate how far you've come. And you are just getting started."</p>
      <p className="text-[#1E3A5F] font-bold mt-4">— Clementina Aina</p>
      <p className="text-gray-500">Founder & CEO, 6Cs (#48 EdTech Globally)</p>
    </div>
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