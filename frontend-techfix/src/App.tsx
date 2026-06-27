import { useState } from 'react'
import ClientForm from './components/ClientForm'
import ClientList from './components/ClientList'

type Tab = 'clientes' | 'registrar'

export default function App() {
  const [tab, setTab] = useState<Tab>('clientes')
  const [refresh, setRefresh] = useState(0)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">TechFix DSS - Gestión de Clientes</h1>
      <nav className="flex gap-4 mb-6">
        <button onClick={() => setTab('clientes')} className={`px-4 py-2 rounded ${tab === 'clientes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Lista de Clientes
        </button>
        <button onClick={() => setTab('registrar')} className={`px-4 py-2 rounded ${tab === 'registrar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Registrar Cliente
        </button>
      </nav>
      {tab === 'registrar' && <ClientForm onSuccess={() => { setTab('clientes'); setRefresh(r => r + 1) }} />}
      {tab === 'clientes' && <ClientList key={refresh} />}
    </div>
  )
}
