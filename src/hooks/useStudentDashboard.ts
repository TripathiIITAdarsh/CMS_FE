import { useState, useEffect } from 'react';
import type { StudentProfile, CourseProgress, ProgressStats } from '../types/student';
import { useStudentAPI } from '../services/studentService';
import { MOCK_COURSE_PROGRESS } from '../constants/courseProgress';
import { calculateProgressStats, cacheStudentProfile } from '../utils/progress';

export const useStudentDashboard = () => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getStudentDetails } = useStudentAPI();
  
  // For now using mock data, but this could also come from API
  const courseProgress = MOCK_COURSE_PROGRESS;
  const progressStats = calculateProgressStats(courseProgress);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const studentData = await getStudentDetails();
      setStudent(studentData);
      
      // Cache the student profile
      cacheStudentProfile(studentData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch student details';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const refetch = () => {
    fetchStudentDetails();
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