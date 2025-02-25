-- Supprime les politiques existantes sur la table profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can insert profile" ON profiles;

-- Désactive temporairement RLS pour s'assurer que les politiques sont bien appliquées
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Ajoute une contrainte unique sur l'email
ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);

-- Réactive RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crée les nouvelles politiques
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);