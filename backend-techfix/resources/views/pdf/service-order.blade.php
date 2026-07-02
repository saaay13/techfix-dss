<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hoja de Servicio #{{ $order->id }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #333; margin: 0; padding: 15px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px; margin-bottom: 10px; }
        .header .logo img { max-height: 40px; }
        .header .title { text-align: right; }
        .header .title h1 { font-size: 18px; color: #1e3a5f; margin: 0; }
        .header .title p { font-size: 9px; color: #666; margin: 1px 0; }
        .info-grid { display: flex; gap: 8px; margin-bottom: 10px; }
        .info-box { flex: 1; border: 1px solid #ddd; border-radius: 4px; padding: 6px 8px; }
        .info-box h3 { font-size: 10px; color: #1e3a5f; margin: 0 0 4px 0; border-bottom: 1px solid #eee; padding-bottom: 3px; }
        .info-box p { margin: 1px 0; font-size: 9px; }
        .info-box .label { color: #888; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        th { background: #1e3a5f; color: #fff; padding: 4px 6px; text-align: left; font-size: 9px; }
        td { padding: 3px 6px; border-bottom: 1px solid #eee; font-size: 9px; }
        .total-row td { font-weight: bold; background: #f8f9fa; font-size: 10px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 20px; gap: 40px; }
        .signatures .sign { text-align: center; flex: 1; }
        .signatures .line { border-top: 1px solid #333; margin-top: 30px; padding-top: 4px; font-size: 9px; }
        .footer { text-align: center; font-size: 8px; color: #999; margin-top: 15px; border-top: 1px solid #eee; padding-top: 6px; }
        .section-title { color: #1e3a5f; font-size: 11px; margin: 0 0 4px 0; }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo">
            <img src="{{ public_path('logo.svg') }}" alt="TechFix Logo">
        </div>
        <div class="title">
            <h1>Hoja de Servicio</h1>
            <p>Fecha de Ingreso: {{ \Carbon\Carbon::parse($order->fecha_ingreso)->format('d/m/Y') }}</p>
        </div>
    </div>

    <div class="info-grid">
        <div class="info-box">
            <h3>Cliente</h3>
            <p><span class="label">Nombre:</span> {{ $order->client->nombre }} {{ $order->client->apellido }}</p>
            <p><span class="label">Teléfono:</span> {{ $order->client->telefono }}</p>
            <p><span class="label">Correo:</span> {{ $order->client->correo }}</p>
            <p><span class="label">CI:</span> {{ $order->client->ci }}</p>
        </div>
        <div class="info-box">
            <h3>Equipo</h3>
            <p><span class="label">Tipo:</span> {{ $order->device->tipo_equipo }}</p>
            <p><span class="label">Marca:</span> {{ $order->device->marca }}</p>
            <p><span class="label">Modelo:</span> {{ $order->device->modelo }}</p>
            <p><span class="label">Serie:</span> {{ $order->device->numero_serie }}</p>
        </div>
        <div class="info-box">
            <h3>Diagnóstico</h3>
            <p>{{ $order->diagnostico_inicial }}</p>
            @if($order->observaciones)
                <p><span class="label">Obs.:</span> {{ $order->observaciones }}</p>
            @endif
            <p><span class="label">Técnico:</span> {{ $order->user->name }}</p>
        </div>
    </div>

    <h3 class="section-title">Servicios Realizados</h3>
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
                    <td style="vertical-align:top"><strong>{{ $item->serviceType->nombre ?? '—' }}</strong></td>
                    <td style="vertical-align:top">{{ $item->descripcion ?? '—' }}</td>
                    <td style="text-align:right;vertical-align:top">Bs. {{ number_format($item->precio, 2) }}</td>
                </tr>
                @if($item->activityLogs->count() > 0)
                    <tr>
                        <td colspan="3" style="padding:0 6px 4px 6px; border-bottom:1px solid #eee;">
                            <table style="width:100%; margin:2px 0;">
                                @foreach($item->activityLogs as $log)
                                    <tr>
                                        <td style="padding:1px 0; border:none; font-size:8px; width:16px; vertical-align:middle; text-align:center;">
                                            {{ $log->completed ? '✓' : '○' }}
                                        </td>
                                        <td style="padding:1px 4px; border:none; font-size:8px; {{ $log->completed ? 'color:#155724;' : 'color:#856404;' }}">
                                            {{ $log->activity->nombre ?? '—' }}
                                        </td>
                                        <td style="padding:1px 0; border:none; font-size:8px; text-align:right; color:#888;">
                                            {{ $log->user->name ?? '—' }}
                                        </td>
                                    </tr>
                                @endforeach
                            </table>
                        </td>
                    </tr>
                @endif
            @endforeach
            <tr class="total-row">
                <td colspan="2" style="text-align:right">Total Servicios</td>
                <td style="text-align:right">Bs. {{ number_format($order->items->sum('precio'), 2) }}</td>
            </tr>
        </tbody>
    </table>

    @if($order->componentUsages->count() > 0)
        <h3 class="section-title">Componentes Utilizados</h3>
        <table>
            <thead>
                <tr>
                    <th>Componente</th>
                    <th style="text-align:center">Cant.</th>
                    <th style="text-align:right">P. Unit.</th>
                    <th style="text-align:right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->componentUsages as $usage)
                    @php $subtotal = $usage->cantidad * $usage->precio_unitario; @endphp
                    <tr>
                        <td>{{ $usage->component->nombre ?? '—' }}</td>
                        <td style="text-align:center">{{ $usage->cantidad }}</td>
                        <td style="text-align:right">Bs. {{ number_format($usage->precio_unitario, 2) }}</td>
                        <td style="text-align:right">Bs. {{ number_format($subtotal, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h3 class="section-title">Resumen de Costos</h3>
    <table>
        <tbody>
            @php
                $serviceCost = $order->items->sum('precio');
                $componentCost = $order->componentUsages->sum(fn($u) => $u->cantidad * $u->precio_unitario);
            @endphp
            <tr>
                <td style="width:80%">Servicios</td>
                <td style="width:20%;text-align:right">Bs. {{ number_format($serviceCost, 2) }}</td>
            </tr>
            @if($componentCost > 0)
            <tr>
                <td>Componentes</td>
                <td style="text-align:right">Bs. {{ number_format($componentCost, 2) }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td>Costo Total</td>
                <td style="text-align:right">Bs. {{ number_format($serviceCost + $componentCost, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <table style="width:100%; margin-top:20px;">
        <tr>
            <td style="text-align:center; width:50%;">
                <div style="border-top:1px solid #333; width:80%; margin:30px auto 0; padding-top:4px; font-size:9px;">Firma del Técnico</div>
                <p style="font-size:8px; color:#666; margin-top:2px;">{{ $order->user->name }}</p>
            </td>
            <td style="text-align:center; width:50%;">
                <div style="border-top:1px solid #333; width:80%; margin:30px auto 0; padding-top:4px; font-size:9px;">Firma del Cliente</div>
                <p style="font-size:8px; color:#666; margin-top:2px;">{{ $order->client->nombre }} {{ $order->client->apellido }}</p>
            </td>
        </tr>
    </table>

    <div class="footer">
        <p>TechFix Taller de Reparación — {{ now()->format('d/m/Y H:i') }}</p>
        <p>Código: {{ $order->codigo_orden }}</p>
    </div>

</body>
</html>
