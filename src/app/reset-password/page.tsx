'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get('id');
  const time = searchParams.get('time');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!id) {
    return (
      <div className="p-6 text-center space-y-4 bg-red-950/40 border border-red-800 rounded-xl">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-red-300">Link Inválido</h3>
        <p className="text-sm text-neutral-300">
          O link de recuperação não contém os parâmetros necessários.
        </p>
        <Link
          href="/"
          className="inline-block mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-900/30 transition text-sm"
        >
          Voltar ao Início
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    if (password.length < 8) {
      setError('A palavra-passe deve ter no mínimo 8 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, time, password, confirm }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ocorreu um erro ao atualizar a palavra-passe.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch {
      setError('Falha de ligação ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-6 text-center space-y-4 bg-emerald-950/40 border border-emerald-800 rounded-xl">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-lg font-bold text-emerald-300">Palavra-passe Redefinida!</h3>
        <p className="text-sm text-neutral-300">
          A sua palavra-passe foi atualizada com sucesso. Será redirecionado para a página inicial...
        </p>
        <Link
          href="/"
          className="inline-block mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-900/30 transition text-sm"
        >
          Entrar Agora
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg flex items-center gap-2 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-200" htmlFor="nova-password">
          Nova Palavra-Passe (mínimo 8 caracteres)
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            id="nova-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-200" htmlFor="confirm-password">
          Confirmar Nova Palavra-Passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            id="confirm-password"
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg shadow-red-900/30 hover:shadow-red-600/40 transition flex items-center justify-center gap-2 mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>A atualizar...</span>
          </>
        ) : (
          <span>Gravar Nova Palavra-Passe</span>
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <Image src="/assets/banda.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Definir Password</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Escolha uma nova palavra-passe segura para aceder à sua conta.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-500" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
