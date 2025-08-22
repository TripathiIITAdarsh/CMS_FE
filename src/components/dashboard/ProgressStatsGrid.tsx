import React from 'react';
import type { ProgressStats } from '../../types/student';

interface ProgressStatsGridProps {
  stats: ProgressStats;
}

const ProgressStatsGrid: React.FC<ProgressStatsGridProps> = ({ stats }) => {
  const { categoriesCompleted, categoriesInProgress, categoriesNotStarted } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-2xl font-bold text-green-500 mb-2">
          {categoriesCompleted}
        </div>
        <div className="text-gray-600">Categories Completed</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-2xl font-bold text-yellow-500 mb-2">
          {categoriesInProgress}
        </div>
        <div className="text-gray-600">Categories In Progress</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-2xl font-bold text-red-500 mb-2">
          {categoriesNotStarted}
        </div>
        <div className="text-gray-600">Categories Not Started</div>
      </div>
    </div>
  );
};

export default ProgressStatsGrid;