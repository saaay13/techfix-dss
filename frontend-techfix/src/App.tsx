import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ClientListPage from './pages/clients/ClientListPage'
import DeviceListPage from './pages/devices/DeviceListPage'
import ServiceOrderListPage from './pages/orders/ServiceOrderListPage'
import ComponentListPage from './pages/inventory/ComponentListPage'
import UserListPage from './pages/users/UserListPage'
import PlaceholderPage from './pages/PlaceholderPage'
import CriticalStockPage from './pages/CriticalStockPage'
import ActivityListPage from './pages/ActivityListPage'
import ActivityFormPage from './pages/ActivityFormPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />

          <Route path="/clientes" element={<PrivateRoute><Layout><ClientListPage /></Layout></PrivateRoute>} />
          <Route path="/equipos" element={<PrivateRoute><Layout><DeviceListPage /></Layout></PrivateRoute>} />
          <Route path="/ordenes" element={<PrivateRoute><Layout><ServiceOrderListPage /></Layout></PrivateRoute>} />
          <Route path="/componentes" element={<PrivateRoute><Layout><ComponentListPage /></Layout></PrivateRoute>} />
          <Route path="/alertas-stock" element={<PrivateRoute><Layout><CriticalStockPage /></Layout></PrivateRoute>} />
          <Route path="/actividades" element={<PrivateRoute><ProtectedRoute roles={['Administrador']}><Layout><ActivityListPage /></Layout></ProtectedRoute></PrivateRoute>} />
          <Route path="/actividades/nueva" element={<PrivateRoute><ProtectedRoute roles={['Administrador']}><Layout><ActivityFormPage /></Layout></ProtectedRoute></PrivateRoute>} />
          <Route path="/actividades/:id/editar" element={<PrivateRoute><ProtectedRoute roles={['Administrador']}><Layout><ActivityFormPage /></Layout></ProtectedRoute></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><ProtectedRoute roles={['Administrador']}><Layout><UserListPage /></Layout></ProtectedRoute></PrivateRoute>} />
          <Route path="/reportes/financieros" element={<PrivateRoute><ProtectedRoute roles={['Administrador']}><Layout><PlaceholderPage title="Reportes Financieros" /></Layout></ProtectedRoute></PrivateRoute>} />
          <Route path="/dashboard/ingresos" element={<PrivateRoute><ProtectedRoute roles={['Administrador']}><Layout><PlaceholderPage title="Dashboard de Ingresos" /></Layout></ProtectedRoute></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
