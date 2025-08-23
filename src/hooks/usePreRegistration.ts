import { useState, useEffect, useCallback } from 'react';
import type { PreRegState, CourseSelection } from '../types/preRegistration';
import { usePreRegistrationAPI } from '../services/preRegistrationService';
import { useStudentProfile } from './useStudentProfile';
import { useNotifications } from './useNotifications';
import {
  groupCoursesBySlot,
  getPreRegisteredCourses,
  getPreRegisteredSelections,
  calculateTotalCredits,
  calculateCourseTypeCounts,
  hasPreRegisteredInSlot,
  findCourseById
} from '../utils/preRegistration';

export const usePreRegistration = () => {
  const [state, setState] = useState<PreRegState>({
    groupedCourses: {},
    selectedCourses: [],
    preRegisteredCourses: new Set(),
    totalCredits: 0,
    courseTypeCounts: { IC: 0, DC: 0, DE: 0, HSS: 0, FE: 0 },
    loading: true,
    error: null,
    isSubmitting: false
  });

  const student = useStudentProfile();
  const { fetchPreRegCourses, submitCourseRegistration } = usePreRegistrationAPI();
  const { addNotification } = useNotifications();

  const fetchCourses = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const courses = await fetchPreRegCourses(student);
      const preRegistered = getPreRegisteredCourses(courses);
      const preRegisteredSelections = getPreRegisteredSelections(courses);
      const grouped = groupCoursesBySlot(courses);

      setState(prev => ({
        ...prev,
        groupedCourses: grouped,
        preRegisteredCourses: preRegistered,
        selectedCourses: [...prev.selectedCourses, ...preRegisteredSelections],
        loading: false
      }));

    } catch (error) {
      console.error("API Error:", error);
      setState(prev => ({
        ...prev,
        error: "Could not connect to the server. Please try again later.",
        loading: false
      }));
    }
  }, [student, fetchPreRegCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Update stats when selected courses change
  useEffect(() => {
    const totalCredits = calculateTotalCredits(state.selectedCourses, state.groupedCourses);
    const courseTypeCounts = calculateCourseTypeCounts(state.selectedCourses, state.groupedCourses);

    setState(prev => ({
      ...prev,
      totalCredits,
      courseTypeCounts
    }));
  }, [state.selectedCourses, state.groupedCourses]);

  const toggleCourse = useCallback((courseId: string) => {
    if (state.preRegisteredCourses.has(courseId)) return;

    const course = findCourseById(courseId, state.groupedCourses);
    if (!course) return;

    // Check if slot already has a pre-registered course
    if (hasPreRegisteredInSlot(course.slot, state.groupedCourses, state.preRegisteredCourses)) {
      addNotification('error', 
        `You cannot select another course in slot ${course.slot} as you already have a pre-registered course in this slot.`
      );
      return;
    }

    setState(prev => {
      const existingIndex = prev.selectedCourses.findIndex(s => s.course_id === courseId);
      if (existingIndex >= 0) {
        return {
          ...prev,
          selectedCourses: prev.selectedCourses.filter(s => s.course_id !== courseId)
        };
      } else {
        return {
          ...prev,
          selectedCourses: [...prev.selectedCourses, {
            course_id: courseId,
            enrollmentType: 'regular',
            course_type: course.type
          }]
        };
      }
    });
  }, [state.preRegisteredCourses, state.groupedCourses, addNotification]);

  const updateEnrollmentType = useCallback((
    courseId: string,
    type: 'regular' | 'pass_fail' | 'equivalent' | 'audit' | 'backlog'
  ) => {
    if (state.preRegisteredCourses.has(courseId)) return;

    setState(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.map(selection =>
        selection.course_id === courseId
          ? { ...selection, enrollmentType: type }
          : selection
      )
    }));
  }, [state.preRegisteredCourses]);

  const submitRegistrations = useCallback(async () => {
    if (state.selectedCourses.length === 0) {
      addNotification('error', 'Please select at least one course before submitting.');
      return;
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));

      const newSelections = state.selectedCourses.filter(
        selection => !state.preRegisteredCourses.has(selection.course_id)
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
          await submitCourseRegistration(selection.course_id, payload);
          successCount++;

          // Add to pre-registered set immediately on success
          setState(prev => ({
            ...prev,
            preRegisteredCourses: new Set([...prev.preRegisteredCourses, selection.course_id])
          }));

        } catch (courseError) {
          console.error(`Error registering course ${selection.course_id}:`, courseError);
          const course = findCourseById(selection.course_id, state.groupedCourses);
          const courseName = course ? `${course.course_code} - ${course.course_name}` : selection.course_id;
          failedCourses.push(courseName);
          
          const errorMessage = courseError instanceof Error ? courseError.message : 'Network error occurred';
          addNotification('error', `${courseName}: ${errorMessage}`);
        }
      }

      // Show summary notifications
      if (successCount > 0) {
        addNotification('success', `Successfully submitted ${successCount} course${successCount > 1 ? 's' : ''}!`);
      }

      if (failedCourses.length > 0) {
        addNotification('error', 
          `Failed to submit ${failedCourses.length} course${failedCourses.length > 1 ? 's' : ''}. Check individual error messages above.`
        );
      }

    } catch (error) {
      console.error("Submission error:", error);
      addNotification('error', 'Failed to submit courses. Please try again.');
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.selectedCourses, state.preRegisteredCourses, state.groupedCourses, student, submitCourseRegistration, addNotification]);

  const refetch = useCallback(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    ...state,
    toggleCourse,
    updateEnrollmentType,
    submitRegistrations,
    refetch
  };
};