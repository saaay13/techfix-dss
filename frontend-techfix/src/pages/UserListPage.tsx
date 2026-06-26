import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers, deleteUser } from '../services/api'

interface User {
  id: number
  name: string
  apellido: string
  email: string
  telefono: string
  activo: boolean
  role: { id: number; nombre: string }
}

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch {
      setError('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Desactivar al usuario "${name}"?`)) return
    try {
      await deleteUser(id)
      fetchUsers()
    } catch {
      setError('Error al desactivar usuario')
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Gestión de Usuarios</h2>
        <button
          onClick={() => navigate('/usuarios/nuevo')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          + Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{error}</div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : users.length === 0 ? (
        <p className="text-muted-foreground">No hay usuarios registrados</p>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Teléfono</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Rol</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{user.name} {user.apellido}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.telefono || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary-600 rounded-full text-xs font-medium">
                      {user.role?.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.activo
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                    }`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/usuarios/${user.id}/editar`)}
                      className="px-3 py-1 bg-primary/10 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      Editar
                    </button>
                    {user.activo && (
                      <button
                        onClick={() => handleDelete(user.id, `${user.name} ${user.apellido}`)}
                        className="px-3 py-1 bg-error/10 text-error rounded-lg text-xs font-medium hover:bg-error/20 transition-colors"
                      >
                        Desactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
