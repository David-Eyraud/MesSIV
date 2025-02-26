-- Supprime les politiques existantes qui causent la récursion
DROP POLICY IF EXISTS "Instructors can view courses they teach" ON courses;
DROP POLICY IF EXISTS "Instructors can view all profiles" ON profiles;

-- Crée une fonction pour vérifier si un utilisateur est instructeur
CREATE OR REPLACE FUNCTION is_instructor(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND is_instructor = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrée les politiques sans récursion
CREATE POLICY "Instructors can view courses they teach"
  ON courses FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    is_instructor(auth.uid())
  );

CREATE POLICY "Instructors can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    is_instructor(auth.uid())
  );