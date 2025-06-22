// pages/PreRegistrationPage.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SlotComponent from "../components/SlotComponent";

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

interface CourseSelection {
  course_id: string;
  enrollmentType: 'Regular' | 'PASS-fail' | 'equivalent' | 'audit';
}

const PreRegistrationPage = () => {
  const [groupedCourses, setGroupedCourses] = useState<Record<string, Course[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<CourseSelection[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Stats for the summary
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [courseTypeCounts, setCourseTypeCounts] = useState({
    IC: 0,
    DC: 0,
    DE: 0,
    HSS: 0,
    FE: 0,
    IK: 0
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/courses/final_courses");
        const rawCourses: Course[] = response.data.final_courses;

        const grouped = rawCourses.reduce((acc: Record<string, Course[]>, course) => {
          const slot = course.slot || "Unslotted";
          if (!acc[slot]) acc[slot] = [];
          acc[slot].push(course);
          return acc;
        }, {});

        setGroupedCourses(grouped); 
      } catch (err) {
        console.error("API Error:", err);
        setError("Could not connect to the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Update stats when selected courses change
  useEffect(() => {
    // Calculate total credits
    const credits = selectedCourses.reduce((sum, selection) => {
      const course = Object.values(groupedCourses)
        .flat()
        .find(c => c.course_id === selection.course_id);
      return sum + (course?.credits || 0);
    }, 0);
    
    setTotalCredits(credits);
    
    // Calculate course type counts
    const counts = { IC: 0, DC: 0, DE: 0, HSS: 0, FE: 0, IK: 0 };
    selectedCourses.forEach(selection => {
      const course = Object.values(groupedCourses)
        .flat()
        .find(c => c.course_id === selection.course_id);
      if (course && counts.hasOwnProperty(course.type)) {
        counts[course.type as keyof typeof counts]++;
      }
    });
    
    setCourseTypeCounts(counts);
  }, [selectedCourses, groupedCourses]);

  const toggleCourse = (id: string) => {
    setSelectedCourses(prev => {
      const existingIndex = prev.findIndex(s => s.course_id === id);
      
      if (existingIndex >= 0) {
        // Remove the course
        return prev.filter(s => s.course_id !== id);
      } else {
        // Add the course with default enrollment type
        return [...prev, { course_id: id, enrollmentType: 'Regular' }];
      }
    });
  };

  const updateEnrollmentType = (courseId: string, type: 'Regular' | 'PASS-fail' | 'equivalent' | 'audit') => {
    setSelectedCourses(prev => 
      prev.map(selection => 
        selection.course_id === courseId 
          ? { ...selection, enrollmentType: type } 
          : selection
      )
    );
  };

  const handleSubmit = async () => {
    if (selectedCourses.length === 0) {
      alert("Please select at least one course before submitting.");
      return;
    }
    
    try {
      const payload = {
        selections: selectedCourses,
        studentId: "22XX230", // Hardcoded for now
        uid: "df37aabe-77f0-4095-af0b-d073ef7cef0e" // Hardcoded for now
      };
      
      console.log("Submitting:", payload);
      
      // Uncomment for actual submission
      // const response = await axios.post(
      //   "https://localhost:3000/pre_register_course",
      //   payload
      // );
      
      // For demo purposes
      alert(`Successfully submitted ${selectedCourses.length} courses!`);
      
      // Clear selections after successful submission
      setSelectedCourses([]);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit courses. Please try again.");
    }
  };

  // Handle scroll to detect active slot
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      let currentSlot = null;
      
      // Find which slot is currently in view
      Object.keys(slotRefs.current).forEach(slot => {
        const element = slotRefs.current[slot];
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + scrollPosition;
          const elementBottom = bottom + scrollPosition;
          
          // Check if the element is in the viewport
          if (scrollPosition >= elementTop - 100 && scrollPosition < elementBottom - 100) {
            currentSlot = slot;
          }
        }
      });
      
      setActiveSlot(currentSlot);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [groupedCourses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-700 font-medium">Loading Courses...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <h3 className="text-lg font-medium text-red-800">Error Loading Courses</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Course Pre-Registration
          </h1>
          <div className="mx-auto mt-3 h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          <p className="text-blue-700 mt-4 max-w-2xl mx-auto">
            Select your preferred courses for the upcoming semester. You can choose the enrollment type for each course.
          </p>
        </div>

        {/* Summary Section - Always visible at top */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Selection Summary</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                  Courses Selected: <span className="text-xl font-bold text-white">{selectedCourses.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active slot indicator for mobile */}
        {activeSlot && (
          <div className="md:hidden sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-lg shadow-lg mb-4">
            <div className="flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-300 to-indigo-300 rounded-lg mr-3"></div>
              <h2 className="text-lg font-bold">Slot {activeSlot}</h2>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {Object.entries(groupedCourses).map(([slot, courses]) => (
            <div 
              key={slot} 
              ref={el => slotRefs.current[slot] = el}
              className="scroll-mt-24" // For scroll snapping
            >
              <SlotComponent
                slot={slot}
                courses={courses}
                selectedCourses={new Set(selectedCourses.map(s => s.course_id))}
                toggleCourse={toggleCourse}
                enrollmentTypes={selectedCourses.reduce((acc, curr) => {
                  acc[curr.course_id] = curr.enrollmentType;
                  return acc;
                }, {} as Record<string, 'Regular' | 'PASS-fail' | 'equivalent' | 'audit'>)}
                updateEnrollmentType={updateEnrollmentType}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sticky submit button - always visible */}
      <div className="sticky bottom-0 py-4 z-20 bg-gradient-to-t from-blue-50 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="font-medium">
                Selected: <span className="font-bold">{selectedCourses.length}</span> courses | 
                Credits: <span className="font-bold">{totalCredits}</span>
              </p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={selectedCourses.length === 0}
              className={`
                bg-white text-blue-900 px-6 py-3 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 
                transition-all shadow-lg hover:shadow-xl font-bold
                ${selectedCourses.length === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-50 transform hover:-translate-y-0.5'}
              `}
            >
              Submit Pre-Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreRegistrationPage;