```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%

classDiagram

class Cliente {
    +int id
    +string nombre
    +string apellido
    +string telefono
    +string correo
    +string ci
    +bool activo
    +registrar()
    +editar()
}

class Equipo {
    +int id
    +string tipo_equipo
    +string marca
    +string modelo
    +string numero_serie
    +string estado_fisico
    +bool activo
    +registrar()
    +consultarHistorial()
}

class TipoServicio {
    +int id
    +string nombre
    +bool activo
    +listar()
}

class OrdenServicio {
    +int id
    +date fecha_ingreso
    +string diagnostico_inicial
    +string estado
    +string prioridad
    +date fecha_estimada_entrega
    +string observaciones
    +decimal costo_total
    +crear()
    +actualizarEstado()
}

class Actividad {
    +int id
    +string nombre
    +bool activo
}

class ActividadRealizada {
    +int id
    +string descripcion_personalizada
    +registrar()
}

class Categoria {
    +int id
    +string nombre
    +bool activo
}

class Componente {
    +int id
    +string nombre
    +string descripcion
    +int cantidad
    +int stock_minimo
    +decimal precio_unitario
    +bool activo
    +registrar()
    +editar()
    +verificarStockCritico()
}

class ComponenteUtilizado {
    +int id
    +int cantidad
    +decimal precio_unitario
}

class CambioComponente {
    +int id
    +string observaciones
    +registrar()
}

class DetalleCambio {
    +int id
    +string tipo
    +int cantidad
}

class Pago {
    +int id
    +decimal monto
    +string metodo_pago
    +date fecha
    +registrar()
}

class Rol {
    +int id
    +string nombre
    +bool activo
}

class Usuario {
    +int id
    +string nombre
    +string apellido
    +string email
    +string password
    +string telefono
    +bool activo
    +autenticar()
}

Cliente "1" --> "*" Equipo : posee

Equipo "1" --> "*" OrdenServicio : tiene

TipoServicio "1" --> "*" OrdenServicio : clasifica

Rol "1" --> "*" Usuario : asigna

Usuario "1" --> "*" OrdenServicio : registra

OrdenServicio *--> "*" ActividadRealizada : contiene

Actividad "1" --> "*" ActividadRealizada : describe

Usuario "1" --> "*" ActividadRealizada : ejecuta

Categoria "1" --> "*" Componente : agrupa

OrdenServicio *--> "*" ComponenteUtilizado : consume

Componente "1" --> "*" ComponenteUtilizado : registra

OrdenServicio *--> "*" CambioComponente : incluye

CambioComponente "1" --> "*" DetalleCambio : tiene

DetalleCambio "*" --> "1" Componente : referencia

OrdenServicio *--> "*" Pago : registra
```
