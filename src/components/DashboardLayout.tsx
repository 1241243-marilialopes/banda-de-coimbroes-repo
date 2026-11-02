'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Users,
  Calendar,
  Music,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  UserCheck,
  Shield,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: any;
}

interface DashboardLayoutProps {
  user: {
    id: number;
    nome: string;
    email: string;
    cargo: number;
  };
  title: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export default function DashboardLayout({
  user,
  title,
  navItems,
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  const roleLabels: Record<number, string> = {
    0: 'Administrador',
    1: 'Músico & Sócio',
    2: 'Admin & Músico',
    3: 'Sócio',
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm tracking-wider">
          <div className="relative w-7 h-7">
            <Image src="/assets/banda.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <span>BANDA DE COIMBRÕES</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-neutral-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-neutral-900 border-r border-neutral-800 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <Link href="/" className="hidden md:flex items-center gap-3 font-extrabold text-sm tracking-wider text-amber-400">
            <div className="relative w-8 h-8">
              <Image src="/assets/banda.png" alt="Logo" fill className="object-contain" priority />
            </div>
            <span>BANDA DE COIMBRÕES</span>
          </Link>

          {/* User Profile Card */}
          <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm">
                {user.nome.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-white">{user.nome}</p>
                <span className="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs rounded font-medium">
                  {roleLabels[user.cargo] || 'Utilizador'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-white transition"
          >
            <span>Ver Website Público</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-neutral-800 bg-neutral-900/40">
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        </header>

        <div className="p-4 sm:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}

