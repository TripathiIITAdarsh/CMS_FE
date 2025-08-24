import type { Course, CourseSelection, CourseTypeCounts } from '../types/preRegistration';

export const calculateTotalCredits = (
  selections: CourseSelection[], 
  groupedCourses: Record<string, Course[]>
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
  groupedCourses: Record<string, Course[]>
): CourseTypeCounts => {
  const counts: CourseTypeCounts = { IC: 0, DC: 0, DE: 0, HSS: 0, FE: 0 };
  
  selections.forEach(selection => {
    const course = Object.values(groupedCourses)
      .flat()
      .find(c => c.course_id === selection.course_id);
    if (course && counts.hasOwnProperty(course.type)) {
      counts[course.type as keyof CourseTypeCounts]++;
    }
  });
  
  return counts;
};

export const groupCoursesBySlot = (courses: Course[]): Record<string, Course[]> => {
  return courses.reduce((acc: Record<string, Course[]>, course) => {
    const slot = course.slot || "Unslotted";
    if (!acc[slot]) acc[slot] = [];
    acc[slot].push(course);
    return acc;
  }, {});
};

export const hasPreRegisteredInSlot = (
  slot: string, 
  groupedCourses: Record<string, Course[]>, 
  preRegisteredCourses: Set<string>
): boolean => {
  return Object.values(groupedCourses)
    .flat()
    .some(course => 
      course.slot === slot && 
      preRegisteredCourses.has(course.course_id)
    );
};

export const getStudentFromStorage = () => {
  const studentString = localStorage.getItem("studentProfile");
  if (!studentString) throw new Error("Student profile not found");
  return JSON.parse(studentString);
};