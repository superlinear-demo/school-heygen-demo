import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message, videoUrl } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    let success = false;
    let responseMessage = '';

    if (videoUrl) {
      // Send video message
      success = await WhatsAppService.sendVideoMessage(
        phoneNumber,
        videoUrl,
        message || 'Test video message from Fortes Education'
      );
      responseMessage = success ? 'Video message sent successfully' : 'Failed to send video message';
    } else {
      // Send text message
      success = await WhatsAppService.sendTextMessage(
        phoneNumber,
        message || 'Test message from Fortes Education'
      );
      responseMessage = success ? 'Text message sent successfully' : 'Failed to send text message';
    }

    return NextResponse.json({
      success,
      message: responseMessage,
      phoneNumber,
      videoUrl: videoUrl || null
    });

  } catch (error) {
    console.error('WhatsApp test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'WhatsApp test endpoint. Use POST with phoneNumber and optional message/videoUrl',
    example: {
      method: 'POST',
      body: {
        phoneNumber: '919538055505',
        message: 'Test message',
        videoUrl: 'https://example.com/video.mp4' // optional
      }
    }
  });
}
