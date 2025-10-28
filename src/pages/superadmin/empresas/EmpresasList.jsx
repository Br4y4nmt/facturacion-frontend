import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import api from "@/services/api";
import ModalEmpresa from "@/components/ui/ModalEmpresa";

export default function EmpresasList() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // 🔹 Obtener empresas
  const fetchEmpresas = async () => {
    try {
      const { data } = await api.get("/empresas");
      setEmpresas(data || []);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cambiar estado (Activa / Inactiva)
  const handleToggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = estadoActual === "Activa" ? "Inactiva" : "Activa";
      await api.put(`/empresas/${id}/estado`, { estado: nuevoEstado });

      setEmpresas((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, estado: nuevoEstado } : e
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat]">
      {/* 🔹 Encabezado principal */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#0B1437]" />
          <h1 className="text-lg font-semibold text-[#0B1437]">Empresas</h1>
        </div>

      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 bg-[#283046] hover:bg-[#0C102A] text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200"
      >
        <Plus size={16} /> Nuevo
      </button>
      </div>

      {/* 🔹 Contenedor principal */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Cabecera */}
        <div className="bg-[#0B1437] text-white px-6 py-5 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-medium tracking-wide">
            Listado de Empresas
          </h2>
        </div>

        {/* Tabla */}
       <div className="overflow-x-auto">
  <table className="w-full text-sm text-[#64748B]">
    <thead className="bg-white text-[#1E293B] uppercase text-xs border-b border-gray-200">
      <tr>
        <th className="px-6 py-4 text-left font-semibold">Nº</th>
        <th className="px-6 py-4 text-left font-semibold">RUC</th>
        <th className="px-6 py-4 text-left font-semibold">Razón Social</th>
        <th className="px-6 py-4 text-left font-semibold">Nombre Comercial</th>
        <th className="px-6 py-4 text-left font-semibold">Teléfono</th>
        <th className="px-6 py-4 text-left font-semibold">Estado</th>
        <th className="px-6 py-4 text-left font-semibold">Acciones</th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan="7" className="text-center py-6 text-gray-400">
            Cargando empresas...
          </td>
        </tr>
      ) : empresas.length === 0 ? (
        <tr>
          <td colSpan="7" className="text-center py-6 text-gray-400">
            No hay empresas registradas.
          </td>
        </tr>
      ) : (
        empresas.map((empresa, index) => (
          <tr
            key={empresa.id}
            className="border-b border-gray-100 hover:bg-[#F9FAFB] transition-all duration-150"
          >
            <td className="px-6 py-3 text-[#64748B]">{index + 1}</td>
            <td className="px-6 py-3 font-medium text-[#64748B]">
              {empresa.ruc}
            </td>
            <td className="px-6 py-3 text-[#64748B]">
              {empresa.razonSocial}
            </td>
            <td className="px-6 py-3 text-[#64748B]">
              {empresa.nombreComercial}
            </td>
            <td className="px-6 py-3 text-[#64748B]">
              {empresa.telefono || "—"}
            </td>

            {/* 🔘 Toggle de estado */}
            <td className="px-6 py-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={empresa.estado === "Activa" || empresa.estado === 1}
                  onChange={() =>
                    handleToggleEstado(empresa.id, empresa.estado)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
              </label>
            </td>

            {/* 🔹 Botones de acción */}
            <td className="px-6 py-3 flex items-center gap-2">
              <button className="flex items-center gap-1 text-white bg-[#0ea5e9] hover:bg-[#0284c7] px-3 py-1 rounded-md text-xs transition-all">
                <Edit size={14} /> Editar
              </button>
              <button className="flex items-center gap-1 text-white bg-[#ef4444] hover:bg-[#dc2626] px-3 py-1 rounded-md text-xs transition-all">
                <Trash2 size={14} /> Eliminar
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


      </div>
      <ModalEmpresa
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  onSubmit={(e) => {
    e.preventDefault();
    // Aquí puedes agregar tu lógica de creación de empresa
    setModalOpen(false);
  }}
/>

    </div>
  );
}
