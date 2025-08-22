import React from 'react';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import LoadingState from '../components/dashboard/LoadingState';
import ErrorState from '../components/dashboard/ErrorState';
import StudentProfileCard from '../components/dashboard/StudentProfileCard';
import OverallProgressCard from '../components/dashboard/OverallProgressCard';
import CourseProgressCard from '../components/dashboard/CourseProgressCard';
import ProgressStatsGrid from '../components/dashboard/ProgressStatsGrid';
import type { CourseProgress } from '../types/student';

const Dashboard: React.FC = () => {
  const { 
    student, 
    courseProgress, 
    progressStats, 
    loading, 
    error, 
    refetch 
  } = useStudentDashboard();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!student) return <ErrorState error="No student data found" onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Student Profile */}
        <StudentProfileCard student={student} />

        {/* Overall Progress */}
        <OverallProgressCard stats={progressStats} />

        {/* Course Progress by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Progress by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseProgress.map((category: CourseProgress) => (
              <CourseProgressCard key={category.category} category={category} />
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <ProgressStatsGrid stats={progressStats} />
      </div>
    </div>
  );
};

export default Dashboard;
