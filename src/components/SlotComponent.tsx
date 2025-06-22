// components/EnhancedSlotComponent.tsx
import React, { forwardRef } from "react";

interface Course {
  course_id: string;
  course_code: string;
  course_name: string;
  school: string;
  slot: string;
  credits: number;
  lecture: number;
  tutorial: number;
  practical: number;
  type: 'IC' | 'DC' | 'DE' | 'HSS' | 'FE' | 'IK';
}

interface SlotProps {
  slot: string;
  courses: Course[];
  selectedCourses: Set<string>;
  toggleCourse: (id: string) => void;
  enrollmentTypes: Record<string, 'Regular' | 'PASS-fail' | 'equivalent' | 'audit'>;
  updateEnrollmentType: (courseId: string, type: 'Regular' | 'PASS-fail' | 'equivalent' | 'audit') => void;
}

const SlotComponent = forwardRef<HTMLDivElement, SlotProps>(({ 
  slot, 
  courses, 
  selectedCourses, 
  toggleCourse,
  enrollmentTypes,
  updateEnrollmentType
}, ref) => {
  // Color mapping for course types
  const typeColors = {
    IC: 'bg-blue-100 text-blue-800',
    DC: 'bg-green-100 text-green-800',
    DE: 'bg-purple-100 text-purple-800',
    HSS: 'bg-amber-100 text-amber-800',
    FE: 'bg-cyan-100 text-cyan-800',
    IK: 'bg-pink-100 text-pink-800'
  };

  return (
    <div 
      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md border border-blue-200 overflow-hidden"
      ref={ref}
    >
      {/* Sticky slot header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-4">
        <div className="flex items-center">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-300 to-indigo-300 rounded-lg mr-3"></div>
          <h2 className="text-xl font-bold text-white">Slot {slot}</h2>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        {courses.map((course) => {
          const isSelected = selectedCourses.has(course.course_id);
          const enrollmentType = enrollmentTypes[course.course_id] || 'Regular';
          
          return (
            <div 
              key={course.course_id}
              className={`bg-white rounded-xl shadow-sm border ${
                isSelected 
                  ? 'border-blue-500 shadow-blue-100' 
                  : 'border-blue-100'
              } p-4 transition-all duration-200`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCourse(course.course_id)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4 flex-shrink-0"
                    />
                    
                    <div>
                      <div className="flex flex-wrap items-start gap-2">
                        <h3 className="text-lg font-semibold text-blue-900">
                          {course.course_name} ({course.course_code})
                        </h3>
                        
                        <span className={`${typeColors[course.type]} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                          {course.type}
                        </span>
                      </div>
                      
                      <p className="text-sm text-blue-700 mt-1">{course.school}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-3 ml-9">
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
                </div>
                
                {isSelected && (
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Enrollment Type
                    </label>
                    <select
                      value={enrollmentType}
                      onChange={(e) => updateEnrollmentType(
                        course.course_id, 
                        e.target.value as 'Regular' | 'PASS-fail' | 'equivalent' | 'audit'
                      )}
                      className="bg-blue-50 border border-blue-300 text-blue-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    >
                      <option value="Regular">Regular</option>
                      <option value="PASS-fail">PASS-fail</option>
                      <option value="equivalent">Equivalent</option>
                      <option value="audit">Audit</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

SlotComponent.displayName = "SlotComponent";

export default SlotComponent;