import type { Course, CourseSelection, Student, SubmissionPayload } from '../types/preRegistration';

export class PreRegistrationApi {
  apiCall: (url: string, options?: any, timeout?: number) => Promise<Response>;

  constructor(apiCall: (url: string, options?: any, timeout?: number) => Promise<Response>) {
    this.apiCall = apiCall;
  }

  async fetchCourses(student: Student): Promise<Course[]> {
    const params = new URLSearchParams({
      branch: student.branch,
      year: student.batch.toString(),
      program: student.program,
      school: student.school,
      semester: "even",
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