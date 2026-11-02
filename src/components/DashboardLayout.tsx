'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  CheckSquare,
  Calendar,
  ListChecks,
  BookOpen,
  CreditCard,
  FileEdit,
  User,
  History,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Music,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  iconName: string;
  subItems?: { label: string; href: string }[];
}

interface NavSection {
  heading?: string;
  items: NavItem[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  users: Users,
  check: CheckSquare,
  calendar: Calendar,
  presencas: ListChecks,
  caderneta: BookOpen,
  music: Music,
  cotas: CreditCard,
  backoffice: FileEdit,
  user: User,
  history: History,
};

interface DashboardLayoutProps {
  user: {
    id: number;
    nome: string;
    email: string;
    cargo: number;
  };
  title: string;
  children: React.ReactNode;
}

export default function DashboardLayout({
  user,
  title,
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [calendarExpanded, setCalendarExpanded] = useState(
    pathname.startsWith('/admin/calendario') || pathname.startsWith('/admin/gerir-servicos')
  );

  useEffect(() => {
    const saved = localStorage.getItem('admin_theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('admin_theme', next);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  const roleLabels: Record<number, string> = {
    0: 'Admin, Sócio',
    1: 'Músico, Sócio',
    2: 'Admin, Músico, Sócio',
    3: 'Sócio',
  };

  // Seções da Sidebar exatamente como no original PHP
  let sections: NavSection[] = [];

  if (user.cargo === 0 || user.cargo === 2) {
    // Admin / Direção (navbar_admin.php & admin_musico_socio/navbar_admin.php)
    const direcaoItems: NavItem[] = [
      { label: 'Utilizadores', href: '/admin/utilizadores', iconName: 'users' },
      { label: 'Aprovar inscrições', href: '/admin/ver-inscricoes', iconName: 'check' },
      {
        label: 'Calendário',
        iconName: 'calendar',
        subItems: [
          { label: 'Ver', href: '/admin/calendario' },
          { label: 'Gerir', href: '/admin/gerir-servicos' },
        ],
      },
      { label: 'Presenças', href: '/admin/presencas', iconName: 'presencas' },
      { label: 'Caderneta', href: '/admin/caderneta', iconName: 'caderneta' },
      { label: 'Cotas', href: '/admin/cotas', iconName: 'cotas' },
      { label: 'Backoffice', href: '/admin/backoffice', iconName: 'backoffice' },
    ];

    sections = [
      {
        items: [{ label: 'Home', href: '/admin', iconName: 'home' }],
      },
      {
        heading: 'Direção',
        items: direcaoItems,
      },
    ];

    // Se for cargo 2 (Admin & Músico & Sócio), adiciona a aba Músico
    if (user.cargo === 2) {
      sections.push({
        heading: 'Músico',
        items: [
          { label: 'Presenças', href: '/musicos-socios/presencas', iconName: 'presencas' },
          { label: 'Histórico de Presenças', href: '/musicos-socios/historico', iconName: 'history' },
          { label: 'Caderneta', href: '/musicos-socios/caderneta', iconName: 'caderneta' },
        ],
      });
    }

    sections.push(
      {
        heading: 'Sócio',
        items: [
          { label: 'Cotas', href: '/admin/minhas-cotas', iconName: 'cotas' },
        ],
      },
      {
        heading: 'Perfil',
        items: [
          { label: 'Eu', href: '/admin/conta', iconName: 'user' },
        ],
      }
    );
  } else if (user.cargo === 1) {
    // Músico & Sócio (navbar_musicos.php)
    sections = [
      {
        items: [{ label: 'Home', href: '/musicos-socios', iconName: 'home' }],
      },
      {
        heading: 'Músico',
        items: [
          { label: 'Calendário', href: '/musicos-socios/calendario', iconName: 'calendar' },
          { label: 'Presenças', href: '/musicos-socios/presencas', iconName: 'presencas' },
          { label: 'Histórico de Presenças', href: '/musicos-socios/historico', iconName: 'history' },
          { label: 'Caderneta', href: '/musicos-socios/caderneta', iconName: 'caderneta' },
        ],
      },
      {
        heading: 'Sócio',
        items: [
          { label: 'Cotas', href: '/musicos-socios/cotas', iconName: 'cotas' },
        ],
      },
      {
        heading: 'Perfil',
        items: [
          { label: 'Eu', href: '/musicos-socios/conta', iconName: 'user' },
        ],
      },
    ];
  } else {
    // Sócio (navbar_socios.php)
    sections = [
      {
        items: [{ label: 'Home', href: '/socios', iconName: 'home' }],
      },
      {
        heading: 'Sócio',
        items: [
          { label: 'Calendário', href: '/socios/calendario', iconName: 'calendar' },
          { label: 'Cotas', href: '/socios/cotas', iconName: 'cotas' },
        ],
      },
      {
        heading: 'Perfil',
        items: [
          { label: 'Eu', href: '/socios/conta', iconName: 'user' },
        ],
      },
    ];
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-200 font-sans ${
        isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Mobile top bar */}
      <div
        className={`md:hidden flex items-center justify-between p-4 border-b ${
          isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src="/assets/banda.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <span className="font-bold text-sm tracking-tight text-red-600">Banda de Coimbrões</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile Theme Toggle Icon */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-amber-400'
                : 'bg-neutral-100 border-neutral-200 text-neutral-600'
            }`}
            title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg border ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-200'
                : 'bg-neutral-100 border-neutral-200 text-neutral-700'
            }`}
            aria-label="Menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 p-5 flex flex-col justify-between border-r transform transition-all duration-300 ease-in-out overflow-y-auto ${
          isDark
            ? 'bg-neutral-900 border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-800 shadow-sm'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-neutral-800">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image src="/assets/banda.png" alt="Logo" fill className="object-contain" priority />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-black tracking-wider text-red-600 uppercase">
                  Banda de Coimbrões
                </span>
                <span className="text-[11px] font-semibold text-neutral-500">Área Reservada</span>
              </div>
            </Link>

            {/* Desktop Theme Toggle Icon */}
            <button
              onClick={toggleTheme}
              className={`hidden md:flex p-1.5 rounded-lg border transition ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-amber-400 hover:bg-neutral-700'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200'
              }`}
              title={isDark ? 'Tema Claro (fundo branco)' : 'Tema Escuro'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* User Card */}
          <div
            className={`p-3 rounded-xl border flex items-center gap-3 ${
              isDark
                ? 'bg-neutral-800/80 border-neutral-700'
                : 'bg-neutral-50 border-neutral-200 shadow-xs'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-red-600/15 text-red-600 border border-red-500/30 flex items-center justify-center font-bold text-sm">
              {user.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold truncate leading-tight">{user.nome}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-red-600/10 text-red-600 text-[10px] font-bold rounded">
                {roleLabels[user.cargo] || 'Utilizador'}
              </span>
            </div>
          </div>

          {/* Sections and Navigation links */}
          <nav className="space-y-4">
            {sections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1">
                {sec.heading && (
                  <h6 className="px-3 text-[10px] font-black uppercase tracking-wider text-neutral-400 pb-1">
                    {sec.heading}
                  </h6>
                )}
                {sec.items.map((item, itemIdx) => {
                  const Icon = ICON_MAP[item.iconName] || Home;

                  // Se o item tiver sub-itens (ex.: Calendário -> Ver / Gerir)
                  if (item.subItems) {
                    const isSubActive = item.subItems.some((s) => pathname.startsWith(s.href));
                    return (
                      <div key={itemIdx} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => setCalendarExpanded(!calendarExpanded)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                            isSubActive
                              ? isDark
                                ? 'text-white bg-neutral-800'
                                : 'text-neutral-900 bg-neutral-100 font-bold'
                              : isDark
                              ? 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isSubActive ? 'text-red-600' : 'text-red-600'}`} />
                            <span>{item.label}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                              calendarExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {calendarExpanded && (
                          <div
                            className={`pl-8 pr-2 py-1 space-y-1 border-l-2 ml-5 ${
                              isDark ? 'border-neutral-700' : 'border-neutral-200'
                            }`}
                          >
                            <span className="block px-2 text-[10px] font-black uppercase tracking-wider text-neutral-400 pb-1">
                              Calendário:
                            </span>
                            {item.subItems.map((sub, subIdx) => {
                              const isChildActive = pathname === sub.href;
                              return (
                                <Link
                                  key={subIdx}
                                  href={sub.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`block px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    isChildActive
                                      ? 'bg-red-600 text-white font-bold'
                                      : isDark
                                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href || '#'}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                        isActive
                          ? 'bg-red-600 text-white shadow-sm font-bold'
                          : isDark
                          ? 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-600'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-neutral-200/60 dark:border-neutral-800 space-y-2">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition ${
              isDark
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver Website Público</span>
          </Link>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition ${
              isDark
                ? 'text-red-400 hover:bg-red-950/40 hover:text-red-300'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header
          className={`hidden md:flex items-center justify-between px-8 py-5 border-b ${
            isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'
          }`}
        >
          <h1 className="text-xl font-extrabold tracking-tight">{title}</h1>
          <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
            <span>{roleLabels[user.cargo] || 'Membro'}</span>
            <span>•</span>
            <span>{user.email}</span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
