'use client';

import { useState } from 'react';
import { CreditCard, Search, Loader2, Check, FileText, Printer, X, Download } from 'lucide-react';

interface AnoOption {
  id_ano: number;
  ano: number | string;
}

interface CotaMemberRow {
  id_pagamento: number;
  socio_id: number;
  nome_utilizador: string;
  numero_socio?: number | string | null;
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
  { key: 'janeiro', short: 'Jan', full: 'Janeiro' },
  { key: 'fevereiro', short: 'Fev', full: 'Fevereiro' },
  { key: 'marco', short: 'Mar', full: 'Março' },
  { key: 'abril', short: 'Abr', full: 'Abril' },
  { key: 'maio', short: 'Mai', full: 'Maio' },
  { key: 'junho', short: 'Jun', full: 'Junho' },
  { key: 'julho', short: 'Jul', full: 'Julho' },
  { key: 'agosto', short: 'Ago', full: 'Agosto' },
  { key: 'setembro', short: 'Set', full: 'Setembro' },
  { key: 'outubro', short: 'Out', full: 'Outubro' },
  { key: 'novembro', short: 'Nov', full: 'Novembro' },
  { key: 'dezembro', short: 'Dez', full: 'Dezembro' },
];

const TIPOS_PAGAMENTO = [
  { id: 1, label: 'Numerário' },
  { id: 2, label: 'Transferência Bancária' },
  { id: 3, label: 'MB Way' },
];

