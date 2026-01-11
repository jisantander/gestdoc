# GESTDOC - Mapeo de Dependencias e Interconexiones

## 1. Estructura de Bases de Datos Compartidas

Ambos backends (Admin y Express) comparten la misma instancia de MongoDB Atlas con las siguientes colecciones:

### Colecciones Compartidas

| Colección | Admin Backend | Express Backend | Propósito |
|-----------|---------------|-----------------|-----------|
| users | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Gestión de usuarios |
| companies | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Gestión de empresas |
| procedures | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Procedimientos y flujos |
| bpmn | ✅ Lectura/Escritura | ✅ Lectura | Definiciones BPMN |
| forms | ✅ Lectura/Escritura | ✅ Lectura | Formularios dinámicos |
| documents | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Documentos generados |
| emails | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Plantillas de email |
| notifications | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Notificaciones |
| urls | ✅ Lectura/Escritura | ✅ Lectura/Escritura | URLs cortas |
| trash | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Papelera |
| interface | ✅ Lectura/Escritura | ✅ Lectura | Configuración de interfaz |
| html | ✅ Lectura/Escritura | ✅ Lectura | Plantillas HTML |
| ecert | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Certificados electrónicos |
| verifications | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Verificaciones |
| pixel | ✅ Lectura/Escritura | ✅ Lectura/Escritura | Tracking pixels |

## 2. Rutas y Endpoints por Componente

### Admin Backend - Rutas Principales

```
/api/bpmn                    - Gestión de procesos BPMN
/api/company                 - Gestión de empresas
/api/user                    - Gestión de usuarios
/api/procedure               - Gestión de procedimientos
/api/form                    - Gestión de formularios
/api/report                  - Generación de reportes
/api/emails                  - Gestión de plantillas de email
/api/getdocs                 - Obtención de documentos
/api/html                    - Gestión de plantillas HTML
/api/interface               - Configuración de interfaz
/api/operation               - Operaciones
/api/preview                 - Vista previa de documentos
/api/themedoc                - Temas de documentos
/api/usegroup                - Grupos de usuarios
/api/history                 - Historial de cambios
```

### Express Backend - Rutas API

```
/api/auth                    - Autenticación y login
/api/documento               - Gestión de documentos
/api/ecert                   - Certificados electrónicos
/api/flow                    - Flujos de procedimientos
/api/getdocs                 - Obtención de documentos
/api/claveunica              - Integración ClaveÚnica
/api/pdf                     - Manipulación de PDFs
/api/pixel                   - Tracking pixels
/api/profile                 - Perfil de usuario
/api/quick                   - Acciones rápidas
/api/short                   - URLs cortas
/api/tramites                - Trámites
/api/verifications           - Verificaciones
/api/orders                  - Órdenes
```

## 3. Flujos de Comunicación Entre Componentes

### Flujo 1: Creación de Procedimiento (Admin)

```
Admin Frontend (React 16)
    ↓ POST /api/procedure
Admin Backend (Node.js)
    ├─ Valida datos
    ├─ Almacena en MongoDB
    ├─ Genera BPMN
    └─ Notifica Express Backend (si aplica)
        ↓ HTTP Request
    Express Backend (Node.js)
        ├─ Recibe notificación
        ├─ Procesa BPMN
        └─ Actualiza colecciones
```

### Flujo 2: Solicitud de Documento (Usuario)

```
Express Frontend (React 17)
    ↓ POST /api/documento/solicitar
Express Backend (Node.js)
    ├─ Valida solicitud
    ├─ Consulta Admin Backend (si es necesario)
    ├─ Genera documento (Word/PDF)
    ├─ Almacena en AWS S3
    ├─ Actualiza MongoDB
    └─ Envía email (Mailgun)
        ↓ SMTP
    Usuario (Email)
```

### Flujo 3: Autenticación

```
Frontend (React)
    ↓ POST /api/auth/login (Google Token)
Backend (Node.js)
    ├─ Valida token con Google
    ├─ Busca usuario en MongoDB
    ├─ Genera JWT
    └─ Retorna token
Frontend
    ├─ Almacena JWT en localStorage
    └─ Incluye en headers posteriores
```

## 4. Dependencias Externas Compartidas

### Servicios en la Nube

