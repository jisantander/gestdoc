# GESTDOC - Estructura de Monorepo Recomendada

## Visión General

Se recomienda migrar a una estructura de **monorepo** que centralice todo el código del proyecto GESTDOC manteniendo la separación lógica de componentes. Esto facilitará:

- Compartir código entre componentes
- Gestionar dependencias de forma centralizada
- Facilitar cambios transversales
- Mejorar la colaboración entre equipos
- Simplificar el despliegue

## Estructura Propuesta

```
gestdoc/
├── .github/
│   ├── workflows/
│   │   ├── ci-admin-backend.yml
│   │   ├── ci-express-backend.yml
│   │   ├── ci-admin-frontend.yml
│   │   ├── ci-express-frontend.yml
│   │   └── deploy.yml
│   └── CODEOWNERS
├── packages/
│   ├── admin-backend/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   ├── controllers/
│   │   │   ├── utils/
│   │   │   └── index.js
│   │   ├── .env.example
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── README.md
│   │
│   ├── express-backend/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   ├── controllers/
│   │   │   ├── cron/
│   │   │   ├── lib/
│   │   │   ├── utils/
│   │   │   └── index.js
│   │   ├── .env.example
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── README.md
│   │
│   ├── admin-frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── containers/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── reducers/
│   │   │   ├── utils/
│   │   │   ├── theme/
│   │   │   ├── App.js
│   │   │   ├── index.js
│   │   │   └── Routes.js
│   │   ├── .env.example
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── README.md
│   │
│   ├── express-frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── reducers/
│   │   │   ├── utils/
│   │   │   ├── theme/
│   │   │   ├── App.js
│   │   │   ├── index.js
│   │   │   └── Routes.js
│   │   ├── .env.example
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── README.md
│   │
│   ├── wordpress/
│   │   ├── wp-content/
│   │   ├── wp-config-sample.php
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   └── README.md
│   │
│   └── shared/
│       ├── utils/
│       │   ├── jwt.js
│       │   ├── email.js
│       │   ├── document-generator.js
│       │   ├── pdf-handler.js
│       │   ├── bpmn-analyzer.js
│       │   └── index.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Company.js
│       │   ├── Procedure.js
│       │   └── index.js
│       ├── constants/
│       │   ├── errors.js
│       │   ├── messages.js
│       │   └── config.js
│       ├── package.json
│       └── README.md
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   ├── TROUBLESHOOTING.md
│   └── diagrams/
│       ├── architecture.png
│       ├── database-schema.png
│       └── flow-diagrams.png
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .gitignore
├── .env.example
├── .env.local.example
├── package.json
├── lerna.json (si se usa Lerna)
├── pnpm-workspace.yaml (si se usa pnpm)
├── README.md
├── CHANGELOG.md
└── LICENSE
```

## Descripción de Directorios

### `/packages/admin-backend`
Backend administrativo con toda la lógica de gestión de procesos, usuarios y empresas. Contiene rutas para BPMN, procedimientos, formularios, reportes, etc.

**Cambios principales**:
- Reorganizar código en estructura clara (src/, models/, routes/, services/)
- Crear controllers para lógica de negocio
- Extraer servicios compartidos

### `/packages/express-backend`
Backend de Express con lógica de procesamiento de documentos, generación de reportes y tareas CRON. Incluye integraciones con Odoo y servicios externos.

**Cambios principales**:
- Reorganizar en estructura modular
- Separar lógica CRON en servicios
- Crear controllers para endpoints

### `/packages/admin-frontend`
Frontend administrativo en React 16 para gestión de procesos BPMN, usuarios y configuración del sistema.

**Cambios principales**:
- Actualizar a React 18+
- Reorganizar componentes
- Mejorar estructura de carpetas

### `/packages/express-frontend`
Frontend en React 17 para usuarios finales con formularios dinámicos y solicitud de documentos.

**Cambios principales**:
- Actualizar a React 18+
- Unificar componentes comunes con admin-frontend
- Mejorar UX

### `/packages/wordpress`
Instalación de WordPress con configuración y plugins personalizados.

### `/packages/shared`
Código compartido entre backends y frontends:
- Utilidades JWT
- Servicios de email
- Generación de documentos
- Análisis BPMN
- Modelos de datos comunes

### `/docs`
Documentación completa del proyecto:
- Arquitectura
- Referencias de API
- Guías de setup
- Guías de despliegue
- Contribución

## Configuración de Herramientas

### `package.json` (Raíz)
```json
{
  "name": "gestdoc",
  "version": "2.0.0",
  "description": "Gestdoc - Plataforma de Gestión Documental",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "install:all": "npm install",
    "dev": "npm run dev --workspaces",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces",
    "format": "npm run format --workspaces",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

### `docker-compose.yml` (Desarrollo)
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  admin-backend:
    build:
      context: ./packages/admin-backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DB_HOST=mongodb
      - DB_NAME=gestdoc
    depends_on:
      - mongodb

  express-backend:
    build:
      context: ./packages/express-backend
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=development
      - DB_HOST=mongodb
      - DB_NAME=gestdoc
    depends_on:
      - mongodb

  admin-frontend:
    build:
      context: ./packages/admin-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:3001
    depends_on:
      - admin-backend

  express-frontend:
    build:
      context: ./packages/express-frontend
    ports:
      - "3003:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:3002
    depends_on:
      - express-backend

  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: mongodb
      WORDPRESS_DB_NAME: gestdoc_wordpress
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

## Migración Gradual

### Fase 1: Preparación (Semana 1)
1. Crear estructura de monorepo
2. Copiar código existente
3. Configurar herramientas de build

### Fase 2: Reorganización (Semanas 2-3)
1. Reorganizar directorios en cada paquete
2. Crear estructura de servicios
3. Extraer código compartido

### Fase 3: Actualización de Dependencias (Semanas 4-5)
1. Actualizar Node.js a 18+ LTS
2. Actualizar React a 18+
3. Actualizar dependencias críticas

### Fase 4: Testing y Validación (Semana 6)
1. Ejecutar tests
2. Validar funcionalidad
3. Corregir problemas

### Fase 5: Despliegue (Semana 7)
1. Desplegar en staging
2. Pruebas de integración
3. Desplegar en producción

## Ventajas del Monorepo

1. **Código Compartido**: Facilita reutilización de utilidades y servicios
2. **Consistencia**: Versiones uniformes de dependencias
3. **Cambios Transversales**: Actualizar código en un solo lugar
4. **Colaboración**: Equipo trabaja en un repositorio único
5. **CI/CD Simplificado**: Pipelines centralizados
6. **Documentación Centralizada**: Un único punto de referencia

## Herramientas Recomendadas

### Gestión de Workspaces
- **npm workspaces** (incluido en npm 7+)
- **pnpm workspaces** (más rápido y eficiente)
- **Lerna** (para proyectos más complejos)

### Linting y Formatting
- **ESLint** (linting)
- **Prettier** (formatting)
- **husky** (pre-commit hooks)

### Testing
- **Jest** (unit tests)
- **Supertest** (API tests)
- **React Testing Library** (component tests)

### CI/CD
- **GitHub Actions** (CI/CD)
- **Docker** (containerización)
- **Docker Compose** (orquestación local)

