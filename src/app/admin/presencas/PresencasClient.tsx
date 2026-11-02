'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';

interface PresencaItem {
  id_presenca: number;
  musico_id: number;
  nome_utilizador: string;
  nome_instrumento?: string;
  servico_id: number;
  nome_servico: string;
  data_inicial?: string;
  confirmado: string;
  pago?: number;
  texto_pagar?: string;
  cor_botao_pagar?: string;
}

interface ServicoOption {
  id_servico: number;
  nome_servico: string;
}

export default function PresencasClient({
  initialPresencas,
  servicos,
}: {
  initialPresencas: PresencaItem[];
  servicos: ServicoOption[];
}) {
  const [presencas, setPresencas] = useState<PresencaItem[]>(initialPresencas);
  const [selectedServico, setSelectedServico] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'warning' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function togglePagamento(id_presenca: number) {
    setUpdatingId(id_presenca);
    try {
      const res = await fetch('/api/admin/presencas/toggle-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_presenca }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('warning', data.error || 'A presença não está confirmada.');
        return;
      }

      setPresencas((prev) =>
        prev.map((p) =>
          p.id_presenca === id_presenca
            ? {
                ...p,
                pago: data.pago,
                texto_pagar: data.pago === 1 ? 'Pago' : 'Pagar',
                cor_botao_pagar: data.pago === 1 ? 'success' : 'danger',
              }
            : p
        )
      );

      showToast('success', data.message || 'Estado de pagamento atualizado com sucesso!');
    } catch (e: any) {
      showToast('error', e.message || 'Erro ao atualizar pagamento.');
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = presencas.filter((p) => {
    if (selectedServico !== 'all' && p.servico_id !== selectedServico) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.nome_utilizador.toLowerCase().includes(q) ||
        (p.nome_instrumento && p.nome_instrumento.toLowerCase().includes(q)) ||
        p.nome_servico.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : toast.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Registo de Presenças dos Músicos</h2>
          <p className="text-sm text-neutral-500">
            Selecione o serviço ou pesquise para gerir presenças e pagamentos de cachet
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown de Serviços */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400 hidden sm:block" />
            <select
              value={selectedServico}
              onChange={(e) =>
                setSelectedServico(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold focus:border-red-500 focus:outline-none transition shadow-2xs"
            >
              <option value="all">Todos os Serviços ({servicos.length})</option>
              {servicos.map((s) => (
                <option key={s.id_servico} value={s.id_servico}>
                  {s.nome_servico}
                </option>
              ))}
            </select>
          </div>

          {/* Pesquisa */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar músico ou instrumento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Presenças */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <Clock className="w-12 h-12 mx-auto text-neutral-400" />
            <p className="font-bold text-neutral-800">Nenhum registo de presenças</p>
            <p className="text-xs text-neutral-500">
              {search || selectedServico !== 'all'
                ? 'Tente ajustar os filtros selecionados.'
                : 'Não existem serviços com marcação de presenças.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-neutral-50 text-[11px] uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Músico</th>
                  <th className="py-3 px-4">Instrumento</th>
                  <th className="py-3 px-4">Serviço</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Presença</th>
                  <th className="py-3 px-4 text-center">Pagamento (Cachet)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((p) => {
                  const isConfirmed = p.confirmado === 'Confirmada';
                  const isPago = Number(p.pago) === 1;

                  return (
                    <tr key={p.id_presenca} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3 px-4 font-bold text-neutral-900">
                        {p.nome_utilizador}
                      </td>
                      <td className="py-3 px-4 text-xs text-neutral-600">
                        {p.nome_instrumento || 'Geral'}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-neutral-800">
                        {p.nome_servico}
                      </td>
                      <td className="py-3 px-4 text-xs text-neutral-500">
                        {p.data_inicial || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isConfirmed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isConfirmed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Confirmada</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>{p.confirmado || 'Não confirmada'}</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          disabled={updatingId === p.id_presenca}
                          onClick={() => togglePagamento(p.id_presenca)}
                          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition ${
                            isPago
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                              : 'bg-red-600 text-white hover:bg-red-700 shadow-2xs'
                          } disabled:opacity-50`}
                          title={
                            !isConfirmed && !isPago
                              ? 'Aviso: A presença deve estar confirmada para efetuar pagamento.'
                              : ''
                          }
                        >
                          <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{updatingId === p.id_presenca ? '...' : isPago ? 'Pago' : 'Pagar'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
