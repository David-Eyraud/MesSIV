-- Ajoute la colonne course_id à la table instructor_evaluations
ALTER TABLE instructor_evaluations 
ADD COLUMN course_id UUID REFERENCES courses(id) ON DELETE CASCADE;

-- Crée un index pour améliorer les performances
CREATE INDEX instructor_evaluations_course_id_idx ON instructor_evaluations (course_id);