import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase-service';
import { MemoryStorage } from '@/lib/memory-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, step2 } = body;

    if (!formId || !step2) {
      return NextResponse.json(
        { error: 'Form ID and step 2 data are required' },
        { status: 400 }
      );
    }

    // Update form with step 2 data
    const hasSupabase = process.env.SL_SCHOOL_DEMO_SUPABASE_URL && process.env.SL_SCHOOL_DEMO_SUPABASE_SERVICE_ROLE_KEY;
    
    if (hasSupabase) {
      // Update in Supabase
      const { error } = await SupabaseService.supabase
        .from('forms')
        .update({
          current_grade: step2.currentGrade,
          current_school: step2.currentSchool,
          place_of_study: step2.placeOfStudy,
          area_of_interest: step2.areaOfInterest,
          updated_at: new Date().toISOString()
        })
        .eq('id', formId);

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
        currentGrade: step2.currentGrade,
        currentSchool: step2.currentSchool,
        placeOfStudy: step2.placeOfStudy,
        areaOfInterest: step2.areaOfInterest,
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Step 2 completed successfully.'
    });

  } catch (error) {
    console.error('Step 2 update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
