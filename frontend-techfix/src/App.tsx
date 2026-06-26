import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';
import UserFormPage from './pages/UserFormPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-svh flex items-center justify-center text-muted-foreground">Cargando...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function HomePage() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-svh bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Bienvenido, {user?.name} {user?.apellido}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Rol: <span className="font-medium text-primary-600">{user?.role?.nombre}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-error text-error-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Órdenes de Servicio', 'Clientes', 'Inventario'].map((title) => (
            <div key={title} className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Módulo próximamente</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><UserListPage /></PrivateRoute>} />
          <Route path="/usuarios/nuevo" element={<PrivateRoute><UserFormPage /></PrivateRoute>} />
          <Route path="/usuarios/:id/editar" element={<PrivateRoute><UserFormPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
