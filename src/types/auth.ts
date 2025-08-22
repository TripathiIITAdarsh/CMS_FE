export interface User {
  student: {
    student_id: string;
    name?: string;
    [key: string]: any;
  };
  user: {
    uid: string;
    email?: string;
    [key: string]: any;
  };
}

export interface LoginCredentials {
  student_id: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; data: any }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  apiCall: (url: string, options?: RequestInit) => Promise<Response>;
}