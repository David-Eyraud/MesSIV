-- Ajoute une nouvelle politique RLS pour permettre aux instructeurs de voir tous les profils
CREATE POLICY "Instructors can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (
      SELECT is_instructor 
      FROM profiles 
      WHERE id = auth.uid()
    ) = true
    OR
    auth.uid() = id
  );