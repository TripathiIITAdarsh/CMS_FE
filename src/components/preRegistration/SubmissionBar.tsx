import React from 'react';

interface SubmissionBarProps {
  selectedCount: number;
  totalCredits: number;
  preRegisteredCount: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const SubmissionBar: React.FC<SubmissionBarProps> = ({
  selectedCount,
  totalCredits,
  preRegisteredCount,
  isSubmitting,
  onSubmit
}) => {
  return (
    <div className="sticky bottom-0 py-4 z-20 bg-gradient-to-t from-blue-50 to-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <p className="font-medium">
              Selected: <span className="font-bold">{selectedCount}</span> courses | 
              Credits: <span className="font-bold">{totalCredits}</span>
            </p>
            {preRegisteredCount > 0 && (
              <p className="text-sm text-blue-200 mt-1">
                ({preRegisteredCount} courses already pre-registered)
              </p>
            )}
          </div>
          
          <button
            onClick={onSubmit}
            disabled={selectedCount === 0 || isSubmitting}
            className={`
              bg-white text-blue-900 px-6 py-3 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 
              transition-all shadow-lg hover:shadow-xl font-bold
              ${selectedCount === 0 || isSubmitting
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-50 transform hover:-translate-y-0.5'}
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Pre-Registration"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionBar;