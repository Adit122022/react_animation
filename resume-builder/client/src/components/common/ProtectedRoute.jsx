import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ children, requirePremium = false }) => {
  const { isAuthenticated, isPremium, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requirePremium && !isPremium) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
};

export default ProtectedRoute;