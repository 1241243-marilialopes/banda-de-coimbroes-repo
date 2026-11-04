'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Save,
  Tag,
} from 'lucide-react';

interface ServicoItem {
  id_servico: number;
  nome_servico: string;
  descricao_servico?: string;
  tipo: number;
  tipo_servico?: string;
  color?: string;
  data_inicial: string;
  data_final: string;
  localizacao?: string;
  contacto_comissao?: string;
  nome_comissao?: string;
  cachet?: number;
  valor?: number;
}

interface TipoServico {
  id_tipo: number;
  tipo_servico: string;
}

export default function GerirServicosClient({
  servicos: initialServicos,
  tipos,
}: {
  servicos: ServicoItem[];
  tipos: TipoServico[];
}) {
  const router = useRouter();
  const [servicos, setServicos] = useState<ServicoItem[]>(initialServicos);
  const [tab, setTab] = useState<'futuros' | 'passados' | 'todos'>('futuros');
  const [search, setSearch] = useState('');

  // Modais
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<ServicoItem | null>(null);
  const [deletingServico, setDeletingServico] = useState<ServicoItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: tipos[0]?.id_tipo || 1,
    data_inicial: '',
    data_final: '',
    localizacao: '',
    contacto: '',
    responsavel: '',
    valor: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('novo=true')) {
      openCreateModal();
    }
  }, []);

  function formatDateTimeLocal(val?: string) {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function formatDisplayDate(val?: string) {
    if (!val) return '—';
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function openCreateModal() {
    setEditingServico(null);
    setFormData({
      nome: '',
      descricao: '',
      tipo: tipos[0]?.id_tipo || 1,
      data_inicial: '',
      data_final: '',
      localizacao: '',
      contacto: '',
      responsavel: '',
      valor: '',
    });
    setErrorMsg('');
    setModalOpen(true);
  }

  function openEditModal(s: ServicoItem) {
    setEditingServico(s);
    const existingCachet =
      s.cachet !== undefined && s.cachet !== null && Number(s.cachet) > 0
        ? String(s.cachet)
        : s.valor !== undefined && s.valor !== null && Number(s.valor) > 0
        ? String(s.valor)
        : '';

    setFormData({
      nome: s.nome_servico || '',
      descricao: s.descricao_servico || '',
      tipo: s.tipo || tipos[0]?.id_tipo || 1,
      data_inicial: formatDateTimeLocal(s.data_inicial),
      data_final: formatDateTimeLocal(s.data_final),
      localizacao: s.localizacao || '',
      contacto: s.contacto_comissao || '',
      responsavel: s.nome_comissao || '',
      valor: existingCachet,
    });
    setErrorMsg('');
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (new Date(formData.data_final) < new Date(formData.data_inicial)) {
      setErrorMsg('A data final tem de ser superior ou igual à data inicial.');
      return;
    }

    setLoading(true);

    try {
      const isEdit = !!editingServico;
      const url = '/api/admin/servicos';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = isEdit
        ? { ...formData, cachet: formData.valor, id_servico: editingServico.id_servico }
        : { ...formData, cachet: formData.valor };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gravar serviço.');
      }

      setSuccessMsg(isEdit ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!');
      setModalOpen(false);
      router.refresh();
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de comunicação');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingServico) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/servicos?id=${deletingServico.id_servico}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao eliminar.');

      setSuccessMsg('Serviço eliminado com sucesso!');
      setDeletingServico(null);
      setServicos((prev) => prev.filter((s) => s.id_servico !== deletingServico.id_servico));
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao eliminar');
    } finally {
      setLoading(false);
    }
  }

  const now = new Date().toISOString();

  const filtered = servicos.filter((s) => {
    // Filtro por tab
    if (tab === 'futuros' && s.data_inicial < now.slice(0, 10)) return false;
    if (tab === 'passados' && s.data_inicial >= now.slice(0, 10)) return false;

    // Filtro por pesquisa
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (s.nome_servico || '').toLowerCase().includes(q) ||
        (s.descricao_servico || '').toLowerCase().includes(q) ||
        (s.localizacao || '').toLowerCase().includes(q) ||
        (s.tipo_servico || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Gerir Serviços & Ensaios</h2>
          <p className="text-sm text-neutral-500">
            Adicione, edite ou remova eventos agendados na agenda oficial da banda
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Serviço</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-neutral-200/60 rounded-xl text-xs font-bold">
          <button
            onClick={() => setTab('futuros')}
            className={`px-4 py-2 rounded-lg transition ${
              tab === 'futuros' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Eventos Futuros
          </button>
          <button
            onClick={() => setTab('passados')}
            className={`px-4 py-2 rounded-lg transition ${
              tab === 'passados' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Eventos Passados
          </button>
          <button
            onClick={() => setTab('todos')}
            className={`px-4 py-2 rounded-lg transition ${
              tab === 'todos' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Todos ({servicos.length})
          </button>
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

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 space-y-2">
            <Calendar className="w-12 h-12 mx-auto text-neutral-400" />
            <p className="font-bold text-neutral-800">Nenhum serviço encontrado</p>
            <p className="text-xs text-neutral-500">
              {search ? 'Tente ajustar o termo de pesquisa.' : 'Não existem eventos nesta categoria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-neutral-50 text-[11px] uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Serviço</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Início</th>
                  <th className="py-3 px-4">Fim</th>
                  <th className="py-3 px-4">Localização</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((s) => (
                  <tr key={s.id_servico} className="hover:bg-neutral-50/70 transition">
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      <div>{s.nome_servico}</div>
                      {s.descricao_servico && (
                        <span className="text-xs font-normal text-neutral-500 line-clamp-1">
                          {s.descricao_servico}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
                        {s.tipo_servico || 'Geral'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600 font-medium">
                      {formatDisplayDate(s.data_inicial)}
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600 font-medium">
                      {formatDisplayDate(s.data_final)}
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600">
                      {s.localizacao || '—'}
                    </td>
                    <td className="py-3 px-4 text-xs font-bold text-neutral-800">
                      {s.cachet || s.valor ? `${Number(s.cachet || s.valor).toFixed(2)} €` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-amber-600 hover:bg-amber-50 transition"
                          title="Editar Serviço"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingServico(s)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition"
                          title="Eliminar Serviço"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Adicionar / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              {editingServico ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Preencha os dados do evento que será registado no calendário oficial da banda.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                    placeholder="Ex: Procissão de Santo António"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Tipo de Serviço *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  >
                    {tipos.map((t) => (
                      <option key={t.id_tipo} value={t.id_tipo}>
                        {t.tipo_servico}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Data e Hora de Início *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.data_inicial}
                    onChange={(e) => setFormData({ ...formData, data_inicial: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Data e Hora de Fim *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.data_final}
                    onChange={(e) => setFormData({ ...formData, data_final: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Localização *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                    placeholder="Ex: Canelas, V. N. Gaia"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Cachet / Valor (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                    placeholder="Ex: 50.00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Nome da Comissão / Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Contacto da Comissão (9 dígitos)
                  </label>
                  <input
                    type="tel"
                    maxLength={9}
                    value={formData.contacto}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Descrição / Notas
                </label>
                <textarea
                  rows={3}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  placeholder="Informações adicionais sobre o serviço..."
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
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'A gravar...' : 'Gravar Serviço'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {deletingServico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Eliminar Serviço?</h3>
            <p className="text-xs text-neutral-600 mb-6">
              Tem a certeza de que pretende eliminar o serviço{' '}
              <strong className="text-neutral-900">{deletingServico.nome_servico}</strong>? Esta ação
              irá também remover todos os registos de presenças associados.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingServico(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
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
