import { useAuth } from '../context/AuthContext';

export const courseService = {
  async getAllCourses() {
    const { apiCall } = useAuth();
    const response = await apiCall('/courses/final_courses');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.final_courses;
  }
};

// Alternative approach using a hook for API calls
export const useCourseAPI = () => {
  const { apiCall } = useAuth();
  
  const getAllCourses = async () => {
    const response = await apiCall('http://localhost:4000/courses/final_courses');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.final_courses;
  };

  return { getAllCourses };
};