-- Supprime la table si elle existe
DROP TABLE IF EXISTS evaluations CASCADE;

-- Crée la table evaluations
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  student_rating_left INTEGER CHECK (student_rating_left BETWEEN 0 AND 5),
  student_rating_right INTEGER CHECK (student_rating_right BETWEEN 0 AND 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id, exercise_id)
);

-- Active RLS
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Crée les politiques
CREATE POLICY "Anyone can view evaluations"
  ON evaluations FOR SELECT
  USING (true);

CREATE POLICY "Users can create own evaluations"
  ON evaluations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evaluations"
  ON evaluations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own evaluations"
  ON evaluations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Crée des index pour améliorer les performances
CREATE INDEX evaluations_user_idx ON evaluations (user_id);
CREATE INDEX evaluations_course_idx ON evaluations (course_id);
CREATE INDEX evaluations_exercise_idx ON evaluations (exercise_id);
CREATE INDEX evaluations_created_at_idx ON evaluations (created_at);

-- Crée le trigger pour updated_at
CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();