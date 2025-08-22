export interface StudentProfile {
  student_id: string;
  name: string;
  branch: string;
  batch: number;
  program: string;
  school: string;
}

export interface CourseProgress {
  category: string;
  categoryName: string;
  totalCredits: number;
  completedCredits: number;
  percentage: number;
}

export interface ProgressStats {
  totalCredits: number;
  completedCredits: number;
  overallPercentage: number;
  categoriesCompleted: number;
  categoriesInProgress: number;
  categoriesNotStarted: number;
}