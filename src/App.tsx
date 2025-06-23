// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Stdash';
import SlotWiseCourses from './pages/Pre_regitstration';
import PrivateRoute from './components/PrivateRoutes';
import { AuthProvider } from './pages/LoginPage';
import CoursesRegistered from './pages/Pre_registered_courses';
function App() {
  return (
    <AuthProvider>

      <BrowserRouter>
        <Routes>
          {/* Public layout */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected layout */}
          <Route element={<PrivateRoute><AuthLayout /></PrivateRoute>}>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/student/:enrollment" element={<StudentDash />} /> */}
            <Route path="/pre_reg" element={<SlotWiseCourses />} />
            <Route path='/courses-registered/:studentId?' element={<CoursesRegistered />} />
          </Route>
             
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
