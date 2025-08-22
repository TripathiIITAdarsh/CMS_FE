export interface CourseHelper {
  branch?: string;
  course_type?: string;
  semester?: string;
  year?: string;
  program?: string;
}

export interface Professor {
  iid: string;
  prof_name: string;
  prof_email: string;
  school: string;
}

export interface ProfessorCourse {
  uid: string;
  iid: string;
  course_id: string;
  professor: Professor;
}

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
  course_helpers: CourseHelper[];
  prof_course: ProfessorCourse[];
}

export interface SlotGroup {
  [slot: string]: Course[];
}