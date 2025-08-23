import { useState, useEffect, useRef } from 'react';

export const useSlotScroll = (groupedCourses: Record<string, any[]>) => {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      let currentSlot = null;
      
      Object.keys(slotRefs.current).forEach(slot => {
        const element = slotRefs.current[slot];
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + scrollPosition;
          const elementBottom = bottom + scrollPosition;
          
          if (scrollPosition >= elementTop - 100 && scrollPosition < elementBottom - 100) {
            currentSlot = slot;
          }
        }
      });
      
      setActiveSlot(currentSlot);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [groupedCourses]);

  return { activeSlot, slotRefs };
};