import React, { useEffect, useMemo, useState } from "react";
import { Building2, Save } from "lucide-react";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import { empresasService } from "@/services/empresaSeries.service";


const TIPOS = [
  { label: "Factura", codigo: "01", defaultSerie: "F001" },
  { label: "Boleta", codigo: "03", defaultSerie: "B001" },
  { label: "Nota de crédito", codigo: "07", defaultSerie: "FC01" },
  { label: "Nota de débito", codigo: "08", defaultSerie: "FD01" },
];

function onlyDigits(v) {
  return String(v ?? "").replace(/[^\d]/g, "");
}

function normalizeSerie(v) {
  return String(v ?? "").toUpperCase().trim();
}

function isPositiveInt(v) {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1;
}

export default function EmpresasSeriesNumeracion() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaId, setEmpresaId] = useState("");
  const [rows, setRows] = useState([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

    useEffect(() => {
    let mounted = true;

    (async () => {
        try {
        setLoadingEmpresas(true);

        const data = await empresasService.list();
        if (!mounted) return;

        const list = Array.isArray(data) ? data : data?.data || [];
        setEmpresas(list);

        if (list.length && !empresaId) {
            setEmpresaId(String(list[0].id));
        }
        } catch (e) {
        console.error(e);
        if (mounted) setError("No se pudo cargar empresas.");
        } finally {
        if (mounted) setLoadingEmpresas(false);
        }
    })();

    return () => {
        mounted = false;
    };
    }, []);

 useEffect(() => {
  if (!empresaId) return;

  let mounted = true;

  (async () => {
    try {
      setError("");
      setLoadingRows(true);

      const data = await empresasService.series(empresaId);
      const list = Array.isArray(data) ? data : data?.data || [];

      const byCodigo = new Map(list.map((r) => [String(r.tipoDoc), r]));

      const merged = TIPOS.map((t) => {
        const found = byCodigo.get(t.codigo);
        return {
          tipoDoc: t.codigo,
          tipoLabel: t.label,
          habilitado: Boolean(
            found?.habilitado ??
            found?.estado ??
            (t.codigo === "01" || t.codigo === "03")
          ),
          serie: normalizeSerie(found?.serie ?? t.defaultSerie),
          correlativo: String(found?.correlativo ?? 1),
        };
      });

      if (mounted) setRows(merged);
    } catch (e) {
      console.error(e);
      if (mounted) setError("No se pudo cargar series/numeración.");
    } finally {
      if (mounted) setLoadingRows(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, [empresaId]);

  const empresaSeleccionada = useMemo(() => {
    return empresas.find((e) => String(e.id) === String(empresaId)) || null;
  }, [empresas, empresaId]);

  const setRow = (tipoDoc, patch) => {
    setRows((prev) =>
      prev.map((r) => (r.tipoDoc === tipoDoc ? { ...r, ...patch } : r))
    );
  };

  const validate = () => {
    for (const r of rows) {
      if (!r.habilitado) continue;
      if (!r.serie) return `La serie es obligatoria en ${r.tipoLabel}.`;
      if (!isPositiveInt(r.correlativo)) return `Correlativo inválido en ${r.tipoLabel}.`;
    }
    const seen = new Set();
    for (const r of rows) {
      if (!r.habilitado) continue;
      const key = r.serie;
      if (seen.has(key)) return `La serie "${key}" está duplicada.`;
      seen.add(key);
    }

    return "";
  };

  const handleSave = async () => {
  const msg = validate();
  if (msg) {
    setError(msg);
    return;
  }

  try {
    setSaving(true);
    setError("");

    const payload = {
      series: rows.map((r) => ({
        tipoDoc: r.tipoDoc,
        habilitado: Boolean(r.habilitado),
        serie: normalizeSerie(r.serie),
        correlativo: Number(r.correlativo),
      })),
    };

    await empresasService.updateSeries(empresaId, payload);
  } catch (e) {
    console.error(e);
    setError("No se pudo guardar la numeración.");
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="p-6 min-h-screen bg-[#F8FAFC] font-[Montserrat]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#0B1437]" />
          <h1 className="text-lg font-semibold text-[#0B1437]">
            Series y Numeración
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={!empresaId || saving || loadingRows}
          className="flex items-center gap-2 bg-[#283046] hover:bg-[#0C102A] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-[#0B1437] text-white px-6 py-5 rounded-t-lg flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-wide">
              Configurar Series por Empresa
            </h2>
            <p className="text-sm text-white/70 mt-1">
              Define serie y correlativo por tipo de comprobante.
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <span className="text-sm text-[#64748B]">Empresa:</span>

            <div className="relative w-full md:w-[520px]">
              <select
                value={empresaId}
                onChange={(e) => setEmpresaId(e.target.value)}
                disabled={loadingEmpresas}
                className="
                  w-full
                  appearance-none
                  border border-gray-300
                  rounded-md
                  px-3 pr-9 py-2
                  text-sm text-[#0B1437]
                  focus:ring-2 focus:ring-[#2C3E50]
                  focus:outline-none
                  bg-white
                "
              >
                {loadingEmpresas ? (
                  <option value="">Cargando empresas...</option>
                ) : empresas.length === 0 ? (
                  <option value="">No hay empresas</option>
                ) : (
                  empresas.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.ruc} — {e.razonSocial}
                    </option>
                  ))
                )}
              </select>

              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {empresaSeleccionada && (
              <div className="text-sm text-[#64748B]">
                Seleccionada:{" "}
                <span className="text-[#0B1437] font-medium">
                  {empresaSeleccionada.razonSocial} (RUC: {empresaSeleccionada.ruc})
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[#64748B]">
            <thead className="bg-white text-[#1E293B] uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Tipo</th>
                <th className="px-6 py-4 text-left font-semibold">Código</th>
                <th className="px-6 py-4 text-left font-semibold">Habilitado</th>
                <th className="px-6 py-4 text-left font-semibold">Serie</th>
                <th className="px-6 py-4 text-left font-semibold">Siguiente correlativo</th>
                <th className="px-6 py-4 text-left font-semibold">Preview</th>
              </tr>
            </thead>

            <tbody>
              {loadingRows ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Cargando series...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No hay configuración de series para esta empresa.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.tipoDoc}
                    className="border-b border-gray-100 hover:bg-[#F9FAFB] transition-all duration-150"
                  >
                    <td className="px-6 py-3 text-[#64748B]">{r.tipoLabel}</td>
                    <td className="px-6 py-3 font-medium text-[#64748B]">{r.tipoDoc}</td>

                    <td className="px-6 py-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(r.habilitado)}
                          onChange={() => setRow(r.tipoDoc, { habilitado: !r.habilitado })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5" />
                      </label>
                    </td>

                    <td className="px-6 py-3">
                      <input
                        value={r.serie}
                        disabled={!r.habilitado}
                        onChange={(e) => setRow(r.tipoDoc, { serie: normalizeSerie(e.target.value) })}
                        placeholder="Ej: F001"
                        className="
                          w-36
                          border border-gray-300
                          rounded-md
                          px-3 py-1.5
                          text-sm text-[#0B1437]
                          focus:ring-2 focus:ring-[#2C3E50]
                          focus:outline-none
                          disabled:bg-gray-100 disabled:text-gray-400
                        "
                      />
                    </td>

                    <td className="px-6 py-3">
                      <input
                        value={r.correlativo}
                        disabled={!r.habilitado}
                        onChange={(e) =>
                          setRow(r.tipoDoc, { correlativo: onlyDigits(e.target.value) })
                        }
                        placeholder="1"
                        className="
                          w-36
                          border border-gray-300
                          rounded-md
                          px-3 py-1.5
                          text-sm text-[#0B1437]
                          focus:ring-2 focus:ring-[#2C3E50]
                          focus:outline-none
                          disabled:bg-gray-100 disabled:text-gray-400
                        "
                      />
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-xs border
                          ${
                            r.habilitado
                              ? "bg-[#F1F5F9] border-gray-200 text-[#0B1437]"
                              : "bg-gray-50 border-gray-200 text-gray-400"
                          }`}
                      >
                        {r.habilitado ? `${r.serie}-${r.correlativo || "?"}` : "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-white text-sm text-[#64748B]">
          Nota: el correlativo representa el <b>siguiente</b> número que se emitirá para la serie.
        </div>
      </div>
    </div>
  );
}
