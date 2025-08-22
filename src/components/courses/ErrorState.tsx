import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <h3 className="text-lg font-medium text-red-800">Error Loading Courses</h3>
      <p className="text-red-600 mt-2">{error}</p>
      <button 
        className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
        onClick={onRetry}
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;