import React, { useEffect, useMemo, useState } from 'react';
import { Search, FileText, RefreshCw } from 'lucide-react';
import { getFacturas, getFacturaById } from '@/services/facturas.service';
import FacturasTable from '@/components/ui/FacturasTable';
import ModalVerFactura from '@/components/ui/ModalVerFactura';

const Stat = ({ title, value, color = 'white' }) => {
  const map = {
    white: 'text-white',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  return (
    <div className="bg-white/10 border border-white/10 rounded-xl p-4">
      <p className="text-xs text-indigo-200">{title}</p>
      <p className={`text-2xl font-bold ${map[color]}`}>{value}</p>
    </div>
  );
};

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [stats, setStats] = useState({ total: 0, totalAmount: 0, pagadas: 0, pendientes: 0 });
  const [empresas, setEmpresas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getFacturas();
        if (!mounted) return;
        setFacturas(res || []);
        setEmpresas(Array.from(new Set((res || []).map((f) => f.empresa || ''))).filter(Boolean));
        const total = (res || []).length;
        const totalAmount = (res || []).reduce((s, f) => s + (f.total || 0), 0);
        const pagadas = (res || []).filter((f) => f.estado === 'Pagada').length;
        const pendientes = (res || []).filter((f) => f.estado === 'Pendiente').length;
        setStats({ total, totalAmount, pagadas, pendientes });
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
    return facturas.filter((f) => {
      const matchSearch =
        !search ||
        (f.numero || '').toLowerCase().includes(search.toLowerCase()) ||
        (f.cliente || '').toLowerCase().includes(search.toLowerCase());
      const matchEmpresa = !filterEmpresa || f.empresa === filterEmpresa;
      const matchEstado = !filterEstado || f.estado === filterEstado;
      return matchSearch && matchEmpresa && matchEstado;
    });
  }, [facturas, search, filterEmpresa, filterEstado]);

  const handleView = async (id) => {
    const f = await getFacturaById(id);
    setSelected(f);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#0B1437] via-[#1a2555] to-[#0B1437] text-white">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FileText className="w-6 h-6" /> Facturas
              </h1>
              <p className="text-indigo-200 text-sm mt-1">Listado de facturas por empresa</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:grid grid-cols-3 gap-3">
                <Stat title="Facturas" value={stats.total} />
                <Stat title="Monto total" value={`S/ ${stats.totalAmount.toFixed(2)}`} />
                <Stat title="Pagadas" value={stats.pagadas} color="emerald" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por número o cliente..." className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm" />
          </div>

          <select value={filterEmpresa} onChange={(e) => setFilterEmpresa(e.target.value)} className="px-4 py-2 border rounded-lg text-sm">
            <option value="">Todas las empresas</option>
            {empresas.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>

          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="px-4 py-2 border rounded-lg text-sm">
            <option value="">Todos los estados</option>
            <option value="Pagada">Pagadas</option>
            <option value="Pendiente">Pendientes</option>
          </select>

          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-100 rounded-lg text-sm flex items-center gap-2"> <RefreshCw className="w-4 h-4" /> Refrescar</button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Facturas</h3>
            <p className="text-sm text-gray-500">Se muestran {filtered.length} registros</p>
          </div>

          <div className="p-4">
            {loading ? (
              <p className="text-gray-500">Cargando facturas...</p>
            ) : (
              <FacturasTable facturas={filtered} onView={handleView} />
            )}
          </div>
        </div>

        <ModalVerFactura factura={selected} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
