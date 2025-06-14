import React, { useEffect, useState } from 'react';

type Student = {
  name: string;
  branch: string;
  program: string;
  rollNo: string;
};

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/students')
      .then(res => res.json())
      .then(setStudents);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Student List</h2>
      <ul className="mt-2 space-y-1">
        {students.map((s, idx) => (
          <li key={idx} className="border p-2 rounded">
            {s.name} - {s.program} ({s.branch}) | Roll No: {s.rollNo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;