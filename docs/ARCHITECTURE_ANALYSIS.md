# GESTDOC - Análisis de Arquitectura

## Resumen Ejecutivo

GESTDOC es una plataforma de gestión documental compleja con múltiples componentes interconectados:
- **Backend Administrativo** (Node.js + Express + MongoDB)
- **Backend Express** (Node.js + Express + MongoDB)
- **Frontend Administrativo** (React 16.13)
- **Frontend Express** (React 17)
- **WordPress** (Sistema de contenidos)

## Componentes del Proyecto

### 1. **Gestdoc-admin-backend-master**
- **Tipo**: Backend API REST
- **Framework**: Express.js
- **Base de Datos**: MongoDB (Atlas)
- **Dependencias Clave**:
  - mongoose (ODM para MongoDB)
  - express-fileupload
  - multer-s3 (Integración AWS S3)
  - docxtemplater (Generación de documentos)
  - jwt-simple (Autenticación)
  - mailgun-js (Envío de emails)
  - odoo-xmlrpc (Integración Odoo)
  - swagger-ui-express (Documentación API)
  - @sentry/node (Monitoreo de errores)

**Rutas principales**:
- `/routes/bpmnRoutes.js` - Gestión de procesos BPMN
- `/routes/companyRoutes.js` - Gestión de empresas
- `/routes/userRoutes.js` - Gestión de usuarios
- `/routes/procedureRoutes.js` - Gestión de procedimientos
- `/routes/formRoutes.js` - Gestión de formularios
- `/routes/reportRoutes.js` - Generación de reportes
- `/routes/emailsRoutes.js` - Gestión de emails
- `/routes/documentGenerator.js` - Generación de documentos

### 2. **Gestdoc-express-backend-master**
- **Tipo**: Backend API REST
- **Framework**: Express.js
- **Base de Datos**: MongoDB
- **Versión Node**: 12.7.0 (DESACTUALIZADA)
- **Dependencias Clave**:
  - mongoose (ODM)
  - express
  - multer (Carga de archivos)
  - node-cron (Tareas programadas)
  - docxtemplater
  - pdf-lib (Manipulación de PDFs)
  - aws-sdk
  - @sentry/node
  - odoo-xmlrpc

**Características especiales**:
- Tareas CRON automáticas (`/cron/index.js`)
- Generación de documentos Word
- Manipulación de PDFs
- Integración con Odoo
- Análisis de procesos BPMN

### 3. **Gestdoc-express-front-master**
- **Tipo**: Frontend SPA
- **Framework**: React 17 (EOL)
- **Herramientas de UI**: Material-UI v4
- **Dependencias Clave**:
  - react-router-dom (Enrutamiento)
  - redux + redux-thunk (State management)
  - axios (HTTP client)
  - formik (Gestión de formularios)
  - @rjsf/material-ui (JSON Schema Forms)
  - react-google-login
  - styled-components
  - @sentry/react

**Características**:
- Autenticación con Google
- Formularios dinámicos basados en JSON Schema
- Integración con reCAPTCHA

### 4. **Gestdoc-admin-front-master**
- **Tipo**: Frontend SPA (Panel Administrativo)
- **Framework**: React 16.13 (EOL)
- **Herramientas de UI**: Material-UI v4, Ant Design v4
- **Dependencias Clave**:
  - bpmn-js (Editor visual BPMN)
  - react-router-dom
  - redux + redux-thunk
  - axios
  - material-table (Tablas de datos)
  - react-email-editor (Editor de emails)
  - react-jsonschema-form-builder
  - @sentry/react

**Características**:
- Editor visual de procesos BPMN
- Panel administrativo completo
- Editor de emails integrado
- Constructor de formularios JSON Schema

### 5. **gestdoc-wordpress-main**
- **Tipo**: Instalación WordPress
- **Ubicación**: `/Gestdoc-xamp`
- **Propósito**: Sitio de contenidos / CMS
- **Incluye**: Configuración completa de WordPress

## Flujo de Interconexiones

