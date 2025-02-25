/*
  # Création des tables profiles et courses

  1. Table profiles
    - Stocke les informations de base des utilisateurs
    - Liée à la table auth.users
    - Inclut prénom, nom et email
    
  2. Table courses
    - Stocke les informations des stages SIV
    - Liée à la table profiles
    - Inclut toutes les informations sur les voiles et sellettes
    
  3. Sécurité
    - Active RLS sur les deux tables
    - Ajoute les politiques CRUD appropriées
    - Ajoute un trigger pour updated_at
*/

-- Supprime les tables si elles existent
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Crée la table profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Active RLS sur profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crée les politiques pour profiles
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

-- Crée la table courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  school TEXT NOT NULL,
  instructor TEXT NOT NULL,
  glider_brand TEXT NOT NULL,
  glider_model TEXT NOT NULL,
  glider_certification TEXT NOT NULL,
  glider_lines BOOLEAN NOT NULL DEFAULT false,
  glider2_brand TEXT,
  glider2_model TEXT,
  glider2_certification TEXT,
  glider2_lines BOOLEAN DEFAULT false,
  harness_brand TEXT NOT NULL,
  harness_model TEXT NOT NULL,
  harness_cocoon BOOLEAN NOT NULL DEFAULT false,
  harness2_brand TEXT,
  harness2_model TEXT,
  harness2_cocoon BOOLEAN DEFAULT false,
  flights_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Active RLS sur courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Crée les politiques pour courses
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

-- Crée le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();