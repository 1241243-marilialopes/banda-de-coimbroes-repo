'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  History,
} from 'lucide-react';

interface HistoricoItem {
  id_presenca?: number;
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

export default function MusicoHistoricoClient({
  historico: initialHistorico,
}: {
  historico: HistoricoItem[];
}) {
  const [historico] = useState<HistoricoItem[]>(initialHistorico);
  const [search, setSearch] = useState('');

  const filtered = historico.filter((h) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (h.nome_servico || '').toLowerCase().includes(q) ||
      (h.descricao_servico || '').toLowerCase().includes(q) ||
      (h.localizacao || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Histórico de Presenças</h2>
          <p className="text-sm text-neutral-500">
            Consulte os ensaios e atuações já realizados e o respetivo registo de presenças
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar histórico..."
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
            <History className="w-12 h-12 mx-auto text-neutral-400" />
            <p className="font-bold text-neutral-800">Sem registos no histórico</p>
            <p className="text-xs text-neutral-500">
              {search
                ? 'Nenhum registo corresponde à pesquisa.'
                : 'Ainda não constam serviços realizados no histórico.'}
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
                {filtered.map((h, idx) => {
                  const isConfirmed = h.confirmado === 'Confirmada';
                  const isPago = Number(h.pago) === 1;

                  return (
                    <tr key={idx} className="hover:bg-neutral-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        {h.nome_servico}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-500 max-w-xs truncate">
                        {h.descricao_servico || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-neutral-800">
                        {h.data_inicial}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-600">
                        {h.data_final}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-neutral-600">
                        {h.localizacao || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Não confirmada</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span
                            className={`text-xs font-black uppercase ${
                              isPago ? 'text-emerald-600' : 'text-neutral-400'
                            }`}
                          >
                            {isPago ? 'Pago' : 'Não Pago'}
                          </span>
                          {h.cachet && Number(h.cachet) > 0 ? (
                            <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                              {Number(h.cachet).toFixed(2)} €
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
