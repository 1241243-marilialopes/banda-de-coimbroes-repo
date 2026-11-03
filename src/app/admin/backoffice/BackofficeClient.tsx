'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileEdit,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Plus,
  ExternalLink,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Save,
  Upload,
} from 'lucide-react';

interface TipoElemento {
  id_tipo: number;
  tipo_elemento: string;
}

interface BackofficeItem {
  id_elemento: number;
  designacao_conteudo: string;
  conteudo: string;
  elemento_tipo: string | number;
}

interface BackofficeImagem {
  id_imagem: number;
  designacao_imagem: string;
  nome_imagem: string;
  conteudo_tipo: string | number;
}

export default function BackofficeClient({
  tipos,
  elementos,
  imagens,
}: {
  tipos: TipoElemento[];
  elementos: BackofficeItem[];
  imagens: BackofficeImagem[];
}) {
  const router = useRouter();
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [search, setSearch] = useState('');

  // Modais de Edição
  const [editingItem, setEditingItem] = useState<BackofficeItem | null>(null);
  const [editingImage, setEditingImage] = useState<BackofficeImagem | null>(null);
  const [editConteudo, setEditConteudo] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Modal de Criação de Secção / Conteúdo
  const [addingSection, setAddingSection] = useState(false);
  const [addTipoMode, setAddTipoMode] = useState<'existente' | 'novo'>('existente');
  const [addTipoId, setAddTipoId] = useState<string>(tipos[0] ? String(tipos[0].id_tipo) : '');
  const [addNovoTipoNome, setAddNovoTipoNome] = useState('');
  const [addDesignacao, setAddDesignacao] = useState('');
  const [addConteudo, setAddConteudo] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/backoffice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_id: addTipoMode === 'existente' ? addTipoId : undefined,
          novo_tipo: addTipoMode === 'novo' ? addNovoTipoNome : undefined,
          designacao: addDesignacao,
          conteudo: addConteudo,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao adicionar secção.');

      showToast('success', 'Secção / elemento adicionado com sucesso.');
      setAddingSection(false);
      setAddDesignacao('');
      setAddConteudo('');
      setAddNovoTipoNome('');
      if (data.id_tipo) {
        setSelectedTipo(String(data.id_tipo));
      }
      router.refresh();
      window.location.reload();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao criar secção.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteElement(id: number, type: 'texto' | 'imagem') {
    if (!confirm('Tem a certeza que deseja eliminar este elemento?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/backoffice?id=${id}&type=${type}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao eliminar elemento.');

      showToast('success', 'Elemento eliminado com sucesso.');
      router.refresh();
      window.location.reload();
    } catch (err: any) {
      showToast('error', err.message || 'Erro ao eliminar.');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenEditText(item: BackofficeItem) {
    setEditingItem(item);
    setEditConteudo(item.conteudo || '');
  }

  function handleOpenEditImage(img: BackofficeImagem) {
    setEditingImage(img);
    setSelectedFile(null);
  }

  async function handleSaveText(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('type', 'texto');
      fd.append('id', String(editingItem.id_elemento));
      fd.append('conteudo', editConteudo);

      const res = await fetch('/api/admin/backoffice', {
        method: 'PUT',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar.');

      showToast('success', 'Elemento atualizado com sucesso.');
      setEditingItem(null);
      router.refresh();
      window.location.reload();
    } catch (err: any) {
      showToast('error', err.message || 'Erro de comunicação');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveImage(e: React.FormEvent) {
    e.preventDefault();
    if (!editingImage) return;
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('type', 'imagem');
      fd.append('id', String(editingImage.id_imagem));
      if (selectedFile) {
        fd.append('imagem', selectedFile);
      }

      const res = await fetch('/api/admin/backoffice', {
        method: 'PUT',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar.');

      showToast('success', 'Elemento atualizado com sucesso.');
      setEditingImage(null);
      router.refresh();
      window.location.reload();
    } catch (err: any) {
      showToast('error', err.message || 'Erro de comunicação');
    } finally {
      setLoading(false);
    }
  }

  // Elementos da categoria selecionada
  const isImagens = selectedTipo === '6';

  const filteredElementos = elementos.filter((el) => {
    if (String(el.elemento_tipo) !== selectedTipo) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (el.designacao_conteudo || '').toLowerCase().includes(q) ||
        (el.conteudo || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredImagens = imagens.filter((img) => {
    if (String(img.conteudo_tipo) !== selectedTipo) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (img.designacao_imagem || '').toLowerCase().includes(q) ||
        (img.nome_imagem || '').toLowerCase().includes(q)
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

      {/* Header com Seletor por Categoria (Exatamente como Imagem 3) e Ações */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">BackOffice</h2>
            <p className="text-xs text-neutral-500">
              Gestão de conteúdos estáticos e imagens exibidos nas páginas públicas do website.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 border border-neutral-300 hover:bg-neutral-100 rounded-xl text-xs font-bold text-neutral-700 transition"
              title="Abrir pré-visualização do website público numa nova aba"
            >
              <ExternalLink className="w-4 h-4 text-neutral-500" />
              <span>Ver Website Público (Pré-visualização)</span>
            </a>
            <button
              type="button"
              onClick={() => setAddingSection(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Secção</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
          <label className="text-sm font-semibold text-neutral-700 whitespace-nowrap">
            Selecione o sítio do elemento:
          </label>
          <select
            value={selectedTipo}
            onChange={(e) => {
              setSelectedTipo(e.target.value);
              setSearch('');
            }}
            className="w-full sm:w-80 px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-800 focus:bg-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition shadow-2xs"
          >
            <option value="">--</option>
            {tipos.map((t) => (
              <option key={t.id_tipo} value={t.id_tipo}>
                {t.tipo_elemento}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conteúdo da Categoria */}
      {selectedTipo ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
            />
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
            {isImagens ? (
              // Tabela de Imagens (op = 6)
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-700">
                  <thead className="bg-neutral-50 text-[11px] uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                    <tr>
                      <th className="py-3 px-4">Nome</th>
                      <th className="py-3 px-4">Imagem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredImagens.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-neutral-500 text-xs">
                          Nenhuma imagem encontrada.
                        </td>
                      </tr>
                    ) : (
                      filteredImagens.map((img) => (
                        <tr key={img.id_imagem} className="hover:bg-neutral-50/70 transition">
                          <td className="py-3 px-4 font-bold text-neutral-900 w-1/3">
                            {img.designacao_imagem}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                                  <img
                                    src={`/api/admin/backoffice/imagem/${img.id_imagem}`}
                                    alt={img.designacao_imagem}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-neutral-600 font-mono">
                                  {img.nome_imagem}
                                </span>
                              </div>
                              <button
                                onClick={() => handleOpenEditImage(img)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200 transition"
                                title="Editar Imagem"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              // Tabela de Textos (op = 1, 2, 3, 5)
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-700">
                  <thead className="bg-neutral-50 text-[11px] uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                    <tr>
                      <th className="py-3 px-4">Nome</th>
                      <th className="py-3 px-4">Conteúdo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredElementos.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-neutral-500 text-xs">
                          Nenhum conteúdo encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredElementos.map((el) => (
                        <tr key={el.id_elemento} className="hover:bg-neutral-50/70 transition">
                          <td className="py-3 px-4 font-bold text-neutral-900 w-1/4 align-top">
                            {el.designacao_conteudo}
                          </td>
                          <td className="py-3 px-4 align-top">
                            <div className="flex items-start justify-between gap-4">
                              <p className="text-xs text-neutral-700 leading-relaxed max-w-2xl whitespace-pre-wrap">
                                {el.conteudo}
                              </p>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleOpenEditText(el)}
                                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200 transition shrink-0"
                                  title="Editar Conteúdo"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteElement(el.id_elemento, 'texto')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition shrink-0"
                                  title="Eliminar Elemento"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-neutral-400 bg-white border border-neutral-200 rounded-2xl">
          <FileEdit className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
          <p className="font-semibold text-neutral-600 text-sm">
            Selecione uma secção no menu acima para consultar e editar os elementos.
          </p>
        </div>
      )}

      {/* Modal Editar Texto */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-neutral-900 mb-1">Editar Conteúdo</h3>
            <p className="text-xs text-neutral-500 mb-4">{editingItem.designacao_conteudo}</p>

            <form onSubmit={handleSaveText} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Conteúdo do Texto
                </label>
                <textarea
                  rows={8}
                  required
                  value={editConteudo}
                  onChange={(e) => setEditConteudo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600 leading-relaxed font-normal"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'A gravar...' : 'Gravar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Imagem */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setEditingImage(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-neutral-900 mb-1">Atualizar Imagem</h3>
            <p className="text-xs text-neutral-500 mb-4">{editingImage.designacao_imagem}</p>

            <form onSubmit={handleSaveImage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Ficheiro de Imagem
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-none focus:border-red-600"
                />
                <span className="block mt-1 text-[11px] text-neutral-400">
                  Ficheiro atual: {editingImage.nome_imagem}
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{loading ? 'A enviar...' : 'Enviar Nova Imagem'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Adicionar Secção / Conteúdo */}
      {addingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setAddingSection(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-neutral-900 mb-1">Adicionar Secção / Conteúdo</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Crie uma nova secção para a página principal ou adicione um novo bloco de conteúdo.
            </p>

            <form onSubmit={handleAddSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-2">
                  Destino da Secção
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setAddTipoMode('existente')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      addTipoMode === 'existente'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    Secção Existente
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddTipoMode('novo')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      addTipoMode === 'novo'
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    + Criar Nova Secção
                  </button>
                </div>

                {addTipoMode === 'existente' ? (
                  <select
                    value={addTipoId}
                    onChange={(e) => setAddTipoId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold"
                  >
                    {tipos.map((t) => (
                      <option key={t.id_tipo} value={t.id_tipo}>
                        {t.tipo_elemento}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Galeria de Prémios, História, Patrocinadores"
                      value={addNovoTipoNome}
                      onChange={(e) => setAddNovoTipoNome(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                    />
                    <span className="block mt-1 text-[11px] text-neutral-400">
                      Isto criará uma nova categoria / secção no menu de gestão do Backoffice.
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Designação / Título do Bloco
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Título da Secção, Texto Introdutório"
                  value={addDesignacao}
                  onChange={(e) => setAddDesignacao(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Conteúdo do Texto
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Insira o texto que será apresentado na secção da página principal..."
                  value={addConteudo}
                  onChange={(e) => setAddConteudo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setAddingSection(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{loading ? 'A criar...' : 'Adicionar Secção'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
