import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userLogado');

  if (!isAuthenticated) {

    return <Navigate to="/" replace />;
  }

  

  return children;
};

