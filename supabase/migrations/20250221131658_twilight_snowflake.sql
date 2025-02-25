-- Supprime toutes les politiques existantes sur la table exercises
DROP POLICY IF EXISTS "Users can view exercises" ON exercises;
DROP POLICY IF EXISTS "Anyone can view exercises" ON exercises;

-- Désactive puis réactive RLS pour s'assurer que les politiques sont bien appliquées
ALTER TABLE exercises DISABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Crée une nouvelle politique qui permet à tout le monde de voir les exercices
CREATE POLICY "Anyone can view exercises"
  ON exercises FOR SELECT
  USING (true);