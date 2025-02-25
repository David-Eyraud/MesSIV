/*
  # Ajout de données de test pour les stages

  1. Données
    - Ajoute 3 stages de test avec des données réalistes
    - Inclut toutes les informations nécessaires (voiles, sellettes, etc.)
    
  2. Sécurité
    - Les stages sont associés à un utilisateur test
    - Respecte les politiques RLS existantes
*/

-- Insérer des stages de test
INSERT INTO courses (
  user_id,
  date,
  location,
  school,
  instructor,
  glider_brand,
  glider_model,
  glider_certification,
  glider_lines,
  harness_brand,
  harness_model,
  harness_cocoon,
  flights_count,
  notes
) VALUES
(
  '00000000-0000-0000-0000-000000000000', -- Remplacer par l'ID de l'utilisateur test
  '2025-04-15',
  'Lac d''Annecy',
  'Les Passagers du Vent',
  'David Eyraud',
  'Advance',
  'Sigma 11',
  'B',
  false,
  'Advance',
  'Impress 4',
  true,
  8,
  'Premier stage SIV, très bonne progression sur les exercices de base.'
),
(
  '00000000-0000-0000-0000-000000000000', -- Remplacer par l'ID de l'utilisateur test
  '2025-05-20',
  'Lac de Serre-Ponçon',
  'Pilotage Parapente',
  'David Eyraud',
  'Ozone',
  'Rush 6',
  'B',
  false,
  'Advance',
  'Impress 4',
  true,
  12,
  'Stage de perfectionnement, travail sur les 360 et wing-overs.'
),
(
  '00000000-0000-0000-0000-000000000000', -- Remplacer par l'ID de l'utilisateur test
  '2025-06-10',
  'Lac d''Annecy',
  'Les Passagers du Vent',
  'David Eyraud',
  'Ozone',
  'Rush 6',
  'B',
  false,
  'Advance',
  'Impress 4',
  true,
  10,
  'Stage de perfectionnement avancé, début du travail sur les manœuvres de voltige.'
);