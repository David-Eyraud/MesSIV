import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import Logo from '../components/icons/Logo';
import ProgressIcon from '../components/icons/ProgressIcon';
import CoursesIcon from '../components/icons/CoursesIcon';
import AccountIcon from '../components/icons/AccountIcon';
import { PencilLine } from 'lucide-react';

const Home = () => {
  const { user, loading } = useAuthStore();
  const isInstructor = user?.user_metadata.is_instructor;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 py-2">
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-primary mb-1">Mes SIV</h1>
        <p className="text-lg text-gray-600">
          Votre carnet de progression personnalisé pour le SIV
        </p>
      </div>

      {!user && (
        <div className="bg-white rounded-lg shadow-md p-3 text-center max-w-sm mx-auto mb-3">
          <h2 className="text-base font-medium text-gray-900 mb-2">Se connecter pour commencer</h2>
          <Link
            to="/account"
            className="inline-block bg-primary text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-600 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      )}

      <div className="space-y-2">
        <Link to="/progress" className="block">
          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex-shrink-0">
                <ProgressIcon />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Ma Progression</h2>
                <p className="text-sm text-gray-600">Suivez votre progression sur tous vos exercices de SIV</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/courses" className="block">
          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex-shrink-0">
                <CoursesIcon />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Mes Stages</h2>
                <p className="text-sm text-gray-600">Créez et consultez l'historique de tous vos stages de SIV</p>
              </div>
            </div>
          </div>
        </Link>

        {isInstructor && (
          <Link to="/evaluate" className="block">
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 text-primary">
                  <PencilLine className="w-full h-full" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Noter mes élèves</h2>
                  <p className="text-sm text-gray-600">Évaluez les exercices de vos élèves et suivez leur progression</p>
                </div>
              </div>
            </div>
          </Link>
        )}

        <Link to="/account" className="block">
          <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex-shrink-0">
                <AccountIcon />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Mon Compte</h2>
                <p className="text-sm text-gray-600">Gérez vos informations personnelles</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;