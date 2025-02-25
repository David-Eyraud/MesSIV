import React from 'react';
import { InstructorRating } from './InstructorRating';

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

interface StudentRatings {
  left?: number;
  right?: number;
}

interface Props {
  exercise: Exercise;
  studentRating: StudentRatings;
  instructorRating?: {
    left?: number;
    right?: number;
  };
  onRatingChange?: (side: 'left' | 'right', value: number) => void;
}

const InstructorExerciseCard = ({ exercise, studentRating, instructorRating = {}, onRatingChange }: Props) => {
  const renderRatingSection = (side: 'left' | 'right') => {
    const studentValue = side === 'left' ? studentRating.left : studentRating.right;
    const instructorValue = side === 'left' ? instructorRating.left : instructorRating.right;

    return (
      <div className="flex items-center justify-between gap-4 text-sm">
        <div>
          <span className="text-gray-600">Auto-évaluation {exercise.right_and_left ? `(${side})` : ''}: </span>
          <span className="font-medium">{studentValue || 0}/5</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Note moniteur: </span>
          <InstructorRating
            value={instructorValue || 0}
            onChange={(value) => onRatingChange?.(side, value)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-3">
        <div className="text-sm text-gray-500 mb-1">{exercise.theme}</div>
        <h3 className="text-lg font-medium text-gray-900">{exercise.name}</h3>
      </div>

      <div className="space-y-2 text-sm">
        {(exercise.bp !== 'N/A' || exercise.bpc !== 'N/A') && (
          <div className="flex gap-4">
            {exercise.bp !== 'N/A' && (
              <div>
                <span className="text-gray-600">BP: </span>
                <span className="font-medium">{exercise.bp}</span>
              </div>
            )}
            {exercise.bpc !== 'N/A' && (
              <div>
                <span className="text-gray-600">BPC: </span>
                <span className="font-medium">{exercise.bpc}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 pt-2">
          {exercise.right_and_left ? (
            <>
              {renderRatingSection('right')}
              {renderRatingSection('left')}
            </>
          ) : (
            renderRatingSection('right')
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorExerciseCard;