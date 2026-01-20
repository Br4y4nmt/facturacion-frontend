import React, { useMemo, useState } from "react";
import {
  Building2,
  RefreshCw,
  XCircle,
  Search,
  Plus,
} from "lucide-react";
import { useSuscripciones } from "@/hooks/useSuscripciones";
import ModalNuevaSuscripcion from "@/components/ui/ModalNuevaSuscripcion";
import ModalCancelacion from "@/components/ui/ModalCancelacion";

const BadgeEstado = ({ estado }) => {
  const map = {
    activa: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Activo",
    },
    vencida: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "Vencido",
    },
    cancelada: {
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
      label: "Cancelado",
    },
  };

  const cfg = map[estado] ?? {
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
    label: estado,
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export default function SuscripcionesActivas() {
  const {
    suscripciones,
    stats,
    loading,
    cancelar,
    renovar,
    crear,
  } = useSuscripciones();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedToCancel, setSelectedToCancel] = useState(null);

  const filtered = useMemo(() => {
    return suscripciones.filter(
      (s) =>
        s.empresa.toLowerCase().includes(search.toLowerCase()) ||
        s.plan.toLowerCase().includes(search.toLowerCase())
    );
  }, [suscripciones, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-r from-[#0B1437] via-[#1a2555] to-[#0B1437] text-white">
          <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  Suscripciones Activas
                </h1>
                <p className="text-indigo-200 text-sm">
                  Control y seguimiento de suscripciones por empresa
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
              >
                <Plus className="w-5 h-5" />
                Nueva Suscripción
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat title="Total" value={stats.total} />
              <Stat title="Activas" value={stats.activas} color="emerald" />
              <Stat title="Vencidas" value={stats.vencidas} color="amber" />
              <Stat title="Canceladas" value={stats.canceladas} color="red" />
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar empresa o plan..."
                className="
                    w-full
                    pl-9 pr-4 py-2
                    text-sm
                    text-slate-700
                    placeholder:text-gray-300
                    bg-white
                    border border-gray-300
                    rounded-md
                    focus:outline-none
                    focus:ring-2 focus:ring-[#2C3E50]
                    focus:border-transparent
                "
                />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Lista de Suscripciones
              </h3>
              <p className="text-sm text-gray-500">
                {filtered.length} suscripciones encontradas
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white text-[#1E293B] uppercase text-xs border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left font-semibold">
                        Empresa
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                        Plan
                        </th>
                        <th className="px-6 py-4 text-center font-semibold">
                        Estado
                        </th>
                        <th className="px-6 py-4 text-center font-semibold">
                        Vence
                        </th>
                        <th className="px-6 py-4 text-right font-semibold">
                        Acciones
                        </th>
                    </tr>
                    </thead>


                <tbody className="divide-y divide-gray-100 text-sm text-slate-500 font-normal">

                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">
                          No hay suscripciones registradas
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium text-slate-600">
                          {s.empresa}
                        </td>
                        <td className="px-6 py-4">{s.plan}</td>
                        <td className="px-6 py-4 text-center">
                          <BadgeEstado estado={s.estado} />
                        </td>
                        <td className="px-6 py-4 text-center">
                          {s.fechaFin}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            {s.estado !== "cancelada" && (
                              <button
                                onClick={() => {
                                  setSelectedToCancel(s);
                                  setShowCancelModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                title="Cancelar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            {s.estado === "vencida" && (
                              <button
                                onClick={() => renovar(s.id)}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                title="Renovar"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODALES */}
      <ModalNuevaSuscripcion
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={crear}
      />

      <ModalCancelacion
        isOpen={showCancelModal}
        subscription={selectedToCancel}
        loading={false}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedToCancel(null);
        }}
        onConfirm={async (motivo) => {
          if (!selectedToCancel) return;
          await cancelar(selectedToCancel.id, { motivo });
          setShowCancelModal(false);
          setSelectedToCancel(null);
        }}
      />
    </>
  );
}


const Stat = ({ title, value, color = "white" }) => {
  const map = {
    white: "text-white",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
  };

  return (
    <div className="bg-white/10 border border-white/10 rounded-xl p-4">
      <p className="text-xs text-indigo-200">{title}</p>
      <p className={`text-2xl font-bold ${map[color]}`}>{value}</p>
    </div>
  );
};
