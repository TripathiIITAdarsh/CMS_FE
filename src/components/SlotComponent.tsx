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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 sm:h-8 bg-blue-500 rounded mr-3"></div>
         <h2 className="text-lg font-semibold text-gray-800">Slot {slot}</h2>
        </div>
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.course_id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCourses.has(course.course_id)}
                onChange={() => toggleCourse(course.course_id)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4 flex-shrink-0"
              />
              <div className="flex-grow">
                <div className="flex items-center flex-wrap"> {/* flex-wrap for smaller screens */}
                  <span className="font-medium text-gray-900">
                    {course.course_name} ({course.course_code})
                  </span>
                  {/* Logic restored to check the course_code prefix */}
                  {course.course_code.startsWith('IC') && (
                    <span className="ml-3 mt-1 sm:mt-0 bg-[#EBF5FF] text-[#007BFF] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      IC Course
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Credits: {course.credits}
                </p>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotComponent;