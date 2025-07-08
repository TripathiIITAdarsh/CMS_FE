// pages/AllCoursesPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from "./LoginPage";

interface CourseHelper {
  branch?: string;
  course_type?: string;
  semester?: string;
  year?: string;
  program?: string;
}

interface Professor {
  iid: string;
  prof_name: string;
  prof_email: string;
  school: string;
}

interface ProfessorCourse {
  uid: string;
  iid: string;
  course_id: string;
  professor: Professor;
}

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
  course_helpers: CourseHelper[];
  prof_course: ProfessorCourse[];
}

interface SlotGroup {
  [slot: string]: Course[];
}

const SlotGroupComponent: React.FC<{ slot: string; courses: Course[] }> = ({ slot, courses }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200 p-5 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-2 h-8 sm:h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-lg mr-3"></div>
        <h2 className="text-xl font-bold text-blue-900">Slot {slot}</h2>
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => {
          
          // Get professor names or show placeholder
          const professors = course.prof_course.length > 0 
            ? course.prof_course.map(pc => pc.professor.prof_name).filter(name => name).join(', ')
            : 'yet to be finalised';
            
          return (
            <div 
              key={course.course_id}
              className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 hover:shadow-md transition-all duration-200"
            >
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
        })}
      </div>
    </div>
  );
};

const AllCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
    const { apiCall } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slotGroups, setSlotGroups] = useState<SlotGroup>({});

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setLoading(true);
        const response = await apiCall('http://localhost:4000/courses/final_courses');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCourses(data.final_courses);
        
        // Group courses by slot
        const groups: SlotGroup = {};
        data.final_courses.forEach((course: Course) => {
          const slot = course.slot;
          if (!groups[slot]) {
            groups[slot] = [];
          }
          groups[slot].push(course);
        });
        
        setSlotGroups(groups);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-blue-700">Loading courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-medium text-red-800">Error Loading Courses</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">All Available Courses</h1>
            <p className="text-blue-100 mt-2">
              Browse all courses offered this semester
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-white/20 rounded-lg p-3">
            <p className="text-white font-medium">
              Current Semester: Odd 2025
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-5 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-700">{courses.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-5 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Unique Slots</h3>
          <p className="text-3xl font-bold text-green-600">
            {Object.keys(slotGroups).length}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-5 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Credits</h3>
          <p className="text-3xl font-bold text-blue-700">
            {courses.reduce((sum, course) => sum + course.credits, 0)}
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Slot-wise Course Distribution</h2>
        
        {Object.keys(slotGroups).length > 0 ? (
          Object.entries(slotGroups).map(([slot, slotCourses]) => (
            <SlotGroupComponent 
              key={slot} 
              slot={slot} 
              courses={slotCourses} 
            />
          ))
        ) : (
          <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
            <h3 className="text-lg font-medium text-blue-800">No Courses Found</h3>
            <p className="text-blue-600 mt-2">
              There are no courses available at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;