import { NextRequest, NextResponse } from 'next/server';
import { KVService } from '@/lib/kv';
import { WhatsAppService } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { video_id, status, video_url } = body;

    if (!video_id) {
      return NextResponse.json(
        { error: 'Missing video_id' },
        { status: 400 }
      );
    }

    // Find the form associated with this video
    // In a real implementation, you'd store the video_id with the form
    // For now, we'll get all completed forms and check if they have videos
    const completedForms = await KVService.getCompletedFormsWithVideo();
    
    // Find the form that matches this video (this is a simplified approach)
    // In production, you'd want to store the video_id with the form data
    let targetForm = null;
    for (const form of completedForms) {
      if (form.heygenVideoUrl && form.heygenVideoUrl.includes(video_id)) {
        targetForm = form;
        break;
      }
    }

    if (!targetForm) {
      // If we can't find the specific form, we'll need to handle this differently
      // For now, we'll return success but log the issue
      console.log('Form not found for video_id:', video_id);
      return NextResponse.json({
        success: true,
        message: 'Video processed but form not found'
      });
    }

    // Update the form with the video URL if provided
    if (video_url && status === 'completed') {
      await KVService.updateHeyGenVideoUrl(targetForm.id, video_url);
      
      // Send WhatsApp message with video
      const success = await WhatsAppService.sendVideoMessage(
        targetForm.phoneNumber,
        video_url,
        `Welcome to Fortes Education! Here's your personalized message.`
      );

      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Video processed and WhatsApp message sent',
          formId: targetForm.id
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
