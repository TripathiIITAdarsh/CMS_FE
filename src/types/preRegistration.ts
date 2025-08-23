export interface PreRegCourse {
  course_id: string;
  course_code: string;
  course_name: string;
  school: string;
  slot: string;
  credits: number;
  lecture: number;
  tutorial: number;
  practical: number;
  type: 'IC' | 'DC' | 'DE' | 'HSS' | 'FE';
  status: boolean;
}

export interface CourseSelection {
  course_id: string;
  enrollmentType: 'regular' | 'pass_fail' | 'equivalent' | 'audit' | 'backlog';
  course_type: 'IC' | 'DC' | 'DE' | 'HSS' | 'FE';
}

export interface CourseTypeStats {
  IC: number;
  DC: number;
  DE: number;
  HSS: number;
  FE: number;
}

export interface PreRegSubmissionPayload {
  studentId: string;
  uid: string;
  course_mode: string;
  course_type: string;
}

export interface PreRegState {
  groupedCourses: Record<string, PreRegCourse[]>;
  selectedCourses: CourseSelection[];
  preRegisteredCourses: Set<string>;
  totalCredits: number;
  courseTypeCounts: CourseTypeStats;
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
}