import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout, { NavItem } from '@/components/DashboardLayout';
import {
  Users,
  Calendar,
  Music,
  CreditCard,
  Settings,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const adminNav: NavItem[] = [
  { label: 'Visão Geral', href: '/admin', icon: Users },
  { label: 'Utilizadores & Sócios', href: '/admin/utilizadores', icon: Users },
  { label: 'Quotas Mensais', href: '/admin/cotas', icon: CreditCard },
  { label: 'Serviços & Ensaios', href: '/admin/servicos', icon: Calendar },
  { label: 'Arquivo de Partituras', href: '/admin/partituras', icon: Music },
  { label: 'Instrumentos', href: '/admin/instrumentos', icon: Settings },
  { label: 'Backoffice do Website', href: '/admin/backoffice', icon: FileCheck },
];

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let totalUsers = 0;
  let totalInscricoes = 0;
  let totalServicos = 0;
  let proximosServicos: any[] = [];

  try {
    const userCount: any = await query('SELECT COUNT(*) as count FROM tb_utilizadores');
    totalUsers = userCount[0]?.count || 0;

    const inscricoesCount: any = await query('SELECT COUNT(*) as count FROM tb_inscricoes');
    totalInscricoes = inscricoesCount[0]?.count || 0;

    const servicosCount: any = await query('SELECT COUNT(*) as count FROM tb_servicos');
    totalServicos = servicosCount[0]?.count || 0;

    proximosServicos = await query(
      'SELECT id_servico, nome_servico, data_inicial, valor FROM tb_servicos ORDER BY data_inicial DESC LIMIT 5'
    );
  } catch (err) {
    console.warn('Erro ao carregar estatísticas do admin:', err);
  }

  return (
    <DashboardLayout user={user} title="Painel de Administração" navItems={adminNav}>
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Membros Registados</span>
              <Users className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-white mt-3">{totalUsers}</p>
            <p className="text-xs text-neutral-500 mt-1">Músicos, sócios e direção</p>
          </div>

          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Inscrições Pendentes</span>
              <FileCheck className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-black text-white mt-3">{totalInscricoes}</p>
            <p className="text-xs text-neutral-500 mt-1">Candidaturas a aguardar validação</p>
          </div>

          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total de Serviços</span>
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-white mt-3">{totalServicos}</p>
            <p className="text-xs text-neutral-500 mt-1">Ensaios, procissões e concertos</p>
          </div>

          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-xs font-bold uppercase tracking-wider">Estado da BD</span>
              <ShieldAlert className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-xl font-bold text-emerald-400 mt-3">MySQL Ativo</p>
            <p className="text-xs text-neutral-500 mt-1">Tabelas e integridade preservadas</p>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Gestão de Quotas</span>
              <CreditCard className="w-5 h-5 text-amber-500" />
            </h3>
            <p className="text-sm text-neutral-400">
              Consulte e atualize a situação de pagamento das quotas mensais e anuais dos sócios da Sociedade Musical.
            </p>
            <Link
              href="/admin/cotas"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300"
            >
              <span>Gerir Quotas</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Presenças e Serviços</span>
              <Calendar className="w-5 h-5 text-blue-500" />
            </h3>
            <p className="text-sm text-neutral-400">
              Marque novos ensaios ou concertos, registe presenças dos músicos e controle os pagamentos por serviço.
            </p>
            <Link
              href="/admin/servicos"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300"
            >
              <span>Gerir Serviços</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Arquivo de Partituras</span>
              <Music className="w-5 h-5 text-purple-500" />
            </h3>
            <p className="text-sm text-neutral-400">
              Carregue novas peças e partituras em formato PDF e atribua-as por instrumento musical para os músicos.
            </p>
            <Link
              href="/admin/partituras"
              className="inline-flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300"
            >
              <span>Aceder ao Arquivo</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tabela de Serviços Recentes */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Serviços e Atuações Recentes</h3>
            <span className="text-xs text-neutral-400">Últimos registos na BD</span>
          </div>

          {proximosServicos.length === 0 ? (
            <p className="text-neutral-500 text-sm py-4">Nenhum serviço agendado no momento.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-800/60 text-xs uppercase text-neutral-400 border-b border-neutral-700">
                  <tr>
                    <th className="py-3 px-4">Nome do Serviço</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Cachet / Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {proximosServicos.map((servico: any) => (
                    <tr key={servico.id_servico} className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-semibold text-white">{servico.nome_servico}</td>
                      <td className="py-3 px-4 text-neutral-400">{servico.data_inicial || '—'}</td>
                      <td className="py-3 px-4 text-amber-400 font-medium">
                        {servico.valor ? `${servico.valor} €` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

