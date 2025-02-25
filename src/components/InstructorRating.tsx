import React from 'react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const InstructorRating = ({ value, onChange, disabled = false }: Props) => {
  const handleClick = (rating: number) => {
    if (disabled) return;
    onChange(rating === value ? 0 : rating);
  };

  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3].map((rating) => (
        <button
          key={rating}
          onClick={() => handleClick(rating)}
          disabled={disabled}
          className={`w-6 h-6 rounded border ${
            value === rating
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 hover:border-primary'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {rating}
        </button>
      ))}
    </div>
  );
};