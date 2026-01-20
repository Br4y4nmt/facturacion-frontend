import api from '@/services/api';

const BASE = '/facturas';

export async function getFacturas(params = {}) {
  const response = await api.get(BASE, { params });
  // server returns an array of mapped facturas
  return response.data;
}

export async function getFacturaById(id) {
  const response = await api.get(`${BASE}/${id}`);
  // server returns { comprobante }
  return response.data.comprobante || null;
}

export default {
  getFacturas,
  getFacturaById,
};
