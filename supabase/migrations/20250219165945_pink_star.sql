/*
  # Initial Schema Setup

  1. Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `courses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `date` (date)
      - `location` (text)
      - `school` (text)
      - `instructor` (text)
      - `glider` (text)
      - `harness` (text)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `exercises`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `level` (text)
      - `category` (text)
      - `keywords` (text[])
      - `created_at` (timestamptz)
    
    - `evaluations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `course_id` (uuid, foreign key)
      - `exercise_id` (uuid, foreign key)
      - `student_rating` (integer)
      - `instructor_rating` (integer)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  school TEXT NOT NULL,
  instructor TEXT NOT NULL,
  glider TEXT NOT NULL,
  harness TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  student_rating INTEGER CHECK (student_rating BETWEEN 0 AND 5),
  instructor_rating INTEGER CHECK (instructor_rating BETWEEN 0 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Courses policies
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

-- Exercises policies (read-only for all authenticated users)
CREATE POLICY "Users can view exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- Evaluations policies
CREATE POLICY "Users can view own evaluations"
  ON evaluations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own evaluations"
  ON evaluations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own evaluations"
  ON evaluations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());