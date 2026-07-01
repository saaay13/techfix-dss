# Diccionario de Datos

## Rol

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del rol |
| nombre | varchar(50) | Nombre del rol (Administrador, Técnico) |
| activo | boolean | Estado del registro |

## Usuario

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del usuario |
| nombre | varchar(100) | Nombre del usuario |
| apellido | varchar(100) | Apellido del usuario |
| email | varchar(150) | Correo electrónico del usuario (único) |
| password | varchar(255) | Contraseña cifrada |
| telefono | varchar(20) | Teléfono de contacto |
| activo | boolean | Estado del registro |
| rol_id (FK → Rol.id) | int | Relación con el rol del usuario |

## Cliente

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del cliente |
| nombre | varchar(100) | Nombre del cliente |
| apellido | varchar(100) | Apellido del cliente |
| telefono | varchar(20) | Teléfono de contacto |
| correo | varchar(150) | Correo electrónico (único) |
| ci | varchar(20) | Cédula de identidad (único) |
| activo | boolean | Estado del registro |

## Equipo

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del equipo |
| tipo_equipo | varchar(50) | Tipo (PC, Laptop, PlayStation, Xbox, Nintendo, Celular, Electrónica general) |
| marca | varchar(100) | Marca del equipo |
| modelo | varchar(100) | Modelo del equipo |
| numero_serie | varchar(100) | Número de serie (único) |
| estado_fisico | varchar(50) | Estado físico (Bueno, Regular, Malo) |
| activo | boolean | Estado del registro |
| cliente_id (FK → Cliente.id) | int | Cliente propietario del equipo |

## TipoServicio

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del tipo de servicio |
| nombre | varchar(100) | Nombre (Mantenimiento preventivo, Mantenimiento correctivo, Upgrade, Instalación, Diagnóstico, Recuperación de datos) |
| descripcion | text | Descripción detallada del servicio |
| precio | decimal(10,2) | Precio de referencia del servicio |
| activo | boolean | Estado del registro |

## OrdenServicio

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único de la orden |
| fecha_ingreso | date | Fecha de recepción del equipo |
| diagnostico_inicial | text | Descripción del diagnóstico inicial |
| estado | varchar(50) | Estado (Recibido, Diagnóstico, En reparación, Finalizado, Entregado) |
| prioridad | varchar(20) | Prioridad (Baja, Media, Alta) |
| fecha_estimada_entrega | date | Fecha estimada de entrega |
| observaciones | text | Observaciones adicionales |
| costo_total | decimal(10,2) | Costo total del servicio (suma de precios de items) |
| cliente_id (FK → Cliente.id) | int | Cliente asociado a la orden |
| equipo_id (FK → Equipo.id) | int | Equipo asociado a la orden |
| usuario_id (FK → Usuario.id) | int | Técnico responsable |

## ServiceOrderItem

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del item de servicio |
| service_order_id (FK → OrdenServicio.id) | int | Orden de servicio relacionada |
| service_type_id (FK → TipoServicio.id) | int | Tipo de servicio contratado |
| descripcion | text | Descripción personalizada del servicio |
| precio | decimal(10,2) | Precio del servicio individual |

## Actividad

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único de la actividad predefinida |
| nombre | varchar(100) | Nombre (Limpieza interna, Cambio de pasta térmica, Formateo, Instalación de Windows, Actualización de BIOS) |
| activo | boolean | Estado del registro |

## ActivityLog (Actividad Realizada)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único |
| descripcion_personalizada | text | Descripción adicional de la actividad |
| service_order_item_id (FK → ServiceOrderItem.id) | int | Item de servicio relacionado |
| activity_id (FK → Actividad.id) | int | Actividad ejecutada |
| usuario_id (FK → Usuario.id) | int | Técnico que ejecutó la actividad |

## StatusHistory

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del cambio de estado |
| service_order_id (FK → OrdenServicio.id) | int | Orden de servicio relacionada |
| estado_anterior | varchar(50) | Estado previo al cambio |
| estado_nuevo | varchar(50) | Estado después del cambio |
| nota | text | Nota obligatoria al cambiar a En reparación o Finalizado |
| user_id (FK → Usuario.id) | int | Usuario que realizó el cambio |
| created_at | datetime | Fecha y hora del cambio |

## Categoria

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único de la categoría |
| nombre | varchar(100) | Nombre de la categoría (Almacenamiento, Memoria, Pantallas, Baterías, etc.) |
| activo | boolean | Estado del registro |

## Componente

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del componente |
| nombre | varchar(100) | Nombre del componente (SSD, RAM, Pantalla, etc.) |
| descripcion | text | Descripción detallada |
| cantidad | int | Stock actual |
| stock_minimo | int | Cantidad mínima para alerta de stock crítico |
| precio_unitario | decimal(10,2) | Precio unitario de venta |
| activo | boolean | Estado del registro |
| categoria_id (FK → Categoria.id) | int | Categoría del componente |

## ComponentSwap (Cambio de Componente)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del cambio |
| observaciones | text | Observaciones del cambio |
| service_order_id (FK → OrdenServicio.id) | int | Orden de servicio relacionada |

## SwapDetail (Detalle de Cambio)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del detalle |
| tipo | varchar(20) | Tipo (retirado, instalado) |
| cantidad | int | Cantidad de componentes |
| component_swap_id (FK → ComponentSwap.id) | int | Cambio de componente relacionado |
| componente_id (FK → Componente.id) | int | Componente referenciado |

## Pago

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del pago |
| monto | decimal(10,2) | Monto del pago |
| metodo_pago | varchar(50) | Método (Efectivo, Transferencia, Tarjeta, QR) |
| fecha | date | Fecha del pago |
| servicio_order_id (FK → OrdenServicio.id) | int | Orden de servicio relacionada |
