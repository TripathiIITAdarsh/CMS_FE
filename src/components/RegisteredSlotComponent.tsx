interface Course {
  course_id: string;
  course_code: string;
  course_name: string;
  school: string;
  slot: string;
  credits: number;
  lecture: number;
  tutorial: number;
  practical: number;
  status: string;
  course_type: string;
  course_mode: string;
}

interface RegisteredSlotProps {
  slot: string;
  courses: Course[];
  onDeRegister: (course_id: string) => void;
  deregistering: Record<string, boolean>;
}

const RegisteredSlotComponent: React.FC<RegisteredSlotProps> = ({ 
  slot, 
  courses,
  onDeRegister,
  deregistering
}) => {
  // Mapping for course mode display names
  const modeDisplayMap: Record<string, string> = {
    'Regular': 'Regular',
    'PASS-fail': 'Pass/Fail',
    'equivalent': 'Equivalent',
    'audit': 'Audit',
    'backlog': 'Backlog'
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200 p-5 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-2 h-8 sm:h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-lg mr-3"></div>
        <h2 className="text-xl font-bold text-blue-900">Slot {slot}</h2>
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => {
          const isDeregistering = deregistering[course.course_id] || false;
          const isRegistered = course.status === 'Registered';
          
          return (
            <div 
              key={course.course_id}
              className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left column - Course details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-blue-900">
                      {course.course_name} 
                    </h3>
                    <span className="text-blue-700 font-mono text-sm">
                      ({course.course_code})
                    </span>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isRegistered 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {course.status}
                    </div>
                  </div>
                  
                  <p className="text-sm text-blue-700 mb-3">{course.school}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-blue-600 font-medium">Credits</p>
                      <p className="font-bold text-blue-800">{course.credits}</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-blue-600 font-medium">Lecture</p>
                      <p className="font-bold text-blue-800">{course.lecture} hrs</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-blue-600 font-medium">Tutorial</p>
                      <p className="font-bold text-blue-800">{course.tutorial} hrs</p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-blue-600 font-medium">Practical</p>
                      <p className="font-bold text-blue-800">{course.practical} hrs</p>
                    </div>
                  </div>
                </div>
                
                {/* Right column - Registration info and actions */}
                <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-blue-200 pt-3 md:pt-0 md:pl-4">
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-1 px-3 rounded-lg text-center">
                      Basket: {course.course_type}
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white text-sm font-semibold py-1 px-3 rounded-lg text-center">
                      Type: {modeDisplayMap[course.course_mode] || course.course_mode}
                    </div>
                  </div>
                  
                  {isRegistered && (
                    <button
                      onClick={() => onDeRegister(course.course_id)}
                      disabled={isDeregistering}
                      className={`cursor-pointer w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        isDeregistering 
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:opacity-90 hover:shadow-md'
                      }`}
                    >
                      {isDeregistering ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          De-register
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default RegisteredSlotComponent;