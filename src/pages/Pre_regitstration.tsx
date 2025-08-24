import React, { useState, useEffect } from "react";
import SlotComponent from "../components/SlotComponent";
import LoadingSpinner from "../components/PreRegistration/LoadingSpinner";
import ErrorDisplay from "../components/PreRegistration/ErrorDisplay";
import CourseSelectionSummary from "../components/PreRegistration/CourseSelectionSummary";
import NotificationContainer from "../components/PreRegistration/NotificationContainer";
import ActiveSlotIndicator from "../components/PreRegistration/ActiveSlotIndicator";
import SubmissionBar from "../components/PreRegistration/SubmissionBar";
import { usePreRegistration } from "../hooks/usePreregistration";
import { useNotifications } from "../hooks/useNotifications";
import { useActiveSlot } from "../hooks/useActiveSlot";
import { calculateTotalCredits, calculateCourseTypeCounts, hasPreRegisteredInSlot } from "../utils/preRegistrationHelpers";

const PreRegistrationPage = () => {
  const {
    groupedCourses,
    loading,
    error,
    selectedCourses,
    setSelectedCourses,
    preRegisteredCourses,
    setPreRegisteredCourses,
    student,
    api
  } = usePreRegistration();

  const { notifications, addNotification, removeNotification } = useNotifications();
  const { activeSlot, slotRefs } = useActiveSlot(groupedCourses);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCredits = calculateTotalCredits(selectedCourses, groupedCourses);
  const courseTypeCounts = calculateCourseTypeCounts(selectedCourses, groupedCourses);

  const toggleCourse = (id: string) => {
    if (preRegisteredCourses.has(id)) return;

    const courseToToggle = Object.values(groupedCourses)
      .flat()
      .find(c => c.course_id === id);

    if (!courseToToggle) return;

    if (hasPreRegisteredInSlot(courseToToggle.slot, groupedCourses, preRegisteredCourses)) {
      addNotification('error', `You cannot select another course in slot ${courseToToggle.slot} as you already have a pre-registered course in this slot.`);
      return;
    }

    setSelectedCourses(prev => {
      const existingIndex = prev.findIndex(s => s.course_id === id);
      if (existingIndex >= 0) {
        return prev.filter(s => s.course_id !== id);
      } else {
        return [...prev, {
          course_id: id,
          enrollmentType: 'regular',
          course_type: courseToToggle.type
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
          const res = await api.submitCourse(selection.course_id, payload);

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const errorMessage = errorData.message || errorData.error || `Failed to register course ${selection.course_id}`;

            const course = Object.values(groupedCourses)
              .flat()
              .find(c => c.course_id === selection.course_id);
            const courseName = course ? `${course.course_code} - ${course.course_name}` : selection.course_id;

            failedCourses.push(courseName);
            addNotification('error', `${courseName}: ${errorMessage}`);
          } else {
            successCount++;
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Course Pre-Registration
          </h1>
          <div className="mx-auto mt-3 h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          <p className="text-blue-700 mt-4 max-w-2xl mx-auto">
            Select your preferred courses for the upcoming semester. You can choose the enrollment type for each course.
          </p>
        </div>

        <CourseSelectionSummary
          courseTypeCounts={courseTypeCounts}
          totalCredits={totalCredits}
          totalCourses={selectedCourses.length}
        />

        {activeSlot && <ActiveSlotIndicator activeSlot={activeSlot} />}

        <div className="space-y-8">
          {Object.entries(groupedCourses).map(([slot, courses]) => (
            <div
              key={slot}
              ref={el => { slotRefs.current[slot] = el; }}
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

      <SubmissionBar
        selectedCoursesCount={selectedCourses.length}
        totalCredits={totalCredits}
        preRegisteredCount={preRegisteredCourses.size}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
export default PreRegistrationPage;