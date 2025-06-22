 // components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../pages/LoginPage'; // update this path

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
