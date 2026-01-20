import React from "react";
import { Routes, Route } from "react-router-dom";
import PlanesList from "./suscripciones/PlanesList";
import SuscripcionesActivas from "./suscripciones/SuscripcionesActivas";
import HistorialPagos from "./suscripciones/HistorialPagos";
import FacturasSistema from "./suscripciones/Facturas";


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
