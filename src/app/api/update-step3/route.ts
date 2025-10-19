import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase-service';
import { MemoryStorage } from '@/lib/memory-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, step3 } = body;

    if (!formId || !step3) {
      return NextResponse.json(
        { error: 'Form ID and step 3 data are required' },
        { status: 400 }
      );
    }

    // Update form with step 3 data and mark as completed
    const hasSupabase = process.env.SL_SCHOOL_DEMO_SUPABASE_URL && process.env.SL_SCHOOL_DEMO_SUPABASE_SERVICE_ROLE_KEY;
    
    if (hasSupabase) {
      // Update in Supabase
      const { error } = await SupabaseService.supabase
        .from('forms')
        .update({
          phone_number: step3.phoneNumber,
          message: step3.message,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', formId)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json(
          { error: 'Failed to update form data' },
          { status: 500 }
        );
      }
    } else {
      // Update in memory storage
      MemoryStorage.updateFormData(formId, {
        phoneNumber: step3.phoneNumber,
        message: step3.message,
        status: 'completed',
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Form completed successfully! You will receive a personalized video message shortly.'
    });

  } catch (error) {
    console.error('Step 3 update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
