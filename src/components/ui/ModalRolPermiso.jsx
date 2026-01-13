import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  X,
  RefreshCw,
  Check,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function ModalRol({
  isOpen,
  onClose,
  onSubmit,
  loading,
  rol,
  mode,
  modulosPermisos = [],
}) {
  const [form, setForm] = useState({ nombre: "", descripcion: "", permisos: [] });
  const [expandedModules, setExpandedModules] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && rol) {
      setForm({
        nombre: rol.nombre || "",
        descripcion: rol.descripcion || "",
        permisos: rol.permisos || [],
      });
      setExpandedModules(modulosPermisos.map((m) => m.id));
    } else {
      setForm({ nombre: "", descripcion: "", permisos: [] });
      setExpandedModules([]);
    }
  }, [isOpen, mode, rol, modulosPermisos]);

  if (!isOpen) return null;

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const togglePermiso = (permisoNombre) => {
    setForm((prev) => ({
      ...prev,
      permisos: prev.permisos.includes(permisoNombre)
        ? prev.permisos.filter((p) => p !== permisoNombre)
        : [...prev.permisos, permisoNombre],
    }));
  };

  const toggleAllModule = (modulo) => {
    const modulePermisos = (modulo.permisos || []).map((p) => p.nombre);
    const allSelected = modulePermisos.every((p) => form.permisos.includes(p));

    setForm((prev) => ({
      ...prev,
      permisos: allSelected
        ? prev.permisos.filter((p) => !modulePermisos.includes(p))
        : [...new Set([...prev.permisos, ...modulePermisos])],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl animate-fadeIn relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            
            <h2 className="text-lg font-semibold text-[#1E293B]">
              {mode === "create" ? "Nuevo Rol" : "Editar Rol"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* Datos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#475569]">
              <div>
                <label className="block mb-1 font-medium">Nombre del Rol</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none uppercase"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Descripción</label>
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                />
              </div>
            </div>

            {/* Permisos */}
            <div className="text-sm text-[#475569]">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium">
                  Permisos ({form.permisos.length} seleccionados)
                </label>
              </div>

              <div className="border border-gray-200 rounded-md overflow-hidden divide-y divide-gray-200">
                {modulosPermisos.map((modulo) => {
                  const ModuleIcon = modulo.icon || Settings;
                  const isExpanded = expandedModules.includes(modulo.id);
                  const modulePermisos = (modulo.permisos || []).map((p) => p.nombre);
                  const selectedCount = modulePermisos.filter((p) => form.permisos.includes(p)).length;
                  const allSelected =
                    modulePermisos.length > 0 && selectedCount === modulePermisos.length;

                  return (
                    <div key={modulo.id}>
                      {/* Module header */}
                      <div
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => toggleModule(modulo.id)}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          <ModuleIcon className="w-5 h-5 text-gray-600" />
                          <div className="flex flex-col">
                            <span className="font-medium text-[#1E293B]">{modulo.nombre}</span>
                            <span className="text-xs text-gray-500">
                              ({selectedCount}/{modulePermisos.length})
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAllModule(modulo);
                          }}
                          className={`text-xs px-2 py-1 rounded-md border transition ${
                            allSelected
                              ? "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {allSelected ? "Quitar todos" : "Seleccionar todos"}
                        </button>
                      </div>

                      {/* Permisos */}
                      {isExpanded && (
                        <div className="px-4 py-3 space-y-2 bg-white">
                          {(modulo.permisos || []).map((permiso) => (
                            <label
                              key={permiso.nombre}
                              className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition"
                            >
                              <input
                                type="checkbox"
                                checked={form.permisos.includes(permiso.nombre)}
                                onChange={() => togglePermiso(permiso.nombre)}
                                className="mt-0.5 w-4 h-4 text-[#1E293B] border-gray-300 rounded focus:ring-[#2C3E50]"
                              />
                              <div>
                                <p className="text-sm font-medium text-[#1E293B]">
                                  {permiso.descripcion || permiso.nombre}
                                </p>
                                <p className="text-xs text-gray-500">{permiso.nombre}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {modulosPermisos.length === 0 && (
                  <div className="px-4 py-4 text-sm text-gray-500">
                    No hay módulos/permisos disponibles.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[#1E293B] text-white hover:bg-[#0B1437] disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  
                  {mode === "create" ? "Crear Rol" : "Guardar cambios"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
