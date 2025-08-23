import React from 'react';
import type { CourseTypeStats } from '../../types/preRegistration';

interface SelectionSummaryProps {
  courseTypeCounts: CourseTypeStats;
  totalCredits: number;
  totalCourses: number;
}

const SelectionSummary: React.FC<SelectionSummaryProps> = ({ 
  courseTypeCounts, 
  totalCredits, 
  totalCourses 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Selection Summary</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(courseTypeCounts).map(([type, count]) => (
              <div 
                key={type} 
                className={`flex flex-col items-center p-3 rounded-lg ${
                  count > 0 
                    ? 'bg-white/20 border border-white/30' 
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                <span className="text-sm text-white font-medium">{type}</span>
                <span className="text-xl font-bold text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center md:text-right mt-4 md:mt-0">
          <div className="mb-4">
            <p className="text-white font-medium">
              Total Credits: <span className="text-xl font-bold text-white">{totalCredits}</span>
            </p>
            <p className="text-white font-medium">
              Courses Selected: <span className="text-xl font-bold text-white">{totalCourses}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSummary;