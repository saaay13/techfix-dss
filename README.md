# TECHFIX DSS

## Definition of Done (DoD)

Una historia de usuario se considera **terminada** cuando cumple todos los siguientes criterios:

### Calidad de Código
- [ ] El código sigue los estándares PSR-12 (PHP) y ESLint (TypeScript/React)
- [ ] No hay errores de sintaxis ni advertencias del linter
- [ ] Las variables y funciones usan nomenclatura camelCase (PHP/TS) y snake_case (BD)
- [ ] El código está formateado correctamente

### Pruebas
- [ ] La funcionalidad fue probada manualmente en el navegador
- [ ] No se rompen funcionalidades existentes (regresión)
- [ ] Los datos se guardan y consultan correctamente en la BD

### Documentación
- [ ] Los diagramas UML están actualizados si hubo cambios estructurales
- [ ] Las rutas API nuevas están documentadas en el código
- [ ] Las migraciones reflejan el modelo de datos actual

### Requisitos de Negocio
- [ ] La historia cumple con todos sus criterios de aceptación
- [ ] Los mensajes de error son claros para el usuario
- [ ] La interfaz es funcional y responsive

### Control de Versiones
- [ ] La rama feature fue fusionada a develop
- [ ] El commit sigue el formato: `Feat: HU-XX descripción`
- [ ] No hay conflictos con develop

## Acuerdos de Trabajo (Squad)

### Daily Scrum
- **Horario:** 7:15 PM (15 minutos máximo)
- **Canal:** WhatsApp 

### Flujo de Git
- **Rama principal:** `main` (producción)
- **Rama de integración:** `develop`
- **Ramas feature:** `feature/nombre-del-feature`
- **Commits:** Formato `Feat: HU-XX descripción`
- **Pull Requests:** Al menos 1 revisión por cada PR a develop
- **Merge:** Se fusiona a develop

### Estándares de Nomenclatura
| Capa                             | Convención                 | Ejemplo                        |
|----------------------------------|----------------------------|--------------------------------|
| PHP (variables, funciones)       | camelCase                  | `registrarCliente()`           |
| Base de datos (tablas, columnas) | snake_case                 | `service_orders`               |
| TypeScript/React (variables)     | camelCase                  | `getUsers()`                   |
| Componentes React                | PascalCase                 | `ClientForm.tsx`               |
| Archivos de migración            | timestamp + snake_case     | `2024_01_01_create_users_table`|
| Rutas API                        | kebab-case                 | `/api/service-orders`          |
