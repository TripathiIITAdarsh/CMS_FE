import { Eye, EyeOff, User, Lock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginForm() {
  const {
    showPassword,
    setShowPassword,
    formData,
    error,
    success,
    isLoading,
    handleInputChange,
    handleLogin
  } = useLoginForm();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <img
          src="https://iitmandi.samarth.ac.in/uploads/uims/ea5086a2733de95ab628e64aa6da8ba80808129b3c7dc0fdb28f357b9beab6011_1605882012_27287335_logo.png"
          alt="Institute Logo"
          className="w-24 h-24 mx-auto mb-4 rounded-xl shadow-md"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">IIT MANDI</h1>
        <p className="text-gray-600 text-sm">Student Portal Login</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
          <CheckCircle size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {/* Login Form */}
      <div className="space-y-6">
        {/* Student ID Field */}
        <div className="space-y-2">
          <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700">
            Student ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="studentId"
              name="student_id"
              type="text"
              required
              disabled={isLoading}
              value={formData.student_id}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Enter your student ID"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            />
            <button
              type="button"
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <button
            type="button"
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-300 underline-offset-4 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              alert('Forgot password functionality would be implemented here');
            }}
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
}