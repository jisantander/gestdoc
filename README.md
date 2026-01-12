# GESTDOC - Plataforma de Gestión Documental

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Plataforma integral para gestión de procesos documentales, generación de reportes y automatización de flujos de trabajo con editor BPMN visual.

## 🚀 Características Principales

- **Editor BPMN Visual**: Diseña y gestiona procesos de negocio con interfaz drag & drop
- **Generación de Documentos**: Crea documentos Word, PDF y reportes automáticamente desde plantillas
- **Formularios Dinámicos**: Formularios configurables basados en JSON Schema
- **Integración Odoo**: Conecta con tu ERP Odoo para sincronización de datos
- **Autenticación Google**: Login seguro con Google OAuth 2.0
- **Almacenamiento AWS S3**: Almacena documentos en la nube de forma segura
- **Panel Administrativo**: Gestión completa del sistema con dashboard analytics
- **Firma Digital**: Integración con e-Cert para firma electrónica
- **Notificaciones**: Sistema de notificaciones por email con Mailgun

## 📋 Requisitos Previos

- **Node.js**: 18.0.0 o superior (LTS recomendado)
- **npm**: 8.0.0 o superior
- **MongoDB**: 5.0 o superior
- **Docker**: 20.0+ (opcional, para desarrollo con contenedores)
- **Git**: Para control de versiones

## 🏗️ Arquitectura

```
gestdoc/
├── packages/
│   ├── admin-backend/        # Backend administrativo (Node.js + Express + MongoDB)
│   ├── express-backend/      # Backend de procesamiento (Node.js + Express + CRON)
│   ├── admin-frontend/       # Frontend administrativo (React 18 + MUI)
│   ├── express-frontend/     # Frontend de usuarios (React 18 + MUI)
│   ├── wordpress/            # CMS WordPress para contenidos
│   └── shared/               # Código compartido (utilidades, constantes)
├── docs/                     # Documentación completa del proyecto
├── scripts/                  # Scripts de utilidad y migración
└── docker-compose.yml        # Orquestación de servicios
```

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/jisantander/gestdoc.git
cd gestdoc

# Configurar variables de entorno
cp packages/admin-backend/.env.example packages/admin-backend/.env
cp packages/express-backend/.env.example packages/express-backend/.env
# Edita los archivos .env con tus configuraciones

# Iniciar servicios con Docker
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Opción 2: Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/jisantander/gestdoc.git
cd gestdoc

# Instalar dependencias
npm install

# Configurar variables de entorno
cp packages/admin-backend/.env.example packages/admin-backend/.env
cp packages/express-backend/.env.example packages/express-backend/.env
# Edita los archivos .env con tus configuraciones

# Iniciar MongoDB (si no está corriendo)
mongod --dbpath /path/to/data

# Iniciar todos los servicios en desarrollo
npm run dev
```

## 🌐 Acceso a las Aplicaciones

Una vez iniciados los servicios:

| Aplicación | URL | Puerto | Descripción |
|-----------|-----|--------|-------------|
| Admin Frontend | http://localhost:3000 | 3000 | Panel administrativo |
| Express Frontend | http://localhost:3003 | 3003 | Interfaz de usuarios |
| Admin Backend API | http://localhost:3001/api | 3001 | API administrativa |
| Express Backend API | http://localhost:3002/api | 3002 | API de procesamiento |
| WordPress | http://localhost:8080 | 8080 | CMS de contenidos |
| MongoDB | localhost:27017 | 27017 | Base de datos |

## 📦 Componentes del Sistema

### Admin Backend (Puerto 3001)
- API REST con Express.js
- Autenticación JWT
- Gestión de usuarios y permisos
- CRUD de procesos BPMN
- Generación de documentos
- Integración con Odoo
- Documentación Swagger: `/api-docs`

### Express Backend (Puerto 3002)
- Procesamiento de documentos
- Tareas CRON programadas
- Generación de reportes
- Envío de notificaciones
- Limpieza automática de archivos temporales

### Admin Frontend (Puerto 3000)
- Editor BPMN visual
- Gestión de formularios dinámicos
- Dashboard con analytics
- Gestión de usuarios y empresas
- Configuración del sistema

### Express Frontend (Puerto 3003)
- Interfaz de usuario final
- Completar formularios
- Seguimiento de trámites
- Firma digital de documentos
- Historial de actividades

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar todos los servicios en modo desarrollo
npm start                # Iniciar todos los servicios en modo producción

# Testing
npm test                 # Ejecutar tests en todos los paquetes
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura

# Linting y Formateo
npm run lint             # Linting de código
npm run lint:fix         # Fix automático de linting
npm run format           # Formatear código con Prettier

# Build
npm run build            # Compilar todos los paquetes
npm run clean            # Limpiar node_modules

# Docker
npm run docker:build     # Construir imágenes Docker
npm run docker:up        # Iniciar contenedores
npm run docker:down      # Detener contenedores
npm run docker:logs      # Ver logs de contenedores
```

