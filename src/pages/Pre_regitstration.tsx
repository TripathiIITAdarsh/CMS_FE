// pages/PreRegistrationPage.tsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useAuth } from "./LoginPage";
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
  type: 'IC' | 'DC' | 'DE' | 'HSS' | 'FE';
  status: boolean;
}

interface CourseSelection {
  course_id: string;
  enrollmentType: 'regular' | 'pass_fail' | 'equivalent' | 'audit' | 'backlog';
  course_type: 'IC' | 'DC' | 'DE' | 'HSS' | 'FE';
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const PreRegistrationPage = () => {
  const { apiCall } = useAuth();
  const [groupedCourses, setGroupedCourses] = useState<Record<string, Course[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<CourseSelection[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preRegisteredCourses, setPreRegisteredCourses] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Stats for the summary
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [courseTypeCounts, setCourseTypeCounts] = useState({
    IC: 0,
    DC: 0,
    DE: 0,
    HSS: 0,
    FE: 0,
  });

  // Notification functions
  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // FIX: Memoize student object to prevent recreation on every render
  const student = useMemo(() => {
    const studentString = localStorage.getItem("studentProfile");
    if (!studentString) throw new Error("Student profile not found");
    return JSON.parse(studentString);
  }, []);

  useEffect(() => {
    // FIX: Add abort controller to prevent state updates after unmount
    const abortController = new AbortController();
    
    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams({
          branch: student.branch,
          year: student.batch.toString(),
          program: student.program,
          school: student.school,
          semester: "even",
          student_id: student.student_id
        });

        const res = await apiCall(`http://localhost:4000/courses/get_pre_reg_courses?${params.toString()}`);
        
        // FIX: Check if component is still mounted
        if (abortController.signal.aborted) return;
        
        const data = await res.json();
        console.log(data);
        const rawCourses: Course[] = data.final_courses || [];

        const preRegistered = new Set<string>();
        rawCourses.forEach(course => {
          if (!course.status) {
            preRegistered.add(course.course_id);
          }
        });
        setPreRegisteredCourses(preRegistered);

        const preRegisteredSelections: CourseSelection[] = [];
        rawCourses.forEach(course => {
          if (!course.status) {
            preRegisteredSelections.push({
              course_id: course.course_id,
              enrollmentType: 'regular',
              course_type: course.type
            });
          }
        });

        setSelectedCourses(prev => [...prev, ...preRegisteredSelections]);

        const grouped = rawCourses.reduce((acc: Record<string, Course[]>, course) => {
          const slot = course.slot || "Unslotted";
          if (!acc[slot]) acc[slot] = [];
          acc[slot].push(course);
          return acc;
        }, {});

        setGroupedCourses(grouped);
      } catch (err) {
        // FIX: Only set error if not aborted
        if (!abortController.signal.aborted) {
          console.error("API Error:", err);
          setError("Could not connect to the server. Please try again later.");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    // FIX: Cleanup function to abort fetch on unmount
    return () => abortController.abort();
  }, [apiCall, student]); // FIX: student is now memoized and stable

  // Update stats when selected courses change
  useEffect(() => {
    const credits = selectedCourses.reduce((sum, selection) => {
      const course = Object.values(groupedCourses)
        .flat()
        .find(c => c.course_id === selection.course_id);
      return sum + (course?.credits || 0);
    }, 0);
    
    setTotalCredits(credits);
    
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

  const hasPreRegisteredInSlot = (slot: string) => {
    return Object.values(groupedCourses)
      .flat()
      .some(course => 
        course.slot === slot && 
        preRegisteredCourses.has(course.course_id)
      );
  };

  const toggleCourse = (id: string) => {
    if (preRegisteredCourses.has(id)) return;

    const courseToToggle = Object.values(groupedCourses)
      .flat()
      .find(c => c.course_id === id);

    if (!courseToToggle) return;

    // Check if slot already has a pre-registered course
    if (hasPreRegisteredInSlot(courseToToggle.slot)) {
      addNotification('error', `You cannot select another course in slot ${courseToToggle.slot} as you already have a pre-registered course in this slot.`);
      return;
    }
    
    setSelectedCourses(prev => {
      const existingIndex = prev.findIndex(s => s.course_id === id);
      if (existingIndex >= 0) {
        return prev.filter(s => s.course_id !== id);
      } else {
        // Find the course to get its type
        const course = Object.values(groupedCourses)
          .flat()
          .find(c => c.course_id === id);
        return [...prev, { 
          course_id: id, 
          enrollmentType: 'regular',
          course_type: course?.type || 'DE' // Default to 'DE' if not found, but should always be found
        }];
      }
    });
  };

  const updateEnrollmentType = (courseId: string, type: 'regular' | 'pass_fail' | 'equivalent' | 'audit' | 'backlog') => {
    if (preRegisteredCourses.has(courseId)) return;
    
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
      addNotification('error', 'Please select at least one course before submitting.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newSelections = selectedCourses.filter(
        selection => !preRegisteredCourses.has(selection.course_id)
      );
      
      let successCount = 0;
      let failedCourses: string[] = [];
      
      for (const selection of newSelections) {
        const payload = {
          studentId: student.student_id,
          uid: student.uid,
          course_mode: selection.enrollmentType,
          course_type: selection.course_type
        };
        
        try {
          const res = await apiCall(
            `http://localhost:3000/prereg/single/${selection.course_id}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }
          );
          
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const errorMessage = errorData.message || errorData.error || `Failed to register course ${selection.course_id}`;
            
            // Find course name for better error display
            const course = Object.values(groupedCourses)
              .flat()
              .find(c => c.course_id === selection.course_id);
            const courseName = course ? `${course.course_code} - ${course.course_name}` : selection.course_id;
            
            failedCourses.push(courseName);
            addNotification('error', `${courseName}: ${errorMessage}`);
          } else {
            successCount++;
            // Add to pre-registered set immediately on success
            setPreRegisteredCourses(prev => new Set([...prev, selection.course_id]));
          }
        } catch (courseError) {
          console.error(`Error registering course ${selection.course_id}:`, courseError);
          const course = Object.values(groupedCourses)
            .flat()
            .find(c => c.course_id === selection.course_id);
          const courseName = course ? `${course.course_code} - ${course.course_name}` : selection.course_id;
          failedCourses.push(courseName);
          addNotification('error', `${courseName}: Network error occurred`);
        }
      }
      
      // Show summary notification
      if (successCount > 0) {
        addNotification('success', `Successfully submitted ${successCount} course${successCount > 1 ? 's' : ''}!`);
      }
      
      if (failedCourses.length > 0) {
        addNotification('error', `Failed to submit ${failedCourses.length} course${failedCourses.length > 1 ? 's' : ''}. Check individual error messages above.`);
      }
      
    } catch (err) {
      console.error("Submission error:", err);
      addNotification('error', 'Failed to submit courses. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      let currentSlot = null;
      
      Object.keys(slotRefs.current).forEach(slot => {
        const element = slotRefs.current[slot];
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + scrollPosition;
          const elementBottom = bottom + scrollPosition;
          
          if (scrollPosition >= elementTop - 100 && scrollPosition < elementBottom - 100) {
            currentSlot = slot;
          }
        }
      });
      
      setActiveSlot(currentSlot);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
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
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out
              ${notification.type === 'success' 
                ? 'bg-green-50 border-green-500 text-green-800' 
                : notification.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-800'
                : 'bg-blue-50 border-blue-500 text-blue-800'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && (
                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'error' && (
                    <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {notification.type === 'info' && (
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium break-words">{notification.message}</p>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className={`
                  ml-4 flex-shrink-0 rounded-md p-1.5 inline-flex 
                  ${notification.type === 'success' 
                    ? 'text-green-500 hover:bg-green-100' 
                    : notification.type === 'error'
                    ? 'text-red-500 hover:bg-red-100'
                    : 'text-blue-500 hover:bg-blue-100'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                `}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* HEADING SECTION - PRESERVED */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Course Pre-Registration
          </h1>
          <div className="mx-auto mt-3 h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          <p className="text-blue-700 mt-4 max-w-2xl mx-auto">
            Select your preferred courses for the upcoming semester. You can choose the enrollment type for each course.
          </p>
        </div>

        {/* SUMMARY SECTION - PRESERVED */}
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
              className="scroll-mt-24"
            >
              <SlotComponent
                slot={slot}
                courses={courses}
                selectedCourses={new Set(selectedCourses.map(s => s.course_id))}
                preRegisteredCourses={preRegisteredCourses}
                toggleCourse={toggleCourse}
                enrollmentTypes={selectedCourses.reduce((acc, curr) => {
                  acc[curr.course_id] = curr.enrollmentType;
                  return acc;
                }, {} as Record<string, 'regular' | 'pass_fail' | 'equivalent' | 'audit' | 'backlog'>)}
                updateEnrollmentType={updateEnrollmentType}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 py-4 z-20 bg-gradient-to-t from-blue-50 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="font-medium">
                Selected: <span className="font-bold">{selectedCourses.length}</span> courses | 
                Credits: <span className="font-bold">{totalCredits}</span>
              </p>
              {preRegisteredCourses.size > 0 && (
                <p className="text-sm text-blue-200 mt-1">
                  ({preRegisteredCourses.size} courses already pre-registered)
                </p>
              )}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={selectedCourses.length === 0 || isSubmitting}
              className={`
                bg-white text-blue-900 px-6 py-3 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 
                transition-all shadow-lg hover:shadow-xl font-bold
                ${selectedCourses.length === 0 || isSubmitting
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-50 transform hover:-translate-y-0.5'}
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Pre-Registration"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreRegistrationPage;