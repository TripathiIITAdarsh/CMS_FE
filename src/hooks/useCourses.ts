import { useState, useEffect } from 'react';
import type { Course, SlotGroup } from '../types/course';
import { useCourseAPI } from '../services/courseService';
import { groupCoursesBySlot } from '../utils/semester';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slotGroups, setSlotGroups] = useState<SlotGroup>({});

  const { getAllCourses } = useCourseAPI();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coursesData = await getAllCourses();
      setCourses(coursesData);
      
      const groups = groupCoursesBySlot(coursesData);
      setSlotGroups(groups);
      
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const refetch = () => {
    fetchCourses();
  };

  return {
    courses,
    slotGroups,
    loading,
    error,
    refetch
  };
};