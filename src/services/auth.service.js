import api from "./api";


export const login = async ({ email, password }) => {
  const response = await api.post("/usuarios/login", { email, password });
  return response.data; 
};
