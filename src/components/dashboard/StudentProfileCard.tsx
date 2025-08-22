import React from 'react';
import type { StudentProfile } from '../../types/student';

interface StudentProfileCardProps {
  student: StudentProfile;
}

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({ student }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Name</span>
            <p className="text-lg text-gray-900">{student.name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Branch</span>
            <p className="text-lg text-gray-900">{student.branch}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Program</span>
            <p className="text-lg text-gray-900">{student.program}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Enrollment ID</span>
            <p className="text-lg text-gray-900">{student.student_id}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Batch</span>
            <p className="text-lg text-gray-900">{student.batch}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">School</span>
            <p className="text-lg text-gray-900">{student.school}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileCard;