'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Mail, Calendar, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EsqueceuPasswordPage() {
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, date: dataNascimento }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao processar o pedido.');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-800 border border-neutral-700 rounded-2xl shadow-2xl p-6 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Link>

        <div className="text-center mb-6">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <Image src="/assets/banda.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recuperar Password</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Introduza o seu email e data de nascimento associados à conta para receber um link de recuperação.
          </p>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-4 bg-emerald-950/40 border border-emerald-800 rounded-xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-300">Email Enviado!</h3>
            <p className="text-sm text-neutral-300">
              Verifique a sua caixa de correio (incluindo a pasta de Spam) para redefinir a sua palavra-passe. O link é válido por 30 minutos.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg transition text-sm"
            >
              Voltar ao Início
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-200" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-200" htmlFor="data-nascimento">
                Data de Nascimento
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  id="data-nascimento"
                  type="date"
                  required
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg focus:border-amber-500 focus:outline-none transition text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-bold rounded-lg shadow transition flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>A processar...</span>
                </>
              ) : (
                <span>Enviar Link de Recuperação</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

