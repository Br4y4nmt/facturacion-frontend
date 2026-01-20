import React, { useEffect, useMemo, useState } from 'react';
import { Search, Upload, Trash2 } from 'lucide-react';
import { getPlantillas, uploadPlantilla, deletePlantilla } from '@/services/plantillas.service';
import ModalPlantilla from '@/components/ui/ModalPlantilla';
import ModalViewPlantilla from '@/components/ui/ModalViewPlantilla';

const TIPOS = ['Boleta', 'Ticket', 'Factura', 'Nota de crédito', 'Otro'];

export default function Plantillas() {
  const [plantillas, setPlantillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const params = filterTipo ? { tipo: filterTipo } : {};
        const res = await getPlantillas(params);
        if (!mounted) return;
        setPlantillas(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [filterTipo]);

  const filtered = useMemo(() => {
    return plantillas.filter((p) => {
      const matchSearch =
        !search || (p.nombre || '').toLowerCase().includes(search.toLowerCase());
      const matchTipo = !filterTipo || (p.tipo || '') === filterTipo;
      return matchSearch && matchTipo;
    });
  }, [plantillas, search, filterTipo]);

  const handleOpenUpload = () => {
    setSelected(null);
    setIsUploadOpen(true);
  };

  const handleView = (plantilla) => {
    setSelected(plantilla);
    setIsViewOpen(true);
  };

  const resolveUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    // Normalize host: remove trailing /api if present
    const base = API.replace(/\/api\/?$/, '');
    // Also remove leading /api from stored url if present
    const cleaned = url.replace(/^\/api/, '');
    return `${base}${cleaned}`;
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar plantilla? Esta acción no se puede deshacer.')) return;
    try {
      await deletePlantilla(id);
      setPlantillas((s) => s.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar plantilla');
    }
  };

  const handleUploaded = (newItem) => {
    setPlantillas((s) => [newItem, ...s]);
    setIsUploadOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#0B1437] via-[#1a2555] to-[#0B1437] text-white">
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">Plantillas PDF</h1>
              <p className="text-indigo-200 text-sm mt-1">Gestión de plantillas para comprobantes (boleta, ticket, factura)</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleOpenUpload} className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2">
                <Upload className="w-4 h-4" /> Subir plantilla
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre..." className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm" />
          </div>

          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="px-4 py-2 border rounded-lg text-sm">
            <option value="">Todos los tipos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Plantillas</h3>
            <p className="text-sm text-gray-500">Se muestran {filtered.length} plantillas</p>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-gray-500">Cargando plantillas...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((p) => (
                  <div key={p.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <button onClick={() => handleView(p)} className="w-full h-80 flex items-center justify-center bg-gray-50">
                      {p.url ? (
                        p.url.toLowerCase().endsWith('.pdf') ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-20 flex items-center justify-center bg-white border border-gray-200 rounded-md shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-gray-500">
                                <path fill="currentColor" d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                                <path fill="#fff" d="M13 2v5h5" />
                              </svg>
                            </div>
                            <div className="text-xs text-gray-600 max-w-[160px] truncate">{p.fileName || p.nombre}</div>
                          </div>
                        ) : (
                          <img
                            src={resolveUrl(p.url)}
                            alt={p.nombre}
                            className="object-contain"
                            style={{ maxHeight: '100%', maxWidth: '100%', width: '100%', height: 'auto', display: 'block' }}
                            onLoad={() => {}}
                            onError={(e) => {
                              // eslint-disable-next-line no-console
                              console.error('Error cargando miniatura:', resolveUrl(p.url), e);
                            }}
                          />
                        )
                      ) : (
                        <div className="text-sm text-gray-400">Sin vista previa</div>
                      )}
                    </button>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="text-sm text-gray-700 truncate">{p.nombre}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Eliminar"
                          aria-label="Eliminar plantilla"
                          className="p-2 bg-white hover:bg-red-50 text-red-600 rounded-md border border-transparent hover:border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <ModalPlantilla plantilla={null} isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUploaded={handleUploaded} />
        <ModalViewPlantilla plantilla={selected} isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} />
      </div>
    </div>
  );
}
