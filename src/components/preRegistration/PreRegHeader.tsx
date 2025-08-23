import React from 'react';

const PreRegHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
        Course Pre-Registration
      </h1>
      <div className="mx-auto mt-3 h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
      <p className="text-blue-700 mt-4 max-w-2xl mx-auto">
        Select your preferred courses for the upcoming semester. You can choose the enrollment type for each course.
      </p>
    </div>
  );
};

export default PreRegHeader;