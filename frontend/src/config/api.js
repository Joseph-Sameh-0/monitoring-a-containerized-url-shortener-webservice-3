// API Configuration for Microservices
const API_CONFIG = {
  // Base URLs for each microservice
  AUTH_SERVICE: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:9001',
  URL_SERVICE: import.meta.env.VITE_URL_SERVICE_URL || 'http://localhost:9002',
  FILE_SERVICE: import.meta.env.VITE_FILE_SERVICE_URL || 'http://localhost:9003',
  NOTE_SERVICE: import.meta.env.VITE_NOTE_SERVICE_URL || 'http://localhost:9004',
}

// API Endpoints
export const API_ENDPOINTS = {
  // Auth Service
  AUTH: {
    REGISTER: `${API_CONFIG.AUTH_SERVICE}/api/auth/register`,
    LOGIN: `${API_CONFIG.AUTH_SERVICE}/api/auth/login`,
  },
  
  // URL Service
  URL: {
    SHORTEN: `${API_CONFIG.URL_SERVICE}/shorten`,
    REDIRECT: (shortCode) => `${API_CONFIG.URL_SERVICE}/${shortCode}`,
    MY_URLS: `${API_CONFIG.URL_SERVICE}/api/urls/my-urls`,
    ADMIN_URLS: `${API_CONFIG.URL_SERVICE}/admin/urls`,
  },
  
  // File Service
  FILE: {
    UPLOAD: `${API_CONFIG.FILE_SERVICE}/api/files/upload`,
    DOWNLOAD: (shortCode) => `${API_CONFIG.FILE_SERVICE}/f/${shortCode}`,
    MY_FILES: `${API_CONFIG.FILE_SERVICE}/api/files/my-files`,
  },
  
  // Note Service
  NOTE: {
    SAVE: `${API_CONFIG.NOTE_SERVICE}/api/notes/save`,
    VIEW: (shortCode) => `${API_CONFIG.NOTE_SERVICE}/n/${shortCode}`,
    MY_NOTES: `${API_CONFIG.NOTE_SERVICE}/api/notes/my-notes`,
  },
}

export default API_CONFIG
