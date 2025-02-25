/*
  # Nettoyage et recréation de la table profiles

  Cette migration nettoie les tables et politiques existantes puis recrée la table profiles
  avec toutes les politiques nécessaires.

  1. Nettoyage
    - Supprime les politiques existantes
    - Supprime la table si elle existe

  2. Création
    - Crée la table profiles avec toutes les colonnes nécessaires
    - Active RLS
    - Ajoute toutes les politiques de sécurité

  3. Sécurité
    - Active RLS sur la table
    - Ajoute les politiques pour :
      - Lecture du profil
      - Mise à jour du profil
      - Insertion du profil
*/

-- Supprime les politiques existantes s'il y en a
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Supprime la table si elle existe
DROP TABLE IF EXISTS profiles;

-- Crée la table profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Active RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crée les politiques
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