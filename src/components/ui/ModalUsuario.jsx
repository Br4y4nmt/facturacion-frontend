import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ModalUsuario({
  isOpen,
  onClose,
  onSubmit,
  loading,
  usuario = null,
  mode = "create", // create | edit
}) {
  const [activeTab, setActiveTab] = useState("datos");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "OPERADOR",
    activo: true,
  });

  // Cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (isOpen && mode === "edit" && usuario) {
      setForm({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        password: "",
        rol: usuario.rol || "OPERADOR",
        activo: usuario.activo ?? true,
      });
    } else if (isOpen && mode === "create") {
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        rol: "OPERADOR",
        activo: true,
      });
    }
    setActiveTab("datos");
  }, [isOpen, mode, usuario]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // En modo edición, solo enviar password si se llenó
    if (mode === "edit" && !form.password) {
      const { password, ...dataWithoutPassword } = form;
      await onSubmit(dataWithoutPassword);
    } else {
      await onSubmit(form);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl animate-fadeIn relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">
            {mode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 px-6">
          {[
            { id: "datos", label: "Datos Personales" },
            { id: "acceso", label: "Acceso y Permisos" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`relative py-3 px-4 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-[#2C3E50] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2C3E50]"
                  : "text-gray-500 hover:text-[#2C3E50]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Tab: Datos Personales */}
            {activeTab === "datos" && (
              <div className="grid grid-cols-2 gap-4 text-sm text-[#475569]">
                <div>
                  <label className="block mb-1 font-medium">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese el nombre"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="Ingrese el apellido"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-1 font-medium">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Tab: Acceso y Permisos */}
            {activeTab === "acceso" && (
              <div className="grid grid-cols-2 gap-4 text-sm text-[#475569]">
                <div>
                  <label className="block mb-1 font-medium">Rol</label>
                  <select
                    name="rol"
                    value={form.rol}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none bg-white"
                  >
                    <option value="ADMIN_EMPRESA">Administrador de Empresa</option>
                    <option value="OPERADOR">Operador</option>
                    <option value="CONTADOR">Contador</option>
                    <option value="USER">Usuario</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Estado</label>
                  <select
                    name="activo"
                    value={form.activo ? "true" : "false"}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        activo: e.target.value === "true",
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none bg-white"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block mb-1 font-medium">
                    {mode === "create" ? "Contraseña" : "Nueva Contraseña"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={
                      mode === "create"
                        ? "Ingrese la contraseña"
                        : "Dejar vacío para mantener la actual"
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                    {...(mode === "create" ? { required: true } : {})}
                  />
                  {mode === "edit" && (
                    <p className="text-xs text-gray-400 mt-1">
                      Solo complete este campo si desea cambiar la contraseña
                    </p>
                  )}
                </div>

                {/* Descripción de roles */}
                <div className="col-span-2 mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Descripción de Roles:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li><span className="font-medium text-[#2C3E50]">Administrador de Empresa:</span> Acceso completo a la gestión de la empresa</li>
                    <li><span className="font-medium text-[#2C3E50]">Operador:</span> Puede crear y gestionar comprobantes</li>
                    <li><span className="font-medium text-[#2C3E50]">Contador:</span> Acceso a reportes y documentos fiscales</li>
                    <li><span className="font-medium text-[#2C3E50]">Usuario:</span> Acceso básico de solo lectura</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[#1E293B] text-white hover:bg-[#0B1437] disabled:opacity-60 transition"
            >
              {loading ? "Guardando..." : mode === "create" ? "Crear Usuario" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
