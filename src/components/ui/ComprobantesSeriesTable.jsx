import React from "react";

const LABELS = {
  FACTURA: "Factura",
  BOLETA: "Boleta",
  NOTA_CREDITO: "Nota de crédito",
  NOTA_DEBITO: "Nota de débito",
};

export default function ComprobantesSeriesTable({ items, onChangeItem }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-[#64748B]">
        <thead className="bg-white text-[#1E293B] uppercase text-xs border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Tipo</th>
            <th className="px-4 py-3 text-left font-semibold">Habilitado</th>
            <th className="px-4 py-3 text-left font-semibold">Serie</th>
            <th className="px-4 py-3 text-left font-semibold">Correlativo</th>
          </tr>
        </thead>

        <tbody>
          {items.map((c) => (
            <tr key={c.tipo} className="border-b border-gray-100">
              <td className="px-4 py-3 text-[#0B1437] font-medium">
                {LABELS[c.tipo] ?? c.tipo}
              </td>

              <td className="px-4 py-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(c.enabled)}
                    onChange={(e) => onChangeItem(c.tipo, { enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                </label>
              </td>

              <td className="px-4 py-3">
                <input
                  value={c.serie}
                  onChange={(e) => onChangeItem(c.tipo, { serie: e.target.value.toUpperCase() })}
                  disabled={!c.enabled}
                  className="w-32 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none disabled:opacity-50"
                />
              </td>

              <td className="px-4 py-3">
                <input
                  type="number"
                  min="1"
                  value={c.correlativo}
                  onChange={(e) =>
                    onChangeItem(c.tipo, { correlativo: Number(e.target.value) })
                  }
                  disabled={!c.enabled}
                  className="w-32 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none disabled:opacity-50"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs text-[#94A3B8] mt-3">
        * La serie y correlativo solo se editan si el comprobante está habilitado.
      </p>
    </div>
  );
}
