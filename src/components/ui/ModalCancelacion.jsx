import React, { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function ModalCancelacion({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  subscription,
}) {
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMotivo("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!motivo.trim()) {
      setError("El motivo es obligatorio");
      return;
    }
    onConfirm(motivo.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl animate-fadeIn relative">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div >
            </div>
            <h2 className="text-lg font-semibold text-[#1E293B]">
              Cancelar Suscripción
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* TAB */}
        <div className="flex items-center border-b border-gray-200 px-6">
          <span className="relative py-3 px-4 text-sm font-medium text-[#2C3E50] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#2C3E50]">
            Motivo de cancelación
          </span>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 text-sm text-[#475569]">
            <p className="mb-3">
              Indica el motivo por el cual se cancela la suscripción
              {subscription ? (
                <span className="font-medium">
                  {" "}
                  de {subscription.empresa}
                </span>
              ) : null}
              .
            </p>

            <textarea
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                setError("");
              }}
              rows={5}
              placeholder="Escribe el motivo de la cancelación..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none"
            />

            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Cancelando..." : "Confirmar cancelación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
