import React from 'react';
import { usePreRegistration } from '../hooks/usePreRegistration';
import { useNotifications } from '../hooks/useNotifications';
import { useSlotScroll } from '../hooks/useSlotScroll';
import SlotComponent from '../components/SlotComponent';
import NotificationContainer from '../components/preRegistration/NotificationContainer';
import PreRegHeader from '../components/preRegistration/PreRegHeader';
import SelectionSummary from '../components/preRegistration/SelectionSummary';
import SubmissionBar from '../components/preRegistration/SubmissionBar';
import ActiveSlotIndicator from '../components/preRegistration/ActiveSlotIndicator';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';

const PreRegistrationPage: React.FC = () => {
  const {
    groupedCourses,
    selectedCourses,
    preRegisteredCourses,
    totalCredits,
    courseTypeCounts,
    loading,
    error,
    isSubmitting,
    toggleCourse,
    updateEnrollmentType,
    submitRegistrations,
    refetch
  } = usePreRegistration();

  const {
    notifications,
    removeNotification
  } = useNotifications();

  const { activeSlot, slotRefs } = useSlotScroll(groupedCourses);

  // Create enrollment types map from selected courses
  const enrollmentTypes = selectedCourses.reduce((acc, curr) => {
    acc[curr.course_id] = curr.enrollmentType;
    return acc;
  }, {} as Record<string, 'regular' | 'pass_fail' | 'equivalent' | 'audit' | 'backlog'>);

  const selectedCourseIds = new Set(selectedCourses.map(s => s.course_id));
  const newSelectionsCount = selectedCourses.filter(
    selection => !preRegisteredCourses.has(selection.course_id)
  ).length;

  if (loading) {
    return <LoadingState message="Loading Courses..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Error Loading Courses"
        message={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <PreRegHeader />

        {/* Selection Summary */}
        <SelectionSummary 
          courseTypeCounts={courseTypeCounts}
          totalCredits={totalCredits}
          totalCourses={selectedCourses.length}
        />

        {/* Active Slot Indicator for Mobile */}
        {activeSlot && <ActiveSlotIndicator slot={activeSlot} />}

        {/* Course Slots */}
        <div className="space-y-8">
          {/* {Object.entries(groupedCourses).map(([slot, courses]) => (
            <div 
              key={slot} 
              ref={el => slotRefs.current[slot] = el}
              className="scroll-mt-24"
            >
              <SlotComponent
                slot={slot}
                courses={courses}
                selectedCourses={selectedCourseIds}
                preRegisteredCourses={preRegisteredCourses}
                toggleCourse={toggleCourse}
                enrollmentTypes={enrollmentTypes}
                updateEnrollmentType={updateEnrollmentType}
              />
            </div>
          ))} */}
        </div>
      </div>

      {/* Submission Bar */}
      <SubmissionBar
        selectedCount={newSelectionsCount}
        totalCredits={totalCredits}
        preRegisteredCount={preRegisteredCourses.size}
        isSubmitting={isSubmitting}
        onSubmit={submitRegistrations}
      />
    </div>
  );
};

export default PreRegistrationPage;