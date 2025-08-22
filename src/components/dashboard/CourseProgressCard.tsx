import React from 'react';
import type { CourseProgress } from '../../types/student';

interface CourseProgressCardProps {
  category: CourseProgress;
}

const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ category }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">{category.category}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{category.percentage}%</div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {category.categoryName}
      </h3>
      
      <div className="text-sm text-gray-600 mb-4">
        {category.completedCredits} of {category.totalCredits} credits completed
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${category.percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CourseProgressCard;