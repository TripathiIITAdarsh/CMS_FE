import React from 'react';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
      <h3 className="text-lg font-medium text-red-800">Error Loading Courses</h3>
      <p className="text-red-600 mt-2">{error}</p>
      <button 
        className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorDisplay;