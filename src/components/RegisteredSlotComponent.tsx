

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
  course_type:string;
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
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-blue-200 p-5 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-2 h-8 sm:h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-lg mr-3"></div>
        <h2 className="text-xl font-bold text-blue-900">Slot {slot}</h2>
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => {
          const isDeregistering = deregistering[course.course_id] || false;
          return (
            <div 
              key={course.course_id}
              className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="text-lg font-semibold text-blue-900">
                      {course.course_name} ({course.course_code})
                    </h3>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === 'Registered' 
                        ? 'bg-green-100 text-green-800' 
                        : course.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {course.status}
                    </div>
                  </div>
                  
                  <p className="text-sm text-blue-700 mt-1">{course.school}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center text-sm text-blue-600">
                      <span className="font-medium mr-1">Credits:</span>
                      <span>{course.credits}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-blue-600">
                      <span className="font-medium mr-1">L:</span>
                      <span>{course.lecture} hrs</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-blue-600">
                      <span className="font-medium mr-1">T:</span>
                      <span>{course.tutorial} hrs</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-blue-600">
                      <span className="font-medium mr-1">P:</span>
                      <span>{course.practical} hrs</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold py-1 px-3 rounded-lg">
                    Basket: {course.course_type}
                  </div>
                </div>
              </div>
              
              {course.status === 'Registered' && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => onDeRegister(course.course_id)}
                    disabled={isDeregistering}
                    className={`cursor-pointer bg-gradient-to-r from-red-500 to-red-700 text-white py-1 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity ${
                      isDeregistering ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isDeregistering ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                        Processing...
                      </>
                    ) : (
                      'De-register'
                    )}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default RegisteredSlotComponent;