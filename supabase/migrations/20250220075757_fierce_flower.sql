/*
  # Import des exercices depuis le CSV

  1. Structure
    - Supprime et recrée la table `exercises`
    - Colonnes adaptées au format du CSV :
      - `id` : INTEGER PRIMARY KEY
      - `name` : TEXT NOT NULL
      - `objective` : TEXT
      - `right_and_left` : BOOLEAN
      - `bp` : TEXT
      - `bpc` : TEXT
      - `theme` : TEXT NOT NULL
      - `level` : TEXT NOT NULL
      - `description` : TEXT
      - `keywords` : TEXT[]

  2. Sécurité
    - Active RLS
    - Politique de lecture pour les utilisateurs authentifiés

  3. Données
    - Import de tous les exercices du CSV
    - Conversion des séparateurs spécifiques
*/

-- Supprime la table si elle existe
DROP TABLE IF EXISTS exercises;

-- Crée la table avec la structure complète
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

-- Active RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour les utilisateurs authentifiés
CREATE POLICY "Users can view exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- Insertion de tous les exercices
INSERT INTO exercises (id, name, objective, right_and_left, bp, bpc, theme, level, description, keywords) VALUES
  (10, 'Tour de frein', 'Faire un tour de frein', false, 'N/A', 'N/A', 'Matériel', 'Tous niveaux', 'à implémenter plus tard', string_to_array('APPI basic SIV, APPI advanced SIV, 2 lignes', ', ')),
  (20, 'Réglages et position sellette', 'Avoir de bons réglage au niveau de la sellette pour le pilotage et la sécurité', false, 'N/A', 'N/A', 'Matériel', 'Tous niveaux', 'à implémenter plus tard', string_to_array('APPI basic SIV, APPI advanced SIV, 2 lignes', ', ')),
  (30, 'Théorie du parachute de secours', 'Faire contrôler l''installation du parachute de secours et connaitre la théorie de la mise en oeuvre', false, 'CQ6', 'CQ5', 'Matériel', 'Tous niveaux', 'à implémenter plus tard', string_to_array('APPI basic SIV, APPI advanced SIV, 2 lignes', ', ')),
  (40, 'Virages aux Arrières', 'Se diriger aux élévateurs arrières', false, 'N/A', 'N/A', 'Pilotage aux arrières', 'Brevet de pilote', 'à implémenter plus tard', string_to_array('APPI basic SIV, APPI advanced SIV, 2 lignes', ', ')),
  (50, 'Balancements roulis', 'Créer, amplifier, entretenir et amortir activement le roulis', false, 'V1', 'V2', 'Roulis', 'Brevet de pilote', 'à implémenter plus tard', string_to_array('APPI basic SIV, APPI advanced SIV, 2 lignes', ', ')),
  (60, 'Serpent lent', 'Maitriser le roulis en sorties de virages', false, 'V1', 'N/A', 'Roulis', 'Brevet de pilote', 'à implémenter plus tard', string_to_array('APPI basic SIV, APPI advanced SIV, 2 lignes', ', ')),
  (70, 'Serpent rapide', 'Maitriser le roulis lors d''inversions de virages', false, 'V1', 'N/A', 'Roulis', 'Brevet de pilote', 'à implémenter plus tard', string_to_array('APPI basic SIV, APPI advanced SIV, 2 lignes', ', ')),
  (80, 'Vol dauphin', 'Créer, amplifier, entretenir et amortir activement le langage', false, 'V1', 'V1', 'Tangage', 'Brevet de pilote', 'à implémenter plus tard', string_to_array('APPI basic SIV, APPI advanced SIV, 2 lignes', ', '));