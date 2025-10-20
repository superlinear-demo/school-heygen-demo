import { NextResponse } from 'next/server';
import { VideoPollingService } from '@/lib/video-polling';
import { MemoryStorage } from '@/lib/memory-storage';
import { SupabaseService } from '@/lib/supabase-service';

export async function GET() {
  try {
    console.log('🧪 Testing polling system...');
    
    // Check if polling is running
    console.log('📊 Polling status check...');
    
    // Get all forms from storage
    let allForms = [];
    if (SupabaseService.isConfigured()) {
      console.log('💾 Getting forms from Supabase...');
      const { data, error } = await SupabaseService.supabase
        .from('forms')
        .select('*');
      
      if (error) {
        console.error('❌ Supabase error:', error);
      } else {
        allForms = data || [];
        console.log(`📋 Found ${allForms.length} forms in Supabase`);
      }
    } else {
      console.log('💾 Getting forms from memory storage...');
      allForms = MemoryStorage.getAllForms();
      console.log(`📋 Found ${allForms.length} forms in memory`);
    }
    
    console.log('📋 All forms:', allForms.map(f => ({
      id: f.id,
      status: f.status,
      hasVideoId: !!(f.heygenVideoId || f.heygen_video_id),
      hasVideoUrl: !!(f.heygenVideoUrl || f.heygen_video_url),
      videoId: f.heygenVideoId || f.heygen_video_id,
      videoUrl: f.heygenVideoUrl || f.heygen_video_url
    })));
    
    // Manually trigger polling
    console.log('🚀 Manually triggering polling...');
    VideoPollingService.startPolling();
    
    return NextResponse.json({
      success: true,
      message: 'Polling test completed',
      formsCount: allForms.length,
      forms: allForms.map(f => ({
        id: f.id,
        status: f.status,
        hasVideoId: !!(f.heygenVideoId || f.heygen_video_id),
        hasVideoUrl: !!(f.heygenVideoUrl || f.heygen_video_url)
      }))
    });
    
  } catch (error) {
    console.error('❌ Polling test error:', error);
    return NextResponse.json(
      { error: 'Polling test failed', details: error.message },
      { status: 500 }
    );
  }
}
