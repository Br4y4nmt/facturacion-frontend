import api from "@/services/api";

export const getConfigFiscalByEmpresa = async (empresaId) => {
  const { data } = await api.get(`/configfiscal/empresas/${empresaId}`);
  return data;
};

export const updateConfigFiscalByEmpresa = async (empresaId, payload) => {
  const { data } = await api.put(`/configfiscal/empresas/${empresaId}`, payload);
  return data;
};

export const uploadCertificadoByEmpresa = async (empresaId, file) => {
  const form = new FormData();
  form.append("certificado", file); 

  const { data } = await api.post(
    `/configfiscal/empresas/${empresaId}/certificado`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return data;
};