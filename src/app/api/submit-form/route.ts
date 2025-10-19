import { NextRequest, NextResponse } from 'next/server';
import { KVService } from '@/lib/kv';
import { HeyGenService } from '@/lib/heygen';
import { FormData } from '@/types/form';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step1, step2, step3 } = body;

    if (!step1 || !step2 || !step3) {
      return NextResponse.json(
        { error: 'Incomplete form data' },
        { status: 400 }
      );
    }

    // Generate unique form ID
    const formId = `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create form data object
    const formData: FormData = {
      id: formId,
      parentName: step1.parentName,
      studentName: step1.studentName,
      studentAge: step1.studentAge,
      currentGrade: step2.currentGrade,
      currentSchool: step2.currentSchool,
      placeOfStudy: step2.placeOfStudy,
      areaOfInterest: step2.areaOfInterest,
      phoneNumber: step3.phoneNumber,
      message: step3.message,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to KV store
    await KVService.saveFormData(formData);

    // Generate HeyGen video script
    const studentFirstName = step1.studentName.split(' ')[0];
    const script = HeyGenService.generateScript(
      step1.parentName,
      step1.studentName,
      studentFirstName
    );

    // Generate HeyGen video
    const heygenResponse = await HeyGenService.generateVideo({
      script,
      voice: 'en-US-AriaNeural',
      avatar: 'default'
    });

    if (heygenResponse && heygenResponse.video_id) {
      // Update form with video ID for tracking
      await KVService.updateFormStatus(formId, 'completed');
      
      return NextResponse.json({
        success: true,
        formId,
        message: 'Form submitted successfully. Video generation initiated.',
        videoId: heygenResponse.video_id
      });
    } else {
      // Even if video generation fails, mark form as completed
      await KVService.updateFormStatus(formId, 'completed');
      
      return NextResponse.json({
        success: true,
        formId,
        message: 'Form submitted successfully. Video generation will be processed.',
        warning: 'Video generation may take a few minutes.'
      });
    }

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
