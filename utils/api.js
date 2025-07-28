import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL/* || 'http://localhost:3000' */;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gérer l'expiration du token
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        // Rediriger vers login si on est dans l'admin
        if (window.location.pathname.startsWith('/admin') &&
          !window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      }
    }

    // Gérer les erreurs de rate limiting
    if (error.response?.status === 429) {
      console.warn('Rate limit atteint:', error.response.data.message);
    }

    return Promise.reject(error);
  }
);


export default api;