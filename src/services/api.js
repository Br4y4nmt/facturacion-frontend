import axios from "axios";

const api = axios.create({
  baseURL: "/api", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      console.log("Sesión expirada o error de autenticación");
      localStorage.clear();
      sessionStorage.clear();

      if (!sessionStorage.getItem("logging_out")) {
        window.location.replace("/login");
      }
    }

    if (error.response?.status === 429 && window.location.pathname === "/login") {
      return Promise.reject(new Error("Rate limit reached"));
    }

    return Promise.reject(error);
  }
);

export default api;
