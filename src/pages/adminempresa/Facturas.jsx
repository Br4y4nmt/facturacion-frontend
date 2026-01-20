import React, { useEffect, useState } from 'react';
import { getFacturas, getFacturaById } from '@/services/facturas.service';
import FacturasTable from '@/components/ui/FacturasTable';
import ModalVerFactura from '@/components/ui/ModalVerFactura';

export default function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getFacturas();
      if (!mounted) return;
      setFacturas(data);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, []);

  async function handleView(id) {
    const f = await getFacturaById(id);
    setSelected(f);
    setIsOpen(true);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Facturas</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {loading ? (
          <p className="text-gray-500">Cargando facturas...</p>
        ) : (
          <FacturasTable facturas={facturas} onView={handleView} />
        )}
      </div>

      <ModalVerFactura factura={selected} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
