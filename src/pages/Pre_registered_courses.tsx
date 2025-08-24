// pages/CoursesRegistered.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisteredSlotComponent from '../components/RegisteredSlotComponent';
const getSemester = (oddStartMonth = 7, oddEndMonth = 12) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  if (month >= oddStartMonth && month <= oddEndMonth) {
    return `ODD ${year}`;
  } else {
    return `EVEN ${year}`;
  }
};

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
  course_mode: 'regular' | 'pass_fail' | 'audit' | 'equivalent' | 'backlog';
}

interface SlotGroup {
  [slot: string]: Course[];
}

const studentString = localStorage.getItem('studentProfile');
let studentProfile: any = null;

if (studentString) {
  studentProfile = JSON.parse(studentString);
}



const CoursesRegistered = () => {
  const { apiCall } = useAuth();
  const { studentId } = useParams<{ studentId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slotGroups, setSlotGroups] = useState<SlotGroup>({});
  const [deregistering, setDeregistering] = useState<Record<string, boolean>>({});
  const currentSemester = getSemester();

    // Simulating API call
    useEffect(() => {
  const fetchRegisteredCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await apiCall(`/get_pre_reg_courses`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      },4000);
      const dataF = await res.json();
      
      const flatCourses: Course[] = dataF.courses.map((entry: any) => ({
        course_id: entry.course.course_id,
        course_code: entry.course.course_code,
        course_name: entry.course.course_name,
        school: entry.course.school,
        slot: entry.course.slot,
        credits: entry.course.credits,
        lecture: entry.course.lecture,
        tutorial: entry.course.tutorial,
        practical: entry.course.practical,
        status: entry.accept_reject ? "Registered" : "Pending",
        course_type: entry.pre_reg_course_type || "Unknown",
        course_mode: entry.pre_reg_course_mode || "Regular" // ADD THIS LINE
      }));
      setCourses(flatCourses);
      groupCoursesBySlot(flatCourses);
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

  const handleDeRegister = async (course_id: string) => {
  if (!window.confirm("Are you sure you want to de-register from this course?")) {
    return;
  }

  try {
    setDeregistering(prev => ({ ...prev, [course_id]: true }));
    const token = localStorage.getItem('token');
    
    await apiCall(`/deprereg/single/${course_id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    },4000);

    // Reload the page instead of updating local state
    window.location.reload(); // Add this line
  } catch (err) {
    console.error("De-registration failed:", err);
    alert("Failed to de-register. Please try again.");
  } finally {
    setDeregistering(prev => {
      const newState = { ...prev };
      delete newState[course_id];
      return newState;
    });
  }
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
              Student ID: <span className="font-bold">{studentProfile?.student_id}</span>
            </p>
            <p className="text-blue-100 text-sm mt-1">
              Semester: {currentSemester}
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
              onDeRegister={handleDeRegister}
              deregistering={deregistering}
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