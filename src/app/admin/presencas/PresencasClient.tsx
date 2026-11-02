'use client';

import { useState } from 'react';
import { ListChecks, CheckCircle2, XCircle, Search, Calendar, MapPin, Loader2 } from 'lucide-react';

interface ServicoOption {
  id_servico: number;
  nome_servico: string;
  data_inicial?: string;
  localizacao?: string;
}

interface PresencaRow {
  id_presenca: number;
  musico_id: number;
  nome_utilizador: string;
  nome_instrumento?: string;
  confirmado?: string;
  pago?: number;
  texto_pagar?: string;
  cor_botao_pagar?: string;
  servico_id: number;
  nome_servico: string;
  data_inicial?: string;
}

export default function PresencasClient({
  servicos,
  initialPresencas,
}: {
  servicos: ServicoOption[];
  initialPresencas: PresencaRow[];
}) {
  const [selectedServico, setSelectedServico] = useState<number | 'all'>('all');
  const [presencas, setPresencas] = useState<PresencaRow[]>(initialPresencas);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function handleTogglePagar(id_presenca: number) {
    setUpdatingId(id_presenca);
    try {
      const res = await fetch('/api/admin/presencas/toggle-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_presenca }),
      });
      const data = await res.json();
      if (data.success) {
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
      }
    } catch (e) {
      console.error('Erro ao atualizar pagamento:', e);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Registo de Presenças dos Músicos</h2>
          <p className="text-sm text-neutral-500">
            Selecione o serviço ou pesquise para gerir presenças e pagamentos de cachet
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown de Serviços */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedServico}
              onChange={(e) => setSelectedServico(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full sm:w-64 px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-semibold focus:border-red-500 focus:outline-none transition shadow-2xs"
            >
              <option value="all">Todos os Serviços</option>
              {servicos.map((s) => (
                <option key={s.id_servico} value={s.id_servico}>
                  {s.nome_servico} ({s.data_inicial || '—'})
                </option>
              ))}
            </select>
          </div>

          {/* Pesquisa */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar músico..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <ListChecks className="w-12 h-12 mx-auto text-neutral-400" />
            <p className="font-bold text-neutral-800">Sem presenças para este filtro</p>
            <p className="text-xs text-neutral-500">
              Não foram encontrados registos para o serviço selecionado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-neutral-50 text-xs uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-3.5 px-4">Músico</th>
                  <th className="py-3.5 px-4">Instrumento</th>
                  <th className="py-3.5 px-4">Serviço</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4">Confirmação</th>
                  <th className="py-3.5 px-4 text-center">Pagamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((p) => {
                  const isConfirmed = p.confirmado === 'Confirmada';
                  const isPago = Number(p.pago) === 1;

                  return (
                    <tr key={p.id_presenca} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        {p.nome_utilizador}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-600">
                        {p.nome_instrumento || 'Geral'}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-neutral-800">
                        {p.nome_servico}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-500">
                        {p.data_inicial || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isConfirmed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                          }`}
                        >
                          {isConfirmed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Confirmada</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-neutral-400" />
                              <span>{p.confirmado || 'Pendente'}</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleTogglePagar(p.id_presenca)}
                          disabled={updatingId === p.id_presenca}
                          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                            isPago
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                        >
                          {updatingId === p.id_presenca ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <span>{isPago ? 'Pago' : 'Pagar'}</span>
                          )}
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
