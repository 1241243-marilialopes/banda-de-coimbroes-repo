'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Shield,
  Music,
  Calendar,
  Key,
  CheckCircle,
  AlertCircle,
  Save,
  Upload,
  MapPin,
  Home,
} from 'lucide-react';

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
    numero_socio?: number | string;
    morada?: string;
    area_residencia?: string;
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
    instrumento: initialUser.instrumento ? String(initialUser.instrumento) : '21',
    genero: initialUser.genero_id !== undefined ? String(initialUser.genero_id) : '2',
    morada: initialUser.morada || '',
    area_residencia: initialUser.area_residencia || '',
    senha: '',
    confirmarSenha: '',
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
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

    if (formData.tele && String(formData.tele).trim() && !/^\d{9}$/.test(String(formData.tele).trim())) {
      setErrorMessage('Por favor, insira um número de telefone válido com 9 dígitos.');
      return;
    }

    if (formData.cc && String(formData.cc).trim() && !/^\d{8}$/.test(String(formData.cc).trim())) {
      setErrorMessage('Por favor, insira um número de Cartão de Cidadão válido com 8 dígitos.');
      return;
    }

    if (formData.nif && String(formData.nif).trim() && !/^\d{9}$/.test(String(formData.nif).trim())) {
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
      let res: Response;

      if (fotoFile) {
        const bodyData = new FormData();
        bodyData.append('nome', formData.nome);
        bodyData.append('email', formData.email);
        bodyData.append('tele', formData.tele);
        bodyData.append('cc', formData.cc);
        bodyData.append('nif', formData.nif);
        bodyData.append('data', formData.data);
        bodyData.append('instrumento', formData.instrumento);
        bodyData.append('genero', formData.genero);
        bodyData.append('morada', formData.morada);
        bodyData.append('area_residencia', formData.area_residencia);
        if (formData.senha) bodyData.append('senha', formData.senha);
        bodyData.append('foto', fotoFile);

        res = await fetch('/api/admin/conta', {
          method: 'POST',
          body: bodyData,
        });
      } else {
        res = await fetch('/api/admin/conta', {
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
            morada: formData.morada,
            area_residencia: formData.area_residencia,
            senha: formData.senha || undefined,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao guardar alterações.');
      }

      setSuccessMessage('Dados e fotografia atualizados com sucesso!');
      setFormData((prev) => ({ ...prev, senha: '', confirmarSenha: '' }));
      setFotoFile(null);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro de ligação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header Info Card com Fotografia */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-red-500/30 flex-shrink-0 bg-neutral-100 shadow-xs">
            {fotoFile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={URL.createObjectURL(fotoFile)}
                alt="Nova foto preview"
                className="w-full h-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/utilizadores/foto/${initialUser.id_utilizador}`}
                alt={formData.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/utilizador.jpg';
                }}
              />
            )}
            <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-[10px] font-bold">
              <Upload className="w-5 h-5 mb-0.5" />
              <span>Trocar</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-neutral-900">{formData.nome || 'Utilizador'}</h2>
              {initialUser.numero_socio && (
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 font-bold text-xs rounded-md">
                  Sócio #{initialUser.numero_socio}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500">{formData.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 bg-red-600/10 text-red-600 font-bold rounded-md text-xs">
                {initialUser.nome_cargo || 'Membro'}
              </span>
              {initialUser.nome_instrumento && (
                <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 font-semibold rounded-md text-xs flex items-center gap-1">
                  <Music className="w-3 h-3 text-red-600" />
                  {initialUser.nome_instrumento}
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 hover:border-red-500 text-neutral-700 hover:text-red-600 rounded-xl text-xs font-bold transition cursor-pointer bg-neutral-50 hover:bg-white shadow-2xs">
            <Upload className="w-4 h-4" />
            <span>{fotoFile ? 'Foto Selecionada ✓' : 'Carregar Nova Foto'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-neutral-900">Editar Dados Pessoais</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Mantenha as suas informações e morada atualizadas perante a Sociedade Musical 1º de Agosto
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              Endereço de Email *
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
              Número de Cartão de Cidadão
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
              NIF (Identificação Fiscal)
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
              Morada Residencial
            </label>
            <input
              type="text"
              name="morada"
              value={formData.morada}
              onChange={handleChange}
              placeholder="Rua, número, andar..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Área de Residência / Freguesia
            </label>
            <input
              type="text"
              name="area_residencia"
              value={formData.area_residencia}
              onChange={handleChange}
              placeholder="Ex: Coimbrões, Gaia"
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
