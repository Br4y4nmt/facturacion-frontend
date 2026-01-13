import React, { useState } from "react";
import { Plus, Edit, Building2 } from "lucide-react";
import ModalEmpresa from "@/components/ui/ModalEmpresa";
import { useEmpresas } from "@/hooks/useEmpresas";
import ModalEmpresaEdit from "@/components/ui/ModalEmpresaEdit";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import SearchIcon from "@/components/icons/SearchIcon";

export default function EmpresasList() {
  const { empresas, loading, toggleEstado, createEmpresa, updateEmpresa, saving } = useEmpresas();
  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [empresaEdit, setEmpresaEdit] = useState(null);
  const [filterBy, setFilterBy] = useState("ruc"); 
  const [search, setSearch] = useState("");

  
  const handleCreate = async (payload) => {
      try {
        await createEmpresa(payload);
        setModalOpen(false);
      } catch (err) {
        console.error(err);
      }
    };

  const handleOpenEdit = (empresa) => {
    setEmpresaEdit(empresa);
    setEditOpen(true);
  };

  const filteredEmpresas = empresas.filter((e) => {
  const value = String(e?.[filterBy] ?? "").toLowerCase();
    return value.includes(search.toLowerCase().trim());
  });

  return (
    <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat]">
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

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        
        <div className="bg-[#0B1437] text-white px-6 py-5 rounded-t-lg flex items-center justify-between">
          
          <h2 className="text-xl font-medium tracking-wide">Listado de Empresas</h2>
        </div>
<div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#64748B]">Filtrar por:</span>

              <div className="relative w-64">
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setSearch("");
              }}
              className="
                w-full
                appearance-none
                border border-gray-300
                rounded-md
                px-3 pr-9 py-1.5
                text-sm text-[#0B1437]
                focus:ring-2 focus:ring-[#2C3E50]
                focus:outline-none
                bg-white
              "
            >
              <option value="ruc">RUC</option>
              <option value="razonSocial">Razón Social</option>
              <option value="nombreComercial">Nombre Comercial</option>
              <option value="telefono">Teléfono</option>
              <option value="email">Correo</option>
            </select>

            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

          </div>

            </div>

            <div className="flex-1">
              <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar"
                className="
                  w-full md:w-140
                  border border-gray-300
                  rounded-md
                  pl-9 pr-3 py-1.5
                  text-sm
                  placeholder:text-gray-300
                  focus:ring-2 focus:ring-[#2C3E50]
                  focus:outline-none
                "
              />
             <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            </div>
          </div>
        </div>
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
              ) : filteredEmpresas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                filteredEmpresas.map((empresa, index) => (
                  <tr
                    key={empresa.id}
                    className="border-b border-gray-100 hover:bg-[#F9FAFB] transition-all duration-150"
                  >
                    <td className="px-6 py-3 text-[#64748B]">{index + 1}</td>
                    <td className="px-6 py-3 font-medium text-[#64748B]">{empresa.ruc}</td>
                    <td className="px-6 py-3 text-[#64748B]">{empresa.razonSocial}</td>
                    <td className="px-6 py-3 text-[#64748B]">{empresa.nombreComercial}</td>
                    <td className="px-6 py-3 text-[#64748B]">{empresa.telefono || "—"}</td>

                    <td className="px-6 py-3">
                      {(() => {
                        const isActive = Boolean(empresa.estado);
                        return (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleEstado(empresa.id, isActive)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                          </label>
                        );
                      })()}
                    </td>


                    <td className="px-6 py-3 flex items-center gap-2">
                      <button onClick={() => handleOpenEdit(empresa)} className="flex items-center gap-1 text-white bg-[#0ea5e9] hover:bg-[#0284c7] px-3 py-1 rounded-md text-xs transition-all">
                        <Edit size={14} /> Editar
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
        onCreate={handleCreate}
        loading={saving}
      />

      <ModalEmpresaEdit
      isOpen={editOpen}
      onClose={() => {
        setEditOpen(false);
        setEmpresaEdit(null);
      }}
      empresa={empresaEdit}
      loading={saving}
      onUpdate={async (id, payload) => {
        await updateEmpresa(id, payload);
        setEditOpen(false);
        setEmpresaEdit(null);
      }}
    />

    </div>
  );
}
