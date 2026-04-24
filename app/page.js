'use client';

import { useState } from 'react';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [formStatus, setFormStatus] = useState({ submitting: false, message: '' });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('lead-name').value;
    const email = document.getElementById('lead-email').value;
    const phone = document.getElementById('lead-phone').value;
    const service = document.getElementById('lead-service').value;
    const messageText = document.getElementById('lead-message').value;
    
    setFormStatus({ submitting: true, message: '' });
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, service, message: messageText })
      });
      
      if (response.ok) {
        setFormStatus({ submitting: false, message: 'Thank you! I will get back to you within 24 hours.' });
        setTimeout(() => {
          setShowModal(false);
          setFormStatus({ submitting: false, message: '' });
          const form = document.getElementById('lead-form');
          if (form) form.reset();
        }, 2000);
      } else {
        const error = await response.json();
        setFormStatus({ submitting: false, message: error.error || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setFormStatus({ submitting: false, message: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1E3A5F] leading-tight">
            Stop Fighting Your Business.
            <br />
            <span className="text-[#2E7D32]">Start Running a System.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mt-6 max-w-3xl mx-auto">
            Most Ghanaian businesses are losing money, time, and customers — not because their products are bad, but because their <span className="font-semibold text-[#1E3A5F]">systems are broken</span>.
          </p>
          <p className="text-lg md:text-xl text-gray-700 mt-4 max-w-2xl mx-auto">
            I build custom software that turns chaos into clarity. 
            <span className="font-bold text-[#2E7D32]"> Free prototype. No monthly USD fees. You own everything.</span>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#1E3A5F] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#152c47] transition transform hover:-translate-y-1 duration-300 shadow-lg cursor-pointer"
            >
              📞 Book a Free Consultation
            </button>
            <a href="#work" className="border-2 border-[#1E3A5F] text-[#1E3A5F] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#1E3A5F] hover:text-white transition transform hover:-translate-y-1 duration-300">
              👀 See My Work
            </a>
          </div>
          <div className="mt-12 inline-block bg-white rounded-full px-6 py-3 shadow-md border border-gray-100">
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span className="text-[#2E7D32] text-xl">✓</span> Built on The Four Laws of Atomic Habits 
              <span className="text-gray-300 mx-1">|</span> 
              <span className="text-[#2E7D32] text-xl">✓</span> 4 live products in 6 months
            </p>
          </div>
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
            <p className="text-gray-600 mt-2">Professional modern websites which serve as engine for business growth-that attract customers and build trust. Mobile-friendly and fast.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">WhatsApp AI Automation</h3>
            <p className="text-gray-600 mt-2">Automated replies to customer messages. Save hours every week. Instant responses.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-[#1E3A5F]">Business Dashboards</h3>
            <p className="text-gray-600 mt-2">Track inventory, sales, and payments in one place. Know your business in real-time.</p>
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

      {/* My Story Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1E3A5F] mb-12">From Uber Seat to Desk</h2>
          <div className="space-y-8 text-gray-700 text-lg leading-relaxed">
            <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
              <p className="font-bold text-[#1E3A5F] mb-2">1. I noticed a pattern.</p>
              <p>I was driving Uber in Accra, watching the world through my windshield. But I was also paying attention to something else — systems. Why do some countries and companies thrive while others struggle? Why do some businesses grow effortlessly while others die slowly?</p>
              <p className="mt-2">The answer was everywhere once I started looking. <strong className="text-[#2E7D32]">The best organizations don't rely on heroes. They rely on systems.</strong> And the worst? They rely on hope, manual work, and expensive software that doesn't fit.</p>
            </div>
            <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
              <p className="font-bold text-[#1E3A5F] mb-2">2. I had to prove it to myself.</p>
              <p>So I started building. Not tutorials. Not courses. Live products. Real users. Real problems.</p>
              <p className="mt-2">First, I built <strong className="text-[#2E7D32]">My Central Bank</strong> — a personal finance tracker. Then <strong className="text-[#2E7D32]">FounderOS</strong> — a life-business operating system.</p>
              <p className="mt-2 italic text-[#1E3A5F]">"Will systems actually work?"</p>
              <p className="mt-2">The results shocked me. Within weeks, I had clarity. Within months, I had 4 live products. <strong className="text-[#2E7D32]">The system worked better than I ever imagined.</strong></p>
            </div>
            <div className="border-l-4 border-[#2E7D32] pl-6 py-2 bg-gray-50 rounded-r-lg">
              <p className="font-bold text-[#1E3A5F] mb-2">3. Then I looked around at businesses in Ghana.</p>
              <p>Brilliant owners. Great products. But stuck. Why? Because they were fighting their own systems — or running on none at all.</p>
              <p className="mt-2">Paper notebooks. WhatsApp chaos. Expensive software built for other countries. Processes that worked against them.</p>
              <p className="mt-2"><strong className="text-[#2E7D32]">I realized something: These business owners didn't need more features. They needed a working system.</strong> Software that actually solved THEIR problems, not problems from Silicon Valley.</p>
            </div>
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
          <div className="mt-12 p-6 bg-[#1E3A5F] text-white rounded-lg text-center">
            <p className="text-xl md:text-2xl font-bold italic">"I don't build tutorials. I build systems that grow businesses."</p>
            <p className="mt-3 text-gray-300">— Innocent Golden, Founder of Build With Innocent</p>
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

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/233530453400" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 z-50 flex items-center justify-center hover:scale-110" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.47 3.45 1.35 4.95L2 22l5.36-1.47c1.45.8 3.1 1.23 4.81 1.23 5.46 0 9.91-4.45 9.91-9.91 0-5.45-4.45-9.9-9.91-9.9zM12 16.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
        </svg>
      </a>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#1E3A5F]">Book Free Consultation</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
              </div>
              <form id="lead-form" className="space-y-4" onSubmit={handleFormSubmit}>
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Your Name *</label>
                  <input type="text" id="lead-name" required className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Email Address *</label>
                  <input type="email" id="lead-email" required className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">WhatsApp Number *</label>
                  <input type="tel" id="lead-phone" required className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white" placeholder="+233 XX XXX XXXX" />
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">What do you need help with?</label>
                  <select id="lead-service" className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white">
                    <option value="">Select a service</option>
                    <option value="website">Modern Website</option>
                    <option value="whatsapp">WhatsApp AI Automation</option>
                    <option value="dashboard">Business Dashboard</option>
                    <option value="custom">Custom Software</option>
                    <option value="other">Other / I'm not sure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Tell me more about your business</label>
                  <textarea id="lead-message" rows="3" className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:border-[#1E3A5F] text-gray-900 bg-white" placeholder="Tell me about your business, challenges, and goals..."></textarea>
                </div>
                <button type="submit" disabled={formStatus.submitting} className="w-full bg-[#1E3A5F] text-white py-3 rounded-lg font-semibold hover:bg-[#152c47] transition disabled:opacity-50">
                  {formStatus.submitting ? 'Sending...' : 'Send Message →'}
                </button>
                {formStatus.message && (
                  <p className={`text-center text-sm ${formStatus.message.includes('Thank you') ? 'text-green-600' : 'text-red-600'}`}>
                    {formStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

           {/* Footer Section */}
      <footer className="bg-[#1E3A5F] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            
            {/* Brand Column */}
            <div>
              <h3 className="text-xl font-bold mb-4">Build With Innocent</h3>
              <p className="text-gray-300 text-sm">Custom software for Ghanaian businesses. Free prototype. No monthly USD fees.</p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-[#2E7D32]">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#work" className="hover:text-white transition">My Work</a></li>
                <li><a href="#" onClick={() => setShowModal(true)} className="hover:text-white transition cursor-pointer">Book Consultation</a></li>
              </ul>
            </div>
            
            {/* Projects */}
            <div>
              <h4 className="font-semibold mb-4 text-[#2E7D32]">Live Projects</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition">SchoolLedger GH</a></li>
                <li><a href="#" className="hover:text-white transition">WhatsApp AI Assistant</a></li>
                <li><a href="#" className="hover:text-white transition">My Central Bank</a></li>
                <li><a href="#" className="hover:text-white transition">FounderOS</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-[#2E7D32]">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>📞 <a href="tel:+233530710628" className="hover:text-white transition">+233 530 710 628</a></li>
                <li>💬 <a href="https://wa.me/233530453400" className="hover:text-white transition">+233 530 453 400 (AI)</a></li>
                <li>📧 <a href="mailto:igtechgh@gmail.com" className="hover:text-white transition">igtechgh@gmail.com</a></li>
                <li>🌐 buildwithinnocent.com</li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Build With Innocent. All rights reserved.</p>
            <p className="mt-1">Built with Next.js & Tailwind CSS. Deployed on Vercel.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}