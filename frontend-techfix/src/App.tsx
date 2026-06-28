import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';
import ClientListPage from './pages/ClientListPage';
import DeviceForm from './pages/DeviceForm';
import PlaceholderPage from './pages/PlaceholderPage';
import ProtectedRoute from './components/ProtectedRoute';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-svh flex items-center justify-center text-muted-foreground">Cargando...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role?.nombre === 'Administrador';

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Equipos', path: '/equipos' },
    ...(isAdmin ? [{ label: 'Usuarios', path: '/usuarios' }] : []),
    { label: 'Reportes', path: '/reportes/financieros' },
    { label: 'Dashboard Ingresos', path: '/dashboard/ingresos' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-primary">TechFix DSS</h1>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border pt-4">
        <div className="text-sm text-foreground font-medium">{user?.name} {user?.apellido}</div>
        <div className="text-xs text-muted-foreground">{user?.role?.nombre}</div>
        <button
          onClick={logout}
          className="mt-2 w-full px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-medium hover:bg-destructive/20 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Bienvenido, {user?.name} {user?.apellido}
      </h1>
      <p className="text-muted-foreground mb-6">
        Rol: <span className="font-medium text-primary">{user?.role?.nombre}</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Órdenes de Servicio', 'Clientes', 'Inventario'].map((title) => (
          <div key={title} className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">Módulo próximamente</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />

          <Route path="/clientes" element={<PrivateRoute><Layout><ClientListPage /></Layout></PrivateRoute>} />
          <Route path="/equipos" element={<PrivateRoute><Layout><DeviceForm /></Layout></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><ProtectedRoute roles={['Administrador']}><Layout><UserListPage /></Layout></ProtectedRoute></PrivateRoute>} />
          <Route path="/reportes/financieros" element={<PrivateRoute><ProtectedRoute roles={['Administrador']}><Layout><PlaceholderPage title="Reportes Financieros" /></Layout></ProtectedRoute></PrivateRoute>} />
          <Route path="/dashboard/ingresos" element={<PrivateRoute><ProtectedRoute roles={['Administrador']}><Layout><PlaceholderPage title="Dashboard de Ingresos" /></Layout></ProtectedRoute></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
