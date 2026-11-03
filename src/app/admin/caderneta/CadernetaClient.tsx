'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Music,
  Download,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Upload,
  Loader2,
} from 'lucide-react';

interface InstrumentOption {
  id_instrumento: number;
  nome_instrumento: string;
}

interface PecaOption {
  id_nome_partitura: number;
  nome_partitura: string;
}

interface PartituraRow {
  id_partitura: number;
  nome?: number;
  nome_partitura: string;
  instrumento_id: number;
  nome_instrumento: string;
}

export default function CadernetaClient({
  instrumentos,
  partituras: initialPartituras,
  pecas,
}: {
  instrumentos: InstrumentOption[];
  partituras: PartituraRow[];
  pecas: PecaOption[];
}) {
  const router = useRouter();
  const [partituras, setPartituras] = useState<PartituraRow[]>(initialPartituras);
  const [selectedInst, setSelectedInst] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');

  // Modais de Criação / Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartitura, setEditingPartitura] = useState<PartituraRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<PartituraRow | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nome_partitura: '',
    id_nome_partitura: '',
    instrumento: instrumentos[0]?.id_instrumento || 1,
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function openCreateModal() {
    setEditingPartitura(null);
    setFormData({
      nome_partitura: '',
      id_nome_partitura: pecas[0]?.id_nome_partitura ? String(pecas[0].id_nome_partitura) : '',
      instrumento: instrumentos[0]?.id_instrumento || 1,
    });
    setPdfFile(null);
    setImgFile(null);
    setError(null);
    setModalOpen(true);
  }

  function openEditModal(p: PartituraRow) {
    setEditingPartitura(p);
    const matchedPeca = pecas.find(
      (peca) => peca.nome_partitura.toLowerCase() === p.nome_partitura.toLowerCase()
    );
    setFormData({
      nome_partitura: p.nome_partitura,
      id_nome_partitura: matchedPeca ? String(matchedPeca.id_nome_partitura) : '',
      instrumento: p.instrumento_id,
    });
    setPdfFile(null);
    setImgFile(null);
    setError(null);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const isEdit = !!editingPartitura;
    if (!formData.nome_partitura.trim()) {
      setError('Por favor, indique o nome da partitura / peça.');
      return;
    }
    if (!isEdit && (!pdfFile || pdfFile.size === 0)) {
      setError('Por favor, selecione um ficheiro PDF de partitura.');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      if (isEdit) {
        fd.append('id_partitura', String(editingPartitura.id_partitura));
      }
      fd.append('nome_partitura', formData.nome_partitura.trim());
      if (formData.id_nome_partitura) {
        fd.append('id_nome_partitura', formData.id_nome_partitura);
      }
      fd.append('instrumento', String(formData.instrumento));
      if (pdfFile) {
        fd.append('ficheiro', pdfFile);
      }
      if (imgFile) {
        fd.append('imagem', imgFile);
      }

      const res = await fetch('/api/admin/partituras', {
        method: isEdit ? 'PUT' : 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar partitura.');
      }

      showToast('success', isEdit ? 'Partitura atualizada com sucesso!' : 'Partitura adicionada com sucesso!');
      setModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Erro ao comunicar com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/partituras?id=${deleteConfirm.id_partitura}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao eliminar partitura.');

      setPartituras((prev) => prev.filter((p) => p.id_partitura !== deleteConfirm.id_partitura));
      setDeleteConfirm(null);
      showToast('success', 'Partitura eliminada com sucesso!');
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao eliminar partitura.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = partituras.filter((p) => {
    if (selectedInst !== 'all' && p.instrumento_id !== selectedInst) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const title = (p.nome_partitura || '').toLowerCase();
      const inst = (p.nome_instrumento || '').toLowerCase();
      return title.includes(q) || inst.includes(q);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Caderneta de Partituras</h2>
          <p className="text-sm text-neutral-500">
            Adicione, consulte, edite e elimine as partituras da banda por instrumento
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Partitura</span>
        </button>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar peça ou instrumento..."
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
            {search || selectedInst !== 'all'
              ? 'Tente ajustar os filtros ou termo de pesquisa.'
              : 'Não existem partituras cadastradas para este filtro.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id_partitura}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group relative"
            >
              {/* Botões de Ação Admin no Canto */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => openEditModal(p)}
                  className="p-1.5 bg-white/90 hover:bg-white text-neutral-700 hover:text-blue-600 rounded-lg shadow-xs border border-neutral-200 backdrop-blur-xs transition"
                  title="Editar Partitura"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(p)}
                  className="p-1.5 bg-white/90 hover:bg-white text-neutral-700 hover:text-red-600 rounded-lg shadow-xs border border-neutral-200 backdrop-blur-xs transition"
                  title="Eliminar Partitura"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

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
                    {p.nome_instrumento}
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

      {/* Modal Adicionar / Editar Partitura */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              {editingPartitura ? 'Editar Partitura' : 'Adicionar Nova Partitura'}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Associe a partitura ao respetivo instrumento e envie o ficheiro PDF oficial.
            </p>

            {error && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Nome da Peça / Obra Musical *
                </label>
                <div className="space-y-2">
                  <select
                    value={formData.id_nome_partitura}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const selPeca = pecas.find((p) => String(p.id_nome_partitura) === selId);
                      setFormData({
                        ...formData,
                        id_nome_partitura: selId,
                        nome_partitura: selPeca ? selPeca.nome_partitura : formData.nome_partitura,
                      });
                    }}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  >
                    <option value="">-- Nova Peça ou Selecione Existente --</option>
                    {pecas.map((peca) => (
                      <option key={peca.id_nome_partitura} value={peca.id_nome_partitura}>
                        {peca.nome_partitura}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Ou digite o nome da peça..."
                    value={formData.nome_partitura}
                    onChange={(e) =>
                      setFormData({ ...formData, nome_partitura: e.target.value, id_nome_partitura: '' })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Instrumento Musical *
                </label>
                <select
                  value={formData.instrumento}
                  onChange={(e) => setFormData({ ...formData, instrumento: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                >
                  {instrumentos.map((i) => (
                    <option key={i.id_instrumento} value={i.id_instrumento}>
                      {i.nome_instrumento}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Ficheiro Partitura (PDF) {editingPartitura ? '(Opcional — substituir)' : '*'}
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Imagem de Capa (Opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImgFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingPartitura ? 'Guardar Alterações' : 'Adicionar Partitura'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminação */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-neutral-900 mb-1">Eliminar Partitura?</h4>
            <p className="text-xs text-neutral-500 mb-6">
              Tem a certeza de que pretende eliminar &quot;{deleteConfirm.nome_partitura}&quot; ({deleteConfirm.nome_instrumento})? Esta ação é irreversível.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
              >
                {loading ? 'A eliminar...' : 'Confirmar Eliminação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
