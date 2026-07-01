import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDevice, getDeviceServiceHistory } from '../../services/devices'

interface ServiceOrder {
  id: number
  fecha_ingreso: string
  diagnostico_inicial: string
  estado: string
  prioridad: string
  costo_total: number
  serviceType: { id: number; nombre: string }
}

interface DeviceInfo {
  id: number
  tipo_equipo: string
  marca: string
  modelo: string
  numero_serie: string
  client: { id: number; nombre: string; apellido: string }
}

const ESTADO_COLOR: Record<string, string> = {
  Recibido: 'bg-blue-100 text-blue-800',
  Diagnóstico: 'bg-purple-100 text-purple-800',
  'En reparación': 'bg-orange-100 text-orange-800',
  Finalizado: 'bg-success/10 text-success',
  Entregado: 'bg-muted text-muted-foreground',
}

const PRIORIDAD_COLOR: Record<string, string> = {
  Baja: 'bg-success/10 text-success',
  Media: 'bg-yellow-100 text-yellow-800',
  Alta: 'bg-error/10 text-error',
}

export default function DeviceServiceHistoryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [device, setDevice] = useState<DeviceInfo | null>(null)
  const [orders, setOrders] = useState<ServiceOrder[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deviceId = Number(id)
        const [deviceData, historyData] = await Promise.all([
          getDevice(deviceId),
          getDeviceServiceHistory(deviceId),
        ])
        setDevice(deviceData)
        setOrders(Array.isArray(historyData) ? historyData : [])
      } catch {
        setError('Error al cargar el historial del equipo')
      }
    }
    fetchData()
  }, [id])

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate('/equipos')} className="text-sm text-primary hover:underline mb-1">
            ← Volver a Equipos
          </button>
          <h2 className="text-2xl font-semibold text-foreground">Historial de Servicios</h2>
          {device && (
            <p className="text-muted-foreground text-sm mt-1">
              {device.tipo_equipo} - {device.marca} {device.modelo} ({device.numero_serie})
              {device.client && ` — ${device.client.nombre} ${device.client.apellido}`}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{error}</div>
      )}

      {orders === null ? null : orders.length === 0 ? (
        <p className="text-muted-foreground">Este equipo no tiene órdenes de servicio registradas.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">#</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Fecha de Ingreso</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Servicio</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Diagnóstico</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground font-mono">#{order.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.fecha_ingreso}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.serviceType?.nombre}</td>
                  <td className="px-4 py-3 text-foreground max-w-xs truncate" title={order.diagnostico_inicial}>
                    {order.diagnostico_inicial}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_COLOR[order.estado] || 'bg-muted text-muted-foreground'}`}>
                      {order.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORIDAD_COLOR[order.prioridad] || ''}`}>
                      {order.prioridad}
                    </span>
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
