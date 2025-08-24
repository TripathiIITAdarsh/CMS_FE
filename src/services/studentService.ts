import { useAuth } from '../context/AuthContext';
import type { StudentProfile } from '../types/student';

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

  return { getStudentDetails };
};