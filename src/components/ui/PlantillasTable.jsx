import React from 'react';
import { Eye, Download, Trash2 } from 'lucide-react';

export default function PlantillasTable({ plantillas = [], onView = () => {}, onDelete = () => {} }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="py-3 px-4">Nombre</th>
            <th className="py-3 px-4">Tipo</th>
            <th className="py-3 px-4">Creado</th>
            <th className="py-3 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plantillas.length === 0 && (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">No hay plantillas</td>
            </tr>
          )}
          {plantillas.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-3 px-4">{p.nombre}</td>
              <td className="py-3 px-4">{p.tipo}</td>
              <td className="py-3 px-4 text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => onView(p)} className="p-2 bg-gray-100 rounded-md" title="Ver">
                    <Eye className="w-4 h-4" />
                  </button>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-md" title="Descargar">
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => onDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded-md" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
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
