@startuml
title HU-12 - Visualizar Dashboard DSS

actor Administrador

boundary "Dashboard (React)" as Frontend
control "DashboardController\n(Laravel API)" as Backend
database "Base de Datos" as DB

Administrador -> Frontend : Ingresa al Dashboard

Frontend -> Backend : GET /api/dashboard

activate Backend

Backend -> DB : Obtener ingresos por mes\nSUM(monto) GROUP BY mes
DB --> Backend : Datos de ingresos

Backend -> DB : Obtener servicios más realizados\nCOUNT(*) GROUP BY tipo_servicio
DB --> Backend : Datos de servicios

Backend -> DB : Obtener equipos con más fallas\nCOUNT(*) GROUP BY equipo_id
DB --> Backend : Datos de equipos

Backend -> DB : Obtener stock crítico\ncantidad <= stock_minimo
DB --> Backend : Lista de componentes

Backend -> DB : Obtener órdenes pendientes\nCOUNT WHERE estado != 'Entregado'
DB --> Backend : Total de órdenes

Backend --> Frontend : JSON con KPIs y estadísticas

deactivate Backend

Frontend -> Frontend : Generar tarjetas KPI\nRenderizar gráficos (Chart.js/Recharts)

Frontend --> Administrador : Mostrar Dashboard

@enduml 