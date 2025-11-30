import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    navigate('/login');
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    navigate('/');
    return null;
  }

  return children;
}
