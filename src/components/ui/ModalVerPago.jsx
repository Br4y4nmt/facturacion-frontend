import React from "react";
import { X, FileText } from "lucide-react";
import CloseButton from "@/components/ui/CloseButton";

export default function ModalVerPago({ isOpen, onClose, pago }) {
  if (!isOpen || !pago) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl animate-fadeIn relative">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1E293B] flex items-center gap-2">
            Detalle del Pago
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 text-sm text-[#475569] grid grid-cols-2 gap-4">

          <Item label="Empresa" value={pago.empresa || "-"} />
          <Item label="Descripción" value={pago.descripcion || "-"} />

          <Item label="Método de Pago" value={pago.metodo || "-"} />
          <Item label="Estado" value={pago.estado || "-"} />

          <Item label="Monto" value={`S/ ${Number(pago.monto || 0).toFixed(2)}`} />
          <Item
            label="Fecha del Pago"
            value={new Date(pago.createdAt).toLocaleDateString("es-PE")}
          />

          <Item
            label="Fecha Inicio"
            value={
              pago.suscripcion?.fechaInicio
                ? new Date(pago.suscripcion.fechaInicio).toLocaleDateString("es-PE")
                : "-"
            }
          />

          <Item
            label="Fecha Fin"
            value={
              pago.suscripcion?.fechaFin
                ? new Date(pago.suscripcion.fechaFin).toLocaleDateString("es-PE")
                : "-"
            }
          />

          <div className="col-span-2">
            <div className="border-t pt-4 mt-2 text-xs text-gray-400">
              ID de Transacción: {pago.id}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <CloseButton onClick={onClose}>Cerrar</CloseButton>
        </div>

      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-[#1E293B]">{value}</p>
    </div>
  );
}
