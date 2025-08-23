import React from 'react';

interface ActiveSlotIndicatorProps {
  slot: string;
}

const ActiveSlotIndicator: React.FC<ActiveSlotIndicatorProps> = ({ slot }) => {
  return (
    <div className="md:hidden sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-lg shadow-lg mb-4">
      <div className="flex items-center">
        <div className="w-2 h-8 bg-gradient-to-b from-blue-300 to-indigo-300 rounded-lg mr-3"></div>
        <h2 className="text-lg font-bold">Slot {slot}</h2>
      </div>
    </div>
  );
};

export default ActiveSlotIndicator;