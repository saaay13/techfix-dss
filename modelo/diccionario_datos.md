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
| activo | boolean | Estado del registro |

## OrdenServicio

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único de la orden |
| fecha_ingreso | date | Fecha de recepción del equipo |
| diagnostico_inicial | text | Descripción del diagnóstico inicial |
| estado | varchar(50) | Estado (Recibido, Diagnóstico, En reparación, Esperando repuestos, Finalizado, Entregado) |
| prioridad | varchar(20) | Prioridad (Baja, Media, Alta) |
| fecha_estimada_entrega | date | Fecha estimada de entrega |
| observaciones | text | Observaciones adicionales |
| costo_total | decimal(10,2) | Costo total del servicio |
| cliente_id (FK → Cliente.id) | int | Cliente asociado a la orden |
| equipo_id (FK → Equipo.id) | int | Equipo asociado a la orden |
| tipo_servicio_id (FK → TipoServicio.id) | int | Tipo de servicio solicitado |
| usuario_id (FK → Usuario.id) | int | Técnico responsable |

## Actividad

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único de la actividad predefinida |
| nombre | varchar(100) | Nombre (Limpieza interna, Cambio de pasta térmica, Formateo, Instalación de Windows, Actualización de BIOS) |
| activo | boolean | Estado del registro |

## ActividadRealizada

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único |
| descripcion_personalizada | text | Descripción adicional de la actividad |
| orden_servicio_id (FK → OrdenServicio.id) | int | Orden de servicio relacionada |
| actividad_id (FK → Actividad.id) | int | Actividad ejecutada |
| usuario_id (FK → Usuario.id) | int | Técnico que ejecutó la actividad |

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

## ComponenteUtilizado

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único |
| cantidad | int | Cantidad utilizada |
| precio_unitario | decimal(10,2) | Precio unitario al momento del uso |
| orden_servicio_id (FK → OrdenServicio.id) | int | Orden de servicio relacionada |
| componente_id (FK → Componente.id) | int | Componente utilizado |

## CambioComponente

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del cambio |
| observaciones | text | Observaciones del cambio |
| orden_servicio_id (FK → OrdenServicio.id) | int | Orden de servicio relacionada |

## DetalleCambio

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del detalle |
| tipo | varchar(20) | Tipo (retirado, instalado) |
| cantidad | int | Cantidad de componentes |
| cambio_componente_id (FK → CambioComponente.id) | int | Cambio de componente relacionado |
| componente_id (FK → Componente.id) | int | Componente referenciado |

## Pago

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id (PK) | int | Identificador único del pago |
| monto | decimal(10,2) | Monto del pago |
| metodo_pago | varchar(50) | Método (Efectivo, Transferencia, Tarjeta, QR) |
| fecha | date | Fecha del pago |
| orden_servicio_id (FK → OrdenServicio.id) | int | Orden de servicio relacionada |
