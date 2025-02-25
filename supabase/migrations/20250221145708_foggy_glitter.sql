-- Drop table if it exists
DROP TABLE IF EXISTS instructor_evaluations CASCADE;

-- Create instructor_evaluations table
CREATE TABLE instructor_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  instructor_rating_left INTEGER CHECK (instructor_rating_left BETWEEN 0 AND 3),
  instructor_rating_right INTEGER CHECK (instructor_rating_right BETWEEN 0 AND 3),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, exercise_id)
);

-- Enable RLS
ALTER TABLE instructor_evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Instructors can view instructor_evaluations"
  ON instructor_evaluations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Instructors can create instructor_evaluations"
  ON instructor_evaluations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Instructors can update instructor_evaluations"
  ON instructor_evaluations FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Instructors can delete instructor_evaluations"
  ON instructor_evaluations FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_instructor_evaluations_updated_at
  BEFORE UPDATE ON instructor_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();