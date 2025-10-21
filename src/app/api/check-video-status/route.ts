import { NextRequest, NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase-service';
import { MemoryStorage } from '@/lib/memory-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');

    if (!formId) {
      return NextResponse.json(
        { success: false, error: 'Form ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking video status for form ${formId}`);

    // Try Supabase first
    if (SupabaseService.isConfigured()) {
      console.log('💾 Checking Supabase for video status...');
      const { data, error } = await SupabaseService.supabase
        .from('forms')
        .select('heygen_video_url, status')
        .eq('id', formId)
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        return NextResponse.json({
          success: false,
          error: 'Database error',
          details: error.message
        });
      }

      if (data) {
        console.log('📊 Supabase data:', data);
        return NextResponse.json({
          success: true,
          videoUrl: data.heygen_video_url,
          status: data.status,
          hasVideo: !!data.heygen_video_url
        });
      }
    } else {
      console.log('💾 Checking memory storage for video status...');
      // Fallback to memory storage
      const formData = MemoryStorage.getFormData(formId);
      
      if (formData) {
        console.log('📊 Memory data:', {
          hasVideoUrl: !!formData.heygenVideoUrl,
          status: formData.status
        });
        return NextResponse.json({
          success: true,
          videoUrl: formData.heygenVideoUrl,
          status: formData.status,
          hasVideo: !!formData.heygenVideoUrl
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Form not found'
    });

  } catch (error) {
    console.error('❌ Video status check error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
