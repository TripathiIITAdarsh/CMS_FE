import { useState, useContext, createContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, AuthContextType } from '../types/auth';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { throw new Error('AuthProvider not found') },
  logout: () => { throw new Error('AuthProvider not found') },
  isAuthenticated: false,
  loading: true,
  apiCall: async () => { throw new Error('AuthProvider not found') }
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await authService.login(credentials);

      // Store token and user data
      localStorage.setItem('token', data.token);
      const userData = {
        student: data.student,
        user: data.user
      };
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true, data };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const logout = () => {
    console.log("logout called");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const apiCall = async (url: string, options: RequestInit = {},port : number = 3000) => {
    return authService.apiCall(url, options,port);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    apiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};