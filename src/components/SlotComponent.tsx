// SlotComponent.tsx
import React from "react";

interface Course {
  course_id: string;
  course_code: string;
  course_name: string;
  slot: string;
  credits: number;
}

interface SlotProps {
  slot: string;
  courses: Course[];
  selectedCourses: Set<string>;
  toggleCourse: (id: string) => void;
}

const SlotComponent: React.FC<SlotProps> = ({ slot, courses, selectedCourses, toggleCourse }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <h2 className="text-xl font-medium">Slot {slot}</h2>
        <div className="flex-grow border-t ml-4"></div>
      </div>
      <div className="space-y-3">
        {courses.map(course => (
          <label
            key={course.course_id}
            className={`flex items-center border rounded-lg p-4 hover:shadow-sm transition ${selectedCourses.has(course.course_id) ? 'ring-2 ring-blue-400' : 'border-gray-200'}`}
          >
            <input
              type="checkbox"
              checked={selectedCourses.has(course.course_id)}
              onChange={() => toggleCourse(course.course_id)}
              className="form-checkbox h-5 w-5 text-blue-600 mr-4"
            />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">
                  {course.course_name} ({course.course_code})
                </span>
                <span className="text-sm text-gray-600">Credits: {course.credits}</span>
              </div>
              {/* IC Course badge example */}
              {course.course_code.startsWith('IC') && (
                <span className="mt-1 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  IC Course
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SlotComponent;