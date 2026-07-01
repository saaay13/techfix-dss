@startuml
title HU-12 - Visualizar Dashboard DSS

actor Administrador

boundary "Dashboard (React)" as Frontend
control "DashboardController\n(Laravel API)" as Backend
database "Base de Datos" as DB

Administrador -> Frontend : Ingresa al Dashboard

Frontend -> Backend : GET /api/dashboard

activate Backend

Backend -> DB : Obtener ingresos por mes\nDATE_FORMAT(fecha) SUM(monto)\ndesde payments (últimos 12 meses)
DB --> Backend : Datos de ingresos agrupados por mes

Backend -> DB : Obtener servicios más realizados\nCOUNT(*) GROUP BY service_type_id\ndesde service_order_items (top 5)
DB --> Backend : Datos de servicios con nombre

Backend -> DB : Obtener equipos con más fallas\nCOUNT(*) GROUP BY device_id\ndesde service_orders (top 5)
DB --> Backend : Datos de equipos con marca/modelo

Backend -> DB : Obtener stock crítico\ncantidad <= stock_minimo\ndesde components
DB --> Backend : Lista de componentes críticos

Backend -> DB : Obtener órdenes pendientes\nCOUNT WHERE estado = 'Diagnóstico'\ndesde service_orders
DB --> Backend : Total de órdenes

Backend --> Frontend : JSON con 5 KPIs y estadísticas

deactivate Backend

Frontend -> Frontend : Generar tarjetas KPI\nRenderizar gráficos (Recharts)\nBarChart (ingresos), PieChart (servicios),\nBarChart horizontal (equipos), tabla (stock)

Frontend --> Administrador : Mostrar Dashboard con auto-refresh cada 30s

@enduml
