# GESTDOC - Instrucciones para Configurar en GitHub

## Paso 1: Crear Repositorio en GitHub

1. Accede a https://github.com/new
2. Nombre del repositorio: `gestdoc`
3. Descripción: "Plataforma de gestión documental con múltiples componentes"
4. Privado o Público (según preferencia)
5. **NO** inicialices con README, .gitignore o LICENSE (los crearemos)
6. Haz clic en "Create repository"

## Paso 2: Preparar el Repositorio Local

```bash
# Desde /home/ubuntu/gestdoc_analysis
cd /home/ubuntu/gestdoc_analysis

# Inicializar git si no está inicializado
git init

# Crear .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
pnpm-lock.yaml

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/
.next/
out/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/
.nyc_output/

# Temp
temp/
tmp/
*.tmp

# Docker
.dockerignore
docker-compose.override.yml

# Uploads
uploads/
reports/
EOF

# Crear README.md principal
cat > README.md << 'EOF'
# GESTDOC - Plataforma de Gestión Documental

Plataforma integral para gestión de procesos documentales, generación de reportes y automatización de flujos de trabajo.

## 🚀 Características

- **Editor BPMN Visual**: Diseña y gestiona procesos de negocio
- **Generación de Documentos**: Crea documentos Word, PDF y reportes automáticamente
- **Formularios Dinámicos**: Formularios basados en JSON Schema
- **Integración Odoo**: Conecta con tu ERP Odoo
- **Autenticación Google**: Login seguro con Google OAuth
- **Almacenamiento AWS S3**: Almacena documentos en la nube
- **Panel Administrativo**: Gestión completa del sistema

## 📋 Requisitos Previos

- Node.js 18+ LTS
- npm 8+
- MongoDB 5.0+
- Docker 20+ (opcional)

## ⚡ Inicio Rápido

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/gestdoc.git
cd gestdoc

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus configuraciones

# Iniciar servicios
docker-compose up -d

# Acceder a las aplicaciones
# Admin: http://localhost:3000
# Express: http://localhost:3003
```

## 📚 Documentación

- [Resumen Ejecutivo](./docs/EXECUTIVE_SUMMARY.md)
- [Análisis de Arquitectura](./docs/ARCHITECTURE_ANALYSIS.md)
- [Mapeo de Dependencias](./docs/DEPENDENCIES_MAPPING.md)
- [Estructura de Monorepo](./docs/MONOREPO_STRUCTURE.md)
- [Plan de Modernización](./docs/MODERNIZATION_PLAN.md)
- [Guía de Setup](./docs/SETUP_GUIDE.md)

## 🏗️ Estructura del Proyecto

```
gestdoc/
├── packages/
│   ├── admin-backend/        # Backend administrativo
│   ├── express-backend/      # Backend de Express
│   ├── admin-frontend/       # Frontend administrativo
│   ├── express-frontend/     # Frontend de usuarios
│   ├── wordpress/            # Instalación WordPress
│   └── shared/               # Código compartido
├── docs/                     # Documentación
├── docker-compose.yml        # Orquestación local
└── README.md
```

## 🛠️ Desarrollo

### Instalar Dependencias
```bash
npm install
```

### Iniciar en Desarrollo
```bash
npm run dev
```

### Ejecutar Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Formatear Código
```bash
npm run format
```

## 🚀 Despliegue

Ver [Guía de Despliegue](./docs/DEPLOYMENT.md)

## 📊 Componentes

| Componente | Tecnología | Puerto | Descripción |
|-----------|-----------|--------|-------------|
| Admin Backend | Node.js + Express | 3001 | API administrativa |
| Express Backend | Node.js + Express | 3002 | API de procesamiento |
| Admin Frontend | React 18 | 3000 | Panel administrativo |
| Express Frontend | React 18 | 3003 | Interfaz de usuarios |
| WordPress | PHP | 8080 | CMS de contenidos |
| MongoDB | NoSQL | 27017 | Base de datos |

