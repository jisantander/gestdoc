# GESTDOC - Guía de Setup Inicial

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: 18+ LTS (https://nodejs.org/)
- **npm**: 8+ (incluido con Node.js)
- **MongoDB**: 5.0+ (local o Atlas)
- **Docker**: 20+ (opcional, para desarrollo con contenedores)
- **Git**: 2.30+ (https://git-scm.com/)

## Instalación Rápida (Desarrollo Local)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/gestdoc.git
cd gestdoc
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias de todos los paquetes
npm install

# O si usas pnpm (más rápido)
pnpm install
```

### 3. Configurar Variables de Entorno

Cada paquete necesita un archivo `.env`:

#### Admin Backend (packages/admin-backend/.env)
```
NODE_ENV=development
PORT=3001

# MongoDB
DB_USER=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=27017
DB_NAME=gestdoc

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro

# AWS S3
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=gestdoc-bucket

# Mailgun
MAILGUN_API_KEY=tu_mailgun_key
MAILGUN_DOMAIN=tu_dominio.mailgun.org

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# Sentry
SENTRY_DSN=tu_sentry_dsn

# Odoo
ODOO_URL=https://tu-odoo.com
ODOO_DB=tu_base_datos
ODOO_USERNAME=admin
ODOO_PASSWORD=password
```

#### Express Backend (packages/express-backend/.env)
```
NODE_ENV=development
PORT=3002

# MongoDB
DB_USER=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=27017
DB_NAME=gestdoc

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro

# AWS S3
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=gestdoc-bucket

# Mailgun
MAILGUN_API_KEY=tu_mailgun_key
MAILGUN_DOMAIN=tu_dominio.mailgun.org

# Sentry
SENTRY=tu_sentry_dsn

# Odoo
ODOO_URL=https://tu-odoo.com
ODOO_DB=tu_base_datos
ODOO_USERNAME=admin
ODOO_PASSWORD=password
```

#### Admin Frontend (packages/admin-frontend/.env)
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_GOOGLE_CLIENT_ID=tu_google_client_id
REACT_APP_SENTRY_DSN=tu_sentry_dsn
REACT_APP_EXP=tu_empresa_id
REACT_EXPRESS_API=http://localhost:3002
```

#### Express Frontend (packages/express-frontend/.env)
```
REACT_APP_API_URL=http://localhost:3002
REACT_APP_GOOGLE_CLIENT_ID=tu_google_client_id
REACT_APP_SENTRY_DSN=tu_sentry_dsn
REACT_APP_RECAPTCHA_KEY=tu_recaptcha_key
```

### 4. Iniciar MongoDB

#### Opción A: MongoDB Local
```bash
# En macOS con Homebrew
brew services start mongodb-community

# En Linux
sudo systemctl start mongod

# En Windows
net start MongoDB
```

#### Opción B: MongoDB con Docker
```bash
docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  --name gestdoc-mongo \
  mongo:5.0
```

### 5. Iniciar los Servicios

#### Opción A: Desarrollo Individual
```bash
# Terminal 1 - Admin Backend
cd packages/admin-backend
npm run dev

# Terminal 2 - Express Backend
cd packages/express-backend
npm run dev

# Terminal 3 - Admin Frontend
cd packages/admin-frontend
npm start

# Terminal 4 - Express Frontend
cd packages/express-frontend
npm start
```

#### Opción B: Con Docker Compose
```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### 6. Acceder a las Aplicaciones

- **Admin Frontend**: http://localhost:3000
- **Express Frontend**: http://localhost:3003
- **Admin Backend API**: http://localhost:3001/api
- **Express Backend API**: http://localhost:3002/api
- **WordPress**: http://localhost:8080
- **MongoDB**: localhost:27017

## Verificación de Instalación

### 1. Verificar Backends

```bash
# Admin Backend
curl http://localhost:3001/api/health

# Express Backend
curl http://localhost:3002/api/status
```

### 2. Verificar Frontends

Abre en el navegador:
- http://localhost:3000 (Admin)
- http://localhost:3003 (Express)

### 3. Verificar MongoDB

```bash
# Conectar a MongoDB
mongosh "mongodb://admin:password@localhost:27017"

# Ver bases de datos
show databases

# Usar gestdoc
use gestdoc

# Ver colecciones
show collections
```

## Troubleshooting

### Puerto en Uso
```bash
# Encontrar proceso usando puerto 3001
lsof -i :3001

# Matar proceso
kill -9 <PID>
```

### MongoDB No Conecta
```bash
# Verificar si MongoDB está corriendo
ps aux | grep mongod

# Reiniciar MongoDB
sudo systemctl restart mongod
```

### Dependencias Rotas
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

### Variables de Entorno No Cargadas
```bash
# Asegúrate de que los archivos .env existan en cada paquete
ls packages/*/. env

# Reinicia los servicios después de cambiar .env
```

## Scripts Disponibles

### Desde la Raíz
```bash
npm install          # Instalar todas las dependencias
npm run dev          # Iniciar todos los servicios en desarrollo
npm run build        # Compilar todos los paquetes
npm run test         # Ejecutar tests
npm run lint         # Linting
npm run format       # Formatear código
```

### Por Paquete
```bash
cd packages/admin-backend
npm start            # Iniciar en producción
npm run dev          # Iniciar en desarrollo
npm run test         # Ejecutar tests
npm run lint         # Linting
```

## Próximos Pasos

1. Lee la [Documentación de Arquitectura](./ARCHITECTURE.md)
2. Consulta la [Referencia de API](./API_REFERENCE.md)
3. Revisa las [Guías de Contribución](./CONTRIBUTING.md)
4. Explora los [Diagramas de Flujo](./diagrams/)

## Soporte

Si encuentras problemas:

1. Consulta [Troubleshooting](./TROUBLESHOOTING.md)
2. Abre un issue en GitHub
3. Contacta al equipo de desarrollo

