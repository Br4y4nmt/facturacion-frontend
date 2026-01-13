import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ModalEmpresaEdit({
  isOpen,
  onClose,
  onUpdate,
  loading,
  empresa, 
}) {
  const [activeTab, setActiveTab] = useState("datos");

  const [form, setForm] = useState({
    ruc: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  useEffect(() => {
    if (isOpen && empresa) {
      setForm({
        ruc: empresa.ruc ?? "",
        razonSocial: empresa.razonSocial ?? "",
        nombreComercial: empresa.nombreComercial ?? "",
        direccion: empresa.direccion ?? "",
        telefono: empresa.telefono ?? "",
        email: empresa.email ?? "",
      });
      setActiveTab("datos");
    }
  }, [isOpen, empresa]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombreComercial: form.nombreComercial,
      direccion: form.direccion,
      telefono: form.telefono,
      email: form.email,
    };

    await onUpdate(empresa.id, payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl animate-fadeIn relative">

        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">
            Editar Empresa
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
            { id: "datos", label: "Datos de Empresa" },
            { id: "contacto", label: "Contacto" },
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

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {activeTab === "datos" && (
              <div className="grid grid-cols-2 gap-4 text-sm text-[#475569]">
                <div>
                  <label className="block mb-1 font-medium">RUC</label>
                  <input
                    type="text"
                    name="ruc"
                    value={form.ruc}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Razón Social</label>
                  <input
                    type="text"
                    name="razonSocial"
                    value={form.razonSocial}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Nombre Comercial
                  </label>
                  <input
                    type="text"
                    name="nombreComercial"
                    value={form.nombreComercial}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "contacto" && (
              <div className="grid grid-cols-2 gap-4 text-sm text-[#475569]">
                <div>
                  <label className="block mb-1 font-medium">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Correo (Empresa)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

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
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