## 🔐 Seguridad

- Autenticación JWT
- OAuth2 con Google
- Rate limiting
- Validación de entrada
- CORS configurado
- Secrets management

## 📈 Monitoreo

- Sentry para error tracking
- Logs centralizados
- Métricas de rendimiento
- Alertas automáticas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [Guía de Contribución](./docs/CONTRIBUTING.md)

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](./LICENSE)

## 👥 Equipo

- Arquitecto de Software
- Desarrolladores Backend
- Desarrolladores Frontend
- DevOps Engineer
- QA Engineer

## 📞 Soporte

- 📧 Email: support@gestdoc.com
- 💬 Issues: GitHub Issues
- 📖 Documentación: [Wiki](./docs)

## 🗺️ Hoja de Ruta

- [x] Análisis de arquitectura
- [x] Documentación
- [ ] Modernización de dependencias
- [ ] Refactorización de código
- [ ] Suite de tests
- [ ] Mejoras de seguridad
- [ ] Optimización de rendimiento

---

**Última actualización**: Enero 2025
EOF

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: GESTDOC project analysis and documentation"
```

## Paso 3: Conectar con GitHub

```bash
# Agregar remoto (reemplaza tu-usuario con tu usuario de GitHub)
git remote add origin https://github.com/tu-usuario/gestdoc.git

# Cambiar rama principal a main si es necesario
git branch -M main

# Hacer push
git push -u origin main
```

## Paso 4: Configurar Ramas de Protección

1. Ve a Settings → Branches
2. Haz clic en "Add rule"
3. Nombre del patrón: `main`
4. Habilita:
   - "Require a pull request before merging"
   - "Require status checks to pass before merging"
   - "Require branches to be up to date before merging"
   - "Include administrators"

## Paso 5: Configurar Colaboradores

1. Ve a Settings → Collaborators
2. Invita a los miembros del equipo
3. Asigna roles apropiados

## Paso 6: Configurar GitHub Actions (CI/CD)

Crear `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test
    
    - name: Build
      run: npm run build
```

## Paso 7: Configurar Secretos

1. Ve a Settings → Secrets and variables → Actions
2. Agrega los siguientes secretos:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `MONGODB_URI`

## Paso 8: Crear Documentación en Wiki

1. Ve a Wiki
2. Crea páginas para:
   - Getting Started
   - Architecture
   - API Reference
   - Deployment
   - Troubleshooting

## Paso 9: Configurar Proyectos (Project Board)

1. Ve a Projects
2. Crea un nuevo proyecto "GESTDOC Roadmap"
3. Configura columnas: Backlog, In Progress, Review, Done
4. Agrega issues y PRs

## Paso 10: Crear Issues Iniciales

Crea issues para:
- Actualización de dependencias
- Refactorización de código
- Implementación de tests
- Mejoras de seguridad
- Documentación

## Próximos Pasos

1. **Semana 1**: Crear estructura de monorepo
2. **Semana 2**: Documentar todas las APIs
3. **Semana 3**: Comenzar actualización de dependencias
4. **Semana 4**: Iniciar refactorización

## Checklist de Configuración

- [ ] Repositorio creado en GitHub
- [ ] Código pusheado a main
- [ ] Ramas protegidas configuradas
- [ ] Colaboradores invitados
- [ ] GitHub Actions configurado
- [ ] Secretos agregados
- [ ] Wiki creada
- [ ] Project board creado
- [ ] Issues iniciales creados
- [ ] Documentación actualizada

## Comandos Útiles

```bash
# Ver estado del repositorio
git status

# Ver historial de commits
git log --oneline

# Crear rama de feature
git checkout -b feature/nombre-feature

# Hacer push de rama
git push origin feature/nombre-feature

# Ver ramas remotas
git branch -r

# Actualizar desde main
git pull origin main
```

## Recursos

- [GitHub Docs](https://docs.github.com)
- [GitHub CLI](https://cli.github.com)
- [Git Documentation](https://git-scm.com/doc)

