/*
  # Correction de la table profiles

  Cette migration vérifie si la table profiles existe déjà avant de la créer.
  Elle ajoute également les politiques de sécurité nécessaires.

  1. Vérification et création de la table
    - Vérifie si la table `profiles` existe
    - Crée la table si elle n'existe pas
    - Ajoute les colonnes nécessaires

  2. Sécurité
    - Active RLS sur la table
    - Ajoute les politiques pour :
      - Lecture du profil
      - Mise à jour du profil
      - Insertion du profil
*/

DO $$ 
BEGIN
  -- Vérifie si la table profiles existe
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles'
  ) THEN
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
  END IF;
END $$;