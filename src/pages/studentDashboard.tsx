import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type StudentData = {
  name: string;
  branch: string;
  program: string;
  enrollment: string;
  batch: number;
  courseProgress: {
    ic: number;
    todoic: number;
    dc: number;
    tododc: number;
    hss: number;
    todohss: number;
    de: number;
    todode: number;
    fe: number;
    todofe: number;
  };
};

const StudentDash = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { enrollment } = useParams();

  useEffect(() => {
    if (!enrollment) {
      setError('No enrollment ID provided');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:4000/api/student/${enrollment}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch student data');
        return res.json();
      })
      .then(data => {
        setStudent(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [enrollment]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!student) return <div>No student data found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Profile Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Student Profile</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Branch:</strong> {student.branch}</p>
          <p><strong>Program:</strong> {student.program}</p>
          <p><strong>Enrollment:</strong> {student.enrollment}</p>
          <p><strong>Batch:</strong> {student.batch}</p>
        </div>
      </div>

      {/* Course Progress Section */}
      <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Course Progress</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h3>IC Department</h3>
            <p>Completed: {student.courseProgress.ic}/{student.courseProgress.todoic} credits</p>
          </div>
          <div>
            <h3>DC Department</h3>
            <p>Completed: {student.courseProgress.dc}/{student.courseProgress.tododc} credits</p>
          </div>
          <div>
            <h3>HSS Department</h3>
            <p>Completed: {student.courseProgress.hss}/{student.courseProgress.todohss} credits</p>
          </div>
          <div>
            <h3>DE Department</h3>
            <p>Completed: {student.courseProgress.de}/{student.courseProgress.todode} credits</p>
          </div>
          <div>
            <h3>FE Department</h3>
            <p>Completed: {student.courseProgress.fe}/{student.courseProgress.todofe} credits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDash;