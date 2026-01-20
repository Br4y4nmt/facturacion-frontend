import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import { useEmpresas } from "@/hooks/useEmpresas";
import { usePlanes } from "@/hooks/usePlanes";

export default function ModalNuevaSuscripcion({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [activeTab] = useState("datos");

  const [form, setForm] = useState({
    empresaId: "",
    planId: "",
    fechaInicio: "",
    meses: 1,
  });

  const { empresas } = useEmpresas();
  const { planes } = usePlanes();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "meses" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl animate-fadeIn relative">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">
            Nueva Suscripción
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center border-b border-gray-200 px-6">
          <button
            type="button"
            className={`relative py-3 px-4 text-sm font-medium ${
              activeTab === "datos"
                ? "text-[#2C3E50] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2C3E50]"
                : "text-gray-500"
            }`}
          >
            Datos de Suscripción
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 text-sm text-[#475569]">
              <div className="col-span-2">
                <label className="block mb-1 font-medium">
                  Empresa <span className="text-red-500">*</span>
                </label>
                <select
                  name="empresaId"
                  value={form.empresaId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                  required
                >
                  <option value="">Seleccionar empresa</option>
                  {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.razonSocial}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block mb-1 font-medium">
                  Plan <span className="text-red-500">*</span>
                </label>
                <select
                  name="planId"
                  value={form.planId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                  required
                >
                  <option value="">Seleccionar plan</option>
                  {planes
                    .filter((p) => p.activo)
                    .map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.nombre} – S/ {plan.precioMensual} / mes
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Fecha Inicio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="fechaInicio"
                    value={form.fechaInicio}
                    onChange={handleChange}
                    className="w-full pl-9 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Duración</label>
                <select
                  name="meses"
                  value={form.meses}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                >
                  <option value={1}>1 mes</option>
                  <option value={3}>3 meses</option>
                  <option value={6}>6 meses</option>
                  <option value={12}>12 meses</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-[#1E293B] text-white hover:bg-[#0B1437] disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Crear Suscripción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
