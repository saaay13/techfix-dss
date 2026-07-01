import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCriticalStock } from '../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface CriticalComponent {
  id: number
  nombre: string
  cantidad: number
  stock_minimo: number
}

interface MonthlyIncome {
  month: string
  total: number
}

interface TopItem {
  nombre: string
  count: number
}

interface DashboardData {
  monthly_income: MonthlyIncome[]
  top_services: TopItem[]
  top_failed_devices: TopItem[]
  critical_stock: number
  pending_orders_count: number
}

const COLORS = ['#000080', '#4343ff', '#7676ff', '#a5a5ff', '#d0d0ff']

export default function Dashboard() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [criticalComponents, setCriticalComponents] = useState<CriticalComponent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = { 'Accept': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    Promise.all([
      fetch('http://127.0.0.1:8000/api/dashboard', { headers }).then(r => r.json()),
      getCriticalStock(),
    ])
      .then(([dashData, criticalData]) => {
        setDashboard(dashData)
        setCriticalComponents(criticalData)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Cargando dashboard...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Bienvenido, {user?.name} {user?.apellido}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rol: <span className="font-medium text-primary">{user?.role?.nombre}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard title="Órdenes Pendientes" value={dashboard?.pending_orders_count ?? 0} color="text-amber-600" />
        <KpiCard title="Stock Crítico" value={dashboard?.critical_stock ?? 0} color="text-destructive" />
        <KpiCard title="Ingresos (12m)" value={formatCurrency(dashboard?.monthly_income?.reduce((s, m) => s + m.total, 0) ?? 0)} color="text-green-600" />
        <KpiCard title="Servicios Top" value={dashboard?.top_services?.[0]?.nombre ?? '-'} color="text-primary" />
        <KpiCard title="Equipo con Fallas" value={dashboard?.top_failed_devices?.[0]?.nombre ?? '-'} color="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Ingresos por Mes</h3>
          {dashboard?.monthly_income?.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboard.monthly_income}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => `Bs. ${v.toLocaleString()}`} />
                <Bar dataKey="total" fill="#000080" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Sin datos</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Servicios Más Realizados</h3>
          {dashboard?.top_services?.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={dashboard.top_services}
                  dataKey="count"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ nombre, count }) => `${nombre} (${count})`}
                >
                  {dashboard.top_services.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Sin datos</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Equipos con Más Fallas</h3>
          {dashboard?.top_failed_devices?.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboard.top_failed_devices} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="nombre" type="category" width={150} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Sin datos</p>
          )}
        </div>

        <div className="bg-card border border-destructive/40 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-destructive/5 border-b border-destructive/20 flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-destructive rounded-full animate-pulse" />
            <p className="text-sm text-destructive font-semibold">
              Stock Crítico — {criticalComponents.length} componente{criticalComponents.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="p-4 max-h-[280px] overflow-y-auto">
            {criticalComponents.length === 0 ? (
              <p className="text-sm text-green-600 text-center py-4">Todo OK</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-foreground">Componente</th>
                    <th className="text-center px-3 py-2 font-medium text-foreground">Stock</th>
                    <th className="text-center px-3 py-2 font-medium text-foreground">Mín.</th>
                  </tr>
                </thead>
                <tbody>
                  {criticalComponents.map(c => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 font-medium text-foreground">{c.nombre}</td>
                      <td className="px-3 py-2 text-center font-bold text-destructive">{c.cantidad}</td>
                      <td className="px-3 py-2 text-center text-muted-foreground">{c.stock_minimo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}

function formatCurrency(amount: number): string {
  return `Bs. ${amount.toLocaleString()}`
}
