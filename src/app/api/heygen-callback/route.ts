import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase-service';
import { MemoryStorage } from '@/lib/memory-storage';
import { WhatsAppService } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { video_id, status, video_url } = body;

    console.log('HeyGen callback received:', { video_id, status, video_url });

    if (!video_id) {
      return NextResponse.json(
        { error: 'Missing video_id' },
        { status: 400 }
      );
    }

    // Use appropriate storage (Supabase if available, otherwise memory)
    const hasSupabase = process.env.SL_SCHOOL_DEMO_SUPABASE_URL && process.env.SL_SCHOOL_DEMO_SUPABASE_SERVICE_ROLE_KEY;
    
    // Get all completed forms (not just those with videos)
    const allForms = hasSupabase 
      ? await SupabaseService.getAllForms()
      : await MemoryStorage.getAllForms();
    
    // Filter for completed forms without video URLs
    const completedForms = allForms.filter(form => 
      form.status === 'completed' && !form.heygenVideoUrl
    );
    
    console.log('All forms:', allForms.length);
    console.log('Completed forms without videos:', completedForms.length);
    console.log('Form details:', allForms.map(f => ({ id: f.id, status: f.status, hasVideo: !!f.heygenVideoUrl })));
    
    if (completedForms.length === 0) {
      console.log('No completed forms without videos found');
      return NextResponse.json({
        success: true,
        message: 'Video processed but no completed forms found',
        debug: {
          totalForms: allForms.length,
          completedForms: completedForms.length,
          formStatuses: allForms.map(f => ({ id: f.id, status: f.status, hasVideo: !!f.heygenVideoUrl }))
        }
      });
    }

    // Get the most recent form
    const targetForm = completedForms[0];

    // Update the form with the video URL if provided
    if (video_url && status === 'completed') {
      if (hasSupabase) {
        await SupabaseService.updateHeyGenVideoUrl(targetForm.id, video_url);
      } else {
        await MemoryStorage.updateHeyGenVideoUrl(targetForm.id, video_url);
      }
      
      // Send WhatsApp message with video
      const success = await WhatsAppService.sendVideoMessage(
        targetForm.phoneNumber,
        video_url,
        `Welcome to Fortes Education! Here's your personalized video message.`
      );

      console.log('WhatsApp message sent:', success);

      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Video processed and WhatsApp message sent',
          formId: targetForm.id,
          phoneNumber: targetForm.phoneNumber
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Video processed but WhatsApp message failed',
          formId: targetForm.id
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Video status updated',
      formId: targetForm.id
    });

  } catch (error) {
    console.error('HeyGen callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
