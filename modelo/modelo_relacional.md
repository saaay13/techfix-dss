```mermaid
erDiagram
    Rol {
        int id PK
        string nombre
        bool activo
    }

    Usuario {
        int id PK
        string nombre
        string apellido
        string email
        string password
        string telefono
        bool activo
        int rol_id FK
    }

    Cliente {
        int id PK
        string nombre
        string apellido
        string telefono
        string correo
        string ci
        bool activo
    }

    Equipo {
        int id PK
        string tipo_equipo
        string marca
        string modelo
        string numero_serie
        string estado_fisico
        bool activo
        int cliente_id FK
    }

    TipoServicio {
        int id PK
        string nombre
        string descripcion
        decimal precio
        bool activo
    }

    OrdenServicio {
        int id PK
        date fecha_ingreso
        string diagnostico_inicial
        string estado
        string prioridad
        date fecha_estimada_entrega
        string observaciones
        decimal costo_total
        int cliente_id FK
        int equipo_id FK
        int usuario_id FK
    }

    ServiceOrderItem {
        int id PK
        int service_order_id FK
        int service_type_id FK
        string descripcion
        decimal precio
    }

    Actividad {
        int id PK
        string nombre
        bool activo
    }

    ActivityLog {
        int id PK
        string descripcion_personalizada
        int service_order_item_id FK
        int activity_id FK
        int usuario_id FK
    }

    StatusHistory {
        int id PK
        int service_order_id FK
        string estado_anterior
        string estado_nuevo
        string nota
        int user_id FK
        datetime created_at
    }

    Categoria {
        int id PK
        string nombre
        bool activo
    }

    Componente {
        int id PK
        string nombre
        string descripcion
        int cantidad
        int stock_minimo
        decimal precio_unitario
        bool activo
        int categoria_id FK
    }

    ComponentSwap {
        int id PK
        string observaciones
        int service_order_id FK
    }

    SwapDetail {
        int id PK
        string tipo
        int cantidad
        int component_swap_id FK
        int componente_id FK
    }

    Pago {
        int id PK
        decimal monto
        string metodo_pago
        date fecha
        int servicio_order_id FK
    }

    Rol ||--o{ Usuario : tiene
    Usuario ||--o{ OrdenServicio : registra
    Usuario ||--o{ ActivityLog : ejecuta
    Usuario ||--o{ StatusHistory : crea
    Cliente ||--o{ Equipo : posee
    Cliente ||--o{ OrdenServicio : tiene
    Equipo ||--o{ OrdenServicio : genera
    OrdenServicio ||--o{ ServiceOrderItem : contiene
    TipoServicio ||--o{ ServiceOrderItem : clasifica
    ServiceOrderItem ||--o{ ActivityLog : contiene
    OrdenServicio ||--o{ StatusHistory : historial
    Actividad ||--o{ ActivityLog : describe
    OrdenServicio ||--o{ ComponentSwap : incluye
    ComponentSwap ||--o{ SwapDetail : tiene
    Componente ||--o{ SwapDetail : referencia
    Categoria ||--o{ Componente : agrupa
    OrdenServicio ||--o{ Pago : registra
```
