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
import StudentList from "./navbar/navbar";
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import SlotWiseCourses from './pages/pre_regitstration';
import StudentDash from './pages/studentDashboard';


function App() {
  return (
    <div>
      <BrowserRouter>
          <Routes>
              <Route path = '/' element = {<StudentList/>}></Route>
              <Route path="/student/:enrollment" element={<StudentDash />} />
              <Route path = '/pre_reg' element = {<SlotWiseCourses/>}></Route>
          </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;