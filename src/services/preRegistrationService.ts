import { useAuth } from '../context/AuthContext';
import type { PreRegCourse, PreRegSubmissionPayload } from '../types/preRegistration';
import type { StudentProfile } from '../types/student';

export const usePreRegistrationAPI = () => {
  const { apiCall } = useAuth();

  const fetchPreRegCourses = async (student: StudentProfile): Promise<PreRegCourse[]> => {
    const params = new URLSearchParams({
      branch: student.branch,
      year: student.batch.toString(),
      program: student.program,
      school: student.school,
      semester: "even",
      student_id: student.student_id
    });

    const response = await apiCall(`http://localhost:4000/courses/get_pre_reg_courses?${params.toString()}`);
    const data = await response.json();
    return data.final_courses || [];
  };

  const submitCourseRegistration = async (
    courseId: string, 
    payload: PreRegSubmissionPayload
  ): Promise<boolean> => {
    const response = await apiCall(
      `http://localhost:3000/prereg/single/${courseId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Registration failed');
    }

    return true;
  };

  return {
    fetchPreRegCourses,
    submitCourseRegistration
  };
};