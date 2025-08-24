export interface Course {
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

export interface Notification {
  id: string; // must be unique
  type: "success" | "error" | "info";
  message: string;
}


export interface CourseTypeCounts {
  IC: number;
  DC: number;
  DE: number;
  HSS: number;
  FE: number;
}

export interface Student {
  student_id: string;
  uid: string;
  branch: string;
  batch: number;
  program: string;
  school: string;
}

export interface SubmissionPayload {
  studentId: string;
  uid: string;
  course_mode: string;
  course_type: string;
}