'use client';

import { useState } from 'react';
import { CreditCard, Search, Loader2, Check } from 'lucide-react';

interface AnoOption {
  id_ano: number;
  ano: number | string;
}

interface CotaMemberRow {
  id_pagamento: number;
  socio_id: number;
  nome_utilizador: string;
  ano_id: number;
  ano_real?: number | string;
  janeiro: number;
  fevereiro: number;
  marco: number;
  abril: number;
  maio: number;
  junho: number;
  julho: number;
  agosto: number;
  setembro: number;
  outubro: number;
  novembro: number;
  dezembro: number;
  ano_completo: number;
}

const MONTHS = [
  { key: 'janeiro', short: 'Jan' },
  { key: 'fevereiro', short: 'Fev' },
  { key: 'marco', short: 'Mar' },
  { key: 'abril', short: 'Abr' },
  { key: 'maio', short: 'Mai' },
  { key: 'junho', short: 'Jun' },
  { key: 'julho', short: 'Jul' },
  { key: 'agosto', short: 'Ago' },
  { key: 'setembro', short: 'Set' },
  { key: 'outubro', short: 'Out' },
  { key: 'novembro', short: 'Nov' },
  { key: 'dezembro', short: 'Dez' },
];

export default function CotasClient({
  anos,
  initialCotas,
}: {
  anos: AnoOption[];
  initialCotas: CotaMemberRow[];
}) {
  const [selectedAnoId, setSelectedAnoId] = useState<number>(
    anos.length > 0 ? anos[anos.length - 1].id_ano : 1
  );
  const [cotas, setCotas] = useState<CotaMemberRow[]>(initialCotas);
  const [search, setSearch] = useState('');
  const [updatingCell, setUpdatingCell] = useState<string | null>(null);

  async function handleToggle(id_pagamento: number, mes: string, currentValue: number) {
    const nextVal = currentValue === 1 ? 0 : 1;
    const cellKey = `${id_pagamento}-${mes}`;
    setUpdatingCell(cellKey);

    try {
      const res = await fetch('/api/admin/cotas/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_pagamento, mes, value: nextVal }),
      });
      const data = await res.json();
      if (data.success) {
        setCotas((prev) =>
          prev.map((row) => {
            if (row.id_pagamento === id_pagamento) {
              if (mes === 'ano_completo') {
                return {
                  ...row,
                  janeiro: nextVal,
                  fevereiro: nextVal,
                  marco: nextVal,
                  abril: nextVal,
                  maio: nextVal,
                  junho: nextVal,
                  julho: nextVal,
                  agosto: nextVal,
                  setembro: nextVal,
                  outubro: nextVal,
                  novembro: nextVal,
                  dezembro: nextVal,
                  ano_completo: nextVal,
                };
              }
              const updated = { ...row, [mes]: nextVal };
              // Verificar se todos os 12 meses estão pagos
              const allPaid = MONTHS.every((m) => (m.key === mes ? nextVal === 1 : (updated as any)[m.key] === 1));
              updated.ano_completo = allPaid ? 1 : 0;
              return updated;
            }
            return row;
          })
        );
      }
    } catch (e) {
      console.error('Erro ao atualizar cota:', e);
    } finally {
      setUpdatingCell(null);
    }
  }

  const filtered = cotas.filter((c) => {
    if (c.ano_id !== selectedAnoId) return false;
    if (search.trim()) {
      return c.nome_utilizador.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const selectedAnoLabel = anos.find((a) => a.id_ano === selectedAnoId)?.ano || selectedAnoId;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Mapa de Quotas — Ano de {selectedAnoLabel}
          </h2>
          <p className="text-sm text-neutral-500">
            Clique em qualquer mês para marcar ou desmarcar o pagamento da quota
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Ano */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-600">Ano:</span>
            <select
              value={selectedAnoId}
              onChange={(e) => setSelectedAnoId(Number(e.target.value))}
              className="px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold focus:border-red-500 focus:outline-none transition shadow-2xs"
            >
              {anos.map((a) => (
                <option key={a.id_ano} value={a.id_ano}>
                  Ano {a.ano}
                </option>
              ))}
            </select>
          </div>

          {/* Pesquisa */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar sócio..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs text-neutral-700">
            <thead className="bg-neutral-50 text-[11px] uppercase font-black text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4 text-left">Sócio</th>
                {MONTHS.map((m) => (
                  <th key={m.key} className="py-3.5 px-2 font-bold">
                    {m.short}
                  </th>
                ))}
                <th className="py-3.5 px-3 font-black text-red-600">Ano Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-10 text-center text-neutral-500">
                    Nenhum registo de quotas encontrado para o ano selecionado.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id_pagamento} className="hover:bg-neutral-50/80 transition">
                    <td className="py-3 px-4 text-left font-bold text-neutral-900 whitespace-nowrap">
                      {row.nome_utilizador}
                    </td>

                    {MONTHS.map((m) => {
                      const val = (row as any)[m.key];
                      const isPaid = val === 1 || val === '1';
                      const cellKey = `${row.id_pagamento}-${m.key}`;
                      const isUpdating = updatingCell === cellKey;

                      return (
                        <td key={m.key} className="py-3 px-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggle(row.id_pagamento, m.key, val)}
                            disabled={isUpdating}
                            title={`${row.nome_utilizador} - ${m.short}: ${isPaid ? 'Pago' : 'Pendente'}`}
                            className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto transition ${
                              isPaid
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-neutral-100 border border-neutral-300 text-transparent hover:border-neutral-400'
                            }`}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                            ) : isPaid ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : null}
                          </button>
                        </td>
                      );
                    })}

                    {/* Checkbox Ano Completo */}
                    <td className="py-3 px-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(row.id_pagamento, 'ano_completo', row.ano_completo)}
                        title="Marcar / desmarcar ano completo"
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition uppercase ${
                          Number(row.ano_completo) === 1
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                        }`}
                      >
                        {Number(row.ano_completo) === 1 ? 'Completo' : 'Parcial'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
