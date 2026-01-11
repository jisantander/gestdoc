/**
 * Constantes compartidas entre componentes
 */

// Estados de documentos
const DOCUMENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

// Estados de usuarios
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_VERIFICATION: 'pending_verification'
};

// Roles de usuario
const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest'
};

// Tipos de notificación
const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Tipos de documento
const DOCUMENT_TYPES = {
  WORD: 'word',
  PDF: 'pdf',
  EXCEL: 'excel',
  IMAGE: 'image',
  OTHER: 'other'
};

// Códigos de error HTTP
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Límites de paginación
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Configuración de archivos
const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'],
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png'
  ]
};

// Expresiones regulares comunes
const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_CL: /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/,
  RUT: /^[0-9]+-[0-9kK]{1}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
};

// Mensajes de error comunes
const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Email inválido',
  INVALID_RUT: 'RUT inválido',
  INVALID_PHONE: 'Teléfono inválido',
  INVALID_DATE: 'Fecha inválida',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido',
  FILE_TOO_LARGE: 'Archivo demasiado grande',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso prohibido',
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error del servidor',
  NETWORK_ERROR: 'Error de conexión'
};

module.exports = {
  DOCUMENT_STATUS,
  USER_STATUS,
  USER_ROLES,
  NOTIFICATION_TYPES,
  DOCUMENT_TYPES,
  HTTP_STATUS,
  PAGINATION,
  FILE_CONFIG,
  REGEX,
  ERROR_MESSAGES
};
