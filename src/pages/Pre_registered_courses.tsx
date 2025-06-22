// pages/CoursesRegistered.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
  status: string;
  course_type:string;
}

interface SlotGroup {
  [slot: string]: Course[];
}

const RegisteredSlotComponent: React.FC<{ slot: string; courses: Course[] }> = ({ slot, courses }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200 p-5 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-2 h-8 sm:h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-lg mr-3"></div>
        <h2 className="text-xl font-bold text-blue-900">Slot {slot}</h2>
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => (
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
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'Registered' 
                      ? 'bg-green-100 text-green-800' 
                      : course.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {course.status}
                  </div>
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
              </div>
              
              <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-1 px-3 rounded-lg">
                  Basket: {course.course_type}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CoursesRegistered = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slotGroups, setSlotGroups] = useState<SlotGroup>({});

  useEffect(() => {
    // Hardcoded student ID and UID for demonstration
    const uid = "STU2023ABC123"; // Hardcoded UID
    const sid = studentId || "22XX230"; // Fallback to default if not in params
    
    // Simulating API call
    const fetchRegisteredCourses = async () => {
      try {
        setLoading(true);
        
        // In a real application, this would be an actual API call
        // const response = await fetch(`/api/courses-registered?studentId=${sid}&uid=${uid}`);
        // const data = await response.json();
        
        // Simulated response with hardcoded data
        const data: Course[] = [
          {
            course_id: "CS101",
            course_code: "CS101",
            course_name: "Introduction to Computer Science",
            school: "School of Computing",
            slot: "A1",
            credits: 4,
            lecture: 3,
            tutorial: 1,
            practical: 2,
            status: "Registered",
            course_type:"IC",
          },
          {
            course_id: "MA202",
            course_code: "MA202",
            course_name: "Advanced Mathematics",
            school: "School of Mathematics",
            slot: "B2",
            credits: 3,
            lecture: 3,
            tutorial: 1,
            practical: 0,
            status: "Registered",
            course_type:"IC"
          },
          {
            course_id: "PHY105",
            course_code: "PHY105",
            course_name: "Modern Physics",
            school: "School of Physics",
            slot: "A1",
            credits: 4,
            lecture: 3,
            tutorial: 1,
            practical: 2,
            course_type:"IC",
            status: "Pending"
          },
          {
            course_id: "CS203",
            course_code: "CS203",
            course_name: "Data Structures and Algorithms",
            school: "School of Computing",
            slot: "C3",
            credits: 4,
            lecture: 3,
            tutorial: 1,
            practical: 2,
            course_type:"IC",
            status: "Registered"
          },
          {
            course_id: "EE101",
            course_code: "EE101",
            course_name: "Electrical Engineering Fundamentals",
            school: "School of Engineering",
            slot: "B2",
            credits: 3,
            lecture: 3,
            tutorial: 1,
            practical: 0,
            course_type:"IC",
            status: "Registered"
          },
          {
            course_id: "CS305",
            course_code: "CS305",
            course_name: "Artificial Intelligence",
            school: "School of Computing",
            slot: "D4",
            credits: 4,
            lecture: 3,
            tutorial: 1,
            practical: 2,
            course_type:"IC",
            status: "Pending"
          }
        ];
        
        setCourses(data);
        groupCoursesBySlot(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch registered courses');
        setLoading(false);
      }
    };

    fetchRegisteredCourses();
  }, [studentId]);

  const groupCoursesBySlot = (courses: Course[]) => {
    const groups: SlotGroup = {};
    
    courses.forEach(course => {
      if (!groups[course.slot]) {
        groups[course.slot] = [];
      }
      groups[course.slot].push(course);
    });
    
    setSlotGroups(groups);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Registered Courses</h1>
            <p className="text-blue-100 mt-2">
              View all courses you've registered for this semester
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-white/20 rounded-lg p-3">
            <p className="text-white font-medium">
              Student ID: <span className="font-bold">{studentId || "22XX230"}</span>
            </p>
            <p className="text-blue-100 text-sm mt-1">
              Semester: Fall 2023
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
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Registered</h3>
          <p className="text-3xl font-bold text-green-600">
            {courses.filter(c => c.status === 'Registered').length}
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
            <RegisteredSlotComponent 
              key={slot} 
              slot={slot} 
              courses={slotCourses} 
            />
          ))
        ) : (
          <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
            <h3 className="text-lg font-medium text-blue-800">No Courses Registered</h3>
            <p className="text-blue-600 mt-2">
              You haven't registered for any courses yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesRegistered;