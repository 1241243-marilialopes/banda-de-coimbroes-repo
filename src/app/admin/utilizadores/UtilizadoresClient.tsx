'use client';

import { useState } from 'react';
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  Music,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';

interface UserRow {
  id_utilizador: number;
  nome_utilizador: string;
  telemovel?: string;
  numero_cc?: string;
  nif?: string;
  data_nascimento?: string;
  email: string;
  instrumento?: number;
  nome_instrumento?: string;
  genero_id?: number;
  genero?: string;
  cargo_id?: number;
  nome_cargo?: string;
  foto_perfil?: any;
}

interface Option {
  id: number;
  label: string;
}

export default function UtilizadoresClient({
  users: initialUsers,
  instrumentos,
  cargos,
  generos,
}: {
  users: UserRow[];
  instrumentos: Option[];
  cargos: Option[];
  generos: Option[];
}) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tele: '',
    cc: '',
    nif: '',
    data: '',
    instrumento: instrumentos[0]?.id || 1,
    genero: generos[0]?.id || 1,
    cargo: cargos[0]?.id !== undefined ? cargos[0].id : 3,
    senha: '',
  });

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function openCreateModal() {
    setEditingUser(null);
    setFormData({
      nome: '',
      email: '',
      tele: '',
      cc: '',
      nif: '',
      data: '',
      instrumento: instrumentos[0]?.id || 1,
      genero: generos[0]?.id || 1,
      cargo: cargos[0]?.id !== undefined ? cargos[0].id : 3,
      senha: '',
    });
    setError(null);
    setModalOpen(true);
  }

  function openEditModal(u: UserRow) {
    setEditingUser(u);
    setFormData({
      nome: u.nome_utilizador,
      email: u.email,
      tele: u.telemovel || '',
      cc: u.numero_cc ? String(u.numero_cc) : '',
      nif: u.nif ? String(u.nif) : '',
      data: u.data_nascimento ? String(u.data_nascimento).slice(0, 10) : '',
      instrumento: u.instrumento || instrumentos[0]?.id || 1,
      genero: u.genero_id || generos[0]?.id || 1,
      cargo: u.cargo_id !== undefined ? u.cargo_id : 3,
      senha: '',
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validações rigorosas como no PHP
    if (!formData.nome.trim()) {
      setError('Por favor, insira o nome de utilizador.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Por favor, insira um email válido.');
      return;
    }

    if (formData.data) {
      const dNascimento = new Date(formData.data);
      const dAtual = new Date();
      if (dNascimento >= dAtual) {
        setError('Por favor, insira uma data de nascimento válida (anterior à data atual).');
        return;
      }
    }

    if (formData.tele && !/^\d{9}$/.test(formData.tele.trim())) {
      setError('Por favor, insira um número de telefone válido com 9 dígitos.');
      return;
    }

    if (formData.cc && !/^\d{8}$/.test(formData.cc.trim())) {
      setError('Por favor, insira um número de Cartão de Cidadão válido com 8 dígitos.');
      return;
    }

    if (formData.nif && !/^\d{9}$/.test(formData.nif.trim())) {
      setError('Por favor, insira um número de Identificação Fiscal (NIF) válido com 9 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const isEdit = !!editingUser;
      const url = '/api/admin/utilizadores';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = isEdit
        ? { ...formData, id_utilizador: editingUser.id_utilizador }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao gravar utilizador.');
        setLoading(false);
        return;
      }

      showToast('success', isEdit ? 'Utilizador atualizado com sucesso!' : 'Utilizador criado com sucesso!');
      setModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Erro de comunicação');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteConfirmUser) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/utilizadores?id=${deleteConfirmUser.id_utilizador}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao eliminar utilizador.');

      setUsers((prev) => prev.filter((u) => u.id_utilizador !== deleteConfirmUser.id_utilizador));
      setDeleteConfirmUser(null);
      showToast('success', 'Utilizador eliminado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao eliminar utilizador.');
    } finally {
      setLoading(false);
    }
  }

  // Pesquisa ampla por TODOS os parâmetros
  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.nome_utilizador || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.telemovel || '').toLowerCase().includes(q) ||
      (u.nif ? String(u.nif) : '').includes(q) ||
      (u.numero_cc ? String(u.numero_cc) : '').includes(q) ||
      (u.data_nascimento || '').toLowerCase().includes(q) ||
      (u.nome_instrumento || '').toLowerCase().includes(q) ||
      (u.nome_cargo || '').toLowerCase().includes(q) ||
      (u.genero || '').toLowerCase().includes(q)
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Gestão de Utilizadores</h2>
          <p className="text-sm text-neutral-500">
            Total de {users.length} membros registados no sistema
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition text-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Adicionar Utilizador</span>
        </button>
      </div>

      {/* Barra de Pesquisa Completa */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Pesquisar por nome, telemóvel, NIF, CC, instrumento, email, data de nascimento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
        />
      </div>

      {/* Tabela de Utilizadores */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            Nenhum utilizador encontrado para &quot;{search}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700">
              <thead className="bg-neutral-50 text-[11px] uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Utilizador</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Documentos</th>
                  <th className="py-3 px-4">Data Nasc.</th>
                  <th className="py-3 px-4">Instrumento</th>
                  <th className="py-3 px-4">Cargo</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((u) => (
                  <tr key={u.id_utilizador} className="hover:bg-neutral-50/70 transition">
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600/10 text-red-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {u.nome_utilizador ? u.nome_utilizador.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div>{u.nome_utilizador}</div>
                          <div className="text-xs font-normal text-neutral-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600">
                      {u.telemovel || '—'}
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600">
                      <div>CC: <span className="font-semibold text-neutral-800">{u.numero_cc || '—'}</span></div>
                      <div>NIF: <span className="font-semibold text-neutral-800">{u.nif || '—'}</span></div>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600">
                      {u.data_nascimento || '—'}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-semibold bg-neutral-100 text-neutral-700">
                        {u.nome_instrumento || 'Geral'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-red-50 text-red-700">
                        {u.nome_cargo || 'Sócio'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-amber-600 hover:bg-amber-50 transition"
                          title="Editar Utilizador"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmUser(u)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition"
                          title="Remover Utilizador"
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

      {/* Modal Criar / Editar */}
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
              {editingUser ? 'Editar Utilizador' : 'Adicionar Novo Utilizador'}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Todos os campos são validados de acordo com os requisitos institucionais da banda.
            </p>

            {error && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Telemóvel (9 dígitos)
                  </label>
                  <input
                    type="tel"
                    maxLength={9}
                    placeholder="9XXXXXXXX"
                    value={formData.tele}
                    onChange={(e) => setFormData({ ...formData, tele: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Nº Cartão Cidadão (8 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="8 dígitos"
                    value={formData.cc}
                    onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    NIF (9 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="9 dígitos"
                    value={formData.nif}
                    onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Instrumento
                  </label>
                  <select
                    value={formData.instrumento}
                    onChange={(e) => setFormData({ ...formData, instrumento: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  >
                    {instrumentos.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Cargo (Base de Dados) *
                  </label>
                  <select
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600 font-semibold"
                  >
                    {cargos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    Género
                  </label>
                  <select
                    value={formData.genero}
                    onChange={(e) => setFormData({ ...formData, genero: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  >
                    {generos.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                    {editingUser ? 'Nova Palavra-passe (opcional)' : 'Palavra-passe Inicial'}
                  </label>
                  <input
                    type="password"
                    placeholder={editingUser ? 'Deixar em branco para manter' : 'Mínimo 6 caracteres'}
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
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
                  <span>{loading ? 'A gravar...' : 'Gravar Utilizador'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Eliminar Utilizador?</h3>
            <p className="text-xs text-neutral-600 mb-6">
              Tem a certeza de que pretende remover o utilizador{' '}
              <strong className="text-neutral-900">{deleteConfirmUser.nome_utilizador}</strong>? Esta ação
              irá apagar o registo de utilizador e as respetivas presenças e cotas.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
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
