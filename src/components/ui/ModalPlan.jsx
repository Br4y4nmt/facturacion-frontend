import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ModalPlan = ({ isOpen, onClose, onSubmit, loading, plan, mode }) => {
  const [activeTab, setActiveTab] = useState("datos");

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precioMensual: "",
    precioAnual: "",
    maxComprobantes: "",
    maxUsuarios: "",
    maxSeries: "",
    caracteristicas: "",
    color: "#3B82F6",
    activo: true,
    popular: false,
    trial: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && mode === "edit" && plan) {
      setForm({
        nombre: plan.nombre || "",
        descripcion: plan.descripcion || "",
        precioMensual: plan.precioMensual?.toString() || "",
        precioAnual: plan.precioAnual?.toString() || "",
        maxComprobantes:
          plan.maxComprobantes === -1 ? "-1" : plan.maxComprobantes?.toString() || "",
        maxUsuarios: plan.maxUsuarios === -1 ? "-1" : plan.maxUsuarios?.toString() || "",
        maxSeries: plan.maxSeries === -1 ? "-1" : plan.maxSeries?.toString() || "",
        caracteristicas: (plan.caracteristicas || []).join("\n"),
        color: plan.color || "#3B82F6",
        activo: plan.activo ?? true,
        popular: plan.popular ?? false,
        trial: plan.trial ?? false,
      });
      setErrors({});
      setActiveTab("datos");
    } else if (isOpen && mode === "create") {
      setForm({
        nombre: "",
        descripcion: "",
        precioMensual: "",
        precioAnual: "",
        maxComprobantes: "",
        maxUsuarios: "",
        maxSeries: "",
        caracteristicas: "",
        color: "#3B82F6",
        activo: true,
        popular: false,
        trial: false,
      });
      setErrors({});
      setActiveTab("datos");
    }
  }, [isOpen, mode, plan]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!form.precioMensual && form.precioMensual !== "0")
      newErrors.precioMensual = "El precio mensual es requerido";
    if (!form.maxComprobantes) newErrors.maxComprobantes = "Límite de comprobantes requerido";
    if (!form.maxUsuarios) newErrors.maxUsuarios = "Límite de usuarios requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: form.nombre.toUpperCase().trim(),
      descripcion: form.descripcion.trim(),
      precioMensual: parseFloat(form.precioMensual) || 0,
      precioAnual: parseFloat(form.precioAnual) || (parseFloat(form.precioMensual) || 0) * 10,
      maxComprobantes: parseInt(form.maxComprobantes) || 100,
      maxUsuarios: parseInt(form.maxUsuarios) || 1,
      maxSeries: parseInt(form.maxSeries) || 1,
      caracteristicas: form.caracteristicas.split("\n").filter((c) => c.trim()),
      color: form.color,
      activo: form.activo,
      popular: form.popular,
      trial: form.trial,
    };

    onSubmit(payload);
  };

  const colores = [
    { value: "#3B82F6", label: "Azul" },
    { value: "#8B5CF6", label: "Violeta" },
    { value: "#F59E0B", label: "Ámbar" },
    { value: "#10B981", label: "Verde" },
    { value: "#EF4444", label: "Rojo" },
    
  ];

  const inputBase =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-[#475569] focus:ring-2 focus:ring-[#2C3E50] focus:outline-none";
  const inputError = "border-red-300";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl animate-fadeIn relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">
            {mode === "create" ? "Nuevo Plan" : "Editar Plan"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs (mismo estilo que ModalEmpresa) */}
        <div className="flex items-center border-b border-gray-200 px-6">
          {[
            { id: "datos", label: "Datos del Plan" },
            { id: "limites", label: "Límites y Precios" },
            { id: "extras", label: "Características" },
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
            {/* TAB: datos */}
            {activeTab === "datos" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#475569]">
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">Nombre del Plan *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: BÁSICO, PROFESIONAL"
                    className={`${inputBase} uppercase ${errors.nombre ? inputError : ""}`}
                  />
                  {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                </div>

                <div>
                  <label className="block mb-1 font-medium">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {colores.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, color: c.value }))}
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          form.color === c.value ? "border-[#2C3E50] scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="block mb-1 font-medium">Descripción</label>
                  <input
                    type="text"
                    value={form.descripcion}
                    onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción breve del plan"
                    className={inputBase}
                  />
                </div>

                <div className="md:col-span-3">
                  <div className="flex flex-wrap gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.activo}
                        onChange={(e) => setForm((prev) => ({ ...prev, activo: e.target.checked }))}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-[#2C3E50]"
                      />
                      <span className="text-sm text-gray-700">Activo</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.popular}
                        onChange={(e) => setForm((prev) => ({ ...prev, popular: e.target.checked }))}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-[#2C3E50]"
                      />
                      <span className="text-sm text-gray-700">Marcar como Popular</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.trial}
                        onChange={(e) => setForm((prev) => ({ ...prev, trial: e.target.checked }))}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-[#2C3E50]"
                      />
                      <span className="text-sm text-gray-700">Plan de Prueba</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: limites */}
            {activeTab === "limites" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#475569]">
                <div>
                  <label className="block mb-1 font-medium">Precio Mensual (S/) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precioMensual}
                    onChange={(e) => setForm((prev) => ({ ...prev, precioMensual: e.target.value }))}
                    placeholder="0.00"
                    className={`${inputBase} ${errors.precioMensual ? inputError : ""}`}
                  />
                  {errors.precioMensual && (
                    <p className="text-xs text-red-500 mt-1">{errors.precioMensual}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-medium">Precio Anual (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.precioAnual}
                    onChange={(e) => setForm((prev) => ({ ...prev, precioAnual: e.target.value }))}
                    placeholder="Precio mensual x 10"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Comprobantes/mes *</label>
                  <input
                    type="number"
                    value={form.maxComprobantes}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxComprobantes: e.target.value }))}
                    placeholder="100"
                    className={`${inputBase} ${errors.maxComprobantes ? inputError : ""}`}
                  />
                  {errors.maxComprobantes && (
                    <p className="text-xs text-red-500 mt-1">{errors.maxComprobantes}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">-1 = ilimitado</p>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Usuarios *</label>
                  <input
                    type="number"
                    value={form.maxUsuarios}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxUsuarios: e.target.value }))}
                    placeholder="2"
                    className={`${inputBase} ${errors.maxUsuarios ? inputError : ""}`}
                  />
                  {errors.maxUsuarios && (
                    <p className="text-xs text-red-500 mt-1">{errors.maxUsuarios}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">-1 = ilimitado</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">Series</label>
                  <input
                    type="number"
                    value={form.maxSeries}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxSeries: e.target.value }))}
                    placeholder="2"
                    className={inputBase}
                  />
                  <p className="text-xs text-gray-400 mt-1">-1 = ilimitado</p>
                </div>
              </div>
            )}

            {/* TAB: extras */}
            {activeTab === "extras" && (
              <div className="grid grid-cols-1 gap-4 text-sm text-[#475569]">
                <div>
                  <label className="block mb-1 font-medium">Características (una por línea)</label>
                  <textarea
                    value={form.caracteristicas}
                    onChange={(e) => setForm((prev) => ({ ...prev, caracteristicas: e.target.value }))}
                    placeholder={"Facturas y Boletas\nSoporte por email\nDashboard básico"}
                    rows={5}
                    className={`${inputBase} resize-none`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer (mismo estilo que ModalEmpresa) */}
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
              className="px-4 py-2 rounded-md bg-[#1E293B] text-white hover:bg-[#0B1437] disabled:opacity-60"
            >
              {loading ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPlan;
