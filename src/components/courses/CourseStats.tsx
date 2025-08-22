import React from 'react';
import type { Course } from '../../types/course';

interface CourseStatsProps {
  courses: Course[];
  slotCount: number;
}

const CourseStats: React.FC<CourseStatsProps> = ({ courses, slotCount }) => {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-5 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Courses</h3>
        <p className="text-3xl font-bold text-blue-700">{courses.length}</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-5 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Unique Slots</h3>
        <p className="text-3xl font-bold text-green-600">{slotCount}</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-5 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Credits</h3>
        <p className="text-3xl font-bold text-blue-700">{totalCredits}</p>
      </div>
    </div>
  );
};

export default CourseStats;