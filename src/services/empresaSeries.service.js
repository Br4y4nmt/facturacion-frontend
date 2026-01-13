import api from "@/services/api";

export const empresasService = {
  list: async () => {
    const { data } = await api.get("/empresas");
    return data;
  },

  series: async (empresaId) => {
    const { data } = await api.get(`/empresa_series/${empresaId}/series`);
    return data;
  },

  updateSeries: async (empresaId, payload) => {
    const { data } = await api.put(`/empresa_series/${empresaId}/series`, payload);
    return data;
  },
};
