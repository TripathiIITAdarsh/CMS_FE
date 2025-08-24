import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-blue-700 font-medium">Loading Courses...</p>
    </div>
  </div>
);

export default LoadingSpinner;