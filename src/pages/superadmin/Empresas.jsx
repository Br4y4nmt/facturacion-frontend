import React from "react";
import { Routes, Route } from "react-router-dom";
import EmpresasList from "./empresas/EmpresasList";
import ConfiguracionFiscal from "./empresas/ConfiguracionFiscal";
import EmpresasSeriesNumeracion from "./empresas/EmpresasSeriesNumeracion";
import EstadoSunat from "./empresas/EstadoSunat";
import UsuariosPorEmpresa from "./empresas/UsuariosPorEmpresa";
import AuditoriaEstado from "./empresas/AuditoriaEstado";
import LocalesPuntoEmision from "./empresas/LocalesPuntoEmision";
import RolesPermisos from "./empresas/RolesPermisos";


export default function Empresas() {
  return (
    <Routes>
      <Route index element={<EmpresasList />} />
      <Route path="locales" element={<LocalesPuntoEmision />} />
      <Route path="usuarios" element={<UsuariosPorEmpresa />} />
      <Route path="roles" element={<RolesPermisos />} />
      <Route path="configuracion" element={<ConfiguracionFiscal />} />
      <Route path="series" element={<EmpresasSeriesNumeracion />} />
      <Route path="sunat" element={<EstadoSunat />} />
      <Route path="auditoria" element={<AuditoriaEstado />} />
    </Routes>
  );
}
