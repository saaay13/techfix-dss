import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ServiceOrderForm from './pages/ServiceOrderForm'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '12px 24px', background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <Link to="/" style={{ marginRight: 16, fontWeight: 'bold', textDecoration: 'none', color: '#007bff' }}>
          TechFix DSS
        </Link>
        <Link to="/ordenes/nueva" style={{ textDecoration: 'none', color: '#007bff' }}>
          Nueva Orden de Servicio
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1 style={{ padding: 24 }}>Bienvenido a TechFix DSS</h1>} />
        <Route path="/ordenes/nueva" element={<ServiceOrderForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
