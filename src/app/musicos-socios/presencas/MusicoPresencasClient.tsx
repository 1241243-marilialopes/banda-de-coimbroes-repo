'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

interface MusicoPresencaRow {
  id_presenca: number;
  id_servico: number;
  nome_servico: string;
  descricao_servico?: string;
  data_inicial: string;
  data_final: string;
  localizacao?: string;
  confirmado: string;
  pago: number;
  musico_label_pago?: string;
  cachet?: number;
}

export default function MusicoPresencasClient({
  initialPresencas,
}: {
  initialPresencas: MusicoPresencaRow[];
}) {
  const [presencas, setPresencas] = useState<MusicoPresencaRow[]>(initialPresencas);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // REGRA DE NEGÓCIO: Atualização em tempo real (polling a cada 3s) da presença definida pelo Admin
  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/musico/presencas');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.presencas) {
            setPresencas(data.presencas);
          }
        }
      } catch {
        // Silencioso em caso de falha de polling
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const filtered = presencas.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (p.nome_servico || '').toLowerCase().includes(q) ||
      (p.descricao_servico || '').toLowerCase().includes(q) ||
      (p.localizacao || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Marcar Presenças</h2>
          <p className="text-sm text-neutral-500">
            Confirme a sua disponibilidade nos próximos ensaios e atuações da banda
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <Calendar className="w-12 h-12 mx-auto text-neutral-400" />
            <p className="font-bold text-neutral-800">Sem serviços agendados</p>
            <p className="text-xs text-neutral-500">
              {search
                ? 'Nenhum serviço corresponde à pesquisa.'
                : 'Não existem serviços futuros para confirmação de presença.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-neutral-50 text-[11px] uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Serviço</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Data Inicial</th>
                  <th className="py-3 px-4">Data Final</th>
                  <th className="py-3 px-4">Localização</th>
                  <th className="py-3 px-4 text-center">Presença</th>
                  <th className="py-3 px-4 text-center">Cachet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((p) => {
                  const isConfirmed = p.confirmado === 'Confirmada';
                  const isPago = Number(p.pago) === 1;

                  return (
                    <tr key={p.id_presenca} className="hover:bg-neutral-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        {p.nome_servico}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-500 max-w-xs truncate">
                        {p.descricao_servico || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-neutral-800">
                        {p.data_inicial}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-600">
                        {p.data_final}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-600">
                        {p.localizacao || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isConfirmed ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Confirmada</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>Não confirmada</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span
                            className={`text-xs font-black uppercase ${
                              isPago ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            {isPago ? 'Pago' : 'Por pagar'}
                          </span>
                          {p.cachet && Number(p.cachet) > 0 ? (
                            <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                              {Number(p.cachet).toFixed(2)} €
                            </span>
                          ) : null}
                        </div>
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
