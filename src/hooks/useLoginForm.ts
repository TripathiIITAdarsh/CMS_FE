import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login: authLogin } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!formData.student_id.trim()) {
      setError('Please enter your Student ID');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await authLogin({
        student_id: formData.student_id,
        password: formData.password
      });

      setSuccess('Login successful! Redirecting...');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    formData,
    error,
    success,
    isLoading,
    handleInputChange,
    handleLogin
  };
};