'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, Lock, Mail, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao autenticar. Tente novamente.');
        setLoading(false);
        return;
      }

      // Sucesso: redireciona para a respetiva área reservada
      router.push(data.redirectUrl || '/');
      router.refresh();
      onClose();
    } catch (err) {
      setError('Erro de ligação ao servidor.');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 sm:p-8 text-white">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Login</h2>
          <p className="text-sm text-gray-400 mt-1">
            Aceda à sua Área Reservada da Banda de Coimbrões
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/60 border border-red-700 text-red-200 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-200" htmlFor="login-email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@dominio.com"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-200" htmlFor="login-senha">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                id="login-senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-bold rounded-lg shadow transition mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>A autenticar...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-800 text-center text-xs sm:text-sm space-y-2 text-gray-400">
          <p>
            Esqueceu-se da sua password?{' '}
            <Link
              href="/esqueceu-password"
              onClick={onClose}
              className="text-amber-400 hover:underline font-medium"
            >
              Recuperar
            </Link>
          </p>
          <p>
            Pretende tornar-se sócio?{' '}
            <Link
              href="/inscricao"
              onClick={onClose}
              className="text-amber-400 hover:underline font-medium"
            >
              Inscreva-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

