import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PencilLine } from 'lucide-react';
import Logo from './icons/Logo';
import AccountIcon from './icons/AccountIcon';
import CoursesIcon from './icons/CoursesIcon';
import ProgressIcon from './icons/ProgressIcon';
import { useAuthStore } from '../lib/store';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const isInstructor = user?.user_metadata.is_instructor;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-200 shadow-sm">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-20">
              <Logo />
            </div>
            {isInstructor && (
              <span className="text-primary font-medium text-sm">Pro</span>
            )}
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`p-2 rounded-full hover:bg-white/80 transition-all duration-200 ${
                isActive('/') ? 'scale-110 bg-white shadow-lg' : ''
              }`}
              title="Accueil"
            >
              <Home className="w-5 h-5 text-primary" />
            </Link>

            <Link
              to="/courses"
              className={`p-2 rounded-full hover:bg-white/80 transition-all duration-200 ${
                isActive('/courses') ? 'scale-110 bg-white shadow-lg' : ''
              }`}
              title="Mes Stages"
            >
              <div className="w-5 h-5">
                <CoursesIcon />
              </div>
            </Link>
            
            <Link
              to="/progress"
              className={`p-2 rounded-full hover:bg-white/80 transition-all duration-200 ${
                isActive('/progress') ? 'scale-110 bg-white shadow-lg' : ''
              }`}
              title="Ma Progression"
            >
              <div className="w-5 h-5">
                <ProgressIcon />
              </div>
            </Link>

            {isInstructor && (
              <Link
                to="/evaluate"
                className={`p-2 rounded-full hover:bg-white/80 transition-all duration-200 ${
                  isActive('/evaluate') ? 'scale-110 bg-white shadow-lg' : ''
                }`}
                title="Noter mes élèves"
              >
                <PencilLine className="w-5 h-5 text-primary" />
              </Link>
            )}
            
            <Link
              to="/account"
              className={`p-2 rounded-full hover:bg-white/80 transition-all duration-200 ${
                isActive('/account') ? 'scale-110 bg-white shadow-lg' : ''
              }`}
              title="Mon Compte"
            >
              <div className="w-5 h-5">
                <AccountIcon />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;