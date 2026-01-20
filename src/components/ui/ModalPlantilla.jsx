import React, { useRef, useState, useEffect } from 'react';
import CloseButton from '@/components/ui/CloseButton';
import { uploadPlantilla } from '@/services/plantillas.service';

export default function ModalPlantilla({ isOpen, onClose, plantilla = null, onUploaded = () => {} }) {
  const [nombre, setNombre] = useState(plantilla ? plantilla.nombre : '');
  const [tipo, setTipo] = useState(plantilla ? plantilla.tipo : 'Boleta');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    if (f) {
      if (f.type && f.type.startsWith('image/')) {
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Selecciona un archivo (PDF o imagen)');
    // simple client-side validation: allow PDF and images
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (file.type && !allowed.includes(file.type)) {
      return alert('Tipo de archivo no permitido. Use PDF, PNG o JPG.');
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('nombre', nombre || file.name);
      form.append('tipo', tipo);
      form.append('file', file);
      const saved = await uploadPlantilla(form);
      onUploaded(saved);
    } catch (err) {
      console.error(err);
      alert('Error al subir plantilla');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isOpen ? 'fixed inset-0 bg-black/40 flex items-center justify-center z-50' : 'hidden'}>
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl animate-fadeIn relative">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-600">{plantilla ? 'Ver plantilla' : 'Subir plantilla'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-md text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-md text-sm">
              <option>Boleta</option>
              <option>Ticket</option>
              <option>Factura</option>
              <option>Nota de crédito</option>
              <option>Otro</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Archivo (PDF / PNG / JPG)</label>
            <div className="flex items-center gap-3 mt-2">
              <input
                id="plantilla-file"
                ref={inputRef}
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={handleFile}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => inputRef.current && inputRef.current.click()}
                className="px-3 py-2 bg-[#212529] hover:bg-[#424B52] text-white rounded-md text-sm"
              >
                Seleccionar archivo
              </button>

              <span className="text-sm text-gray-600">{file ? file.name : 'Ningún archivo seleccionado'}</span>
              {previewUrl && (
                <div className="ml-3 w-20 h-20 border border-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {plantilla && plantilla.url && (
              <div className="mt-3">
                <a href={plantilla.url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 underline">Abrir plantilla existente</a>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm">Cancelar</button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#212529] hover:bg-[#424B52] text-white rounded-md text-sm"
            >
              {loading ? 'Subiendo...' : (plantilla ? 'Actualizar' : 'Subir')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
