import React from 'react';
import { getSemester } from '../utils/semester';
import { useCourses } from '../hooks/useCourses';
import SlotGroup from '../components/courses/SlotGroup';
import CourseStats from '../components/courses/CourseStats';
import LoadingState from '../components/courses/LoadingState';
import ErrorState from '../components/courses/ErrorState';

const AllCourses: React.FC = () => {
  const currentSemester = getSemester();
  const { courses, slotGroups, loading, error, refetch } = useCourses();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
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
              Current Semester: {currentSemester}
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <CourseStats courses={courses} slotCount={Object.keys(slotGroups).length} />
      
      {/* Course Groups */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Slot-wise Course Distribution</h2>
        
        {Object.keys(slotGroups).length > 0 ? (
          Object.entries(slotGroups).map(([slot, slotCourses]) => (
            <SlotGroup key={slot} slot={slot} courses={slotCourses} />
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

export default AllCourses;