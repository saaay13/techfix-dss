# TECHFIX DSS
## Sistema Inteligente de Gestión y Análisis para Servicios Técnicos


## 1. Contexto Estratégico

### Descripción del problema

Los talleres y servicios técnicos de computadoras, laptops, consolas y equipos electrónicos suelen registrar reparaciones manualmente o mediante herramientas no especializadas. Esto ocasiona problemas en el seguimiento de servicios, control de inventario y análisis del negocio.

La ausencia de información analítica dificulta responder preguntas importantes como:
- ¿Qué servicios son más rentables?
- ¿Qué componentes deben reponerse con mayor frecuencia?
- ¿Qué equipos presentan más fallas?
- ¿Cuál es el tiempo promedio de reparación?
- ¿Qué clientes son recurrentes?

Como consecuencia, las decisiones operativas y comerciales se realizan sin apoyo de datos históricos.

### Árbol de Problemas

```
                        ┌─────────────────────────────┐
                        │   Pérdidas económicas        │
                        ├─────────────────────────────┤
                        │   Compras ineficientes de    │
                        │   repuestos                  │
                        ├─────────────────────────────┤
                        │   Retrasos en reparaciones   │
                        ├─────────────────────────────┤
                        │   Baja satisfacción del      │
                        │   cliente                    │
                        ├─────────────────────────────┤
                        │   Dificultad para evaluar    │
                        │   rentabilidad del negocio   │
                        └──────────────┬──────────────┘
                                       │
                        ┌──────────────▼──────────────┐
                        │     INEFICIENTE GESTIÓN     │
                        │     Y ANÁLISIS DE           │
              ┌─────────┤  SERVICIOS TÉCNICOS         ├─────────┐
              │         └──────────────┬──────────────┘         │
              │                        │                        │
    ┌─────────▼──────────┐  ┌─────────▼──────────┐  ┌─────────▼──────────┐
    │ Registro manual    │  │ Falta de historial  │  │ Ausencia de        │
    │ o disperso de      │  │ centralizado de     │  │ control de         │
    │ reparaciones       │  │ equipos             │  │ inventario         │
    └────────────────────┘  └────────────────────┘  └────────────────────┘
    ┌────────────────────┐  ┌────────────────────┐
    │ No existe          │  │ Falta de            │
    │ seguimiento        │  │ indicadores para    │
    │ detallado de       │  │ apoyar decisiones   │
    │ actividades        │  │                     │
    └────────────────────┘  └────────────────────┘
```

### Árbol de Soluciones

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Sistema centralizado│  │ Historial completo  │  │ Control de inventario│
│ de registro de      │  │ por equipo (serie,  │  │ automatizado con     │
│ reparaciones        │  │ cliente, servicios) │  │ alertas de stock     │
└─────────┬───────────┘  └─────────┬───────────┘  └─────────┬───────────┘
          │                        │                        │
┌─────────▼───────────┐  ┌─────────▼───────────┐
│ Seguimiento         │  │ Dashboard con KPIs  │
│ detallado de        │  │ y análisis de datos │
│ actividades y estados│  │ históricos          │
└─────────┬───────────┘  └─────────┬───────────┘
          │                        │
          └────────────┬───────────┘
                       │
          ┌────────────▼────────────┐
          │   GESTIÓN EFICIENTE Y   │
          │   ANÁLISIS ESTRATÉGICO  │
          │   DE SERVICIOS TÉCNICOS │
          └────────────┬────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│  • Reducción de pérdidas económicas             │
