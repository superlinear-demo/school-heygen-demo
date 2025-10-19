import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase-service';
import { MemoryStorage } from '@/lib/memory-storage';
import { HeyGenService } from '@/lib/heygen';
import { FormData } from '@/types/form';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step1 } = body;

    if (!step1) {
      return NextResponse.json(
        { error: 'Step 1 data is required' },
        { status: 400 }
      );
    }

    // Generate unique form ID
    const formId = `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create partial form data with only step 1 information
    const formData: FormData = {
      id: formId,
      parentName: step1.parentName,
      studentName: step1.studentName,
      studentAge: step1.studentAge,
      // Set other fields as empty for now
      currentGrade: '',
      currentSchool: '',
      placeOfStudy: '',
      areaOfInterest: '',
      phoneNumber: '',
      message: '',
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to storage (Supabase if available, otherwise memory)
    const hasSupabase = process.env.SL_SCHOOL_DEMO_SUPABASE_URL && process.env.SL_SCHOOL_DEMO_SUPABASE_SERVICE_ROLE_KEY;
    if (hasSupabase) {
      await SupabaseService.saveFormData(formData);
    } else {
      await MemoryStorage.saveFormData(formData);
    }

    // Generate HeyGen video script
    const studentFirstName = step1.studentName.split(' ')[0];
    const script = HeyGenService.generateScript(
      step1.parentName,
      step1.studentName,
      studentFirstName
    );

    // Generate HeyGen video immediately
    const heygenResponse = await HeyGenService.generateVideo({
      script,
      voice: 'en-US-AriaNeural',
      avatar: 'default'
    });

    if (heygenResponse && heygenResponse.video_id) {
      return NextResponse.json({
        success: true,
        formId,
        message: 'Step 1 completed. Video generation initiated.',
        videoId: heygenResponse.video_id
      });
    } else {
      return NextResponse.json({
        success: true,
        formId,
        message: 'Step 1 completed. Video generation will be processed.',
        warning: 'Video generation may take a few minutes.'
      });
    }

  } catch (error) {
    console.error('Step 1 submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
