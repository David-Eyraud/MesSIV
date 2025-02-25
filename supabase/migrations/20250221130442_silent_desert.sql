-- Supprime la politique existante
DROP POLICY IF EXISTS "Users can view exercises" ON exercises;

-- Crée une nouvelle politique qui permet à tout le monde de voir les exercices
CREATE POLICY "Anyone can view exercises"
  ON exercises FOR SELECT
  USING (true);