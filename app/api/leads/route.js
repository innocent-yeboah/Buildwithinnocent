import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// ============================================
// 1. EMAIL TO YOU (Admin Notification)
// ============================================
async function sendEmailNotification(leadData) {
  const { name, email, phone, service_interest, message } = leadData;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        h2 { color: #1E3A5F; border-bottom: 2px solid #2E7D32; padding-bottom: 10px; }
        .label { font-weight: bold; color: #1E3A5F; margin-top: 15px; }
        .value { background: #f5f5f5; padding: 10px; border-radius: 5px; margin-top: 5px; }
        .footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>🔔 NEW LEAD!</h2>
        <div class="label">Name:</div>
        <div class="value">${name}</div>
        <div class="label">Email:</div>
        <div class="value">${email}</div>
        <div class="label">Phone:</div>
        <div class="value">${phone}</div>
        <div class="label">Service Interest:</div>
        <div class="value">${service_interest || 'Not specified'}</div>
        <div class="label">Message:</div>
        <div class="value">${message || 'No message provided'}</div>
        <div class="label">Submitted:</div>
        <div class="value">${new Date().toLocaleString('en-GH')}</div>
        <div class="footer">
          Reply to this lead: <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}">WhatsApp ${phone}</a>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Build With Innocent <notifications@buildwithinnocent.com>',
        to: ['igtechgh@gmail.com'],
        subject: `🔔 New Lead: ${name} is interested in ${service_interest || 'software'}`,
        html: emailHtml
      })
    });
    
    if (!res.ok) {
      const error = await res.text();
      console.error('Resend error:', error);
    }
    return res.ok;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}

// ============================================
// 2. EMAIL TO CUSTOMER (Acknowledgment)
// ============================================
async function sendCustomerEmail(leadData) {
  const { name, email, phone, service_interest } = leadData;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
        .header { background-color: #1E3A5F; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .content { padding: 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; }
        .greeting { font-size: 20px; font-weight: bold; color: #1E3A5F; margin-bottom: 20px; }
        .message { margin-bottom: 20px; color: #555; }
        .details { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2E7D32; }
        .whatsapp-button { background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #888; }
        .signature { margin-top: 20px; font-weight: bold; color: #1E3A5F; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Build With Innocent</h1></div>
        <div class="content">
          <div class="greeting">Hello ${name}! 👋</div>
          <div class="message">Thank you for reaching out to <strong>Build With Innocent</strong>. I have received your request and am excited to help you grow your business.</div>
          <div class="details">
            <p><strong>📋 Your request summary:</strong></p>
            <p>• Service requested: <strong>${service_interest || 'Consultation'}</strong></p>
            <p>• Contact number: <strong>${phone}</strong></p>
            <p>• Submitted on: <strong>${new Date().toLocaleString('en-GH')}</strong></p>
          </div>
          <div class="message"><strong>What happens next?</strong></div>
          <div class="message">📞 I will contact you via WhatsApp within <strong>24 hours</strong> to discuss your needs in detail.<br><br>⚡ If you need immediate assistance, feel free to reach me directly:</div>
          <div style="text-align: center;">
            <a href="https://wa.me/233530710628" class="whatsapp-button">💬 Chat with me on WhatsApp</a>
          </div>
          <div class="message">While you wait, you can explore my completed projects at:<br>🌐 <a href="https://buildwithinnocent.com" style="color: #1E3A5F;">buildwithinnocent.com</a></div>
          <div class="signature">
            Best regards,<br>
            <strong style="color: #2E7D32;">Innocent Golden</strong><br>
            Founder, Build With Innocent
          </div>
        </div>
        <div class="footer">
          <p>© 2026 Build With Innocent. All rights reserved.</p>
          <p>You received this email because you submitted a form on our website.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Build With Innocent <hello@buildwithinnocent.com>',
        to: [email],
        subject: `Thank you, ${name}! I've received your request`,
        html: emailHtml
      })
    });
    
    if (!res.ok) {
      const error = await res.text();
      console.error('Customer email error:', error);
    }
    return res.ok;
  } catch (error) {
    console.error('Customer email error:', error);
    return false;
  }
}

// ============================================
// 3. MAIN POST HANDLER (ONLY ONE!)
// ============================================
export async function POST(request) {
  try {
    const { name, email, phone, service, message } = await request.json();
    
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }
    
    const leadData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service_interest: service || null,
      message: message || null,
    };
    
    // Insert into Supabase
    const { error } = await supabase
      .from('leads')
      .insert({
        ...leadData,
        source: 'website',
        contacted: false,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Send both emails (don't await — let them run in background)
    sendEmailNotification(leadData).catch(err => console.error('Admin email failed:', err));
    sendCustomerEmail(leadData).catch(err => console.error('Customer email failed:', err));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}