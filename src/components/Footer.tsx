import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-200">
      <div className="max-w-5xl mx-auto px-2 py-2">
        <div className="grid grid-cols-3 gap-2">
          <Link to="/about" className="block">
            <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow h-full flex items-center justify-center">
              <h3 className="text-primary text-sm font-medium text-center">À<br />Propos</h3>
            </div>
          </Link>

          <Link to="/partners" className="block">
            <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow h-full flex items-center justify-center">
              <h3 className="text-primary text-sm font-medium">Partenaires</h3>
            </div>
          </Link>

          <Link to="/legal" className="block">
            <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow h-full flex items-center justify-center">
              <h3 className="text-primary text-sm font-medium text-center">Mentions<br />Légales</h3>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;