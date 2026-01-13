import React from "react";

export default function FiscalSettingsForm({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm text-[#64748B] mb-1">Impuesto (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={value.taxPercent}
          onChange={(e) => onChange({ taxPercent: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-[#64748B] mb-1">Moneda</label>
        <select
          value={value.currency}
          onChange={(e) => onChange({ currency: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#2C3E50] focus:outline-none bg-white"
        >
          <option value="PEN">PEN (S/)</option>
          <option value="USD">USD ($)</option>
        </select>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <label className="text-sm text-[#64748B]">Precios incluyen impuesto</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value.pricesIncludeTax)}
            onChange={(e) => onChange({ pricesIncludeTax: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
        </label>
      </div>
    </div>
  );
}
