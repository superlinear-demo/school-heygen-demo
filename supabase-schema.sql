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

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_forms_status ON forms(status);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for now)
-- In production, you might want to restrict this based on user authentication
CREATE POLICY "Allow all operations on forms" ON forms
  FOR ALL USING (true);
