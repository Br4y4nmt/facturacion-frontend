import React from 'react';

export default function FacturasTable({ facturas = [], onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-white">
          <tr>
            <th className="px-4 py-3 text-center font-medium text-gray-600">Nº</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Número</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Cliente</th>
            <th className="px-4 py-3 text-center font-medium text-gray-600">Fecha</th>
            <th className="px-4 py-3 text-right font-medium text-gray-600">Total</th>
            <th className="px-4 py-3 text-center font-medium text-gray-600">Estado</th>
            <th className="px-4 py-3 text-center font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {facturas.map((f, idx) => (
            <tr key={f.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-center text-gray-700">{idx + 1}</td>
              <td className="px-4 py-3 text-gray-700">{f.numero}</td>
              <td className="px-4 py-3 text-gray-700">{f.cliente}</td>
              <td className="px-4 py-3 text-center text-gray-700">{f.fecha}</td>
              <td className="px-4 py-3 text-right text-gray-700">S/ {f.total.toFixed(2)}</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${f.estado === 'Pagada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {f.estado}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="px-3 py-1 bg-[#17A2B8] text-white rounded-md text-sm"
                    onClick={() => onView && onView(f.id)}
                  >
                    Ver
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
