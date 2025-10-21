import { NextResponse } from 'next/server';
import { SupabaseService } from '@/lib/supabase-service';

export async function POST() {
  try {
    console.log('🔧 Setting up database schema...');
    
    if (!SupabaseService.isConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 400 }
      );
    }

    // Add the missing heygen_video_id column
    console.log('📝 Adding heygen_video_id column...');
    const { error: alterError } = await SupabaseService.supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE forms ADD COLUMN IF NOT EXISTS heygen_video_id TEXT;'
    });

    if (alterError) {
      console.error('❌ Error adding column:', alterError);
      // Try alternative approach
      const { error: directError } = await SupabaseService.supabase
        .from('forms')
        .select('heygen_video_id')
        .limit(1);
      
      if (directError && directError.code === 'PGRST204') {
        console.log('🔄 Column does not exist, trying to create table with updated schema...');
        
        // Try to create the table with the correct schema
        const { error: createError } = await SupabaseService.supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS forms_new (
              id TEXT PRIMARY KEY,
              parent_name TEXT NOT NULL,
              student_name TEXT NOT NULL,
              student_age INTEGER NOT NULL,
              current_grade TEXT NOT NULL,
              current_school TEXT NOT NULL,
              place_of_study TEXT NOT NULL,
              area_of_interest TEXT NOT NULL,
              phone_number TEXT NOT NULL,
              message TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
              heygen_video_id TEXT,
              heygen_video_url TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });
        
        if (createError) {
          console.error('❌ Error creating new table:', createError);
        }
      }
    }

    // Check if the column exists now
    const { error } = await SupabaseService.supabase
      .from('forms')
      .select('id, heygen_video_id')
      .limit(1);

    if (error) {
      console.error('❌ Column still does not exist:', error);
      return NextResponse.json({
        success: false,
        error: 'Could not add heygen_video_id column',
        details: error
      });
    }

    console.log('✅ Database schema updated successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Database schema updated successfully',
      hasVideoIdColumn: true
    });

  } catch (error) {
    console.error('❌ Database setup error:', error);
    return NextResponse.json(
      { error: 'Database setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}