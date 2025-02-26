-- Ajoute une nouvelle politique RLS pour permettre aux instructeurs de voir les cours qu'ils enseignent
CREATE POLICY "Instructors can view courses they teach"
  ON courses FOR SELECT
  TO authenticated
  USING (
    instructor = (
      SELECT first_name || ' ' || last_name 
      FROM profiles 
      WHERE id = auth.uid()
    )
    OR
    (
      SELECT is_instructor 
      FROM profiles 
      WHERE id = auth.uid()
    ) = true
  );