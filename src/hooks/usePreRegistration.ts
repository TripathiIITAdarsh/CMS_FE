import { useState, useEffect, useMemo } from 'react';
import type { Course, CourseSelection, Student } from '../types/preRegistration';
import { PreRegistrationApi } from '../services/preRegistrationApi';
import { groupCoursesBySlot, getStudentFromStorage } from '../utils/preRegistrationHelpers';
import { useAuth } from '../context/AuthContext';

export const usePreRegistration = () => {
  const { apiCall } = useAuth();
  const [groupedCourses, setGroupedCourses] = useState<Record<string, Course[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<CourseSelection[]>([]);
  const [preRegisteredCourses, setPreRegisteredCourses] = useState<Set<string>>(new Set());

  const student = useMemo(() => getStudentFromStorage(), []);
  const api = useMemo(() => new PreRegistrationApi(apiCall), [apiCall]);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchCourses = async () => {
      try {
        const rawCourses = await api.fetchCourses(student);
        
        if (abortController.signal.aborted) return;
        
        const preRegistered = new Set<string>();
        const preRegisteredSelections: CourseSelection[] = [];
        
        rawCourses.forEach(course => {
          if (!course.status) {
            preRegistered.add(course.course_id);
            preRegisteredSelections.push({
              course_id: course.course_id,
              enrollmentType: 'regular',
              course_type: course.type
            });
          }
        });

        setPreRegisteredCourses(preRegistered);
        setSelectedCourses(prev => [...prev, ...preRegisteredSelections]);
        setGroupedCourses(groupCoursesBySlot(rawCourses));
      } catch (err) {
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
    return () => abortController.abort();
  }, [api, student]);

  return {
    groupedCourses,
    loading,
    error,
    selectedCourses,
    setSelectedCourses,
    preRegisteredCourses,
    setPreRegisteredCourses,
    student,
    api
  };
};