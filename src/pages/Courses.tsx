import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import ScrollToTop from '../components/ScrollToTop';
import ConfirmDialog from '../components/ConfirmDialog';
import CoursesIcon from '../components/icons/CoursesIcon';

interface Course {
  id: string;
  date: string;
  location: string;
  school: string;
  instructor: string;
  glider_brand: string;
  glider_model: string;
  glider_certification: string;
  glider_lines: boolean;
  glider2_brand?: string;
  glider2_model?: string;
  glider2_certification?: string;
  glider2_lines?: boolean;
  harness_brand: string;
  harness_model: string;
  harness_cocoon: boolean;
  harness2_brand?: string;
  harness2_model?: string;
  harness2_cocoon?: boolean;
  flights_count: number;
  notes?: string;
}

const CERTIFICATIONS = ['A', 'B', 'C', 'D', 'CCC'] as const;
type Certification = typeof CERTIFICATIONS[number];

const DEFAULT_LOCATION = "Lac d'Annecy";
const DEFAULT_SCHOOL = "Les Passagers du Vent";
const DEFAULT_INSTRUCTOR = "David Eyraud";

const CourseForm = ({ course, onClose, onDelete }: { course?: Course; onClose: () => void; onDelete?: (course: Course) => void }) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSecondGlider, setHasSecondGlider] = useState(!!course?.glider2_brand);
  const [hasSecondHarness, setHasSecondHarness] = useState(!!course?.harness2_brand);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>(course || {
    date: new Date().toISOString().split('T')[0],
    location: DEFAULT_LOCATION,
    school: DEFAULT_SCHOOL,
    instructor: DEFAULT_INSTRUCTOR,
    glider_brand: '',
    glider_model: '',
    glider_certification: '',
    glider_lines: false,
    glider2_brand: '',
    glider2_model: '',
    glider2_certification: '',
    glider2_lines: false,
    harness_brand: '',
    harness_model: '',
    harness_cocoon: false,
    harness2_brand: '',
    harness2_model: '',
    harness2_cocoon: false,
    flights_count: 0,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const courseData = {
        ...formData,
        user_id: user.id,
      };

      if (!hasSecondGlider) {
        delete courseData.glider2_brand;
        delete courseData.glider2_model;
        delete courseData.glider2_certification;
        delete courseData.glider2_lines;
      }
      
      if (!hasSecondHarness) {
        delete courseData.harness2_brand;
        delete courseData.harness2_model;
        delete courseData.harness2_cocoon;
      }

      if (course) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', course.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error saving course:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'enregistrement du stage');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!course || !onDelete) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!course || !onDelete) return;
    onDelete(course);
    setShowConfirmDialog(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
            <h2 className="text-xl font-semibold text-gray-900">
              {course ? 'Modifier le Stage' : 'Nouveau Stage'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Fermer</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Lieu
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                  École
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                  Moniteur
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Voile principale</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="glider_brand" className="block text-sm font-medium text-gray-700">
                    Marque
                  </label>
                  <input
                    type="text"
                    id="glider_brand"
                    name="glider_brand"
                    value={formData.glider_brand}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="glider_model" className="block text-sm font-medium text-gray-700">
                    Modèle
                  </label>
                  <input
                    type="text"
                    id="glider_model"
                    name="glider_model"
                    value={formData.glider_model}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="glider_certification" className="block text-sm font-medium text-gray-700">
                    Homologation
                  </label>
                  <select
                    id="glider_certification"
                    name="glider_certification"
                    value={formData.glider_certification}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="">Sélectionner...</option>
                    {CERTIFICATIONS.map(cert => (
                      <option key={cert} value={cert}>{cert}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="glider_lines"
                    name="glider_lines"
                    checked={formData.glider_lines}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="glider_lines" className="ml-2 block text-sm text-gray-900">
                    2 lignes
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Deuxième voile</h3>
                <button
                  type="button"
                  onClick={() => setHasSecondGlider(!hasSecondGlider)}
                  className="text-sm text-primary hover:text-primary-600"
                >
                  {hasSecondGlider ? 'Supprimer' : 'Ajouter'}
                </button>
              </div>

              {hasSecondGlider && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="glider2_brand" className="block text-sm font-medium text-gray-700">
                      Marque
                    </label>
                    <input
                      type="text"
                      id="glider2_brand"
                      name="glider2_brand"
                      value={formData.glider2_brand}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="glider2_model" className="block text-sm font-medium text-gray-700">
                      Modèle
                    </label>
                    <input
                      type="text"
                      id="glider2_model"
                      name="glider2_model"
                      value={formData.glider2_model}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="glider2_certification" className="block text-sm font-medium text-gray-700">
                      Homologation
                    </label>
                    <select
                      id="glider2_certification"
                      name="glider2_certification"
                      value={formData.glider2_certification}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    >
                      <option value="">Sélectionner...</option>
                      {CERTIFICATIONS.map(cert => (
                        <option key={cert} value={cert}>{cert}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="glider2_lines"
                      name="glider2_lines"
                      checked={formData.glider2_lines}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="glider2_lines" className="ml-2 block text-sm text-gray-900">
                      2 lignes
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sellette principale</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="harness_brand" className="block text-sm font-medium text-gray-700">
                    Marque
                  </label>
                  <input
                    type="text"
                    id="harness_brand"
                    name="harness_brand"
                    value={formData.harness_brand}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="harness_model" className="block text-sm font-medium text-gray-700">
                    Modèle
                  </label>
                  <input
                    type="text"
                    id="harness_model"
                    name="harness_model"
                    value={formData.harness_model}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="harness_cocoon"
                    name="harness_cocoon"
                    checked={formData.harness_cocoon}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="harness_cocoon" className="ml-2 block text-sm text-gray-900">
                    Cocon
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Deuxième sellette</h3>
                <button
                  type="button"
                  onClick={() => setHasSecondHarness(!hasSecondHarness)}
                  className="text-sm text-primary hover:text-primary-600"
                >
                  {hasSecondHarness ? 'Supprimer' : 'Ajouter'}
                </button>
              </div>

              {hasSecondHarness && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="harness2_brand" className="block text-sm font-medium text-gray-700">
                      Marque
                    </label>
                    <input
                      type="text"
                      id="harness2_brand"
                      name="harness2_brand"
                      value={formData.harness2_brand}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="harness2_model" className="block text-sm font-medium text-gray-700">
                      Modèle
                    </label>
                    <input
                      type="text"
                      id="harness2_model"
                      name="harness2_model"
                      value={formData.harness2_model}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="harness2_cocoon"
                      name="harness2_cocoon"
                      checked={formData.harness2_cocoon}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="harness2_cocoon" className="ml-2 block text-sm text-gray-900">
                      Cocon
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div>
                <label htmlFor="flights_count" className="block text-sm font-medium text-gray-700">
                  Nombre de vols
                </label>
                <input
                  type="number"
                  id="flights_count"
                  name="flights_count"
                  value={formData.flights_count}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="flex justify-between gap-3">
              {course && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-md text-sm font-medium hover:bg-red-50"
                >
                  Supprimer
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : course ? 'Enregistrer' : 'Créer le stage'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer le stage"
        message="Cette action va définitivement supprimer ce stage et toutes les informations qui y sont reliées comme l'évaluation des exercices. Cette action est irréversible."
      />
    </>
  );
};

const Courses = () => {
  const { user, loading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user, showForm]);

  const handleDelete = async (course: Course) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id);

      if (error) throw error;

      setCourses(courses.filter(c => c.id !== course.id));
      setShowForm(false);
      setEditingCourse(undefined);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Une erreur est survenue lors de la suppression du stage');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCourse(undefined);
  };

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
        <h1 className="text-3xl font-bold text-primary mb-1">Mes Stages</h1>
        <p className="text-lg text-gray-600">
          Créez et consultez l'historique de tous vos stages de SIV
        </p>
      </div>

      {!user ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <CoursesIcon />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Connectez-vous pour gérer vos stages
          </h2>
          <p className="text-gray-600 mb-6">
            Pour créer et suivre vos stages de SIV, vous devez d'abord vous connecter ou créer un compte.
          </p>
          <Link
            to="/account"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Se connecter
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Stage</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {courses.map(course => (
                <button
                  key={course.id}
                  onClick={() => handleEdit(course)}
                  className="text-left bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow w-full"
                >
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Stage du {new Date(course.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-gray-600">{course.school}</div>
                  <div className="text-gray-600">Avec {course.instructor}</div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>
                      {course.glider_brand} {course.glider_model}
                      {course.glider2_brand && (
                        <> et {course.glider2_brand} {course.glider2_model}</>
                      )}
                    </div>
                    <div>
                      {course.harness_brand} {course.harness_model}
                      {course.harness2_brand && (
                        <> et {course.harness2_brand} {course.harness2_model}</>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 mx-auto mb-2 text-gray-400">
                <CoursesIcon />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun stage enregistré</h3>
              <p className="text-gray-500">Commencez par créer votre premier stage SIV</p>
            </div>
          )}

          {showForm && (
            <CourseForm
              course={editingCourse}
              onClose={handleCloseForm}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Courses;