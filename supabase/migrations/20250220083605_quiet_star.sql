/*
  # Correction des données d'exercices

  1. Supprime et recrée la table exercises
  2. Ajoute tous les exercices avec leurs niveaux corrects
  3. Configure la sécurité RLS
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
  -- Exercices de niveau "Tous niveaux"
  (10, 'Tour de frein', 'Faire un tour de frein', false, 'N/A', 'N/A', 'Matériel', 'Tous niveaux', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (20, 'Réglages et position sellette', 'Avoir de bons réglage au niveau de la sellette pour le pilotage et la sécurité', false, 'N/A', 'N/A', 'Matériel', 'Tous niveaux', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (30, 'Théorie du parachute de secours', 'Faire contrôler l''installation du parachute de secours et connaitre la théorie de la mise en oeuvre', false, 'CQ6', 'CQ5', 'Matériel', 'Tous niveaux', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (330, 'Décrochage asymétrique en virage aux arrières', 'Détecter un décrochage asymétrique accidentel en virage aux arrières et réagir correctement', true, 'N/A', 'N/A', 'Pilotage aux arrières', 'Tous niveaux', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (360, 'Les Oreilles + accélérateur', 'Réaliser des oreilles en tirant une suspente de chaque côté, accélérer et se diriger', false, 'V5', 'N/A', 'S''enfuir et descendre', 'Tous niveaux', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),

  -- Exercices de niveau "Brevet de pilote"
  (40, 'Virages aux Arrières', 'Se diriger aux élévateurs arrières', false, 'N/A', 'N/A', 'Pilotage aux arrières', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (50, 'Balancements roulis', 'Créer, amplifier, entretenir et amortir activement le roulis', false, 'V1', 'V2', 'Roulis', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (60, 'Serpent lent', 'Maitriser le roulis en sorties de virages', false, 'V1', 'N/A', 'Roulis', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (70, 'Serpent rapide', 'Maitriser le roulis lors d''inversions de virages', false, 'V1', 'N/A', 'Roulis', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (80, 'Vol dauphin', 'Créer, amplifier, entretenir et amortir activement le langage', false, 'V1', 'V1', 'Tangage', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (90, 'Virages dans une ressource', 'Réaliser une mise en virage au milieu d''une ressource et respecter la remise à plat', true, 'N/A', 'N/A', 'Virages pendulaires', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (100, 'Virages au début de la phase d''accélération', 'Réaliser une mise en virage au début de la phase d''accélération et gérer la sortie de 360', true, 'N/A', 'N/A', 'Virages pendulaires', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (110, 'Virages dynamique (en fin d''accélération)', 'Réaliser une mise en virage à la fin de la phase d''accélération (point 0)', true, 'N/A', 'N/A', 'Virages pendulaires', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (120, '360 à 45°', 'Réaliser un 360 à 45° d''inclinaison', true, 'N/A', 'N/A', 'Spirale (360)', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (130, '360 face planète', 'Réaliser un 360 à plus de 80° d''inclinaison', true, 'N/A', 'V5', 'Spirale (360)', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (140, 'Sortie rapide de 360 engagés', 'Sortir d''une rotation engagée (> 80°) en moins d''un demi tour', false, 'N/A', 'N/A', 'Spirale (360)', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (150, 'Sortie en chandelle', 'Obtenir une belle chandelle bien compensée et une abattée bien symétrique en sortie de 360', false, 'N/A', 'N/A', 'Spirale (360)', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (170, 'Dissipation d''énergie', 'Dissiper l''énergie d''un 360 en effectuant une remise à plat dans la ressource (pas d''abattée en sortie)', false, 'N/A', 'N/A', 'Spirale (360)', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (180, 'Contrôle d''inclinaison jusqu''à 45°', 'Contrôler le niveau d''inclinaison et la vitesse de redressement en 360 (à 2 commandes)', true, 'N/A', 'N/A', 'Spirale (360)', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (190, 'Contrôle d''inclinaison jusqu''à 90°', 'Contrôler le niveau d''inclinaison et la vitesse de redressement en 360 (à 2 commandes)', true, 'N/A', 'N/A', 'Spirale (360)', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (200, 'Décravatage', 'Défaire une cravate avec un décrochage asymétrique', true, 'N/A', 'N/A', 'Décrochage asymétrique', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (210, 'Décrochage asymétrique en virage', 'Détecter un décrochage asymétrique accidentel en virage et réagir correctement', true, 'N/A', 'N/A', 'Décrochage asymétrique', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (220, 'Manoeuvre d''évitement', 'Réaliser un virage brutale pour éviter une collision', true, 'N/A', 'N/A', 'Décrochage asymétrique', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (230, 'Fermeture Asymétrique non maintenue', 'Réaliser une fermeture asymétrique >45° non maintenue', true, 'V2', 'V4', 'SIV', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (250, 'Fermeture Asymétrique maintenue', 'Réaliser une Fermeture Asymétrique >45%, la maintenir, contrôler le CAP est se diriger', true, 'V2', 'V4', 'SIV', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (260, 'Fermeture Frontale (commandes clipsées)', 'Réaliser une fermetures frontales à minimum 50% et réagir correctement', false, 'V2', 'V4', 'SIV', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (270, 'Fermeture Frontale (commandes en main)', 'Réaliser une fermetures frontales à minimum 50% en gardant les commandes de frein en main', false, 'V2', 'V4', 'SIV', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (290, 'Parachutale aux B', 'Réaliser une parachutale en tractant les élévateurs B (minimum 4 secondes)', false, 'N/A', 'V4', 'SIV', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (300, 'Utilisation de l''accélérateur', 'Pousser l''accélérateur à 100% et se diriger aux arrières', false, 'V5', 'N/A', 'S''enfuir et descendre', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (350, 'Les Oreilles', 'Réaliser des oreilles en tirant une suspente de chaque côté et se diriger', false, 'V5', 'N/A', 'S''enfuir et descendre', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (370, '(Très) grandes oreilles + accélérateur', 'Réaliser des très grandes oreilles en tirant 2 suspentes sur 3 de chaque côté ou en ravalant une seule suspente (sur deux), accélérer et se diriger', false, 'N/A', 'V5', 'S''enfuir et descendre', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (380, 'B extérieurs', 'Réaliser une traction de la suspente B extérieur de chaque côté et se diriger', false, 'N/A', 'V5', 'S''enfuir et descendre', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (390, 'B extérieurs + accélérateur', 'Réaliser une traction de la suspente B extérieur de chaque côté, accélérer et se diriger', false, 'N/A', 'V5', 'S''enfuir et descendre', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (400, 'A intérieurs', 'Réaliser une petite fermeture du centre du bord d''attaque en tractant les 2 suspentes A1', false, 'N/A', 'V5', 'S''enfuir et descendre', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (410, '360 aux oreilles', 'Réaliser une descente rapide en 360 aux oreilles', true, 'N/A', 'V5', 'S''enfuir et descendre', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (420, 'Méthode Suisse (360 avec fermeture extérieure)', 'Réaliser une descente rapide en 360 avec une fermeture asymétrique extérieure au virage', true, 'N/A', 'V5', 'S''enfuir et descendre', 'Brevet de pilote', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),

  -- Exercices de niveau "Brevet de pilote confirmé"
  (160, 'Tempo de fortes abattées pendulaires', 'Contrôler une forte abattée pendulaire', false, 'N/A', 'N/A', 'Tangage', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (240, 'Fermeture Asymétrique accéléré', 'Réaliser une fermeture asymétrique avec l''accélérateur poussé (minimum 80%)', true, 'N/A', 'V4', 'SIV', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (280, 'Fermeture Frontale accéléré', 'Réaliser une fermetures frontales avec l''accélérateur poussé (minimum 80%)', false, 'N/A', 'V4', 'SIV', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (310, 'Vol dauphin aux arrières', 'Créer, amplifier, entretenir et amortir activement le langage en pilotant aux élévateurs arrières', false, 'N/A', 'N/A', 'Pilotage aux arrières', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (320, 'Point de décrochage aux arrières', 'Sentir le moment du décrochage lors d''une traction symétrique des élévateurs arrières', false, 'N/A', 'N/A', 'Pilotage aux arrières', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (340, 'Tempo de fortes abattées aux arrières', 'Contrôler une forte abattée pendulaire aux arrières', false, 'N/A', 'N/A', 'Pilotage aux arrières', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (430, 'Auto-rotation stabilisée', 'Réaliser une autorotation (de type SAT) et la maintenir stabilisée durant 2 tours minimum', true, 'N/A', 'V4', 'SIV', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (440, 'Sortie d''auto-rotation', 'Sortir d''une autorotation et prendre un cap en conservant la voile toujours fermée (minimum 40%)', true, 'N/A', 'V4', 'SIV', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (450, 'Petits Wing-Over', 'Réaliser une série de wing-over (90° de roulis et 90° à 180°de changement de cap à chaque inversion de virage)', false, 'N/A', 'V3', 'Wing-Over', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (470, 'Décrochage complet', 'Réaliser un décrochage complet de la voile', false, 'N/A', 'N/A', 'Décrochage et marche arrière', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (480, 'Marche Arrière stabilisée', 'Stabiliser une marche arrière avec le meilleur compromis de quantité de frein', false, 'N/A', 'N/A', 'Décrochage et marche arrière', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (490, 'Tempo de fortes abattées aérodynamiques', 'Contrôler une forte abattée aérodynamique', false, 'N/A', 'N/A', 'Tangage', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (500, 'Vrille avec sortie en marche arrière', 'Réaliser une vrille minimum 1 tour et utiliser la marche arrière pour s''en sortir', true, 'N/A', 'N/A', 'Décrochage et marche arrière', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (510, 'Vrille avec sortie avant', 'Réaliser une vrille minimum 1 tour et sortir en relâchant les commandes', true, 'N/A', 'N/A', 'Décrochage et marche arrière', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (520, 'Ouverture du parachute de secours', 'Effectuer une ouverture du parachute de secours', false, 'N/A', 'CQ5', 'Parachute de secours', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (530, 'Affaler la voile après ouverture du parachute de secours', 'Affaler la voile symétriquement après l''ouverture du parachute de secours', false, 'N/A', 'CQ5', 'Parachute de secours', 'Brevet de pilote confirmé', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),

  -- Exercices de niveau "Voltige"
  (460, 'Gros Wing-Over', 'Réaliser une série de wing-over (110° à 135° de roulis et 180° à 270°de changement de cap à chaque inversion de virage)', false, 'N/A', 'N/A', 'Wing-Over', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (540, 'SAT', 'Réaliser la manoeuvre SAT (minimum 45°)', true, 'N/A', 'N/A', 'SAT', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (550, 'SAT percée en entrée', 'Réaliser une entrée trop rapide en SAT, provoquer un décrochage asymétrique et une vrille, et sortir par la marche arrière', true, 'N/A', 'N/A', 'SAT', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (560, 'SAT to vrille', 'Réaliser une SAT stabilisée puis enchainer sur une vrille', true, 'N/A', 'N/A', 'SAT', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (570, '360 asymétriques', 'Réaliser une série de 360 asymétriques (110° à 135° de roulis)', true, 'N/A', 'N/A', 'Wing-Over', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (580, 'Inversion', 'Réaliser une inversion de virage depuis un 360 asymétrique ou un 360', true, 'N/A', 'N/A', 'Wing-Over', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (590, 'Super stall', 'Réaliser un décrochage dans une grosse ressource', false, 'N/A', 'N/A', 'Décrochage et marche arrière', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (600, 'Parachutale aux freins', 'Réaliser une phase parachutale aux freins', false, 'N/A', 'N/A', 'Hélicoptère', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (610, 'Vrille reconstruite', 'Réaliser une vrille et reconstruire vers la position hélicoptère', true, 'N/A', 'N/A', 'Hélicoptère', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (620, 'Hélicoptère sortie arrière', 'Réaliser un hélicoptère et sortir par la marche arrière', true, 'N/A', 'N/A', 'Hélicoptère', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (630, 'Hélicoptère sortie avant', 'Réaliser un hélicoptère et sortir par l''avant', true, 'N/A', 'N/A', 'Hélicoptère', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (640, 'Vrille 1 tour sortie avant', 'Réaliser une vrille reconstruite sur un tour et sortir par l''avant en contrôlant l''abattée', true, 'N/A', 'N/A', 'Misty Flip', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (650, 'Misty Flip', 'Réaliser un misty Flip (sortie dans l''axe de rentrée)', true, 'N/A', 'N/A', 'Misty Flip', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (660, 'Mac twist', 'Réaliser un Mac Twist', true, 'N/A', 'N/A', 'Mac Twist', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (670, 'Sat Asymétrique', 'Réaliser une Sat Asymétrique', true, 'N/A', 'N/A', 'SAT asymétrique', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (680, 'Rythmique SAT', 'Réaliser une Rythmique SAT', true, 'N/A', 'N/A', 'SAT asymétrique', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (690, 'Tumbling', 'Réaliser un Tumbling', true, 'N/A', 'N/A', 'SAT asymétrique', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']),
  (700, 'Infinity', 'Réaliser un Infinity Tumbling', false, 'N/A', 'N/A', 'SAT asymétrique', 'Voltige', 'à implémenter plus tard', ARRAY['APPI basic SIV', 'APPI advanced SIV', '2 lignes']);