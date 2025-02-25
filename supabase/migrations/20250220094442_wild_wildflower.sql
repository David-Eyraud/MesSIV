/*
  # Création du schéma complet de la base de données

  1. Tables
    - profiles : Informations utilisateur
    - courses : Stages SIV
    - exercises : Exercices de SIV
    - evaluations : Évaluations des exercices

  2. Relations
    - profiles -> auth.users
    - courses -> profiles
    - evaluations -> profiles, courses, exercises

  3. Sécurité
    - RLS activé sur toutes les tables
    - Politiques CRUD appropriées
    - Triggers pour updated_at
*/

-- Supprime les tables existantes
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
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

-- Crée la table exercises
CREATE TABLE exercises (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  objective TEXT,
  right_and_left BOOLEAN NOT NULL DEFAULT false,
  bp TEXT,
  bpc TEXT,
  theme TEXT NOT NULL,
  level TEXT NOT NULL,
  description TEXT,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Active RLS sur exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Crée les politiques pour exercises
CREATE POLICY "Users can view exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- Crée la table evaluations
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  student_rating_left INTEGER CHECK (student_rating_left BETWEEN 0 AND 5),
  student_rating_right INTEGER CHECK (student_rating_right BETWEEN 0 AND 5),
  instructor_rating INTEGER CHECK (instructor_rating BETWEEN 0 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Active RLS sur evaluations
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Crée les politiques pour evaluations
CREATE POLICY "Users can view own evaluations"
  ON evaluations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own evaluations"
  ON evaluations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own evaluations"
  ON evaluations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own evaluations"
  ON evaluations FOR DELETE
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

CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();