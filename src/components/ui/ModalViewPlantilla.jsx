import React, { useState } from 'react';
import CloseButton from '@/components/ui/CloseButton';

export default function ModalViewPlantilla({ isOpen, onClose, plantilla = null }) {
  const [imgError, setImgError] = useState(false);
  if (!isOpen || !plantilla) return null;
  const resolveUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;

  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const base = API.replace(/\/api\/?$/, "");

  // Strip leading /api if present in the stored URL (server may serve uploads at /uploads)
  const cleaned = url.replace(/^\/api/, '');
  // eslint-disable-next-line no-console
  console.log('Resolving modal URL:', { original: url, cleaned, base });

  return `${base}${cleaned}`;
};
    // Diagnostic logs: show when modal opens and the resolved URL
    // These will only run when isOpen && plantilla are truthy (we return early otherwise)
    // eslint-disable-next-line no-console
    console.log('ModalViewPlantilla render:', { isOpen, plantilla });
    // eslint-disable-next-line no-console
    console.log('Resolved plantilla URL:', resolveUrl(plantilla?.url));
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl p-4">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">{plantilla.nombre}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="w-full h-[80vh] flex items-center justify-center bg-gray-50">
          {plantilla.url ? (
            plantilla.url.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={resolveUrl(plantilla.url)}
                title={plantilla.nombre}
                onLoad={() => {
                  // eslint-disable-next-line no-console
                  console.log('PDF iframe cargado:', resolveUrl(plantilla.url));
                }}
                className="w-full h-[78vh]"
              />
            ) : (
              !imgError ? (
                <img
                  src={resolveUrl(plantilla.url)}
                  alt={plantilla.nombre}
                  className="object-contain"
                  style={{ maxHeight: '78vh', maxWidth: '100%', width: '100%', height: 'auto', display: 'block' }}
                  onLoad={() => {
                    // eslint-disable-next-line no-console
                    console.log('Imagen cargada en modal:', resolveUrl(plantilla.url));
                  }}
                  onError={(e) => {
                    // show console info to help debug why image isn't rendering
                    // eslint-disable-next-line no-console
                    console.error('Error cargando imagen en modal:', resolveUrl(plantilla.url), e);
                    setImgError(true);
                  }}
                />
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">No fue posible mostrar la imagen en el modal.</p>
                  <div className="flex items-center justify-center gap-3">
                    <a href={resolveUrl(plantilla.url)} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#212529] hover:bg-[#424B52] text-white rounded-md text-sm">Abrir en nueva pestaña</a>
                    <button onClick={() => window.open(resolveUrl(plantilla.url), '_blank')} className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm">Abrir</button>
                  </div>
                </div>
              )
            )
          ) : (
            <p className="text-gray-500">No hay vista previa disponible</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <CloseButton onClick={onClose}>Cerrar</CloseButton>
        </div>
      </div>
    </div>
  );
}