## 🔧 Configuración

### Variables de Entorno

Cada backend requiere su archivo `.env`. Usa los archivos `.env.example` como plantilla:

**Variables principales:**
- `MONGODB_URI`: URI de conexión a MongoDB
- `JWT_SECRET`: Secreto para tokens JWT
- `AWS_ACCESS_KEY_ID`: Credenciales de AWS S3
- `AWS_SECRET_ACCESS_KEY`: Credenciales de AWS S3
- `MAILGUN_API_KEY`: API key de Mailgun
- `GOOGLE_CLIENT_ID`: Client ID de Google OAuth
- `ODOO_URL`: URL de instancia Odoo
- `SENTRY_DSN`: DSN de Sentry (opcional)

### Configuración de S3

Crea el archivo `s3_config.json` (no incluido en Git por seguridad):

```json
{
  "accessKeyId": "tu-access-key-id",
  "secretAccessKey": "tu-secret-access-key",
  "region": "us-east-1"
}
```

## 📚 Documentación

- [Resumen Ejecutivo](./docs/EXECUTIVE_SUMMARY.md) - Visión general del proyecto
- [Análisis de Arquitectura](./docs/ARCHITECTURE_ANALYSIS.md) - Arquitectura detallada
- [Mapeo de Dependencias](./docs/DEPENDENCIES_MAPPING.md) - Interconexiones entre componentes
- [Estructura de Monorepo](./docs/MONOREPO_STRUCTURE.md) - Organización del código
- [Plan de Modernización](./docs/MODERNIZATION_PLAN.md) - Roadmap de mejoras
- [Guía de Setup](./docs/SETUP_GUIDE.md) - Instalación detallada
- [Configuración GitHub](./docs/GITHUB_SETUP_INSTRUCTIONS.md) - CI/CD y configuración
- [Guía de Migración](./MIGRATION_GUIDE.md) - Migración a versiones modernas
- [Resumen de Actualizaciones](./UPGRADE_SUMMARY.md) - Cambios de dependencias
- [Resumen de Refactorización](./REFACTORING_SUMMARY.md) - Cambios de código

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests de un paquete específico
cd packages/admin-backend && npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 🚢 Despliegue

### Producción con Docker

```bash
# Build de imágenes de producción
docker-compose -f docker-compose.prod.yml build

# Iniciar en producción
docker-compose -f docker-compose.prod.yml up -d
```

### Variables de Entorno en Producción

Asegúrate de configurar:
- `NODE_ENV=production`
- Credenciales reales de servicios
- URLs de producción
- Secretos seguros (JWT_SECRET, etc.)

## 🔒 Seguridad

- ✅ Autenticación JWT con tokens seguros
- ✅ OAuth2 con Google
- ✅ Rate limiting en APIs
- ✅ Validación de entrada en todos los endpoints
- ✅ CORS configurado apropiadamente
- ✅ Secrets management con variables de entorno
- ✅ Hashing de passwords con bcrypt
- ✅ Protección contra inyección SQL/NoSQL
- ✅ HTTPS en producción (recomendado)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- ESLint para linting
- Prettier para formateo
- Commits semánticos (Conventional Commits)
- Tests para nuevas features

## 📝 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para historial de cambios.

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

## 👥 Equipo

- **GESTDOC Team** - Desarrollo y mantenimiento

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/jisantander/gestdoc/issues)
- **Documentación**: [Wiki](./docs)
- **Email**: support@gestdoc.com

## 🙏 Agradecimientos

- Material-UI / MUI por los componentes UI
- BPMN.js por el editor de procesos
- MongoDB por la base de datos
- AWS por el almacenamiento S3
- Todos los contribuidores del proyecto

---

**Última actualización**: Enero 2025  
**Versión**: 2.0.0  
**Estado**: En desarrollo activo
