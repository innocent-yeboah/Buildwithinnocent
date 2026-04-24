export default function Home() {
  return (
    <div className="min-h-screen bg-white">
     {/* Hero Section - Sales Message using Atomic Habits Framework */}
<section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-white to-gray-50">
  <div className="max-w-5xl mx-auto text-center">
    
    {/* Main Headline */}
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1E3A5F] leading-tight">
      Stop Fighting Your Business.
      <br />
      <span className="text-[#2E7D32]">Start Running a System.</span>
    </h1>
    
    {/* Subheadline - Problem Agitation */}
    <p className="text-xl md:text-2xl text-gray-600 mt-6 max-w-3xl mx-auto">
      Most Ghanaian businesses are losing money, time, and customers — not because their products are bad, but because their <span className="font-semibold text-[#1E3A5F]">systems are broken</span>.
    </p>
    
    {/* Solution Statement */}
    <p className="text-lg md:text-xl text-gray-700 mt-4 max-w-2xl mx-auto">
      I build custom software that turns chaos into clarity. 
      <span className="font-bold text-[#2E7D32]"> Free prototype. No monthly USD fees. You own everything.</span>
    </p>
    
    {/* CTA Buttons */}
    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#contact" className="bg-[#1E3A5F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#152c47] transition transform hover:-translate-y-1 duration-300 shadow-lg">
        📞 Book a Free Consultation
      </a>
      <a href="#work" className="border-2 border-[#1E3A5F] text-[#1E3A5F] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#1E3A5F] hover:text-white transition transform hover:-translate-y-1 duration-300">
        👀 See My Work
      </a>
    </div>
    
    {/* Atomic Habits Badge - Visual Trust Signal */}
    <div className="mt-12 inline-block bg-white rounded-full px-6 py-3 shadow-md border border-gray-100">
      <p className="text-gray-500 text-sm flex items-center gap-2">
        <span className="text-[#2E7D32] text-xl">✓</span> Built on The Four Laws of Atomic Habits 
        <span className="text-gray-300 mx-1">|</span> 
        <span className="text-[#2E7D32] text-xl">✓</span> 4 live products in 6 months
      </p>
    </div>
    
    {/* Social Proof - Clementina's Endorsement (Tiny, Trust-building) */}
    <div className="mt-8 max-w-md mx-auto">
      <p className="text-gray-400 text-sm italic">
        "Inspiring story. Let's celebrate how far you've come." 
        <span className="block font-semibold text-gray-500">— Clementina Aina, Founder of 6Cs (Top 0.01% EdTech)</span>
      </p>
    </div>
    
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
  
  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
    <a href="https://wa.me/233530453400" className="bg-[#25D366] text-white px-6 py-3 rounded-lg hover:bg-[#128C7E] transition inline-flex items-center justify-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.47 3.45 1.35 4.95L2 22l5.36-1.47c1.45.8 3.1 1.23 4.81 1.23 5.46 0 9.91-4.45 9.91-9.91 0-5.45-4.45-9.9-9.91-9.9z" />
      </svg>
      WhatsApp AI Assistant
    </a>
    <a href="tel:+233530710628" className="bg-white text-[#1E3A5F] px-6 py-3 rounded-lg hover:bg-gray-100 transition inline-flex items-center justify-center gap-2">
      📞 Call Me: +233 530 710 628
    </a>
  </div>
  
  <div className="mt-8 text-gray-300 text-sm">
    <p>🤖 Try our AI assistant on WhatsApp: <span className="font-semibold">+233 530 453 400</span></p>
    <p className="mt-1">📞 Direct calls: <span className="font-semibold">+233 530 710 628</span></p>
    <p className="mt-4">📍 Based in Accra, Ghana. Available for remote work worldwide.</p>
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