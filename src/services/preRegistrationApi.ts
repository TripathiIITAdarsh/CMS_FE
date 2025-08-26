import type { Course, CourseSelection, Student, SubmissionPayload } from '../types/preRegistration';

export class PreRegistrationApi {
  apiCall: (url: string, options?: any, timeout?: number) => Promise<Response>;

  constructor(apiCall: (url: string, options?: any, timeout?: number) => Promise<Response>) {
    this.apiCall = apiCall;
  }
  getSemester = (oddStartMonth = 7, oddEndMonth = 12) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    if (month >= oddStartMonth && month <= oddEndMonth) {
      return `odd`;
    } else {
      return `even`;
    }
  };
  async fetchCourses(student: Student): Promise<Course[]> {
    const params = new URLSearchParams({
      branch: student.branch,
      year: student.batch.toString(),
      program: student.program,
      school: student.school,
      semester: this.getSemester(),
      student_id: student.student_id
    });

    const res = await this.apiCall(`/get_pre_reg_courses?${params.toString()}`, {}, 4000);
    const data = await res.json();
    
    return data.final_courses || [];
  }

  async submitCourse(courseId: string, payload: SubmissionPayload): Promise<Response> {
    return await this.apiCall(
      `/prereg/single/${courseId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },4000
    );
  }
}