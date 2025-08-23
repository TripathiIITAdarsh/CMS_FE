import { useMemo } from 'react';
import type { StudentProfile } from '../types/student';

export const useStudentProfile = (): StudentProfile => {
  const student = useMemo(() => {
    const studentString = localStorage.getItem("studentProfile");
    if (!studentString) {
      throw new Error("Student profile not found in localStorage");
    }
    try {
      return JSON.parse(studentString);
    } catch (error) {
      throw new Error("Invalid student profile data in localStorage");
    }
  }, []);

  return student;
};