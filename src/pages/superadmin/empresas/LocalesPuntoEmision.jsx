import React, { useState, useMemo, useEffect } from "react";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useLocales } from "@/hooks/useLocales";
import {
  MapPin,
  Building2,
  Plus,
  Edit3,
  Trash2,
  Search,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Store,
  Hash,
} from "lucide-react";


const StatCard = ({ icon: Icon, title, value, gradient }) => {
  const gradients = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-emerald-500 to-teal-600",
    purple: "from-purple-500 to-violet-600",
    amber: "from-amber-500 to-orange-500",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[gradient] || gradients.blue}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-br ${gradients[gradient] || gradients.blue} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ activo }) => {
  return activo ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      Activo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
      <span className="w-2 h-2 rounded-full bg-red-500"></span>
      Inactivo
    </span>
  );
};

const TipoBadge = ({ tipo }) => {
  const config = {
    PRINCIPAL: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Principal" },
    SUCURSAL: { bg: "bg-blue-100", text: "text-blue-700", label: "Sucursal" },
    ALMACEN: { bg: "bg-amber-100", text: "text-amber-700", label: "Almacén" },
    PUNTO_VENTA: { bg: "bg-teal-100", text: "text-teal-700", label: "Punto de Venta" },
  };

  const { bg, text, label } = config[tipo] || { bg: "bg-gray-100", text: "text-gray-700", label: tipo };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
};

const ModalLocal = ({ isOpen, onClose, onSubmit, loading, local, mode }) => {
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    direccion: "",
    ubigeo: "",
    tipo: "SUCURSAL",
    activo: true,
  });

  useEffect(() => {
    if (isOpen && mode === "edit" && local) {
      setForm({
        codigo: local.codigo || "",
        nombre: local.nombre || "",
        direccion: local.direccion || "",
        ubigeo: local.ubigeo || "",
        tipo: local.tipo || "SUCURSAL",
        activo: local.activo ?? true,
      });
    } else if (isOpen && mode === "create") {
      setForm({
        codigo: "",
        nombre: "",
        direccion: "",
        ubigeo: "",
        tipo: "SUCURSAL",
        activo: true,
      });
    }
  }, [isOpen, mode, local]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#1E293B]">
            {mode === "create" ? "Nuevo Local" : "Editar Local"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Código</label>
                <input
                  type="text"
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  placeholder="Ej: 0001"
                  maxLength={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none placeholder:text-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tipo</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none bg-white"
                >
                  <option value="PRINCIPAL">Principal</option>
                  <option value="SUCURSAL">Sucursal</option>
                  <option value="ALMACEN">Almacén</option>
                  <option value="PUNTO_VENTA">Punto de Venta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombre del Local</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Sucursal Miraflores"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none placeholder:text-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Av. Principal 123, Distrito, Ciudad"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none placeholder:text-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Ubigeo</label>
              <input
                type="text"
                name="ubigeo"
                value={form.ubigeo}
                onChange={handleChange}
                placeholder="Ej: 150101"
                maxLength={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1E293B] hover:bg-[#0f172a] rounded-md transition disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function LocalesPuntoEmision() {
  const { empresas, loading: loadingEmpresas, error: errorEmpresas } = useEmpresas();
  const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedLocal, setSelectedLocal] = useState(null);

  const {
    locales,
    loading,
    error: errorLocales,
    stats,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    refetch,
    createLocal,
    updateLocal,
    deleteLocal,
    toggleStatus,
  } = useLocales(selectedEmpresaId);

  useEffect(() => {
    if (!selectedEmpresaId && Array.isArray(empresas) && empresas.length > 0) {
      setSelectedEmpresaId(empresas[0].id);
    }
  }, [empresas, selectedEmpresaId]);

  const selectedEmpresa = useMemo(() => {
    return (empresas || []).find((e) => e.id === selectedEmpresaId) || null;
  }, [empresas, selectedEmpresaId]);

  const filteredLocales = useMemo(() => {
    return locales.filter((l) => {
      const matchSearch =
        !searchTerm ||
        l.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.direccion?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTipo = !filterTipo || l.tipo === filterTipo;

      return matchSearch && matchTipo;
    });
  }, [locales, searchTerm, filterTipo]);

  const handleOpenCreate = () => {
    setSelectedLocal(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleOpenEdit = (local) => {
    setSelectedLocal(local);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === "create") {
        await createLocal({
          ...formData,
          empresaId: selectedEmpresaId,
        });
      } else {
        await updateLocal(selectedLocal.id, formData);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async (local) => {
    if (!confirm(`¿Eliminar el local "${local.nombre}"?`)) return;
    try {
      await deleteLocal(local.id);
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const handleToggleStatus = async (local) => {
    try {
      await toggleStatus(local.id);
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  if (loadingEmpresas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
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
          <p className="text-gray-500">
            {errorEmpresas ? "No se pudo cargar la información." : "No hay empresas registradas."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="bg-gradient-to-r from-[#0B1437] via-[#1a2555] to-[#0B1437] text-white">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <MapPin className="w-7 h-7" />
                Locales / Puntos de Emisión
              </h1>
              <p className="text-indigo-200 text-sm mt-1">
                Gestiona los locales y puntos de emisión de comprobantes por empresa
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              disabled={!selectedEmpresaId}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Nuevo Local
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-indigo-200 mb-1 font-medium uppercase tracking-wide">
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

              {selectedEmpresa && (
                <div className="hidden lg:flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-indigo-300">RUC:</span>
                    <span className="ml-2 font-semibold">{selectedEmpresa.ruc}</span>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div>
                    <span className="text-indigo-300">Total Locales:</span>
                    <span className="ml-2 font-semibold">{stats.total}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, código o dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                placeholder:text-gray-400"              />
            </div>

            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
              <option value="">Todos los tipos</option>
              <option value="PRINCIPAL">Principal</option>
              <option value="SUCURSAL">Sucursal</option>
              <option value="ALMACEN">Almacén</option>
              <option value="PUNTO_VENTA">Punto de Venta</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Lista de Locales</h3>
            <p className="text-sm text-gray-500">{filteredLocales.length} locales encontrados</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-3">
                  <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 text-sm">Cargando locales...</p>
              </div>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white text-[#1E293B] uppercase text-xs border-b border-gray-200">
                <tr >
                  <th className="px-6 py-4 text-left font-semibold">Código</th>
                  <th className="px-6 py-4 text-left font-semibold">Local</th>
                  <th className="px-6 py-4 text-left font-semibold">Dirección</th>
                  <th className="px-6 py-4 text-left font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-left font-semibold">Series</th>
                  <th className="px-6 py-4 text-left font-semibold">Estado</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLocales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <MapPin className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No hay locales registrados</p>
                        <p className="text-gray-400 text-sm">Agrega el primer local para esta empresa</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLocales.map((local) => (
                    <tr
                        key={local.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                        >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="font-mono font-semibold text-gray-900">{local.codigo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{local.nombre}</p>
                        <p className="text-xs text-gray-500">Ubigeo: {local.ubigeo || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[280px] truncate">
                        {local.direccion}
                      </td>
                      <td className="px-6 py-4">
                        <TipoBadge tipo={local.tipo} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                          {local.seriesAsignadas} series
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge activo={local.activo} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(local)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(local)}
                            className={`p-2 rounded-lg transition ${
                              local.activo
                                ? "text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                                : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={local.activo ? "Desactivar" : "Activar"}
                          >
                            {local.activo ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(local)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>

      <ModalLocal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        loading={modalMode === "create" ? loadingCreate : loadingUpdate}
        local={selectedLocal}
        mode={modalMode}
      />
    </div>
  );
}
