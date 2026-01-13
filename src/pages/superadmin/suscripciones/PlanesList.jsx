import React, { useState, useMemo } from "react";
import ModalPlan from "@/components/ui/ModalPlan";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Search,
  Check,
  X,
  Users,
  FileText,
  Zap,
  Crown,
  Star,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePlanes } from "@/hooks/usePlanes";



const StatCard = ({ icon: Icon, title, value, subtitle, gradient }) => {
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
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-br ${gradients[gradient] || gradients.blue} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const formatPrice = (price) => {
  if (price === 0) return "GRATIS";
  if (price === -1) return "Consultar";
  return `S/ ${price.toFixed(2)}`;
};

const formatLimit = (value) => {
  if (value === -1) return "Ilimitado";
  return value.toString();
};



// ============================================
// CARD DE PLAN
// ============================================

const PlanCard = ({ plan, onEdit, onDelete, onToggle }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative ${
        !plan.activo ? "opacity-60" : ""
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            <Star className="w-3 h-3 fill-current" />
            Popular
          </span>
        </div>
      )}

      {/* Trial badge */}
      {plan.trial && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <Zap className="w-3 h-3" />
            Prueba
          </span>
        </div>
      )}

      {/* Header con color */}
      <div
        className="px-6 py-5 text-white"
        style={{ backgroundColor: plan.color || "#3B82F6" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold">{plan.nombre}</h3>
        </div>
        <p className="text-white/80 text-sm">{plan.descripcion}</p>
      </div>

      {/* Precio */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(plan.precioMensual)}
          </span>
          {plan.precioMensual > 0 && (
            <span className="text-gray-500 text-sm">/mes</span>
          )}
        </div>
        {plan.precioAnual > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            o {formatPrice(plan.precioAnual)}/año (2 meses gratis)
          </p>
        )}
      </div>

      {/* Límites */}
      <div className="px-6 py-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <FileText className="w-4 h-4" />
            Comprobantes/mes
          </span>
          <span className="font-semibold text-gray-900">
            {formatLimit(plan.maxComprobantes)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            Usuarios
          </span>
          <span className="font-semibold text-gray-900">
            {formatLimit(plan.maxUsuarios)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-600">
            <Zap className="w-4 h-4" />
            Series
          </span>
          <span className="font-semibold text-gray-900">
            {formatLimit(plan.maxSeries)}
          </span>
        </div>
      </div>

      {/* Características expandibles */}
      {plan.caracteristicas?.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition w-full"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Ver características ({plan.caracteristicas.length})
          </button>
          {expanded && (
            <ul className="mt-3 space-y-2">
              {plan.caracteristicas.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Empresas suscritas */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            <strong className="text-gray-900">{plan.empresasCount || 0}</strong> empresas suscritas
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 p-4 border-t border-gray-100">
        <button
          onClick={() => onToggle(plan.id)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition flex-1 justify-center ${
            plan.activo
              ? "text-gray-600 hover:bg-gray-100"
              : "text-emerald-600 hover:bg-emerald-50"
          }`}
        >
          <span
    className={`relative inline-flex w-11 h-6 rounded-full transition ${
        plan.activo ? "bg-emerald-500" : "bg-gray-300"
    }`}
    >
    <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
        plan.activo ? "translate-x-5" : "translate-x-0"
        }`}
    />
    </span>
    <span className="font-medium">{plan.activo ? "Activo" : "Inactivo"}</span>

        </button>
        <button
          onClick={() => onEdit(plan)}
          className="flex items-center justify-center px-3 py-2 rounded-lg transition text-gray-400 hover:text-blue-600 hover:bg-blue-50"

        >
          <Edit3 className="w-4 h-4" />
        </button>
        {plan.empresasCount === 0 && (
          <button
            onClick={() => onDelete(plan)}
            className="flex items-center justify-center px-3 py-2 rounded-lg transition text-gray-400 hover:text-red-600 hover:bg-red-50"

          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function PlanesList() {
  const {
    planes,
    loading,
    error,
    stats,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    refetch,
    createPlan,
    updatePlan,
    deletePlan,
    toggleEstado,
  } = usePlanes();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Filtrar planes
  const filteredPlanes = useMemo(() => {
    return planes.filter((p) => {
      return (
        !searchTerm ||
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [planes, searchTerm]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedPlan(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleOpenEdit = (plan) => {
    setSelectedPlan(plan);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === "create") {
        await createPlan(formData);
      } else {
        await updatePlan(selectedPlan.id, formData);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.error || "Error al guardar el plan");
    }
  };

  const handleDelete = async (plan) => {
    if (plan.empresasCount > 0) {
      alert(`Este plan tiene ${plan.empresasCount} empresas suscritas. No se puede eliminar.`);
      return;
    }
    if (!confirm(`¿Eliminar el plan "${plan.nombre}"?`)) return;

    try {
      await deletePlan(plan.id);
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert(err.response?.data?.error || "Error al eliminar el plan");
    }
  };

  const handleToggle = async (planId) => {
    try {
      await toggleEstado(planId);
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Cargando planes...</p>
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
                <Package className="w-7 h-7" />
                Planes de Servicio
              </h1>
              <p className="text-indigo-200 text-sm mt-1">
                Gestiona los planes y precios para tus clientes
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30"
            >
              <Plus className="w-5 h-5" />
              Nuevo Plan
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-indigo-200 text-xs uppercase tracking-wide">Total Planes</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-indigo-200 text-xs uppercase tracking-wide">Activos</p>
              <p className="text-2xl font-bold mt-1 text-emerald-400">{stats.activos}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-indigo-200 text-xs uppercase tracking-wide">Inactivos</p>
              <p className="text-2xl font-bold mt-1 text-gray-400">{stats.inactivos}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-indigo-200 text-xs uppercase tracking-wide">Empresas Suscritas</p>
              <p className="text-2xl font-bold mt-1 text-amber-400">{stats.totalEmpresas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar planes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Grid de Planes */}
        {filteredPlanes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay planes</h3>
            <p className="text-gray-500 mb-4">Crea tu primer plan de servicio</p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Crear Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlanes.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}


      </div>

      {/* Modal */}
      <ModalPlan
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        loading={modalMode === "create" ? loadingCreate : loadingUpdate}
        plan={selectedPlan}
        mode={modalMode}
      />
    </div>
  );
}
