export const APP_CONFIG = {
  name: 'Firebase Auth App',
  version: '1.0.0',
  defaultTitle: 'Firebase Auth',
} as const;

export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  POSTS: '/posts',
} as const;

export const FIREBASE_ERRORS = {
  'auth/account-exists-with-different-credential': 'Esta cuenta ya existe con un proveedor diferente',
  'auth/email-already-in-use': 'Este email ya está en uso',
  'auth/invalid-email': 'Email inválido',
  'auth/user-not-found': 'Usuario no encontrado',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/weak-password': 'La contraseña es muy débil',
  'auth/invalid-credential': 'Credenciales inválidas',
  'auth/user-disabled': 'Usuario deshabilitado',
  'auth/too-many-requests': 'Demasiados intentos fallidos',
  'auth/network-request-failed': 'Error de conexión',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Email inválido',
  MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
  FILE_TOO_LARGE: (maxSize: string) => `El archivo es demasiado grande. Máximo ${maxSize} permitido`,
  INVALID_FILE_TYPE: (allowedTypes: string) => `Tipo de archivo no válido. Solo se permiten: ${allowedTypes}`,
} as const;

export const PHOTO_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_FILES_PER_UPLOAD: 10,
  STORAGE_PATH: 'photos',
} as const;
