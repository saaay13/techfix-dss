import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-svh flex items-center justify-center text-muted-foreground">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role?.nombre)) {
    return (
      <div className="min-h-svh flex items-center justify-center">
        <div className="text-center p-8 bg-card border border-border rounded-xl shadow-sm max-w-md">
          <h2 className="text-xl font-semibold text-error mb-2">Acceso denegado</h2>
          <p className="text-muted-foreground">No tienes permiso para acceder a esta página.</p>
          <p className="text-sm text-muted-foreground mt-2">Tu rol: <span className="font-medium">{user.role?.nombre}</span></p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
