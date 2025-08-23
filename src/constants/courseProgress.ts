import type { CourseProgress } from '../types/student';

// This should eventually come from an API
export const MOCK_COURSE_PROGRESS: CourseProgress[] = [
  {
    category: 'IC',
    categoryName: 'Institute Core',
    totalCredits: 12,
    completedCredits: 8,
    percentage: 67
  },
  {
    category: 'DC',
    categoryName: 'Discipline Core',
    totalCredits: 24,
    completedCredits: 16,
    percentage: 67
  },
  {
    category: 'DE',
    categoryName: 'Discipline Elective',
    totalCredits: 16,
    completedCredits: 12,
    percentage: 75
  },
  {
    category: 'HSS',
    categoryName: 'Humanities & Social Sciences',
    totalCredits: 8,
    completedCredits: 4,
    percentage: 50
  },
  {
    category: 'FE',
    categoryName: 'Free Elective',
    totalCredits: 8,
    completedCredits: 0,
    percentage: 0
  }
];