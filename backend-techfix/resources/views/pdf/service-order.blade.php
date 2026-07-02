<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hoja de Servicio #{{ $order->id }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #333; margin: 0; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e3a5f; padding-bottom: 15px; margin-bottom: 20px; }
        .header .logo img { max-height: 60px; }
        .header .title { text-align: right; }
        .header .title h1 { font-size: 22px; color: #1e3a5f; margin: 0; }
        .header .title p { font-size: 11px; color: #666; margin: 2px 0; }
        .info-grid { display: flex; gap: 20px; margin-bottom: 20px; }
        .info-box { flex: 1; border: 1px solid #ddd; border-radius: 6px; padding: 12px; }
        .info-box h3 { font-size: 13px; color: #1e3a5f; margin: 0 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .info-box p { margin: 3px 0; font-size: 11px; }
        .info-box .label { color: #888; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #1e3a5f; color: #fff; padding: 8px 10px; text-align: left; font-size: 11px; }
        td { padding: 7px 10px; border-bottom: 1px solid #eee; font-size: 11px; }
        .total-row td { font-weight: bold; background: #f8f9fa; font-size: 13px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
        .signatures .sign { text-align: center; width: 200px; }
        .signatures .line { border-top: 1px solid #333; margin-top: 40px; padding-top: 8px; font-size: 11px; }
        .footer { text-align: center; font-size: 10px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 10px; font-weight: bold; }
        .badge-recibido { background: #fff3cd; color: #856404; }
        .badge-progreso { background: #cce5ff; color: #004085; }
        .badge-completado { background: #d4edda; color: #155724; }
        .badge-entregado { background: #d6d8db; color: #383d41; }
        .estados-table td { vertical-align: top; }
        .completed { color: #155724; }
        .pending { color: #856404; }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo">
            <img src="{{ public_path('logo.svg') }}" alt="TechFix Logo">
        </div>
        <div class="title">
            <h1>Hoja de Servicio</h1>
            <p>Orden #{{ $order->id }}</p>
            <p>Fecha: {{ \Carbon\Carbon::parse($order->fecha_ingreso)->format('d/m/Y') }}</p>
            <p>
                Estado:
                <span class="badge badge-{{ $order->estado === 'Recibido' ? 'recibido' : ($order->estado === 'En reparación' ? 'progreso' : ($order->estado === 'Finalizado' ? 'completado' : 'entregado')) }}">
                    {{ $order->estado }}
                </span>
            </p>
        </div>
    </div>

    <div class="info-grid">
        <div class="info-box">
            <h3>Datos del Cliente</h3>
            <p><span class="label">Nombre:</span> {{ $order->client->nombre }} {{ $order->client->apellido }}</p>
            <p><span class="label">Teléfono:</span> {{ $order->client->telefono }}</p>
            <p><span class="label">Correo:</span> {{ $order->client->correo }}</p>
            <p><span class="label">CI:</span> {{ $order->client->ci }}</p>
        </div>
        <div class="info-box">
            <h3>Datos del Equipo</h3>
            <p><span class="label">Tipo:</span> {{ $order->device->tipo_equipo }}</p>
            <p><span class="label">Marca:</span> {{ $order->device->marca }}</p>
            <p><span class="label">Modelo:</span> {{ $order->device->modelo }}</p>
            <p><span class="label">Serie:</span> {{ $order->device->numero_serie }}</p>
        </div>
        <div class="info-box">
            <h3>Diagnóstico</h3>
            <p>{{ $order->diagnostico_inicial }}</p>
            @if($order->observaciones)
                <p><span class="label">Observaciones:</span> {{ $order->observaciones }}</p>
            @endif
            <p><span class="label">Prioridad:</span> {{ $order->prioridad }}</p>
            <p><span class="label">Técnico:</span> {{ $order->user->name }}</p>
        </div>
    </div>

    <h3 style="color:#1e3a5f; margin-bottom:8px;">Servicios Realizados</h3>
    <table>
        <thead>
            <tr>
                <th>Servicio</th>
                <th>Descripción</th>
                <th>Precio</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->serviceType->nombre ?? '—' }}</td>
                    <td>{{ $item->descripcion ?? '—' }}</td>
                    <td>Bs. {{ number_format($item->precio, 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="2" style="text-align:right;">Total Servicios</td>
                <td>Bs. {{ number_format($order->items->sum('precio'), 2) }}</td>
            </tr>
        </tbody>
    </table>

    @php
        $allLogs = $order->items->flatMap->activityLogs;
    @endphp
    @if($allLogs->count() > 0)
        <h3 style="color:#1e3a5f; margin-bottom:8px;">Actividades Realizadas</h3>
        <table>
            <thead>
                <tr>
                    <th>Actividad</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Realizado por</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                @foreach($allLogs as $log)
                    <tr>
                        <td>{{ $log->activity->nombre ?? '—' }}</td>
                        <td>{{ $log->serviceOrderItem->serviceType->nombre ?? '—' }}</td>
                        <td class="{{ $log->completed ? 'completed' : 'pending' }}">{{ $log->completed ? 'Completado' : 'Pendiente' }}</td>
                        <td>{{ $log->user->name ?? '—' }}</td>
                        <td>{{ $log->created_at ? \Carbon\Carbon::parse($log->created_at)->format('d/m/Y H:i') : '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if($order->componentUsages->count() > 0)
        <h3 style="color:#1e3a5f; margin-bottom:8px;">Componentes Utilizados</h3>
        <table>
            <thead>
                <tr>
                    <th>Componente</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @php $subtotalComponents = 0; @endphp
                @foreach($order->componentUsages as $usage)
                    @php
                        $subtotal = $usage->cantidad * $usage->precio_unitario;
                        $subtotalComponents += $subtotal;
                    @endphp
                    <tr>
                        <td>{{ $usage->component->nombre ?? '—' }}</td>
                        <td>{{ $usage->cantidad }}</td>
                        <td>Bs. {{ number_format($usage->precio_unitario, 2) }}</td>
                        <td>Bs. {{ number_format($subtotal, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h3 style="color:#1e3a5f; margin-bottom:8px;">Resumen de Costos</h3>
    <table>
        <tbody>
            @php
                $serviceCost = $order->items->sum('precio');
                $componentCost = $order->componentUsages->sum(fn($u) => $u->cantidad * $u->precio_unitario);
            @endphp
            <tr>
                <td style="width:70%;">Servicios</td>
                <td style="width:30%;">Bs. {{ number_format($serviceCost, 2) }}</td>
            </tr>
            @if($componentCost > 0)
            <tr>
                <td>Componentes</td>
                <td>Bs. {{ number_format($componentCost, 2) }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td>Costo Total</td>
                <td>Bs. {{ number_format($serviceCost + $componentCost, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="signatures">
        <div class="sign">
            <div class="line">Firma del Técnico</div>
            <p style="font-size:10px; color:#666; margin-top:4px;">{{ $order->user->name }}</p>
        </div>
        <div class="sign">
            <div class="line">Firma del Cliente</div>
            <p style="font-size:10px; color:#666; margin-top:4px;">{{ $order->client->nombre }} {{ $order->client->apellido }}</p>
        </div>
    </div>

    <div class="footer">
        <p>TechFix Taller de Reparación — {{ now()->format('d/m/Y H:i') }}</p>
        <p>Documento generado electrónicamente.</p>
    </div>

</body>
</html>
