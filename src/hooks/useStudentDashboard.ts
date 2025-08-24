import { useState, useEffect } from 'react';
import type { StudentProfile, CourseProgress, ProgressStats } from '../types/student';
import { useStudentAPI } from '../services/studentService';
import { calculateProgressStats, cacheStudentProfile } from '../utils/progress';

export const useStudentDashboard = () => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalCredits: 0,
    completedCredits: 0,
    overallPercentage: 0,
    categoriesCompleted: 0,
    categoriesInProgress: 0,
    categoriesNotStarted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getStudentDetails, getCourseProgress } = useStudentAPI();

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both student details and course progress
      const [studentData, courseProgressData] = await Promise.all([
        getStudentDetails(),
        getCourseProgress()
      ]);

      setStudent(studentData);
      setCourseProgress(courseProgressData);
      
      // Calculate progress stats from the fetched data
      const stats = calculateProgressStats(courseProgressData);
      setProgressStats(stats);
      
      // Cache the student profile
      cacheStudentProfile(studentData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch student data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const refetch = () => {
    fetchStudentData();
  };

  return {
    student,
    courseProgress,
    progressStats,
    loading,
    error,
    refetch
  };
};