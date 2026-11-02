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
}: {
  users: UserRow[];
  instrumentos: Option[];
}) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tele: '',
    cc: '',
    nif: '',
    data: '',
    instrumento: 1,
    genero: 1,
    cargo: 3,
    senha: '',
  });

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
      genero: 1,
      cargo: 3,
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
      instrumento: u.instrumento || 1,
      genero: u.genero_id || 1,
      cargo: u.cargo_id !== undefined ? u.cargo_id : 3,
      senha: '',
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      if (isEdit) {
        const instLabel = instrumentos.find((i) => i.id === Number(formData.instrumento))?.label;
        const cargoLabels: Record<number, string> = {
          0: 'Administrador',
          1: 'Músico & Sócio',
          2: 'Admin & Músico',
          3: 'Sócio',
        };

        setUsers((prev) =>
          prev.map((u) =>
            u.id_utilizador === editingUser.id_utilizador
              ? {
                  ...u,
                  nome_utilizador: formData.nome,
                  email: formData.email,
                  telemovel: formData.tele,
                  numero_cc: formData.cc,
                  nif: formData.nif,
                  data_nascimento: formData.data,
                  instrumento: Number(formData.instrumento),
                  nome_instrumento: instLabel || u.nome_instrumento,
                  genero_id: Number(formData.genero),
                  cargo_id: Number(formData.cargo),
                  nome_cargo: cargoLabels[Number(formData.cargo)] || u.nome_cargo,
                }
              : u
          )
        );
      } else {
        // Recarregar lista para incluir o novo ID
        window.location.reload();
      }

      setModalOpen(false);
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
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id_utilizador !== deleteConfirmUser.id_utilizador));
        setDeleteConfirmUser(null);
      }
    } catch (e) {
      console.error('Erro ao eliminar:', e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.nome_utilizador.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.nome_instrumento && u.nome_instrumento.toLowerCase().includes(q)) ||
      (u.nome_cargo && u.nome_cargo.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Gestão de Utilizadores</h2>
          <p className="text-sm text-neutral-500">
            Total de {users.length} membros registados no sistema
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar utilizador..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:border-red-500 focus:outline-none transition shadow-2xs"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar Utilizador</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-neutral-700">
            <thead className="bg-neutral-50 text-[11px] uppercase font-black text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-3.5 px-4">Foto / Nome</th>
                <th className="py-3.5 px-4">Contactos</th>
                <th className="py-3.5 px-4">Documentos</th>
                <th className="py-3.5 px-4">Nasc.</th>
                <th className="py-3.5 px-4">Instrumento</th>
                <th className="py-3.5 px-4">Cargo</th>
                <th className="py-3.5 px-4 text-center">Opções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-neutral-500">
                    Nenhum utilizador encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id_utilizador} className="hover:bg-neutral-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-600/10 text-red-600 font-bold flex items-center justify-center border border-red-500/20 text-xs overflow-hidden flex-shrink-0">
                          {u.foto_perfil ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`data:image/jpeg;base64,${Buffer.from(u.foto_perfil).toString('base64')}`}
                              alt={u.nome_utilizador}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            u.nome_utilizador.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 leading-tight">
                            {u.nome_utilizador}
                          </p>
                          <span className="text-[10px] text-neutral-400">#{u.id_utilizador}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-xs space-y-0.5">
                      <div className="flex items-center gap-1.5 text-neutral-700">
                        <Mail className="w-3 h-3 text-neutral-400" />
                        <span className="truncate max-w-[140px]">{u.email}</span>
                      </div>
                      {u.telemovel && (
                        <div className="flex items-center gap-1.5 text-neutral-500">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          <span>{u.telemovel}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-xs text-neutral-600">
                      <div>CC: {u.numero_cc || '—'}</div>
                      <div>NIF: {u.nif || '—'}</div>
                    </td>

                    <td className="py-3 px-4 text-xs text-neutral-600">
                      {u.data_nascimento ? String(u.data_nascimento).slice(0, 10) : '—'}
                    </td>

                    <td className="py-3 px-4 text-xs font-semibold text-neutral-800">
                      <div className="flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-red-600" />
                        <span>{u.nome_instrumento || 'Geral'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-xs">
                      <span className="inline-block px-2.5 py-0.5 bg-red-50 text-red-700 font-bold rounded-md border border-red-200">
                        {u.nome_cargo || 'Membro'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                          title="Editar utilizador"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmUser(u)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                          title="Remover utilizador"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar / Editar Utilizador */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-900 border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-neutral-900 mb-1">
              {editingUser ? 'Editar Utilizador' : 'Adicionar Novo Utilizador'}
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Preencha os dados do membro para registar ou atualizar na base de dados
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold mb-1 text-neutral-700">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-neutral-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-neutral-700">Telemóvel</label>
                  <input
                    type="text"
                    value={formData.tele}
                    onChange={(e) => setFormData({ ...formData, tele: e.target.value })}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-neutral-700">Nº Cartão Cidadão</label>
                  <input
                    type="number"
                    value={formData.cc}
                    onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-neutral-700">NIF</label>
                  <input
                    type="number"
                    value={formData.nif}
                    onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-neutral-700">Data Nascimento</label>
                  <input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1 text-neutral-700">Instrumento</label>
                  <select
                    value={formData.instrumento}
                    onChange={(e) => setFormData({ ...formData, instrumento: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                  >
                    {instrumentos.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-neutral-700">Género</label>
                  <select
                    value={formData.genero}
                    onChange={(e) => setFormData({ ...formData, genero: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                  >
                    <option value={1}>Masculino</option>
                    <option value={2}>Feminino</option>
                    <option value={3}>Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-neutral-700">Cargo</label>
                  <select
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                  >
                    <option value={0}>Administrador</option>
                    <option value={1}>Músico & Sócio</option>
                    <option value={2}>Admin & Músico</option>
                    <option value={3}>Sócio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-neutral-700">
                  {editingUser ? 'Nova Palavra-passe (deixar em branco para manter)' : 'Palavra-passe *'}
                </label>
                <input
                  type="password"
                  placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
                  required={!editingUser}
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-xl focus:border-red-500 focus:outline-none transition"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingUser ? 'Gravar Alterações' : 'Criar Utilizador'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminação */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-neutral-200 text-neutral-900 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Remover Utilizador</h3>
            </div>
            <p className="text-xs text-neutral-600">
              Tem a certeza de que deseja eliminar o utilizador{' '}
              <strong className="text-neutral-900">{deleteConfirmUser.nome_utilizador}</strong>? Esta
              ação removerá também os seus registos de quotas e presenças associadas.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={loading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
