-- Supprime la table existante et ses politiques
DROP TABLE IF EXISTS instructor_evaluations CASCADE;

-- Crée la table instructor_evaluations avec la structure complète
CREATE TABLE instructor_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  instructor_rating_left INTEGER CHECK (instructor_rating_left BETWEEN 0 AND 3),
  instructor_rating_right INTEGER CHECK (instructor_rating_right BETWEEN 0 AND 3),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Contrainte unique pour éviter les doublons
  UNIQUE(student_id, course_id, exercise_id)
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
CREATE INDEX instructor_evaluations_course_idx ON instructor_evaluations (course_id);
CREATE INDEX instructor_evaluations_exercise_idx ON instructor_evaluations (exercise_id);
CREATE INDEX instructor_evaluations_created_at_idx ON instructor_evaluations (created_at);