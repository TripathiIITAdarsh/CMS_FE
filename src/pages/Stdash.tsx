import React, { useEffect, useState } from 'react';
import axios from 'axios';

type StudentProfile = {
  student_id: string;
  name: string;
  branch: string;
  batch: number;
  program: string;
  school: string;
};

type CourseProgress = {
  category: string;
  categoryName: string;
  totalCredits: number;
  completedCredits: number;
  percentage: number;
};

const Dashboard = () => {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Hardcoded for now
  const student_id = '21BI575';
  const uid = 'df37aabe-77f0-4095-af0b-d073ef7cef0e';

  // Hardcoded course progress data - only percentages
  const courseProgress: CourseProgress[] = [
    {
      category: 'IC',
      categoryName: 'Institute Core',
      totalCredits: 12,
      completedCredits: 8,
      percentage: 67
    },
    {
      category: 'DC',
      categoryName: 'Discipline Core',
      totalCredits: 24,
      completedCredits: 16,
      percentage: 67
    },
    {
      category: 'DE',
      categoryName: 'Discipline Elective',
      totalCredits: 16,
      completedCredits: 12,
      percentage: 75
    },
    {
      category: 'HSS',
      categoryName: 'Humanities & Social Sciences',
      totalCredits: 8,
      completedCredits: 4,
      percentage: 50
    },
    {
      category: 'FE',
      categoryName: 'Free Elective',
      totalCredits: 8,
      completedCredits: 0,
      percentage: 0
    }
  ];

  useEffect(() => {
    axios
      .get('http://localhost:3000/details', {
        params: {
          student_id,
          uid,
        },
      })
      .then((res) => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">No student data found</div>
      </div>
    );
  }

  const totalCredits = courseProgress.reduce((sum, category) => sum + category.totalCredits, 0);
  const totalCompletedCredits = courseProgress.reduce((sum, category) => sum + category.completedCredits, 0);
  const overallPercentage = Math.round((totalCompletedCredits / totalCredits) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Student Profile Section */}
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

        {/* Overall Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Academic Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalCompletedCredits}</div>
              <div className="text-gray-500">Credits Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{totalCredits}</div>
              <div className="text-gray-500">Total Credits Required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{overallPercentage}%</div>
              <div className="text-gray-500">Overall Progress</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Course Progress Section - Simplified */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Progress by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseProgress.map((category) => (
              <div key={category.category} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{category.percentage}%</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.categoryName}
                </h3>
                
                <div className="text-sm text-gray-600 mb-4">
                  {category.completedCredits} of {category.totalCredits} credits completed
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-500 mb-2">
              {courseProgress.filter(c => c.percentage === 100).length}
            </div>
            <div className="text-gray-600">Categories Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-2">
              {courseProgress.filter(c => c.percentage > 0 && c.percentage < 100).length}
            </div>
            <div className="text-gray-600">Categories In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-red-500 mb-2">
              {courseProgress.filter(c => c.percentage === 0).length}
            </div>
            <div className="text-gray-600">Categories Not Started</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;