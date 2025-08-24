import { useAuth } from '../context/AuthContext';



export const useCourseAPI = () => {
  const { apiCall } = useAuth();
  
  const getAllCourses = async () => {
    const response = await apiCall('/final_courses',{},4000);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.final_courses;
  };

  return { getAllCourses };
};