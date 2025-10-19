import { NextResponse } from 'next/server';

export async function GET() {
  // Test environment variables (without exposing sensitive data)
  const envCheck = {
    heygenApiKey: !!process.env.HEYGEN_API_KEY || !!process.env.HEYGEN_API_TOKEN,
    whatsappToken: !!process.env.WHATSAPP_ACCESS_TOKEN,
    whatsappPhoneId: process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_WABA,
    phoneList: process.env.PHONE_LIST || process.env.DEMO_PHONE_NUMBERS,
    supabaseUrl: !!process.env.SL_SCHOOL_DEMO_SUPABASE_URL,
    supabaseKey: !!process.env.SL_SCHOOL_DEMO_SUPABASE_SERVICE_ROLE_KEY
  };

  return NextResponse.json({
    success: true,
    environment: envCheck,
    message: 'Environment variables check completed'
  });
}
