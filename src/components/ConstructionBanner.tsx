import React from 'react';
import { Construction } from 'lucide-react';

const ConstructionBanner = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-5xl mx-auto px-2 py-2">
        <div className="flex items-center justify-center gap-2 text-amber-800">
          <Construction className="w-4 h-4" />
          <p className="text-sm font-medium">
            Application en cours de construction
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConstructionBanner;