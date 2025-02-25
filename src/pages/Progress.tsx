import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import ScrollToTop from '../components/ScrollToTop';
import ExerciseCard from '../components/ExerciseCard';
import ProgressIcon from '../components/icons/ProgressIcon';
import { Link } from 'react-router-dom';

interface Exercise {
  id: number;
  name: string;
  objective: string;
  right_and_left: boolean;
  bp: string;
  bpc: string;
  theme: string;
  level: string;
  description: string;
  keywords: string[];
}

interface Evaluation {
  id: string;
  exercise_id: number;
  student_rating_left: number;
  student_rating_right: number;
  instructor_rating: number;
  created_at: string;
}

interface StudentRatings {
  [key: number]: {
    left?: number;
    right?: number;
  };
}

interface InstructorRatings {
  [key: number]: {
    left?: number;
    right?: number;
  };
}

const LEVELS = ['Tous les exercices', 'Brevet de pilote', 'Brevet de pilote confirmé', 'Voltige'] as const;
type Level = typeof LEVELS[number];

const Progress = () => {
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level>('Tous les exercices');
  const [includeUpToLevel, setIncludeUpToLevel] = useState(true);
  const [studentRatings, setStudentRatings] = useState<StudentRatings>({});
  const [instructorRatings, setInstructorRatings] = useState<InstructorRatings>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [courses, setCourses] = useState<{ id: string; date: string }[]>([]);
  const [showOnlyEvaluated, setShowOnlyEvaluated] = useState(false);

  // Charger les stages
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, date')
          .order('date', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
        
        // Sélectionner automatiquement le stage le plus récent
        if (data && data.length > 0) {
          setSelectedCourse(data[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stages:', error);
      }
    };

    loadCourses();
  }, [user]);

  // Charger les exercices et les évaluations
  useEffect(() => {
    const loadExercisesAndEvaluations = async () => {
      setLoading(true);
      try {
        // Charger tous les exercices
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .order('id');

        if (exercisesError) {
          console.error('Erreur lors du chargement des exercices:', exercisesError);
          return;
        }

        setExercises(exercisesData || []);

        // Si l'utilisateur est connecté, charger ses évaluations
        if (user) {
          let evaluationsQuery = supabase
            .from('evaluations')
            .select('*')
            .eq('user_id', user.id);

          if (selectedCourse !== 'all') {
            evaluationsQuery = evaluationsQuery.eq('course_id', selectedCourse);
          }

          const { data: evaluationsData, error: evaluationsError } = await evaluationsQuery;

          if (evaluationsError) throw evaluationsError;

          // Charger les évaluations du moniteur
          let instructorEvaluationsQuery = supabase
            .from('instructor_evaluations')
            .select('*')
            .eq('student_id', user.id);

          if (selectedCourse !== 'all') {
            instructorEvaluationsQuery = instructorEvaluationsQuery.eq('course_id', selectedCourse);
          }

          const { data: instructorEvaluationsData, error: instructorEvaluationsError } = await instructorEvaluationsQuery;

          if (instructorEvaluationsError) throw instructorEvaluationsError;

          // Traiter les évaluations de l'élève
          const ratingsMap: StudentRatings = {};
          if (evaluationsData) {
            evaluationsData.forEach(evaluation => {
              ratingsMap[evaluation.exercise_id] = {
                left: evaluation.student_rating_left,
                right: evaluation.student_rating_right
              };
            });
          }
          setStudentRatings(ratingsMap);

          // Traiter les évaluations du moniteur
          const instructorRatingsMap: InstructorRatings = {};
          if (instructorEvaluationsData) {
            instructorEvaluationsData.forEach(evaluation => {
              instructorRatingsMap[evaluation.exercise_id] = {
                left: evaluation.instructor_rating_left,
                right: evaluation.instructor_rating_right
              };
            });
          }
          setInstructorRatings(instructorRatingsMap);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercisesAndEvaluations();
  }, [user, selectedCourse]);

  const handleRatingChange = async (exerciseId: number, side: 'left' | 'right', value: number) => {
    if (!user || selectedCourse === 'all') return;

    try {
      const existingEval = studentRatings[exerciseId];
      const ratingData = {
        user_id: user.id,
        course_id: selectedCourse,
        exercise_id: exerciseId,
        student_rating_left: side === 'left' ? value : existingEval?.student_rating_left || 0,
        student_rating_right: side === 'right' ? value : existingEval?.student_rating_right || 0
      };

      const { error } = await supabase
        .from('evaluations')
        .upsert([ratingData]);

      if (error) throw error;

      // Mettre à jour l'état local
      setStudentRatings(prev => ({
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          [side]: value
        }
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'évaluation:', error);
    }
  };

  const getLevelIndex = (level: string): number => {
    return LEVELS.indexOf(level as Level);
  };

  const filteredExercises = exercises.filter(exercise => {
    // Si "Tous les exercices" est sélectionné, on affiche tous les exercices
    if (selectedLevel === 'Tous les exercices') {
      if (showOnlyEvaluated && user) {
        const evaluation = studentRatings[exercise.id];
        return evaluation && (
          (evaluation.left && evaluation.left > 0) || 
          (evaluation.right && evaluation.right > 0)
        );
      }
      return true;
    }

    // Sinon, on applique les filtres de niveau
    const exerciseLevelIndex = getLevelIndex(exercise.level);
    const selectedLevelIndex = getLevelIndex(selectedLevel);

    let levelMatch = false;
    if (includeUpToLevel) {
      // Inclure tous les niveaux jusqu'au niveau sélectionné
      levelMatch = exerciseLevelIndex <= selectedLevelIndex;
    } else {
      // Afficher uniquement le niveau sélectionné
      levelMatch = exercise.level === selectedLevel;
    }

    // Filtrer les exercices évalués si l'option est activée et l'utilisateur est connecté
    if (showOnlyEvaluated && user) {
      const evaluation = studentRatings[exercise.id];
      const hasEvaluation = evaluation && (
        (evaluation.left && evaluation.left > 0) || 
        (evaluation.right && evaluation.right > 0)
      );
      return levelMatch && hasEvaluation;
    }

    return levelMatch;
  });

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 py-2">
      <ScrollToTop />
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-primary mb-1">Ma Progression</h1>
        <p className="text-lg text-gray-600">
          Suivez votre progression sur tous vos exercices de SIV
        </p>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-amber-800">
            Pour pouvoir évaluer vos exercices, vous devez{' '}
            <Link to="/account" className="text-primary hover:text-primary-600 font-medium">
              créer un compte
            </Link>
            {' '}et créer un stage.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-3 mb-3 sticky top-0 z-10">
        {user && (
          <div className="mb-3">
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
              Stage
            </label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="all">Tous mes stages</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  Stage du {new Date(course.date).toLocaleDateString('fr-FR')}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 text-gray-500" />
            <span>Filtres</span>
          </button>
          <div className="text-sm text-gray-500">
            {filteredExercises.length} exercices
          </div>
        </div>

        {showFilters && (
          <div className="border-t border-gray-200 pt-3 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as Level)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {selectedLevel !== 'Tous les exercices' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeUpToLevel"
                  checked={includeUpToLevel}
                  onChange={(e) => setIncludeUpToLevel(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="includeUpToLevel" className="text-sm text-gray-700">
                  Inclure les niveaux précédents
                </label>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showOnlyEvaluated"
                  checked={showOnlyEvaluated}
                  onChange={(e) => setShowOnlyEvaluated(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="showOnlyEvaluated" className="text-sm text-gray-700">
                  Afficher seulement les exercices évalués
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : filteredExercises.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredExercises.map(exercise => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              studentRating={studentRatings[exercise.id] || { right: 0, left: 0 }}
              instructorRating={instructorRatings[exercise.id]}
              onRatingChange={user ? (side, value) => handleRatingChange(exercise.id, side, value) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <div className="w-12 h-12 mx-auto mb-2 text-gray-400">
            <ProgressIcon />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun exercice trouvé</h3>
          <p className="text-gray-500">Modifiez vos critères de filtrage</p>
        </div>
      )}
    </div>
  );
};

export default Progress;