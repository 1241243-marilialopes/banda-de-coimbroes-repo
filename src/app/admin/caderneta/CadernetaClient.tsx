'use client';

import { useState } from 'react';
import { BookOpen, Music, Download, Search, Filter } from 'lucide-react';

interface InstrumentOption {
  id_instrumento: number;
  nome_instrumento: string;
}

interface PartituraRow {
  id_partitura: number;
  nome_obra?: string;
  nome_ficheiro?: string;
  instrumento_id: number;
  nome_instrumento?: string;
}

export default function CadernetaClient({
  instrumentos,
  partituras,
}: {
  instrumentos: InstrumentOption[];
  partituras: PartituraRow[];
}) {
  const [selectedInst, setSelectedInst] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = partituras.filter((p) => {
    if (selectedInst !== 'all' && p.instrumento_id !== selectedInst) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const title = (p.nome_obra || p.nome_ficheiro || '').toLowerCase();
      const inst = (p.nome_instrumento || '').toLowerCase();
      return title.includes(q) || inst.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Caderneta de Partituras</h2>
          <p className="text-sm text-neutral-500">
            Filtre por instrumento para consultar e transferir as partituras da banda
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor por Instrumento */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400 hidden sm:block" />
            <select
              value={selectedInst}
              onChange={(e) =>
                setSelectedInst(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold focus:border-red-500 focus:outline-none transition shadow-2xs"
            >
              <option value="all">Todos os Instrumentos ({partituras.length})</option>
              {instrumentos.map((inst) => (
                <option key={inst.id_instrumento} value={inst.id_instrumento}>
                  {inst.nome_instrumento}
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
              placeholder="Pesquisar obra..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <BookOpen className="w-12 h-12 mx-auto text-neutral-400" />
            <p className="font-bold text-neutral-800">Nenhuma partitura encontrada</p>
            <p className="text-xs text-neutral-500">
              Não existem partituras cadastradas para o instrumento selecionado.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filtered.map((p) => (
              <div
                key={p.id_partitura}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50/80 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600 flex-shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm sm:text-base text-neutral-900 truncate">
                      {p.nome_obra || p.nome_ficheiro}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                      <span className="font-semibold text-neutral-700">
                        Naipe: {p.nome_instrumento || 'Geral'}
                      </span>
                      {p.nome_ficheiro && (
                        <span className="text-neutral-400 hidden sm:inline truncate">
                          • {p.nome_ficheiro}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <a
                  href={`/api/partituras/download/${p.id_partitura}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Descarregar PDF</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

