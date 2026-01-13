import api from "@/services/api";

export const empresasService = {
  list: async () => {
    const { data } = await api.get("/empresas");
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post("/empresas", payload);
    return data;
  },

  updateEstado: (id, estado) => api.put(`/empresas/${id}/estado`, { estado }),

  remove: async (id) => {
    const { data } = await api.delete(`/empresas/${id}`);
    return data;
  },
  
   update: async (id, payload) => {
    const { data } = await api.put(`/empresas/${id}`, payload);
    return data;
  },

};
