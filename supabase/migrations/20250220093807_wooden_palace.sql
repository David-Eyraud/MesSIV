/*
  # Recréation de la table courses

  1. Suppression
    - Supprime la table courses existante et ses politiques
    
  2. Création
    - Recrée la table avec la structure complète
    - Ajoute toutes les colonnes nécessaires pour les voiles et sellettes
    
  3. Sécurité
    - Active RLS
    - Ajoute les politiques CRUD
    - Ajoute un trigger pour updated_at
*/

-- Supprime la table existante et ses politiques
DROP TABLE IF EXISTS courses CASCADE;

-- Crée la table avec la structure complète
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

-- Active RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Crée les politiques
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

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();