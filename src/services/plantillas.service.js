import api from '@/services/api';

export async function getPlantillas(params = {}) {
  const res = await api.get('/plantillas', { params });
  return res.data;
}

export async function uploadPlantilla(formData) {
  const res = await api.post('/plantillas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // backend returns { plantilla: { ... } }
  return res.data && res.data.plantilla ? res.data.plantilla : res.data;
}

export async function deletePlantilla(id) {
  const res = await api.delete(`/plantillas/${id}`);
  return res.data;
}
