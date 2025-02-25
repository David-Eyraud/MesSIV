import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ScoreIcon from './icons/ScoreIcon';

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

interface ExerciseCardProps {
  exercise: Exercise;
  studentRating: {
    left?: number;
    right?: number;
  };
  instructorRating?: {
    left?: number;
    right?: number;
  };
  onRatingChange?: (side: 'left' | 'right', value: number) => void;
}

const getBorderColor = (level: string): string => {
  switch (level) {
    case 'Tous niveaux':
      return 'border-gray-400';
    case 'Brevet de pilote':
      return 'border-green-500';
    case 'Brevet de pilote confirmé':
      return 'border-amber-800';
    case 'Voltige':
      return 'border-black';
    default:
      return 'border-gray-300';
  }
};

const getRatingDescription = (value: number): string => {
  switch (value) {
    case 0:
      return 'Pas encore travaillé';
    case 1:
      return 'Vu mais pas maîtrisé du tout';
    case 2:
      return 'Irrégulier';
    case 3:
      return 'Compris mais à travailler';
    case 4:
      return 'Assez bien maîtrisé';
    case 5:
      return 'Parfaitement maîtrisé';
    default:
      return '';
  }
};

const getRatingColor = (value: number): string => {
  switch (value) {
    case 0:
      return '#e5e7eb'; // gray-200
    case 1:
      return '#ef4444'; // red-500
    case 2:
      return '#f97316'; // orange-500
    case 3:
      return '#eab308'; // yellow-500
    case 4:
      return '#84cc16'; // lime-500
    case 5:
      return '#22c55e'; // green-500
    default:
      return '#e5e7eb'; // gray-200
  }
};

const RatingSlider = ({ 
  value, 
  onChange,
  side,
  disabled = false
}: { 
  value: number;
  onChange: (value: number) => void;
  side?: 'left' | 'right';
  disabled?: boolean;
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleChange = (newValue: number) => {
    if (disabled) return;
    onChange(newValue);
    
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    // Show description and set timeout to hide it
    setShowDescription(true);
    const id = setTimeout(() => {
      setShowDescription(false);
    }, 2000);
    setTimeoutId(id);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const ratingColor = getRatingColor(value);

  return (
    <div className="flex items-center gap-2">
      <div className="w-40">
        <div className="relative">
          {showDescription && (
            <div className="absolute -top-6 left-0 right-0 text-xs text-gray-600 text-center">
              {getRatingDescription(value)}
            </div>
          )}
          <div className="relative h-6 flex items-center">
            <div className="absolute w-full h-1 bg-gray-200 rounded" />
            <div 
              className="absolute h-1 rounded" 
              style={{
                width: `${(value / 5) * 100}%`,
                backgroundColor: ratingColor
              }}
            />
            <div 
              className="absolute w-4 h-4 rounded-full cursor-pointer shadow-md"
              style={{
                left: `calc(${(value / 5) * 100}% - 0.5rem)`,
                backgroundColor: value === 0 ? '#F15A24' : ratingColor,
              }}
            />
            <input
              type="range"
              min="0"
              max="5"
              value={value}
              onChange={(e) => handleChange(parseInt(e.target.value))}
              className="absolute w-full opacity-0 cursor-pointer"
              style={{ height: '24px' }}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      {side && (
        <span className="text-sm text-gray-500 capitalize w-14">{side}</span>
      )}
    </div>
  );
};

const ExerciseDetailsModal = ({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) => {
  // Fermer la modale si on clique sur Escape ou en dehors
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-gray-900">{exercise.name}</h2>
              <div className="mt-1 text-gray-700">
                <p>Objectif (être capable de ...)</p>
                <p className="mt-1">{exercise.objective}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-gray-700">
              <span className="font-medium">Thème:</span> {exercise.theme}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Niveau:</span> {exercise.level}
            </p>

            {exercise.bp !== 'N/A' && (
              <p className="text-gray-700">
                Correspond au module {exercise.bp} du brevet de pilote FFVL
              </p>
            )}

            {exercise.bpc !== 'N/A' && (
              <p className="text-gray-700">
                Correspond au module {exercise.bpc} du brevet de pilote confirmé FFVL
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  studentRating,
  instructorRating = {},
  onRatingChange,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md p-4 border-2 ${getBorderColor(exercise.level)}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">{exercise.theme}</div>
            <button
              onClick={() => setShowDetails(true)}
              className="text-lg font-medium text-gray-900 hover:text-primary text-left"
            >
              {exercise.name}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          {exercise.right_and_left ? (
            <>
              <div className="flex items-center justify-between">
                <RatingSlider
                  value={studentRating.right || 0}
                  onChange={(value) => onRatingChange?.('right', value)}
                  side="droite"
                  disabled={!onRatingChange}
                />
                <div className="w-12 h-12">
                  <ScoreIcon score={instructorRating?.right} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <RatingSlider
                  value={studentRating.left || 0}
                  onChange={(value) => onRatingChange?.('left', value)}
                  side="gauche"
                  disabled={!onRatingChange}
                />
                <div className="w-12 h-12">
                  <ScoreIcon score={instructorRating?.left} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <RatingSlider
                value={studentRating.right || 0}
                onChange={(value) => onRatingChange?.('right', value)}
                disabled={!onRatingChange}
              />
              <div className="w-12 h-12">
                <ScoreIcon score={instructorRating?.right} />
              </div>
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <ExerciseDetailsModal
          exercise={exercise}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default ExerciseCard;