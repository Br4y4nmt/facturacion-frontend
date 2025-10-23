import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para manejar errores de sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo manejar errores de autenticación si no estamos en login
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      console.log("Sesión expirada o error de autenticación");
      localStorage.clear();
      sessionStorage.clear();
      
      if (!sessionStorage.getItem('logging_out')) {
        window.location.replace('/login');
      }
    }
    // No mostrar errores 429 en consola si estamos en login
    if (error.response?.status === 429 && window.location.pathname === '/login') {
      return Promise.reject(new Error('Rate limit reached'));
    }
    return Promise.reject(error);
  }
);

export default api;
