import React from "react";
import { Routes, Route } from "react-router-dom";
import PlanesList from "./suscripciones/PlanesList";

// Placeholders para las otras vistas (se crearán después)
const SuscripcionesActivas = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">Suscripciones Activas</h1>
    <p className="text-gray-500 mt-2">Vista en desarrollo...</p>
  </div>
);

const HistorialPagos = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">Historial de Pagos</h1>
    <p className="text-gray-500 mt-2">Vista en desarrollo...</p>
  </div>
);

const FacturasSistema = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">Facturas del Sistema</h1>
    <p className="text-gray-500 mt-2">Vista en desarrollo...</p>
  </div>
);

export default function Suscripciones() {
  return (
    <Routes>
      <Route path="planes" element={<PlanesList />} />
      <Route path="activas" element={<SuscripcionesActivas />} />
      <Route path="pagos" element={<HistorialPagos />} />
      <Route path="facturas" element={<FacturasSistema />} />
    </Routes>
  );
}
