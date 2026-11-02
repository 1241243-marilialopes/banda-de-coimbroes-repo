'use client';

import { useState } from 'react';
import { BookOpen, Music, Download, Search } from 'lucide-react';

interface PartituraRow {
  id_partitura: number;
  nome_partitura: string;
  instrumento_id: number;
  nome_instrumento: string;
}

export default function MusicoCadernetaClient({
  partituras,
  instrumentName,
}: {
  partituras: PartituraRow[];
  instrumentName: string;
}) {
  const [search, setSearch] = useState('');

  const filtered = partituras.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const title = (p.nome_partitura || '').toLowerCase();
      return title.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Partituras de {instrumentName}
          </h2>
          <p className="text-sm text-neutral-500">
            Material de ensaio e atuações atribuído ao seu naipe musical
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar peça..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500 space-y-2">
          <BookOpen className="w-12 h-12 mx-auto text-neutral-400" />
          <p className="font-bold text-neutral-800">Nenhuma partitura encontrada</p>
          <p className="text-xs text-neutral-500">
            {search
              ? 'Nenhuma peça corresponde à sua pesquisa.'
              : `Ainda não existem partituras registadas para ${instrumentName}.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id_partitura}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden flex items-center justify-center border-b border-neutral-100">
                  <img
                    src={`/api/partituras/imagem/${p.id_partitura}`}
                    alt={p.nome_partitura}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center -z-10 text-neutral-300">
                    <Music className="w-16 h-16" />
                  </div>
                </div>

                <div className="p-4 space-y-1 text-center">
                  <h4 className="font-bold text-base text-neutral-900 line-clamp-1">
                    {p.nome_partitura}
                  </h4>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
                    {instrumentName}
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href={`/api/partituras/download/${p.id_partitura}`}
                  target="_blank"
                  rel="noreferrer"
                  download={`${p.nome_partitura}.pdf`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
