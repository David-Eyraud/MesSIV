/*
  # Create courses table

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `date` (date)
      - `location` (text)
      - `school` (text)
      - `instructor` (text)
      - `glider_brand` (text)
      - `glider_model` (text)
      - `glider_certification` (text)
      - `glider_lines` (boolean)
      - `glider2_brand` (text, nullable)
      - `glider2_model` (text, nullable)
      - `glider2_certification` (text, nullable)
      - `glider2_lines` (boolean)
      - `harness_brand` (text)
      - `harness_model` (text)
      - `harness_cocoon` (boolean)
      - `harness2_brand` (text, nullable)
      - `harness2_model` (text, nullable)
      - `harness2_cocoon` (boolean)
      - `flights_count` (integer)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `courses` table
    - Add policies for authenticated users to:
      - View their own courses
      - Create new courses
      - Update their own courses
      - Delete their own courses
*/

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  school TEXT NOT NULL,
  instructor TEXT NOT NULL,
  glider_brand TEXT NOT NULL,
  glider_model TEXT NOT NULL,
  glider_certification TEXT NOT NULL,
  glider_lines BOOLEAN NOT NULL DEFAULT false,
  glider2_brand TEXT,
  glider2_model TEXT,
  glider2_certification TEXT,
  glider2_lines BOOLEAN DEFAULT false,
  harness_brand TEXT NOT NULL,
  harness_model TEXT NOT NULL,
  harness_cocoon BOOLEAN NOT NULL DEFAULT false,
  harness2_brand TEXT,
  harness2_model TEXT,
  harness2_cocoon BOOLEAN DEFAULT false,
  flights_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();