```
┌─────────────────────────────────────────────────────────┐
│                   GESTDOC ARCHITECTURE                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────┤
│  Admin Frontend (React 16)  │  Express Frontend (React 17) │
│  - Panel Administrativo     │  - Interfaz de Usuario       │
│  - Editor BPMN              │  - Formularios Dinámicos     │
│  - Gestión de Procesos      │  - Solicitudes de Documentos │
└─────────────────────────────────────────────────────────┘
         │                            │
         │ HTTP/REST                  │ HTTP/REST
         │                            │
┌────────┴────────────────────────────┴──────────────────┐
│                    API LAYER                            │
├─────────────────────────────────────────────────────────┤
│  Admin Backend (Node.js)   │  Express Backend (Node.js)  │
│  - Gestión de Usuarios     │  - Procesamiento de Docs    │
│  - Gestión de Empresas     │  - Generación de Reportes   │
│  - BPMN Logic              │  - Tareas CRON              │
│  - Documentos              │  - Integración Odoo         │
└─────────────────────────────────────────────────────────┘
         │                            │
         │ MongoDB                    │ MongoDB
         │                            │
┌────────┴────────────────────────────┴──────────────────┐
│                    DATA LAYER                           │
├─────────────────────────────────────────────────────────┤
│  MongoDB Atlas (Shared Database)                        │
│  - Users, Companies, Procedures, Documents, Forms, etc. │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS                  │
├─────────────────────────────────────────────────────────┤
│  - AWS S3 (Almacenamiento de archivos)                 │
│  - Mailgun (Envío de emails)                           │
│  - Google Auth (Autenticación)                         │
│  - Odoo (ERP Integration)                              │
│  - Sentry (Error Monitoring)                           │
│  - reCAPTCHA (Seguridad)                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    CMS LAYER                            │
├─────────────────────────────────────────────────────────┤
│  WordPress (Gestdoc-xamp)                              │
│  - Contenidos estáticos                                │
│  - Blog / Información                                  │
└─────────────────────────────────────────────────────────┘
```

## Flujo de Datos Clave

### 1. Creación de Procedimiento
1. Admin Frontend → Admin Backend (POST /procedureRoutes)
2. Admin Backend valida y almacena en MongoDB
3. Admin Backend notifica Express Backend (si es necesario)
4. Express Backend genera pasos del BPMN

### 2. Solicitud de Documento
1. Express Frontend → Express Backend (POST /documentRequest)
2. Express Backend procesa la solicitud
3. Express Backend genera documento (Word/PDF)
4. Express Backend almacena en AWS S3
5. Express Backend envía notificación por email (Mailgun)

### 3. Autenticación
1. Frontend → Backend (POST /login con Google token)
2. Backend valida token y genera JWT
3. JWT se usa para autenticar requests posteriores

## Variables de Entorno Críticas

### Admin Backend
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME` - MongoDB
- `JWT_SECRET` - Firma de tokens
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` - AWS S3
- `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` - Envío de emails
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Autenticación Google
- `SENTRY_DSN` - Monitoreo de errores
- `NODE_ENV` - Entorno (localhost, development, production)

### Express Backend
- Similar a Admin Backend
- `SENTRY` - DSN de Sentry

### Frontends
- `REACT_APP_API_URL` - URL del backend
- `REACT_APP_GOOGLE_CLIENT_ID` - Google OAuth
- `REACT_APP_SENTRY_DSN` - Sentry
- `REACT_APP_RECAPTCHA_KEY` - reCAPTCHA
- `REACT_APP_EXP` - ID de empresa Gestdoc Express (Admin Frontend)
- `REACT_EXPRESS_API` - URL del Express Backend (Admin Frontend)

## Problemas Potenciales Identificados

### 1. Versiones de Node.js Inconsistentes
- Express Backend: 12.7.0 (muy antigua, sin soporte)
- Admin Backend: No especificada
- **Recomendación**: Actualizar a Node 18+ LTS

### 2. Versiones de React Inconsistentes
- Admin Frontend: 16.13.1 (EOL desde septiembre 2020)
- Express Frontend: 17.0.1 (EOL desde junio 2022)
- **Recomendación**: Actualizar a React 18+

### 3. Dependencias Desactualizadas
- Muchas dependencias con vulnerabilidades conocidas
- Necesita auditoría de seguridad completa
- Algunos packages deprecated

### 4. Falta de Documentación de API
- Solo Admin Backend tiene Swagger
- Express Backend no tiene documentación formal
- Falta documentación de endpoints

### 5. Duplicidad de Código
- Lógica BPMN en ambos backends
- Servicios de email duplicados
- Validaciones duplicadas

### 6. Configuración de Seguridad
- Variables sensibles en archivos de configuración
- Falta de encriptación de datos sensibles
- Necesita revisión de permisos

## Próximos Pasos Recomendados

1. ✅ Crear estructura de monorepo en GitHub
2. ✅ Levantar entorno local con Docker Compose
3. ✅ Documentar todas las APIs
4. ✅ Crear plan de modernización
5. ✅ Establecer estándares de código
6. ✅ Auditoría de seguridad
7. ✅ Optimización de rendimiento

