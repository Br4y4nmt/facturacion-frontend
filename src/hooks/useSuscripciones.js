import { useEffect, useState, useCallback } from "react";
import {
  getSuscripciones,
  postCrearSuscripcion,
  postCancelarSuscripcion,
  postRenovarSuscripcion,
} from "@/services/suscripcionesService";

export function useSuscripciones() {
  const [suscripciones, setSuscripciones] = useState([]);
  const [stats, setStats] = useState({
    activas: 0,
    vencidas: 0,
    canceladas: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuscripciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getSuscripciones();

      setSuscripciones(data.suscripciones);
      setStats(data.stats);
    } catch (err) {
      console.error("Error al cargar suscripciones", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuscripciones();
  }, [fetchSuscripciones]);


  const crear = async (payload) => {
    await postCrearSuscripcion(payload);
    await fetchSuscripciones();
  };

  const cancelar = async (id, payload = {}) => {
    await postCancelarSuscripcion(id, payload);
    await fetchSuscripciones();
  };

  const renovar = async (id, payload = { meses: 1 }) => {
    await postRenovarSuscripcion(id, payload);
    await fetchSuscripciones();
  };

  return {
    suscripciones,
    stats,
    loading,
    error,
    crear,     // 👈 ahora existe y está bien definido
    cancelar,
    renovar,
    refetch: fetchSuscripciones,
  };
}
