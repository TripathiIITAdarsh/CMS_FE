// components/LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    enrollment: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);
    // Here you would add your actual login logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-blue-600/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-600/20 rounded-full filter blur-3xl"></div>
      
      {/* Main login card */}
      <div className="w-full max-w-md z-10">
        <div className="bg-gradient-to-br from-blue-800/30 via-indigo-800/30 to-purple-800/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-700/30 overflow-hidden">
          {/* Card header */}
          <div className="p-8 pb-6 border-b border-blue-700/30 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-4 rounded-2xl shadow-lg">
                <div className="bg-white p-3 rounded-xl">
                  <Lock className="text-blue-600" size={36} />
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white">Student Portal</h2>
            <p className="text-blue-200 mt-2">Sign in to access your dashboard</p>
          </div>
          
          {/* Login form */}
          <form onSubmit={handleSubmit} className="p-8 pt-6">
            <div className="space-y-5">
              {/* Enrollment input */}
              <div>
                <label htmlFor="enrollment" className="block text-sm font-medium text-blue-200 mb-1">
                  Enrollment Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-blue-400" size={20} />
                  </div>
                  <input
                    type="text"
                    id="enrollment"
                    name="enrollment"
                    value={formData.enrollment}
                    onChange={handleChange}
                    placeholder="22XX230"
                    className="w-full pl-10 pr-4 py-3 bg-blue-900/50 border border-blue-700/30 rounded-xl text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              {/* Password input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-blue-400" size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-blue-900/50 border border-blue-700/30 rounded-xl text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="text-blue-400 hover:text-blue-300" size={20} />
                    ) : (
                      <Eye className="text-blue-400 hover:text-blue-300" size={20} />
                    )}
                  </button>
                </div>
                <div className="mt-2 flex justify-end">
                  <Link to="#" className="text-sm text-blue-300 hover:text-blue-100 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Sign In
              </button>
            </div>
          </form>
          
          {/* Footer */}
          <div className="p-6 pt-2 border-t border-blue-700/30 text-center">
            <p className="text-blue-300 text-sm">
              Don't have an account?{' '}
              <Link to="#" className="text-blue-100 font-medium hover:text-white transition-colors">
                Contact Admin
              </Link>
            </p>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-blue-300 text-sm">
            © {new Date().getFullYear()} EduPortal Student Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;