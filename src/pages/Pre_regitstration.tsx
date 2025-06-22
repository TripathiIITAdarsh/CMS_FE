import React, { useEffect, useState } from "react";
import axios from "axios";
import SlotComponent from "../components/SlotComponent";

interface Course {
  course_id: string;
  course_code: string;
  course_name: string;
  slot: string;
  credits: number;
}

const uid = "23WN038";

const SlotWiseCourses = () => {
  const [groupedCourses, setGroupedCourses] = useState<Record<string, Course[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const remainingSubmissions = 2; // Update dynamically if needed

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const student_id = "23WN038"; // You can dynamically set this from context/auth later

        if (!student_id) {
          setError("Student ID not found");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/slot-wise/prereg", {
          params: { uid, student_id }
        });

        const rawCourses: Course[] = response.data.final_courses;

        // Group courses by slot
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

  const toggleCourse = (id: string) => {
    setSelectedCourses(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    console.log("Submitting:", Array.from(selectedCourses));
    alert(`Submitting ${selectedCourses.size} courses.`);
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-lg">
        Loading Courses...
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-red-500 px-4 text-center">
        {error}
      </div>
    );
  }

  // Main UI
  return (
    <div className="bg-[#F3F4F8] min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Course Pre-Registration
          </h1>
          <div className="mx-auto mt-2 h-1 w-24 sm:w-32 bg-blue-500 rounded-full"></div>
        </div>

        <div className="flex justify-center mb-8">
          <span className="bg-white text-gray-600 text-sm font-medium px-4 py-2 rounded-md shadow-sm border border-gray-200">
            Remaining Submissions: {remainingSubmissions}
          </span>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedCourses).map(([slot, courses]) => (
            <SlotComponent
              key={slot}
              slot={slot}
              courses={courses}
              selectedCourses={selectedCourses}
              toggleCourse={toggleCourse}
            />
          ))}
        </div>

        <div className="sticky bottom-0 mt-8 py-2">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-gray-700 font-medium text-center sm:text-left">
              Selected Courses: {selectedCourses.size}
            </span>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 cursor-pointer text-white px-6 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition w-full sm:w-auto"
            >
              Submit Pre-Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotWiseCourses;