│  • Compras optimizadas de repuestos             │
│  • Reparaciones más rápidas                     │
│  • Mayor satisfacción del cliente               │
│  • Decisiones basadas en datos históricos       │
│  • Rentabilidad del negocio evaluable           │
└─────────────────────────────────────────────────┘
```

### Objetivo SMART

Desarrollar un sistema DSS para la gestión de servicios técnicos electrónicos que permita registrar órdenes de servicio, controlar inventario y generar indicadores analíticos sobre rentabilidad, demanda e inventario, mejorando la toma de decisiones y reduciendo en un 20% el tiempo administrativo durante un período de tres meses.

---

## 2. Definición del MVP

### Cuadro Es / No es / Hace / No hace

| Es | No es |
|---|---|
| Sistema DSS para servicios técnicos | Sistema de comercio electrónico |
| Sistema de inventario técnico | Red social |
| Sistema de análisis y reportes | ERP empresarial completo |

| Hace | No hace |
|---|---|
| Registra reparaciones | Vende productos en línea |
| Genera reportes y dashboards | Gestiona envíos |
| Controla inventario | Procesa pagos bancarios |
| Imprime hojas de servicio | Gestiona múltiples sucursales |

### Canvas MVP

**Segmentos de Clientes**
- Talleres de reparación electrónica.
- Técnicos independientes.
- Servicios técnicos de computadoras.
- Servicios técnicos de consolas.
- Empresas de soporte informático.

**Propuesta de Valor**
- Centralización de información.
- Historial completo de equipos.
- Control automatizado de inventario.
- Seguimiento de actividades realizadas.
- Generación automática de hojas de servicio.
- KPIs para apoyar la toma de decisiones.
- Mejora de la rentabilidad del negocio.

**Canales**
- Aplicación web (React + TypeScript).
- Reportes PDF.
- Correo electrónico.
- Atención presencial en el taller.

**Relación con Clientes**
- Seguimiento del estado de reparación.
- Entrega de hoja de servicio en PDF.
- Atención personalizada.
- Historial por equipo y cliente.
- Observaciones y recomendaciones técnicas.

**Fuentes de Ingresos**
- Licencia mensual.
- Suscripción anual.
- Plan básico gratuito.
- Plan premium.
- Implementación inicial (pago único).
- Capacitación opcional.

**Recursos Clave**
- Plataforma web TechFix DSS.
- MySQL.
- Laravel.
- React + TypeScript + Tailwind CSS.
- Dashboard analítico.
- Inventario de componentes.
- Técnicos y administradores.

**Actividades Clave**
- CRUD de órdenes de servicio.
- CRUD de clientes.
- CRUD de equipos.
- Control de inventario.
- Registro de actividades técnicas.
- Gestión de upgrades.
- Generación de PDF.
- Dashboards DSS.

**Socios Clave**
- Proveedores de componentes electrónicos.
- Proveedores de infraestructura cloud.
- Empresas de soporte tecnológico.
- Proveedores de licencias.
- Servicios de correo electrónico.

**Estructura de Costos**
- Desarrollo del software.
- Hosting y servidor.
- Mantenimiento del sistema.
- Licencias de software.
- Infraestructura tecnológica.
- Capacitación de usuarios.
- Mantenimiento de la base de datos.

---

## 3. Product Backlog — Épicas e Historias de Usuario

### Épica E1 — Gestión de Clientes y Equipos

**HU-01: Registrar cliente**
Como administrador quiero registrar un cliente con nombre, teléfono y correo para tener su información centralizada.
- Criterios de aceptación:
  - Nombre, teléfono y correo son obligatorios.
  - El correo debe tener formato válido.
  - No se permiten correos duplicados.

**HU-02: Registrar equipo**
Como técnico quiero registrar un equipo con tipo, marca, modelo y serie para tener un historial por cada equipo.
- Criterios de aceptación:
  - Tipo de equipo se selecciona de una lista predefinida (PC, Laptop, PlayStation, Xbox, Nintendo, Celular, Electrónica general).
  - Número de serie es único.
  - Estado físico es opcional.

**HU-03: Consultar historial de servicios de un equipo**
Como técnico quiero consultar el historial de servicios de un equipo para conocer reparaciones anteriores.
- Criterios de aceptación:
  - Se muestra el listado de órdenes asociadas al equipo.
  - Cada orden muestra fecha, diagnóstico y estado.
  - Las órdenes se ordenan de más reciente a más antigua.

### Épica E2 — Gestión de Órdenes de Servicio

**HU-04: Crear orden de servicio**
Como técnico quiero crear una orden de servicio con diagnóstico y prioridad para iniciar el proceso de reparación.
- Criterios de aceptación:
  - La orden se asocia a un cliente y un equipo existentes.
  - Los estados siguen el flujo: Recibido → Diagnóstico → En reparación → Finalizado → Entregado.
  - La prioridad puede ser Baja, Media o Alta.

**HU-05: Actualizar estado de una orden**
Como técnico quiero actualizar el estado de una orden para reflejar el avance de la reparación.
- Criterios de aceptación:
  - Solo se puede avanzar al siguiente estado del flujo.
  - Se registra la fecha y hora del cambio.
  - Es obligatorio agregar una nota al cambiar a "En reparación" o "Finalizado".

**HU-06: Registrar actividad realizada**
Como técnico quiero registrar una actividad realizada en una orden para dejar evidencia del trabajo.
- Criterios de aceptación:
  - Las actividades se seleccionan de una lista predefinida (Limpieza interna, Cambio de pasta térmica, Formateo, Instalación de Windows, Actualización de BIOS).
  - Se puede agregar una descripción personalizada.
  - Cada actividad se asocia a una orden de servicio.

**HU-07: Registrar cambio de componente**
Como técnico quiero registrar un cambio de componente (retirado e instalado) para documentar actualizaciones del equipo.
- Criterios de aceptación:
  - Se selecciona componente retirado del inventario.
  - Se selecciona o registra componente instalado.
  - Opción de indicar si el componente retirado se devolvió al cliente.

**HU-08: Registrar pago**
Como administrador quiero registrar un pago asociado a una orden para llevar control de ingresos.
- Criterios de aceptación:
  - Se ingresa monto, método de pago y fecha.
  - El pago se asocia a una orden de servicio.
  - Una orden puede tener uno o varios pagos parciales.

### Épica E3 — Gestión de Inventario

**HU-09: Registrar componente en inventario**
Como administrador quiero registrar un componente en el inventario con nombre, cantidad y precio para conocer el stock disponible.
- Criterios de aceptación:
  - Nombre, cantidad y precio son obligatorios.
  - Cantidad debe ser un número entero positivo.
  - Se puede editar y eliminar componentes.

**HU-10: Visualizar alertas de stock crítico**
Como administrador quiero visualizar alertas de stock crítico para saber qué componentes necesito reponer.
- Criterios de aceptación:
  - Se muestra una alerta visual cuando el stock es menor al mínimo configurable.
  - El mínimo se configura por componente.
  - Los componentes críticos aparecen destacados en el dashboard.

### Épica E4 — Dashboard y Reportes

**HU-11: Generar hoja de servicio PDF**
Como administrador quiero generar una hoja de servicio en PDF para entregarla al cliente como evidencia.
- Criterios de aceptación:
  - El PDF incluye: datos del cliente, datos del equipo, diagnóstico, actividades realizadas, componentes usados, costo total y firmas.
  - El PDF se puede descargar e imprimir.

**HU-12: Visualizar dashboard DSS**
Como administrador quiero ver un dashboard con KPIs para tomar decisiones basadas en datos históricos.
- Criterios de aceptación:
  - El dashboard muestra al menos 5 KPIs (ingresos por mes, servicios más realizados, equipos con más fallas, stock crítico, órdenes pendientes).
  - Los datos se actualizan automáticamente al cambiar la información.
  - El dashboard usa gráficos (Chart.js o Recharts).

### Épica E5 — Seguridad y Acceso al Sistema

**HU-13: Iniciar sesión**
Como usuario quiero iniciar sesión con correo y contraseña para acceder al sistema de forma segura.
- Criterios de aceptación:
  - El correo y la contraseña son obligatorios.
  - Se valida que el usuario esté registrado y activo.
  - El acceso se protege con autenticación (Sanctum).

**HU-14: Gestionar usuarios**
Como administrador quiero gestionar los usuarios del sistema para controlar quién tiene acceso.
- Criterios de aceptación:
  - CRUD completo de usuarios (nombre, correo, rol, activo).
  - Solo un administrador puede crear, editar o desactivar usuarios.
  - El correo debe ser único.

**HU-15: Control de acceso por roles**
Como administrador quiero asignar roles a los usuarios para restringir funcionalidades según su perfil.
- Criterios de aceptación:
  - Los roles disponibles son Administrador y Técnico.
  - Solo los administradores pueden acceder a gestión de usuarios y configuración.
  - El backend valida el rol en cada petición.

### Épica E6 — Servicios y Actividades

**HU-16: Gestionar tipos de servicio**
Como administrador quiero gestionar los tipos de servicio para categorizar las órdenes.
- Criterios de aceptación:
  - CRUD completo de tipos de servicio (nombre, descripción, precio).
  - Solo los tipos activos aparecen en los selectores de la orden.
  - Borrado lógico (activo).

**HU-17: Gestionar actividades**
Como administrador quiero gestionar las actividades para tener un listado disponible al registrarlas en las órdenes.
- Criterios de aceptación:
  - CRUD completo de actividades (nombre).
  - Borrado lógico (activo).
  - El listado muestra solo actividades activas por defecto.
--------------------------------------------------------------------------
**HU-XX: Verificar Definition of Done al completar HU**
Como desarrollador quiero pasar una checklist de verificación final antes de dar por terminada una historia de usuario para asegurar la calidad.
- Criterios de aceptación:
  - Existe un checklist estándar (criterios cumplidos, peer review, pruebas, sin conflictos, develop actualizado).
  - Al marcar una HU como completada, se debe llenar la checklist.
  - No se puede cerrar la HU sin todos los ítems marcados.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React + TypeScript + Tailwind CSS |
| **Backend** | Laravel (PHP) |
| **Base de datos** | MySQL |
| **Dashboard** | Chart.js / Recharts |
| **PDF** | jsPDF / PDFKit |

## Estructura del Proyecto

| Carpeta/Archivo | Descripción |
|----------------|-------------|
| `README.md` | Este archivo |
| `modelo/` | Diagramas UML y modelo de datos |
| `.gitignore` | Archivos ignorados por Git |

## ODS Relacionados

- **ODS 8:** Trabajo decente y crecimiento económico
- **ODS 9:** Industria, innovación e infraestructura

## Enlaces

- **Repositorio:** [https://github.com/saaay13/techfix-dss](https://github.com/saaay13/techfix-dss)
- **GitHub Projects:** [https://github.com/users/saaay13/projects/11](https://github.com/saaay13/techfix-dss/projects/1)