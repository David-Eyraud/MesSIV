import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, PencilLine } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ScrollToTop from '../components/ScrollToTop';
import InstructorExerciseCard from '../components/InstructorExerciseCard';

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

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  course: {
    id: string;
    date: string;
    location: string;
    school: string;
    glider_brand: string;
    glider_model: string;
  };
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

const Evaluate = () => {
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>('Tous les exercices');
  const [includeUpToLevel, setIncludeUpToLevel] = useState(true);
  const [studentRatings, setStudentRatings] = useState<StudentRatings>({});
  const [instructorRatings, setInstructorRatings] = useState<InstructorRatings>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyEvaluated, setShowOnlyEvaluated] = useState(false);
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(() => new Date());
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  // Charger les élèves pour la période sélectionnée
  useEffect(() => {
    if (!user?.user_metadata.is_instructor) {
      setLoading(false);
      return;
    }

    const loadStudents = async () => {
      setLoading(true);
      try {
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select(`
            id,
            date,
            location,
            school,
            glider_brand,
            glider_model,
            user_id
          `)
          .eq('instructor', 'David Eyraud')
          .gte('date', format(startDate, 'yyyy-MM-dd'))
          .lte('date', format(endDate, 'yyyy-MM-dd'));

        if (coursesError) {
          console.error('Erreur lors de la récupération des stages:', coursesError);
          throw coursesError;
        }

        if (!courses || courses.length === 0) {
          setStudents([]);
          return;
        }

        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', courses.map(c => c.user_id));

        if (profilesError) {
          console.error('Erreur lors de la récupération des profils:', profilesError);
          throw profilesError;
        }

        const formattedStudents = courses.map(course => {
          const profile = profiles?.find(p => p.id === course.user_id);
          if (!profile) return null;

          return {
            id: profile.id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            course: {
              id: course.id,
              date: course.date,
              location: course.location,
              school: course.school,
              glider_brand: course.glider_brand,
              glider_model: course.glider_model
            }
          };
        }).filter(Boolean) as Student[];

        setStudents(formattedStudents);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [user, startDate, endDate]);

  // Charger les exercices et les évaluations
  useEffect(() => {
    if (!selectedStudent) return;

    const loadExercisesAndEvaluations = async () => {
      setLoading(true);
      try {
        // Charger les exercices
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .order('id');

        if (exercisesError) {
          console.error('Erreur lors du chargement des exercices:', exercisesError);
          return;
        }

        setExercises(exercisesData || []);

        // Charger les évaluations de l'élève
        const { data: studentEvaluations, error: studentEvalError } = await supabase
          .from('evaluations')
          .select('*')
          .eq('user_id', selectedStudent.id)
          .eq('course_id', selectedStudent.course.id);

        if (studentEvalError) {
          console.error('Erreur lors du chargement des évaluations élève:', studentEvalError);
          return;
        }

        // Charger les évaluations du moniteur
        const { data: instructorEvaluations, error: instructorEvalError } = await supabase
          .from('instructor_evaluations')
          .select('*')
          .eq('student_id', selectedStudent.id)
          .eq('course_id', selectedStudent.course.id);

        if (instructorEvalError) {
          console.error('Erreur lors du chargement des évaluations moniteur:', instructorEvalError);
          return;
        }

        // Traiter les évaluations
        const studentRatingsMap: StudentRatings = {};
        const instructorRatingsMap: InstructorRatings = {};

        if (studentEvaluations) {
          studentEvaluations.forEach((evaluation) => {
            studentRatingsMap[evaluation.exercise_id] = {
              left: evaluation.student_rating_left,
              right: evaluation.student_rating_right
            };
          });
        }

        if (instructorEvaluations) {
          instructorEvaluations.forEach((evaluation) => {
            instructorRatingsMap[evaluation.exercise_id] = {
              left: evaluation.instructor_rating_left,
              right: evaluation.instructor_rating_right
            };
          });
        }

        setStudentRatings(studentRatingsMap);
        setInstructorRatings(instructorRatingsMap);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExercisesAndEvaluations();
  }, [selectedStudent]);

  const handleRatingChange = async (exerciseId: number, side: 'left' | 'right', value: number) => {
    if (!selectedStudent) return;

    try {
      const existingRating = instructorRatings[exerciseId] || {};
      const ratingData = {
        student_id: selectedStudent.id,
        course_id: selectedStudent.course.id,
        exercise_id: exerciseId,
        instructor_rating_left: side === 'left' ? value : existingRating.left || 0,
        instructor_rating_right: side === 'right' ? value : existingRating.right || 0
      };

      // Récupérer d'abord l'évaluation existante
      const { data, error: selectError } = await supabase
        .from('instructor_evaluations')
        .select('id')
        .match({
          student_id: selectedStudent.id,
          course_id: selectedStudent.course.id,
          exercise_id: exerciseId
        });

      if (selectError) throw selectError;

      let error;
      if (data && data.length > 0) {
        // Si l'évaluation existe, faire un update
        const { error: updateError } = await supabase
          .from('instructor_evaluations')
          .update(ratingData)
          .eq('id', data[0].id);
        error = updateError;
      } else {
        // Sinon, faire un insert
        const { error: insertError } = await supabase
          .from('instructor_evaluations')
          .insert([ratingData]);
        error = insertError;
      }

      if (error) throw error;

      // Mettre à jour l'état local
      setInstructorRatings(prev => ({
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
      if (showOnlyEvaluated) {
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

    // Filtrer les exercices évalués si l'option est activée
    if (showOnlyEvaluated) {
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
        <h1 className="text-3xl font-bold text-primary mb-1">Noter mes élèves</h1>
        <p className="text-lg text-gray-600">
          Évaluez les exercices de vos élèves et suivez leur progression
        </p>
      </div>

      {/* Sélecteur de dates - non sticky */}
      <div className="bg-white rounded-lg shadow-md p-3 mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Période
        </label>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div 
              onClick={() => setShowStartCalendar(!showStartCalendar)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-primary"
            >
              <span className="text-sm text-gray-600">Du</span>
              <span className="text-sm font-medium">
                {format(startDate, 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            {showStartCalendar && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-20">
                <input
                  type="date"
                  value={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    setStartDate(new Date(e.target.value));
                    setShowStartCalendar(false);
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            )}
          </div>

          <div className="relative flex-1">
            <div 
              onClick={() => setShowEndCalendar(!showEndCalendar)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-primary"
            >
              <span className="text-sm text-gray-600">au</span>
              <span className="text-sm font-medium">
                {format(endDate, 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            {showEndCalendar && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-20">
                <input
                  type="date"
                  value={format(endDate, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    setEndDate(new Date(e.target.value));
                    setShowEndCalendar(false);
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sélecteur de pilote - sticky */}
      <div className="bg-white rounded-lg shadow-md p-3 mb-3 sticky top-0 z-10">
        <div className="relative">
          <select
            className="w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary pr-10"
            onChange={(e) => {
              const student = students.find(s => `${s.id}-${s.course.id}` === e.target.value);
              setSelectedStudent(student || null);
            }}
            value={selectedStudent ? `${selectedStudent.id}-${selectedStudent.course.id}` : ""}
          >
            {!selectedStudent && <option value="" disabled>Choisir un pilote...</option>}
            {students.map((student) => (
              <option key={`${student.id}-${student.course.id}`} value={`${student.id}-${student.course.id}`}>
                {student.first_name} {student.last_name} - {student.course.glider_brand} {student.course.glider_model}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      {selectedStudent && (
        <>
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showOnlyEvaluated"
                  checked={showOnlyEvaluated}
                  onChange={(e) => setShowOnlyEvaluated(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="showOnlyEvaluated" className="text-sm text-gray-700">
                  Afficher seulement les exercices évalués par l'élève
                </label>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredExercises.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredExercises.map(exercise => (
                <InstructorExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  studentRating={studentRatings[exercise.id] || { right: 0, left: 0 }}
                  instructorRating={instructorRatings[exercise.id] || { right: 0, left: 0 }}
                  onRatingChange={(side, value) => handleRatingChange(exercise.id, side, value)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 mx-auto mb-2 text-gray-400">
                <PencilLine className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun exercice trouvé</h3>
              <p className="text-gray-500">Modifiez vos critères de filtrage</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Evaluate;