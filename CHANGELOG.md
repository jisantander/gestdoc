# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [2.0.0] - 2025-01-11

### 🎉 Lanzamiento Mayor - Modernización Completa

Esta versión representa una refactorización completa del proyecto GESTDOC con actualizaciones de todas las dependencias principales y mejoras significativas en arquitectura, seguridad y mantenibilidad.

### ✨ Agregado

#### Infraestructura
- Estructura de monorepo con workspaces de npm
- Paquete `@gestdoc/shared` con utilidades compartidas
- Docker Compose para desarrollo local
- Scripts de migración automática
- Configuración de ESLint y Prettier
- EditorConfig para consistencia de código

#### Utilidades Compartidas
- Validaciones: email, RUT chileno, ObjectId, rangos de fecha
- Formateo: RUT, fechas, moneda, tamaño de archivos
- Constantes: estados, roles, códigos HTTP, mensajes de error
- Tipos y configuraciones compartidas

#### Servicios
- Servicio S3 moderno con AWS SDK v3
- Mejor manejo de errores en autenticación JWT
- Documentación JSDoc en funciones principales

#### Configuración
- Archivos `.env.example` para todos los backends
- Configuración de desarrollo con hot reload
- Variables de entorno documentadas

#### Documentación
- Guía de migración completa (MIGRATION_GUIDE.md)
- Resumen de actualizaciones (UPGRADE_SUMMARY.md)
- Resumen de refactorización (REFACTORING_SUMMARY.md)
- README actualizado con instrucciones completas
- Documentación de arquitectura y dependencias

### 🔄 Cambiado

#### Dependencias Principales
- **Node.js**: 12.7.0 → 18.0.0+ LTS
- **React**: 16.13.1 / 17.0.1 → 18.2.0
- **Material-UI v4** → **MUI v5** (@mui/material 5.15.4)
- **React Router**: v5 → v6
- **Mongoose**: 5.x → 8.0.3
- **Express**: 4.15.3 / 4.17.1 → 4.18.2
- **AWS SDK**: v2 → v3 (modular)
- **Sentry**: 6.15.0 → 7.100.0

#### Paquetes Reemplazados
- `bcrypt-nodejs` → `bcrypt` 5.1.1 (más seguro)
- `jwt-simple` → `jsonwebtoken` 9.0.2 (más features)
- `mailgun-js` → `mailgun.js` 9.3.0 (nueva API oficial)
- `mongoose-paginate` → `mongoose-paginate-v2` 1.8.0

#### Código
- Migrado de `var` a `const` y `let`
- Callbacks → async/await
- `ReactDOM.render` → `ReactDOM.createRoot` (React 18)
- Mejor manejo de errores con try/catch
- Código más limpio y moderno

### 🔒 Seguridad

- Eliminadas todas las vulnerabilidades críticas conocidas
- Secretos removidos del repositorio
- `.gitignore` actualizado para proteger credenciales
- Archivos `.example` para configuración segura
- Hashing de passwords mejorado con bcrypt moderno
- Tokens JWT con mejor validación

### 🚀 Rendimiento

- AWS SDK v3 con tree-shaking (70% menos bundle size)
- React 18 con concurrent rendering
- Mongoose 8 con queries optimizadas
- Mejor gestión de memoria en Node 18

### 🛠️ Herramientas de Desarrollo

- ESLint para linting de código
- Prettier para formateo automático
- Jest para testing
- Supertest para testing de APIs
- Nodemon para hot reload
- Docker Compose para desarrollo

### 📝 Documentación

- 8 documentos de análisis y guías
- README completo con badges
- Guías de migración detalladas
- Documentación de APIs (Swagger en admin-backend)
- Comentarios JSDoc en código

### 🐛 Corregido

- Vulnerabilidades de seguridad en dependencias antiguas
- Problemas de compatibilidad con Node.js moderno
- Warnings de deprecación en Mongoose
- Problemas de CORS en desarrollo
- Errores de tipos en TypeScript

### 🗑️ Removido

- Dependencias deprecated (bcrypt-nodejs, jwt-simple)
- Código duplicado entre backends
- Archivos de configuración con secretos
- Node modules del repositorio

### ⚠️ Breaking Changes

#### React 18
- `ReactDOM.render` ya no funciona, usar `createRoot`
- Algunos componentes requieren actualización para concurrent mode

#### React Router v6
- `Switch` → `Routes`
- `component` prop → `element` prop
- `useHistory` → `useNavigate`

#### MUI v5
- Imports: `@material-ui/core` → `@mui/material`
- Sistema de estilos diferente
- Algunos componentes con API nueva

#### Mongoose 8
- Callbacks deprecated, usar Promises/async-await
- Algunas opciones de conexión removidas
- Validaciones más estrictas

#### AWS SDK v3
- Imports modulares requeridos
- API completamente diferente
- Configuración de cliente diferente

### 📦 Migración

Para migrar de v1.x a v2.0:

1. Actualizar Node.js a 18+
2. Instalar dependencias: `npm install`
3. Copiar `.env.example` a `.env` y configurar
4. Revisar MIGRATION_GUIDE.md
5. Ejecutar scripts de migración si es necesario
6. Probar exhaustivamente

### 🔗 Links

- [Repositorio](https://github.com/jisantander/gestdoc)
- [Documentación](./docs)
- [Guía de Migración](./MIGRATION_GUIDE.md)

---

## [1.0.0] - 2023-XX-XX

### Versión Inicial

- Implementación inicial de GESTDOC
- Editor BPMN
- Generación de documentos
- Integración con Odoo
- Panel administrativo
- Autenticación con Google OAuth

---

[2.0.0]: https://github.com/jisantander/gestdoc/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/jisantander/gestdoc/releases/tag/v1.0.0
