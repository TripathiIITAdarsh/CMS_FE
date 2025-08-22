import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-blue-700">Loading courses...</span>
    </div>
  );
};

export default LoadingState;