import type { PreRegCourse, CourseSelection, CourseTypeStats } from '../types/preRegistration';

export const groupCoursesBySlot = (courses: PreRegCourse[]): Record<string, PreRegCourse[]> => {
  return courses.reduce((acc: Record<string, PreRegCourse[]>, course) => {
    const slot = course.slot || "Unslotted";
    if (!acc[slot]) acc[slot] = [];
    acc[slot].push(course);
    return acc;
  }, {});
};

export const getPreRegisteredCourses = (courses: PreRegCourse[]): Set<string> => {
  const preRegistered = new Set<string>();
  courses.forEach(course => {
    if (!course.status) {
      preRegistered.add(course.course_id);
    }
  });
  return preRegistered;
};

export const getPreRegisteredSelections = (courses: PreRegCourse[]): CourseSelection[] => {
  return courses
    .filter(course => !course.status)
    .map(course => ({
      course_id: course.course_id,
      enrollmentType: 'regular' as const,
      course_type: course.type
    }));
};

export const calculateTotalCredits = (
  selections: CourseSelection[], 
  groupedCourses: Record<string, PreRegCourse[]>
): number => {
  return selections.reduce((sum, selection) => {
    const course = Object.values(groupedCourses)
      .flat()
      .find(c => c.course_id === selection.course_id);
    return sum + (course?.credits || 0);
  }, 0);
};

export const calculateCourseTypeCounts = (
  selections: CourseSelection[], 
  groupedCourses: Record<string, PreRegCourse[]>
): CourseTypeStats => {
  const counts: CourseTypeStats = { IC: 0, DC: 0, DE: 0, HSS: 0, FE: 0 };
  
  selections.forEach(selection => {
    const course = Object.values(groupedCourses)
      .flat()
      .find(c => c.course_id === selection.course_id);
    if (course && counts.hasOwnProperty(course.type)) {
      counts[course.type as keyof CourseTypeStats]++;
    }
  });
  
  return counts;
};

export const hasPreRegisteredInSlot = (
  slot: string,
  groupedCourses: Record<string, PreRegCourse[]>,
  preRegisteredCourses: Set<string>
): boolean => {
  return Object.values(groupedCourses)
    .flat()
    .some(course => 
      course.slot === slot && 
      preRegisteredCourses.has(course.course_id)
    );
};

export const findCourseById = (
  courseId: string,
  groupedCourses: Record<string, PreRegCourse[]>
): PreRegCourse | undefined => {
  return Object.values(groupedCourses)
    .flat()
    .find(c => c.course_id === courseId);
};