import React from "react";
import { X, Printer, Download, Mail, Send } from "lucide-react";
import CloseButton from "@/components/ui/CloseButton";
import ReceiptSvg from "@/components/icons/ReceiptSvg";

export default function ModalVerFactura({ factura, isOpen, onClose }) {
  if (!isOpen || !factura) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl animate-fadeIn relative">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-600">
            Comprobante: FACTURA-{factura.id}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Impresiones */}
          <div>
            <p className="font-semibold text-gray-700 mb-3">Impresiones</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col">
                <div className="x-button-pdf flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert("Imprimir A4")}
                    className="w-14 h-14 flex items-center justify-center rounded-lg bg-[#17A2B8] hover:bg-[#0f8b95] text-white"
                  >
                    <Printer className="w-6 h-6 text-white" />
                  </button>
                  <p className="text-sm text-gray-700">A4</p>
                </div>
              </div>
              <div className="col">
                <div className="x-button-pdf flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert("Imprimir Ticket")}
                    className="w-14 h-14 flex items-center justify-center rounded-lg bg-[#17A2B8] hover:bg-[#0f8b95] text-white"
                  >
                    <ReceiptSvg className="w-10 h-10 text-white" strokeWidth={2} />
                  </button>
                  <p className="text-sm text-gray-700">Ticket</p>
                </div>
              </div>
            </div>
          </div>

          {/* Descargas */}
          <div>
            <p className="font-semibold text-gray-700 mb-3">Descargas</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col">
                <div className="x-button-pdf flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert("Descargar A4")}
                    className="w-14 h-14 flex items-center justify-center rounded-lg bg-[#17A2B8] hover:bg-[#0f8b95] text-white"
                  >
                    <Download className="w-6 h-6 text-white" />
                  </button>
                  <p className="text-sm text-gray-700">A4</p>
                </div>
              </div>
              <div className="col">
                <div className="x-button-pdf flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert("Descargar Ticket")}
                    className="w-14 h-14 flex items-center justify-center rounded-lg bg-[#17A2B8] hover:bg-[#0f8b95] text-white"
                  >
                    <Download className="w-6 h-6 text-white" />
                  </button>
                  <p className="text-sm text-gray-700">Ticket</p>
                </div>
              </div>
            </div>
          </div>

          {/* Envíos rápidos */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Correo electrónico"
                className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm placeholder-gray-400"
              />
              <button
                type="button"
                className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => alert('Enviar correo')}
              >
                <Mail className="w-4 h-4" />
                Enviar
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-0 top-0 h-full inline-flex items-center px-3 text-sm text-gray-600 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">+51</span>
                <input
                  type="tel"
                  placeholder="Número de teléfono"
                  className="w-full pl-16 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-400"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => alert('Enviar SMS')}
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4">
          <CloseButton onClick={onClose}>Cerrar</CloseButton>
        </div>

      </div>
    </div>
  );
}

function ActionCard({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 hover:bg-gray-50 transition"
    >
      <div className="text-[#17A2B8]">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}
