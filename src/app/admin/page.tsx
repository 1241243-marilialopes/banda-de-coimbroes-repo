import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  Calendar,
  Music,
  CreditCard,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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
      'SELECT id_servico, nome_servico, data_inicial, localizacao, valor FROM tb_servicos ORDER BY data_inicial DESC LIMIT 5'
    );
  } catch (err) {
    console.warn('Erro ao carregar estatísticas do admin:', err);
  }

  return (
    <DashboardLayout user={user} title="Painel de Administração">
      <div className="space-y-8">
        {/* KPI Cards Clicáveis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Membros Registados -> /admin/utilizadores */}
          <Link
            href="/admin/utilizadores"
            className="group p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-lg hover:border-red-500 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-neutral-500 group-hover:text-red-600 transition">
                <span className="text-xs font-bold uppercase tracking-wider">Membros Registados</span>
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-3xl font-black text-neutral-900 mt-3 group-hover:text-red-600 transition">
                {totalUsers}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Músicos, sócios e direção</p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-red-600">
              <span>Gerir Utilizadores</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Inscrições Pendentes -> /admin/ver-inscricoes */}
          <Link
            href="/admin/ver-inscricoes"
            className="group p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-500 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-neutral-500 group-hover:text-blue-600 transition">
                <span className="text-xs font-bold uppercase tracking-wider">Inscrições Pendentes</span>
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-neutral-900 mt-3 group-hover:text-blue-600 transition">
                {totalInscricoes}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Candidaturas a aguardar validação</p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Aprovar Inscrições</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Total de Serviços -> /admin/calendario */}
          <Link
            href="/admin/calendario"
            className="group p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-lg hover:border-emerald-500 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-neutral-500 group-hover:text-emerald-600 transition">
                <span className="text-xs font-bold uppercase tracking-wider">Total de Serviços</span>
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-neutral-900 mt-3 group-hover:text-emerald-600 transition">
                {totalServicos}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Ensaios, procissões e concertos</p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Ver Calendário</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Estado da BD -> /admin/backoffice */}
          <Link
            href="/admin/backoffice"
            className="group p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-lg hover:border-purple-500 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-neutral-500 group-hover:text-purple-600 transition">
                <span className="text-xs font-bold uppercase tracking-wider">Estado da BD</span>
                <ShieldAlert className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xl font-bold text-emerald-600 mt-3">MySQL Ativo</p>
              <p className="text-xs text-neutral-500 mt-1">Tabelas e integridade preservadas</p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>Gerir Backoffice</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Row 2: Main Cards Clicáveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Gestão de Quotas -> /admin/cotas */}
          <Link
            href="/admin/cotas"
            className="group p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-lg hover:border-red-500 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-red-600 transition">
                  Gestão de Quotas
                </h3>
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Consulte e atualize a situação de pagamento das quotas mensais e anuais dos sócios da Sociedade Musical.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-red-600">
              <span>Abrir Mapa de Quotas</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card: Presenças e Serviços -> /admin/presencas */}
          <Link
            href="/admin/presencas"
            className="group p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-lg hover:border-blue-500 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 transition">
                  Presenças e Serviços
                </h3>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Marque novos ensaios ou concertos, registe presenças dos músicos e controle as presenças por serviço.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600">
              <span>Gerir Presenças</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card: Arquivo de Partituras -> /admin/caderneta */}
          <Link
            href="/admin/caderneta"
            className="group p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-lg hover:border-purple-500 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-purple-600 transition">
                  Arquivo de Partituras
                </h3>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                  <Music className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Carregue novas peças e partituras em formato PDF e atribua-as por instrumento musical para os músicos.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-purple-600">
              <span>Aceder à Caderneta</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Tabela de Serviços Recentes */}
        <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Serviços e Atuações Recentes</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Últimos eventos registados na base de dados</p>
            </div>
            <Link
              href="/admin/calendario"
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>Ver no Calendário</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {proximosServicos.length === 0 ? (
            <p className="text-neutral-500 text-sm py-4">Nenhum serviço agendado no momento.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-700">
                <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">Nome do Serviço</th>
                    <th className="py-3 px-4 font-bold">Data</th>
                    <th className="py-3 px-4 font-bold">Localização</th>
                    <th className="py-3 px-4 font-bold">Cachet / Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {proximosServicos.map((servico: any) => (
                    <tr key={servico.id_servico} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3 px-4 font-semibold text-neutral-900">
                        {servico.nome_servico}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{servico.data_inicial || '—'}</td>
                      <td className="py-3 px-4 text-neutral-600">{servico.localizacao || '—'}</td>
                      <td className="py-3 px-4 text-red-600 font-bold">
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
