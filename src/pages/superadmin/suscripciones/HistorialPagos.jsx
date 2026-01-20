import React, { useEffect, useMemo, useState } from "react";
import { Search, FileText, Download, RefreshCw } from "lucide-react";import { getPagos } from "@/services/pagos.service";
import ModalVerPago from "@/components/ui/ModalVerPago";
import ModalComprobantePago from "@/components/ui/ModalComprobantePagoS";

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

const BadgeEstado = ({ estado }) => {
  const map = {
    success: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    failed: "bg-red-50 text-red-700",
  };
  const cfg = map[estado] || "bg-gray-50 text-gray-700";
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg}`}>{estado?.toUpperCase()}</span>;
};

export default function HistorialPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterEmpresa, setFilterEmpresa] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [stats, setStats] = useState({ total: 0, totalAmount: 0, success: 0, pending: 0, failed: 0 });
  const [empresas, setEmpresas] = useState([]);
  const [showVerModal, setShowVerModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [showComprobante, setShowComprobante] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getPagos();
        if (!mounted) return;
        setPagos(res.pagos || []);
        setEmpresas(Array.from(new Set((res.pagos || []).map((p) => p.empresa))));
        const total = (res.pagos || []).length;
        const totalAmount = (res.pagos || []).reduce((s, p) => s + (p.monto || 0), 0);
        const success = (res.pagos || []).filter((p) => p.estado === "success").length;
        const pending = (res.pagos || []).filter((p) => p.estado === "pending").length;
        const failed = (res.pagos || []).filter((p) => p.estado === "failed").length;
        setStats({ total, totalAmount, success, pending, failed });
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const filtered = useMemo(() => {
    return pagos.filter((p) => {
      const matchSearch =
        !search ||
        (p.empresa || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.descripcion || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.metodo || "").toLowerCase().includes(search.toLowerCase());
      const matchEmpresa = !filterEmpresa || p.empresa === filterEmpresa;
      const matchEstado = !filterEstado || p.estado === filterEstado;
      return matchSearch && matchEmpresa && matchEstado;
    });
  }, [pagos, search, filterEmpresa, filterEstado]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
    const handleVer = (pago) => {
    setPagoSeleccionado(pago);
    setShowVerModal(true);
    };
    const handleComprobante = (pago) => {
    setPagoSeleccionado(pago);
    setShowComprobante(true);
    };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#0B1437] via-[#1a2555] to-[#0B1437] text-white">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FileText className="w-6 h-6" /> Historial de Pagos
              </h1>
              <p className="text-indigo-200 text-sm mt-1">Registro de cobros y transacciones por empresa</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:grid grid-cols-3 gap-3">
                <Stat title="Pagos" value={stats.total} />
                <Stat title="Monto total" value={`S/ ${stats.totalAmount.toFixed(2)}`} />
                <Stat title="Exitosos" value={stats.success} color="emerald" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por empresa, método o descripción..." className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm" />
          </div>

          <select value={filterEmpresa} onChange={(e) => setFilterEmpresa(e.target.value)} className="px-4 py-2 border rounded-lg text-sm">
            <option value="">Todas las empresas</option>
            {empresas.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>

          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="px-4 py-2 border rounded-lg text-sm">
            <option value="">Todos los estados</option>
            <option value="success">Exitosos</option>
            <option value="pending">Pendientes</option>
            <option value="failed">Fallidos</option>
          </select>

          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-100 rounded-lg text-sm flex items-center gap-2"> <RefreshCw className="w-4 h-4" /> Refrescar</button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Transacciones</h3>
            <p className="text-sm text-gray-500">Se muestran {filtered.length} registros</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Descripción</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{p.empresa}</td>
                    <td className="px-4 py-3">{p.descripcion}</td>
                    <td className="px-4 py-3">{p.metodo || "-"}</td>
                    <td className="px-4 py-3">S/ {Number(p.monto || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">{new Date(p.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3"> <BadgeEstado estado={p.estado} /> </td>
                   <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">

                        {/* Ver detalle */}
                        <button
                        onClick={() => handleVer(p)}
                        className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition"
                        title="Ver detalle"
                        >
                        <FileText className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => handleComprobante(p)}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition"
                            title="Comprobante"
                            >
                            <Download className="w-4 h-4" />
                            </button>


                    </div>
                    </td>

                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No hay pagos registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <ModalVerPago
        isOpen={showVerModal}
        onClose={() => setShowVerModal(false)}
        pago={pagoSeleccionado}
        />
        <ModalComprobantePago
        isOpen={showComprobante}
        onClose={() => setShowComprobante(false)}
        pago={pagoSeleccionado}
        />
      </div>
    </div>
  );
}
