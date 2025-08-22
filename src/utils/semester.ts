import SlotGroup from "../components/courses/SlotGroup";

export const getSemester = (oddStartMonth = 7, oddEndMonth = 12): string => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  if (month >= oddStartMonth && month <= oddEndMonth) {
    return `ODD ${year}`;
  } else {
    return `EVEN ${year}`;
  }
};

export const groupCoursesBySlot = (courses: Course[]): SlotGroup => {
  const groups: SlotGroup = {};
  
  courses.forEach((course) => {
    const slot = course.slot;
    if (!groups[slot]) {
      groups[slot] = [];
    }
    groups[slot].push(course);
  });
  
  return groups;
};