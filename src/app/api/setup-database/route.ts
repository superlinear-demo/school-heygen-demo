import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // First, let's try to create the table using a simple query
    // This will fail if the table doesn't exist, but that's expected
    const { data, error } = await supabase
      .from('forms')
      .select('id')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, we need to create it
      return NextResponse.json({
        success: false,
        message: 'Table does not exist. Please run the SQL schema in your Supabase dashboard.',
        sqlSchema: `
-- Create the forms table
CREATE TABLE IF NOT EXISTS forms (
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
  heygen_video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forms_status ON forms(status);
CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all operations on forms" ON forms
  FOR ALL USING (true);
        `
      });
    }

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Database error',
        error: error.message
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database table exists and is accessible',
      data: data
    });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Database setup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
