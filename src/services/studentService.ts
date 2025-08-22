import { useAuth } from '../context/AuthContext';
import type { StudentProfile } from '../types/student';

export const useStudentAPI = () => {
  const { apiCall } = useAuth();

  const getStudentDetails = async (): Promise<StudentProfile> => {
    const response = await apiCall('http://localhost:3000/details');
    
    if (!response.ok) {
      throw new Error('Failed to fetch student details');
    }
    
    const data = await response.json();
    return data;
  };

  return { getStudentDetails };
};