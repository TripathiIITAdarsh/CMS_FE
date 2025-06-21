// import {BrowserRouter, Route } from "react-router-dom";
// import StudentDash from './pages/studentDashboard';
// import Navbar from "./navbar/navbar";

// // // In your App component
// {/* <StudentDashboard 
//   name="John Doe"
//   totalCredits={24}
//   coursesBySemester={yourCoursesData}
// />    */}

// function App() {
//     return(
//         <BrowserRouter>
//             <Route> path='/n' element={<Navbar/>}  </Route>
//             <Route> path = '/' element = {<StudentDash />}</Route>
            
//         </BrowserRouter>
//     )
// }
// export default App;


// App.jsx
// App.tsx
// App.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import StudentList from "./navbar/navbar";
import SlotWiseCourses from './pages/Pre_regitstration';
import StudentDash from './pages/studentDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Sidebar - now properly integrated in layout */}
        <Sidebar />
        
        {/* Main content area with responsive margin */}
        <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen transition-all duration-300 md:ml-72 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path='/' element={<StudentList />} />
              <Route path='/student/:enrollment' element={<StudentDash />} />
              <Route path='/pre_reg' element={<SlotWiseCourses />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;