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

function App() {
  return (
    <div>
      <StudentList />
      <div className="mt-20 p-4">
        <h1 className="text-2xl">Welcome to My Site!</h1>
      </div>
    </div>
  );
}

export default App;