import type { CourseProgress, ProgressStats, StudentProfile } from '../types/student';

export const calculateProgressStats = (courseProgress: CourseProgress[]): ProgressStats => {
  const totalCredits = courseProgress.reduce((sum, category) => sum + category.totalCredits, 0);
  const completedCredits = courseProgress.reduce((sum, category) => sum + category.completedCredits, 0);
  const overallPercentage = Math.round((completedCredits / totalCredits) * 100);

  return {
    totalCredits,
    completedCredits,
    overallPercentage,
    categoriesCompleted: courseProgress.filter(c => c.percentage === 100).length,
    categoriesInProgress: courseProgress.filter(c => c.percentage > 0 && c.percentage < 100).length,
    categoriesNotStarted: courseProgress.filter(c => c.percentage === 0).length
  };
};

export const cacheStudentProfile = (student: StudentProfile): void => {
  try {
    localStorage.setItem('studentProfile', JSON.stringify(student));
  } catch (error) {
    console.warn('Failed to cache student profile:', error);
  }
};

export const getCachedStudentProfile = (): StudentProfile | null => {
  try {
    const cached = localStorage.getItem('studentProfile');
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Failed to get cached student profile:', error);
    return null;
  }
};