//SlotWiseCourses.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import SlotComponent from "../components/SlotComponent";

interface Course {
  course_id: string;
  course_code: string;
  course_name: string;
  slot: string;
  credits: number;
}

const SlotWiseCourses = () => {
  const [groupedCourses, setGroupedCourses] = useState<Record<string, Course[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const remainingSubmissions = 2; // update dynamically as needed

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const student_id = Cookies.get("student_id") || "B23175";
        if (!student_id) {
          setError("Student ID not found in cookies.");
          setLoading(false);
          return;
        }
        const response = await axios.get("/api/v1/get_courses", { params: { student_id } });
        setGroupedCourses(response.data.groupedCourses);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleCourse = (id: string) => {
    setSelectedCourses(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    // submit selectedCourses to backend
    console.log("Submitting:", Array.from(selectedCourses));
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-4">Course Pre-Registration</h1>

      <div className="flex justify-center mb-8">
        /*<span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          Remaining Submissions: {remainingSubmissions}
        </span>
      </div>
      {Object.entries(groupedCourses).map(([slot, courses]) => (
        <SlotComponent
          key={slot}
          slot={slot}
          courses={courses}
          selectedCourses={selectedCourses}
          toggleCourse={toggleCourse}
        />
      ))}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <span>Selected Courses: {selectedCourses.size}</span>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Pre-Registration
        </button>
      </div>
    </div>
  );
};

export default SlotWiseCourses;