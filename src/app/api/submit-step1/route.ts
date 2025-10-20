import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase-service';
import { MemoryStorage } from '@/lib/memory-storage';
import { HeyGenService } from '@/lib/heygen';
import { VideoPollingService } from '@/lib/video-polling';
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
    console.log('🎬 Starting HeyGen video generation...');
    const heygenResponse = await HeyGenService.generateVideo({
      script,
      voice: 'en-US-AriaNeural',
      avatar: 'default'
    });

    console.log('🎬 HeyGen response:', heygenResponse);

    // Extract video ID from response
    const videoId = heygenResponse?.video_id;
    
    if (heygenResponse && videoId) {
      console.log('✅ HeyGen video generation initiated with ID:', videoId);
      
      // Store video ID in the form data
      const hasSupabase = process.env.SL_SCHOOL_DEMO_SUPABASE_URL && process.env.SL_SCHOOL_DEMO_SUPABASE_SERVICE_ROLE_KEY;
      if (hasSupabase) {
        console.log('💾 Storing video ID in Supabase...');
        const { error } = await SupabaseService.supabase
          .from('forms')
          .update({ heygen_video_id: videoId })
          .eq('id', formId);
        
        if (error) {
          console.error('❌ Error storing video ID in Supabase:', error);
          console.log('🔄 Falling back to memory storage...');
          MemoryStorage.updateFormData(formId, { heygenVideoId: videoId });
          console.log('✅ Video ID stored in memory storage as fallback');
        } else {
          console.log('✅ Video ID stored in Supabase successfully');
        }
      } else {
        console.log('💾 Storing video ID in memory storage...');
        MemoryStorage.updateFormData(formId, { heygenVideoId: videoId });
        console.log('✅ Video ID stored in memory storage');
      }

      // Start polling for video status
      console.log('🚀 Starting video polling service...');
      VideoPollingService.startPolling();

      return NextResponse.json({
        success: true,
        formId,
        message: 'Step 1 completed. Video generation initiated.',
        videoId: videoId
      });
    } else {
      console.log('⚠️ HeyGen video generation failed or no video ID returned');
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
