import React from 'react';
import PilotageLogo from '../components/icons/PilotageLogo';
import PassagersLogo from '../components/icons/PassagersLogo';

const Partners = () => {
  return (
    <div className="container max-w-5xl mx-auto px-2 py-2">
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-primary mb-1">Partenaires</h1>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="max-w-[500px] mx-auto">
            <div className="mb-6">
              <a 
                href="https://www.pilotage-parapente.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:opacity-90 transition-opacity"
              >
                <div className="h-24">
                  <PilotageLogo />
                </div>
              </a>
            </div>
            <p className="text-center text-gray-700">
              Le manuel de pilotage en ligne par David Eyraud. Retrouvez toutes les leçons de pilotage avec des explications détaillées, des images et plus de 450 vidéos.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="max-w-[500px] mx-auto">
            <div className="mb-6">
              <a 
                href="https://www.lespassagersduvent.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:opacity-90 transition-opacity"
              >
                <div className="h-24">
                  <PassagersLogo />
                </div>
              </a>
            </div>
            <p className="text-center text-gray-700">
              Le spécialiste du parapente à Annecy depuis 1987.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;