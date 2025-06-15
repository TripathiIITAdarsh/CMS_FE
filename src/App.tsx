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
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StudentList from "./navbar/navbar";
import StudentDash from './pages/studentDashboard';

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/student/:enrollment" element={<StudentDash />} />
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;