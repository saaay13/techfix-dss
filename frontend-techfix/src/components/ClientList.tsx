import { useEffect, useState } from 'react'
import { getClients } from '../services/api'

export default function ClientList() {
  const [clients, setClients] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const load = (s = '') =>
    getClients(s).then(data => setClients(data.data || []))

  useEffect(() => { load() }, [])

  return (
    <div>
      <input
        placeholder="Buscar cliente..."
        value={search}
        onChange={e => { setSearch(e.target.value); load(e.target.value) }}
        className="w-full p-2 border rounded mb-4"
      />
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left">Nombre</th>
            <th className="p-2 border text-left">Apellido</th>
            <th className="p-2 border text-left">Teléfono</th>
            <th className="p-2 border text-left">Correo</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="p-2 border">{c.nombre}</td>
              <td className="p-2 border">{c.apellido}</td>
              <td className="p-2 border">{c.telefono}</td>
              <td className="p-2 border">{c.correo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
