import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import DeviceForm from './pages/DeviceForm'

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>TechFix DSS</h1>
      <p>Sistema de Gestión de Servicios Técnicos</p>
      <nav>
        <ul>
          <li><Link to="/devices/nuevo">Registrar Equipo</Link></li>
        </ul>
      </nav>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devices/nuevo" element={<DeviceForm />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
