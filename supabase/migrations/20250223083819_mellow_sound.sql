-- Supprime les politiques existantes sur la table courses
DROP POLICY IF EXISTS "Users can view own courses" ON courses;
DROP POLICY IF EXISTS "Users can create own courses" ON courses;
DROP POLICY IF EXISTS "Users can update own courses" ON courses;
DROP POLICY IF EXISTS "Users can delete own courses" ON courses;

-- Désactive temporairement RLS pour s'assurer que les politiques sont bien appliquées
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Réactive RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Crée les nouvelles politiques
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