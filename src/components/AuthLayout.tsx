// layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen transition-all duration-300 md:ml-72 p-4 md:p-6">
        <div className="max-w-8xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
