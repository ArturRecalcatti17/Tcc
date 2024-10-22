import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userLogado');

  if (!isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    return <Navigate to="/" replace />;
  }

  

  return children;
};
