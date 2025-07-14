// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

function ProtectedRoute({ children }) {
  const userData = useUserStore((state) => state.userData);

  if (!userData) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;