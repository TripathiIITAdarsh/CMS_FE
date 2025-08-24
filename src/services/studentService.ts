import { useAuth } from '../context/AuthContext';
import type { StudentProfile, CourseProgress } from '../types/student';

export const useStudentAPI = () => {
  const { apiCall } = useAuth();

  const getStudentDetails = async (): Promise<StudentProfile> => {
    const response = await apiCall('/details');
    
    if (!response.ok) {
      throw new Error('Failed to fetch student details');
    }
    
    const data = await response.json();
    console.log(data)
    return data;
  };

  const getCourseProgress = async (): Promise<CourseProgress[]> => {
    const response = await apiCall('/utils');
    
    if (!response.ok) {
      throw new Error('Failed to fetch course progress');
    }
    
    const data = await response.json();
    console.log('Course Progress Data:', data);
    
    // Transform the backend data to match CourseProgress interface
    const courseProgress: CourseProgress[] = [
      {
        category: 'DC',
        categoryName: 'Discipline Core',
        totalCredits: data.required.DC,
        completedCredits: data.earned.DC || 0,
        percentage: data.required.DC > 0 ? Math.round(((data.earned.DC || 0) / data.required.DC) * 100) : 0
      },
      {
        category: 'DE',
        categoryName: 'Discipline Elective',
        totalCredits: data.required.DE,
        completedCredits: data.earned.DE || 0,
        percentage: data.required.DE > 0 ? Math.round(((data.earned.DE || 0) / data.required.DE) * 100) : 0
      },
      {
        category: 'FE',
        categoryName: 'Free Elective',
        totalCredits: data.required.FE,
        completedCredits: data.earned.FE || 0,
        percentage: data.required.FE > 0 ? Math.round(((data.earned.FE || 0) / data.required.FE) * 100) : 0
      }
    ];
    
    return courseProgress;
  };

  return { 
    getStudentDetails,
    getCourseProgress 
  };
};