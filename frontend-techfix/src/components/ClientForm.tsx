import { useState } from 'react'
import { createClient } from '../services/api'

interface Props {
  onSuccess: () => void
}

export default function ClientForm({ onSuccess }: Props) {
  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', correo: '', ci: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await createClient(form)
      setForm({ nombre: '', apellido: '', telefono: '', correo: '', ci: '' })
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg max-w-md">
      <h2 className="text-lg font-semibold mb-4">Registrar Cliente</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="space-y-2">
        <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full p-2 border rounded" required />
        <input placeholder="Apellido" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} className="w-full p-2 border rounded" required />
        <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="w-full p-2 border rounded" required />
        <input placeholder="Correo" type="email" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} className="w-full p-2 border rounded" required />
        <input placeholder="CI" value={form.ci} onChange={e => setForm({ ...form, ci: e.target.value })} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
      </div>
    </form>
  )
}
