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

-- Crée les politiques
CREATE POLICY "Anyone can view instructor_evaluations"
  ON instructor_evaluations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can create instructor_evaluations"
  ON instructor_evaluations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update instructor_evaluations"
  ON instructor_evaluations FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can delete instructor_evaluations"
  ON instructor_evaluations FOR DELETE
  TO authenticated
  USING (true);

-- Crée des index pour améliorer les performances
CREATE INDEX instructor_evaluations_student_idx ON instructor_evaluations (student_id);
CREATE INDEX instructor_evaluations_exercise_idx ON instructor_evaluations (exercise_id);
CREATE INDEX instructor_evaluations_created_at_idx ON instructor_evaluations (created_at);

-- Crée le trigger pour updated_at
CREATE TRIGGER update_instructor_evaluations_updated_at
  BEFORE UPDATE ON instructor_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();