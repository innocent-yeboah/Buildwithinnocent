import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Email notification function
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

export async function POST(request) {
  try {
    const { name, email, phone, service, message } = await request.json();
    
    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        source: 'website',
        service_interest: service || null,
        message: message || null,
        contacted: false,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Send email notification (don't await - let it run in background)
    sendEmailNotification({
      name,
      email,
      phone,
      service_interest: service,
      message
    }).catch(err => console.error('Email send failed:', err));
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}