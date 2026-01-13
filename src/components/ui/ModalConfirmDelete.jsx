import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function ModalConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Confirmar Eliminación",
  message = "¿Está seguro de que desea eliminar este elemento?",
  itemName = "",
  itemDetail = "",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl animate-fadeIn relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <p className="text-gray-600 mb-2">{message}</p>
            
            {itemName && (
              <p className="font-semibold text-[#1E293B] text-lg">{itemName}</p>
            )}
            
            {itemDetail && (
              <p className="text-sm text-gray-500 mt-1">{itemDetail}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition min-w-[100px]"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition min-w-[100px]"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
