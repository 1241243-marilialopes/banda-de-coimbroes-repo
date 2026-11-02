'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Shield, Music, Calendar, Key, CheckCircle, AlertCircle, Save } from 'lucide-react';

interface ContaClientProps {
  initialUser: {
    id_utilizador: number;
    nome_utilizador: string;
    email: string;
    telemovel: string;
    numero_cc: string | number;
    nif: string | number;
    data_nascimento: string;
    instrumento: number;
    nome_instrumento?: string;
    genero_id: number;
    genero?: string;
    cargo_id: number;
    nome_cargo?: string;
  };
  instrumentos: Array<{ id_instrumento: number; nome_instrumento: string }>;
  generos: Array<{ id_genero: number; genero: string }>;
}

export default function ContaClient({ initialUser, instrumentos, generos }: ContaClientProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: initialUser.nome_utilizador || '',
    email: initialUser.email || '',
    tele: initialUser.telemovel || '',
    cc: initialUser.numero_cc ? String(initialUser.numero_cc) : '',
    nif: initialUser.nif ? String(initialUser.nif) : '',
    data: initialUser.data_nascimento || '',
    instrumento: initialUser.instrumento ? String(initialUser.instrumento) : '1',
    genero: initialUser.genero_id ? String(initialUser.genero_id) : '1',
    senha: '',
    confirmarSenha: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.nome.trim()) {
      setErrorMessage('O nome de utilizador é obrigatório.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('O email é obrigatório.');
      return;
    }

    if (formData.data) {
      const dNasc = new Date(formData.data);
      if (dNasc >= new Date()) {
        setErrorMessage('Por favor, insira uma data de nascimento válida (anterior à data atual).');
        return;
      }
    }

    if (formData.tele && !/^\d{9}$/.test(formData.tele.trim())) {
      setErrorMessage('Por favor, insira um número de telefone válido com 9 dígitos.');
      return;
    }

    if (formData.cc && !/^\d{8}$/.test(formData.cc.trim())) {
      setErrorMessage('Por favor, insira um número de Cartão de Cidadão válido com 8 dígitos.');
      return;
    }

    if (formData.nif && !/^\d{9}$/.test(formData.nif.trim())) {
      setErrorMessage('Por favor, insira um número de Identificação Fiscal válido com 9 dígitos.');
      return;
    }

    if (formData.senha && formData.senha.length < 6) {
      setErrorMessage('A nova palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      setErrorMessage('As palavras-passe não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/conta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          tele: formData.tele,
          cc: formData.cc,
          nif: formData.nif,
          data: formData.data,
          instrumento: Number(formData.instrumento),
          genero: Number(formData.genero),
          senha: formData.senha || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao guardar alterações.');
      }

      setSuccessMessage('Dados atualizados com sucesso!');
      setFormData((prev) => ({ ...prev, senha: '', confirmarSenha: '' }));
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro de ligação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Info Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-600/10 text-red-600 border border-red-500/20 font-black text-2xl flex items-center justify-center">
            {formData.nome ? formData.nome.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">{formData.nome || 'Administrador'}</h2>
            <p className="text-sm text-neutral-500">{formData.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="px-2.5 py-0.5 bg-red-600/10 text-red-600 font-bold rounded-md text-xs">
                {initialUser.nome_cargo || 'Administrador'}
              </span>
              {initialUser.nome_instrumento && (
                <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 font-medium rounded-md text-xs flex items-center gap-1">
                  <Music className="w-3 h-3 text-red-600" />
                  {initialUser.nome_instrumento}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Editar Dados Pessoais</h3>
          <p className="text-xs text-neutral-500">
            Atualize as suas informações e credenciais de acesso à plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Nome de Utilizador *
            </label>
            <input
              type="text"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Telemóvel
            </label>
            <input
              type="tel"
              name="tele"
              maxLength={9}
              value={formData.tele}
              onChange={handleChange}
              placeholder="9 dígitos"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Data de Nascimento
            </label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Nº Cartão de Cidadão
            </label>
            <input
              type="text"
              name="cc"
              maxLength={8}
              value={formData.cc}
              onChange={handleChange}
              placeholder="8 dígitos"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              NIF
            </label>
            <input
              type="text"
              name="nif"
              maxLength={9}
              value={formData.nif}
              onChange={handleChange}
              placeholder="9 dígitos"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Instrumento
            </label>
            <select
              name="instrumento"
              value={formData.instrumento}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            >
              {instrumentos.map((inst) => (
                <option key={inst.id_instrumento} value={inst.id_instrumento}>
                  {inst.nome_instrumento}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Género
            </label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            >
              {generos.map((gen) => (
                <option key={gen.id_genero} value={gen.id_genero}>
                  {gen.genero}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="pt-6 border-t border-neutral-100">
          <h4 className="text-sm font-bold text-neutral-900 mb-1 flex items-center gap-2">
            <Key className="w-4 h-4 text-red-600" />
            Alterar Palavra-passe
          </h4>
          <p className="text-xs text-neutral-500 mb-4">
            Deixe os campos em branco se desejar manter a sua palavra-passe atual.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Nova Palavra-passe
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Confirmar Nova Palavra-passe
              </label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Repita a nova palavra-passe"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition shadow-xs flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

