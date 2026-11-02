'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Option {
  id: number;
  label: string;
}

export default function InscricaoPage() {
  const [instrumentos, setInstrumentos] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    tele: '',
    cc: '',
    nif: '',
    data: '',
    email: '',
    instrumento: '',
    genero: '1',
  });

  useEffect(() => {
    // Carregar lista de instrumentos
    fetch('/api/instrumentos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInstrumentos(data.map((i: any) => ({ id: i.id_instrumento, label: i.nome_instrumento })));
        }
      })
      .catch(() => {
        // Fallback com instrumentos típicos de banda filarmónica
        setInstrumentos([
          { id: 1, label: 'Flauta' },
          { id: 2, label: 'Clarinete' },
          { id: 3, label: 'Saxofone Alto' },
          { id: 4, label: 'Saxofone Tenor' },
          { id: 5, label: 'Trompete' },
          { id: 6, label: 'Trompa' },
          { id: 7, label: 'Trombone' },
          { id: 8, label: 'Eufónio / Bombardino' },
          { id: 9, label: 'Tuba' },
          { id: 10, label: 'Percussão' },
        ]);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/inscricao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ocorreu um erro ao submeter a inscrição.');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl bg-neutral-800/80 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 sm:p-10 backdrop-blur-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </Link>

        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image src="/assets/banda.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Inscrição de Sócio</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Junte-se à Sociedade Musical 1º de Agosto e faça parte da nossa história.
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4 bg-emerald-950/40 border border-emerald-800 rounded-xl">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-emerald-300">Inscrição Recebida!</h3>
            <p className="text-sm text-neutral-300">
              O seu pedido foi registado com sucesso. Enviámos um email de confirmação para{' '}
              <strong className="text-white">{formData.email}</strong>.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg shadow transition"
            >
              Voltar à Página Principal
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-950/50 border border-red-800 rounded-lg flex items-center gap-3 text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="nome">
                Nome Completo <span className="text-amber-500">*</span>
              </label>
              <input
                id="nome"
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="tele">
                  Telemóvel <span className="text-amber-500">*</span>
                </label>
                <input
                  id="tele"
                  type="tel"
                  required
                  value={formData.tele}
                  onChange={(e) => setFormData({ ...formData, tele: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="email">
                  Email <span className="text-amber-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="cc">
                  Cartão de Cidadão <span className="text-amber-500">*</span>
                </label>
                <input
                  id="cc"
                  type="number"
                  required
                  value={formData.cc}
                  onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="nif">
                  NIF <span className="text-amber-500">*</span>
                </label>
                <input
                  id="nif"
                  type="number"
                  required
                  value={formData.nif}
                  onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="data">
                  Data de Nascimento <span className="text-amber-500">*</span>
                </label>
                <input
                  id="data"
                  type="date"
                  required
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="genero">
                  Género <span className="text-amber-500">*</span>
                </label>
                <select
                  id="genero"
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition text-white"
                >
                  <option value="1">Masculino</option>
                  <option value="2">Feminino</option>
                  <option value="3">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1" htmlFor="instrumento">
                  Instrumento <span className="text-amber-500">*</span>
                </label>
                <select
                  id="instrumento"
                  required
                  value={formData.instrumento}
                  onChange={(e) => setFormData({ ...formData, instrumento: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition text-white"
                >
                  <option value="">Selecione...</option>
                  {instrumentos.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-extrabold rounded-lg shadow-lg hover:shadow-amber-500/20 transition flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>A submeter inscrição...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Concluir Inscrição</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