| Servicio | Admin Backend | Express Backend | Frontend | Propósito |
|----------|---------------|-----------------|----------|-----------|
| MongoDB Atlas | ✅ | ✅ | ❌ | Base de datos |
| AWS S3 | ✅ | ✅ | ❌ | Almacenamiento de archivos |
| Mailgun | ✅ | ✅ | ❌ | Envío de emails |
| Google OAuth | ✅ | ✅ | ✅ | Autenticación |
| Sentry | ✅ | ✅ | ✅ | Monitoreo de errores |
| reCAPTCHA | ❌ | ❌ | ✅ | Seguridad en formularios |
| Odoo | ✅ | ✅ | ❌ | ERP Integration |

## 5. Duplicidad de Código Identificada

### Servicios Duplicados

| Servicio | Admin Backend | Express Backend | Recomendación |
|----------|---------------|-----------------|---------------|
| JWT | jwt-simple | jsonwebtoken | Unificar a jsonwebtoken |
| Generación de Documentos | docxtemplater | docxtemplater | Crear servicio compartido |
| Envío de Emails | mailgun-js | mailgun-js | Crear servicio centralizado |
| Validación de BPMN | ✅ Completo | ✅ Básico | Centralizar lógica |
| Manipulación de PDFs | pdf-lib | pdf-lib | Crear librería compartida |
| Autenticación | jwt-simple | jsonwebtoken | Unificar |

### Lógica Duplicada en Modelos

```
Admin Backend Models          Express Backend Models
├── procedureModel.js         ├── procedures.js (35KB)
├── userModel.js              ├── users.js (15KB)
├── bpmnModel.js              ├── bpmn.js
├── companyModel.js           ├── companyModel.js
└── ...                       └── ...
```

## 6. Dependencias de Versiones

### Inconsistencias Críticas

| Paquete | Admin Backend | Express Backend | Recomendación |
|---------|---------------|-----------------|---------------|
| Node.js | No especificada | 12.7.0 (EOL) | Actualizar a 18+ LTS |
| Express | ^4.15.3 | ^4.17.1 | Unificar a ^4.18+ |
| Mongoose | ^5.9.18 | ^5.9.26 | Actualizar a ^7+ |
| React (Admin Front) | 16.13.1 (EOL) | - | Actualizar a 18+ |
| React (Express Front) | - | 17.0.1 (EOL) | Actualizar a 18+ |
| Material-UI | ^4.11.0 | ^4.11.0 | Considerar MUI v5+ |

## 7. Matriz de Comunicación Entre Componentes

```
                    Admin     Express    Admin      Express    WordPress
                    Backend   Backend    Frontend   Frontend   
Admin Backend       -         HTTP       ✅         ❌         ❌
Express Backend     HTTP      -          ❌         ✅         ❌
Admin Frontend      ✅        ❌         -          ❌         ❌
Express Frontend    ❌        ✅         ❌         -          ❌
WordPress           ❌        ❌         ❌         ❌         -
```

## 8. Puntos de Integración Críticos

### 1. Base de Datos Compartida
- **Riesgo**: Conflictos de escritura simultánea
- **Solución**: Implementar transacciones MongoDB
- **Prioridad**: Alta

### 2. Autenticación
- **Riesgo**: Tokens JWT inconsistentes
- **Solución**: Centralizar servicio de autenticación
- **Prioridad**: Alta

### 3. Generación de Documentos
- **Riesgo**: Duplicidad de código y lógica
- **Solución**: Crear microservicio centralizado
- **Prioridad**: Media

### 4. Notificaciones
- **Riesgo**: Falta de sincronización entre backends
- **Solución**: Implementar message queue (RabbitMQ/Redis)
- **Prioridad**: Media

## 9. Recomendaciones de Arquitectura

### Corto Plazo (1-2 meses)
1. Crear monorepo en GitHub
2. Documentar todas las APIs
3. Establecer estándares de código
4. Actualizar dependencias vulnerables

### Mediano Plazo (2-4 meses)
1. Unificar servicios duplicados
2. Crear servicios compartidos
3. Implementar transacciones en BD
4. Actualizar Node.js a 18+ LTS

### Largo Plazo (4-6 meses)
1. Migrar a React 18+
2. Implementar message queue
3. Refactorizar modelos de datos
4. Crear API Gateway centralizado

