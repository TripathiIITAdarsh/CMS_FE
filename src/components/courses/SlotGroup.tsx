import React from 'react';
import type { Course } from '../../types/course';
import CourseCard from './CourseCard';

interface SlotGroupProps {
  slot: string;
  courses: Course[];
}

const SlotGroup: React.FC<SlotGroupProps> = ({ slot, courses }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200 p-5 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-2 h-8 sm:h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-lg mr-3"></div>
        <h2 className="text-xl font-bold text-blue-900">Slot {slot}</h2>
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => (
          <CourseCard key={course.course_id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default SlotGroup;