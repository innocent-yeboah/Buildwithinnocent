import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

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
      .insert([
        {
          name,
          email,
          phone,
          source: 'website',
          service_interest: service,
          message: message || '',
          contacted: false,
        }
      ]);
    
    if (error) throw error;
    
    // Optional: Send WhatsApp notification to you
    await fetch(`https://api.whatsapp.com/send?phone=233530710628&text=New%20lead%3A%20${name}%20-${email}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}