export default function CotasClient({
  anos,
  initialCotas,
}: {
  anos: AnoOption[];
  initialCotas: CotaMemberRow[];
}) {
  const currentYear = new Date().getFullYear();
  const defaultAno = anos.find((a) => Number(a.ano) === currentYear) || (anos.length > 0 ? anos[0] : null);

  const [selectedAnoId, setSelectedAnoId] = useState<number>(
    defaultAno ? defaultAno.id_ano : 1
  );
  const [cotas, setCotas] = useState<CotaMemberRow[]>(initialCotas);
  const [search, setSearch] = useState('');
  const [updatingCell, setUpdatingCell] = useState<string | null>(null);

  // Ficha de Pagamento Modal
  const [fichaModalUser, setFichaModalUser] = useState<CotaMemberRow | null>(null);
  const [tipoPagamento, setTipoPagamento] = useState<number>(1);
  const [allFichasModal, setAllFichasModal] = useState(false);

  const selectedAnoObj = anos.find((a) => a.id_ano === selectedAnoId);
  const anoLabel = selectedAnoObj ? selectedAnoObj.ano : currentYear;

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
      if (data.success && data.updatedMonths) {
        setCotas((prev) =>
          prev.map((row) =>
            row.id_pagamento === id_pagamento
              ? { ...row, ...data.updatedMonths }
              : row
          )
        );
      } else if (data.success) {
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
              const allPaid = MONTHS.every((m) => (m.key === mes ? nextVal === 1 : (updated as any)[m.key] === 1));
              return { ...updated, ano_completo: allPaid ? 1 : 0 };
            }
            return row;
          })
        );
      }
    } catch (err) {
      console.error('Erro ao atualizar quota:', err);
    } finally {
      setUpdatingCell(null);
    }
  }

  const filtered = cotas.filter((c) => {
    const matchesAno = c.ano_id === selectedAnoId;
    const matchesSearch = search.trim() === '' || c.nome_utilizador.toLowerCase().includes(search.toLowerCase());
    return matchesAno && matchesSearch;
  });

  function getPaidMonths(row: CotaMemberRow) {
    return MONTHS.filter((m) => (row as any)[m.key] === 1 || (row as any)[m.key] === '1');
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/10 text-red-600 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-neutral-900">Mapa Anual de Quotas</h2>
            <p className="text-xs text-neutral-500 font-medium">
              Controlo de liquidação de quotas mensais dos associados
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor do Ano */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-neutral-500 uppercase">Ano:</label>
            <select
              value={selectedAnoId}
              onChange={(e) => setSelectedAnoId(Number(e.target.value))}
              className="px-3.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 focus:outline-none focus:border-red-600 cursor-pointer shadow-2xs"
            >
              {anos.map((a) => (
                <option key={a.id_ano} value={a.id_ano}>
                  {a.ano} {Number(a.ano) === currentYear ? '(Corrente)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Botão Emitir Todas as Fichas */}
          <button
            onClick={() => setAllFichasModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition shadow-xs"
            title="Emitir todas as fichas de pagamento do ano"
          >
            <Printer className="w-4 h-4" />
            <span>Emitir Fichas (Todos)</span>
          </button>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Pesquisar sócio pelo nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
        />
      </div>

      {/* Tabela do Mapa Anual */}
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
                <th className="py-3.5 px-3 font-bold text-neutral-500 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={15} className="py-10 text-center text-neutral-500">
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

                    {/* Botão Ficha de Pagamento */}
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setFichaModalUser(row)}
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition"
                        title="Emitir Ficha de Pagamento"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ficha Individual */}
      {fichaModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setFichaModalUser(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Recibo para Impressão */}
            <div id="print-receipt" className="space-y-5 p-2">
              <div className="text-center pb-4 border-b border-neutral-200">
                <span className="text-[11px] font-black uppercase tracking-widest text-red-600 block">
                  Sociedade Musical 1º de Agosto
                </span>
                <h3 className="text-xl font-black text-neutral-900 mt-1">Banda de Coimbrões</h3>
                <p className="text-xs text-neutral-500">Ficha / Recibo de Pagamento de Quotas</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 font-bold block uppercase">Associado</span>
                  <p className="font-bold text-neutral-900 text-sm mt-0.5">{fichaModalUser.nome_utilizador}</p>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block uppercase">Nº de Sócio</span>
                  <p className="font-black text-neutral-900 text-sm mt-0.5">
                    #{fichaModalUser.numero_socio !== null && fichaModalUser.numero_socio !== undefined ? fichaModalUser.numero_socio : fichaModalUser.socio_id}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block uppercase">Ano de Exercício</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{anoLabel}</p>
                </div>
                <div>
                  <span className="text-neutral-400 font-bold block uppercase">Data de Emissão</span>
                  <p className="font-bold text-neutral-900 mt-0.5">
                    {new Date().toLocaleDateString('pt-PT')}
                  </p>
                </div>
              </div>

              {/* Seletor de Tipo de Pagamento */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1.5">
                  Forma de Pagamento Utilizada:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIPOS_PAGAMENTO.map((tp) => (
                    <button
                      key={tp.id}
                      type="button"
                      onClick={() => setTipoPagamento(tp.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-center ${
                        tipoPagamento === tp.id
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {tp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meses Liquidados */}
              <div className="pt-2">
                <span className="text-xs font-bold text-neutral-700 uppercase block mb-2">
                  Situação das Mensalidades ({anoLabel}):
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {MONTHS.map((m) => {
                    const isPaid = (fichaModalUser as any)[m.key] === 1 || (fichaModalUser as any)[m.key] === '1';
                    return (
                      <div
                        key={m.key}
                        className={`p-2 rounded-lg text-center border text-xs font-bold ${
                          isPaid
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-400'
                        }`}
                      >
                        <span className="block text-[10px]">{m.short}</span>
                        <span>{isPaid ? '✓ Pago' : '—'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs flex items-center justify-between font-bold">
                <span className="text-neutral-600">Total de Mensalidades Liquidadas:</span>
                <span className="text-red-600 text-sm">{getPaidMonths(fichaModalUser).length} / 12 meses</span>
              </div>

              <div className="pt-6 border-t border-neutral-200 text-center text-[10px] text-neutral-400">
                Sociedade Musical 1º de Agosto • NIF: 501 547 319 • Coimbrões, V. N. Gaia
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setFichaModalUser(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Ficha</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Emitir Todas as Fichas */}
      {allFichasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAllFichasModal(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-neutral-200">
              <span className="text-[11px] font-black uppercase tracking-widest text-red-600 block">
                Sociedade Musical 1º de Agosto
              </span>
              <h3 className="text-xl font-black text-neutral-900 mt-1">
                Mapa Geral de Quotas — Exercício de {anoLabel}
              </h3>
              <p className="text-xs text-neutral-500">Relatório consolidado de todos os associados</p>
            </div>

            <div className="py-4 space-y-4">
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {filtered.map((u) => {
                  const paid = getPaidMonths(u);
                  return (
                    <div key={u.id_pagamento} className="p-3 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-black text-neutral-900">{u.nome_utilizador}</span>
                        <span className="text-neutral-400 ml-2">
                          #{u.numero_socio !== null && u.numero_socio !== undefined ? u.numero_socio : u.socio_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-600">{paid.length}/12 meses</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            paid.length === 12
                              ? 'bg-emerald-100 text-emerald-800'
                              : paid.length > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {paid.length === 12 ? 'Liquidado' : paid.length > 0 ? 'Parcial' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setAllFichasModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Relatório</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
