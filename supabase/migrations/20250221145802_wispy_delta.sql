-- Supprime la table si elle existe
DROP TABLE IF EXISTS instructor_evaluations CASCADE;

-- Crée la table instructor_evaluations
CREATE TABLE instructor_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  instructor_rating_left INTEGER CHECK (instructor_rating_left BETWEEN 0 AND 3),
  instructor_rating_right INTEGER CHECK (instructor_rating_right BETWEEN 0 AND 3),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Active RLS
ALTER TABLE instructor_evaluations ENABLE ROW LEVEL SECURITY;

-- Crée les politiques avec des conditions plus précises
CREATE POLICY "Instructors can view all instructor_evaluations"
  ON instructor_evaluations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Instructors can create instructor_evaluations"
  ON instructor_evaluations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = student_id
    )
  );

CREATE POLICY "Instructors can update instructor_evaluations"
  ON instructor_evaluations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = student_id
    )
  );

CREATE POLICY "Instructors can delete instructor_evaluations"
  ON instructor_evaluations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = student_id
    )
  );

-- Crée l'index pour améliorer les performances
CREATE INDEX instructor_evaluations_student_exercise_idx ON instructor_evaluations (student_id, exercise_id);

-- Crée le trigger pour updated_at
CREATE TRIGGER update_instructor_evaluations_updated_at
  BEFORE UPDATE ON instructor_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();