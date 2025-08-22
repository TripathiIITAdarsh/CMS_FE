import React from 'react';
import type { Course } from '../../types/course';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const professors = course.prof_course.length > 0 
    ? course.prof_course.map(pc => pc.professor.prof_name).filter(name => name).join(', ')
    : 'yet to be finalised';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="text-lg font-semibold text-blue-900">
              {course.course_name} ({course.course_code})
            </h3>
          </div>
          
          <p className="text-sm text-blue-700 mt-1">{course.school}</p>
          
          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center text-sm text-blue-600">
              <span className="font-medium mr-1">Credits:</span>
              <span>{course.credits}</span>
            </div>
            
            <div className="flex items-center text-sm text-blue-600">
              <span className="font-medium mr-1">L:</span>
              <span>{course.lecture} hrs</span>
            </div>
            
            <div className="flex items-center text-sm text-blue-600">
              <span className="font-medium mr-1">T:</span>
              <span>{course.tutorial} hrs</span>
            </div>
            
            <div className="flex items-center text-sm text-blue-600">
              <span className="font-medium mr-1">P:</span>
              <span>{course.practical} hrs</span>
            </div>
          </div>
          
          <div className="mt-2 text-sm">
            <span className="font-medium mr-1 text-blue-600">Professor(s):</span>
            <span className={professors === 'yet to be finalised' ? "text-amber-600 italic" : "text-blue-600"}>
              {professors}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
