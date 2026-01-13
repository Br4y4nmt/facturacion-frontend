import React, { useState, useMemo, useEffect } from "react";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useRoles } from "@/hooks/useRoles";
import {
  ShieldCheck,
  Users,
  Plus,
  Edit3,
  Trash2,
  Search,
  AlertTriangle,
  Check,
  X,
  Lock,
  Settings,
} from "lucide-react";

import ModalRolPermiso from "@/components/ui/ModalRolPermiso";

export default function RolesPermisos() {
  const { empresas, loading: loadingEmpresas, error: errorEmpresas } = useEmpresas();

  const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("roles"); // roles | matriz

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create | edit
  const [selectedRol, setSelectedRol] = useState(null);

  const {
    roles,
    modulos,
    stats,
    loadingCreate,
    loadingUpdate,
    createRol,
    updateRol,
    deleteRol,
  } = useRoles();

  // ✅ SIN fallback, solo backend
  const modulosPermisos = Array.isArray(modulos) ? modulos : [];

  // Auto-seleccionar primera empresa
  useEffect(() => {
    if (!selectedEmpresaId && Array.isArray(empresas) && empresas.length > 0) {
      setSelectedEmpresaId(empresas[0].id);
    }
  }, [empresas, selectedEmpresaId]);

  // Filtrar roles
  const filteredRoles = useMemo(() => {
    return (roles || []).filter((r) => {
      return (
        !searchTerm ||
        r.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [roles, searchTerm]);

  // Handlers modal
  const handleOpenCreate = () => {
    setSelectedRol(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleOpenEdit = (rol) => {
    setSelectedRol(rol);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === "create") {
        await createRol(formData);
      } else {
        await updateRol(selectedRol.id, formData);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.error || "Error al guardar el rol");
    }
  };

  const handleDelete = async (rol) => {
    if (rol.esDefault) {
      alert("No puedes eliminar un rol del sistema.");
      return;
    }
    if (rol.usuariosAsignados > 0) {
      alert(`Este rol tiene ${rol.usuariosAsignados} usuarios asignados. Reasígnalos primero.`);
      return;
    }
    if (!confirm(`¿Eliminar el rol "${rol.nombre}"?`)) return;

    try {
      await deleteRol(rol.id);
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert(err.response?.data?.error || "Error al eliminar el rol");
    }
  };

  // Estados de carga
  if (loadingEmpresas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (errorEmpresas || !empresas?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {errorEmpresas ? "Error al cargar" : "Sin empresas"}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1437] via-[#1a2555] to-[#0B1437] text-white">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-7 h-7" />
                Roles y Permisos
              </h1>
              <p className="text-indigo-200 text-sm mt-1">
                Gestiona roles y permisos de acceso al sistema
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30"
            >
              <Plus className="w-5 h-5" />
              Nuevo Rol
            </button>
          </div>

          {/* Selector de empresa */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-indigo-200 mb-1.5 font-medium uppercase tracking-wide">
                  Empresa
                </label>
                <select
                  value={selectedEmpresaId || ""}
                  onChange={(e) => setSelectedEmpresaId(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-white/30 focus:outline-none"
                >
                  {empresas?.map((e) => (
                    <option key={e.id} value={e.id} className="text-gray-900 bg-white">
                      {e.ruc} — {e.razonSocial}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden lg:flex items-center gap-6 text-sm">
                <div>
                  <span className="text-indigo-300">Roles:</span>
                  <span className="ml-2 font-semibold">{stats?.total ?? 0}</span>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <span className="text-indigo-300">Usuarios:</span>
                  <span className="ml-2 font-semibold">{stats?.totalUsuarios ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("roles")}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  viewMode === "roles"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Vista Roles
              </button>
              <button
                onClick={() => setViewMode("matriz")}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  viewMode === "matriz"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Matriz Permisos
              </button>
            </div>
          </div>
        </div>

        {/* Vista Roles */}
        {viewMode === "roles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoles.map((rol) => (
              <div
                key={rol.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition">
                        <ShieldCheck className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{rol.nombre}</h3>
                        <p className="text-xs text-gray-500">{rol.descripcion}</p>
                      </div>
                    </div>

                    {rol.esDefault && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        Sistema
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Lock className="w-4 h-4" />
                      <span>{rol.permisos?.length ?? 0} permisos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{rol.usuariosAsignados ?? 0} usuarios</span>
                    </div>
                  </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => handleOpenEdit(rol)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition"
                        title="Editar"
                        type="button"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Editar</span>
                    </button>

                    {!rol.esDefault && (
                        <button
                        onClick={() => handleDelete(rol)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Eliminar"
                        type="button"
                        >
                        <Trash2 className="w-4 h-4" />
                        
                        </button>
                    )}
                    </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista Matriz */}
        {viewMode === "matriz" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Matriz de Permisos</h3>
              <p className="text-sm text-gray-500">Vista comparativa de permisos por rol</p>
            </div>

            {/* Si aún no hay módulos del backend */}
            {modulosPermisos.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                No hay módulos/permisos disponibles (backend aún no devolvió datos).
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">
                        Permiso
                      </th>
                      {filteredRoles.map((rol) => (
                        <th
                          key={rol.id}
                          className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase min-w-[100px]"
                        >
                          {rol.nombre}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {modulosPermisos.map((modulo) => {
                      const ModuleIcon = modulo.icon || Settings;

                      return (
                        <React.Fragment key={modulo.id}>
                          <tr className="bg-gray-50/50">
                            <td
                              colSpan={filteredRoles.length + 1}
                              className="px-4 py-2 text-sm font-semibold text-gray-700"
                            >
                              <div className="flex items-center gap-2">
                                <ModuleIcon className="w-4 h-4" />
                                {modulo.nombre}
                              </div>
                            </td>
                          </tr>

                          {(modulo.permisos || []).map((permiso) => (
                            <tr key={permiso.nombre || permiso.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm text-gray-600 sticky left-0 bg-white">
                                {permiso.descripcion || permiso.nombre}
                              </td>

                              {filteredRoles.map((rol) => (
                                <td
                                  key={`${rol.id}-${permiso.nombre}`}
                                  className="px-4 py-2 text-center"
                                >
                                  {(rol.permisos || []).includes(permiso.nombre) ? (
                                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                  ) : (
                                    <X className="w-5 h-5 text-gray-300 mx-auto" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalRolPermiso
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        loading={modalMode === "create" ? loadingCreate : loadingUpdate}
        rol={selectedRol}
        mode={modalMode}
        modulosPermisos={modulosPermisos}
      />
    </div>
  );
}
