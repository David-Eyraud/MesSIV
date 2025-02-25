/*
  # Ajout de la table profiles et de ses politiques

  1. Nouvelles Tables
    - `profiles`
      - `id` (uuid, clé primaire, référence auth.users)
      - `first_name` (text, non null)
      - `last_name` (text, non null)
      - `email` (text, non null)
      - `created_at` (timestamptz, défaut now())
      - `updated_at` (timestamptz, défaut now())

  2. Sécurité
    - Activation de RLS sur la table `profiles`
    - Politiques pour permettre aux utilisateurs de :
      - Voir leur propre profil
      - Mettre à jour leur propre profil
      - Insérer leur propre profil
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
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