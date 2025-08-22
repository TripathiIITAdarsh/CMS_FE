import React from 'react';
import type { ProgressStats } from '../../types/student';

interface OverallProgressCardProps {
  stats: ProgressStats;
}

const OverallProgressCard: React.FC<OverallProgressCardProps> = ({ stats }) => {
  const { totalCredits, completedCredits, overallPercentage } = stats;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Academic Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{completedCredits}</div>
          <div className="text-gray-500">Credits Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-600">{totalCredits}</div>
          <div className="text-gray-500">Total Credits Required</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{overallPercentage}%</div>
          <div className="text-gray-500">Overall Progress</div>
        </div>
      </div>
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${overallPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OverallProgressCard;