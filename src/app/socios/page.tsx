import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout, { NavItem } from '@/components/DashboardLayout';
import { CreditCard, Calendar, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

const socioNav: NavItem[] = [
  { label: 'A Minha Área', href: '/socios', icon: UserCheck },
  { label: 'Minhas Quotas', href: '/socios/cotas', icon: CreditCard },
  { label: 'Calendário de Eventos', href: '/socios/calendario', icon: Calendar },
];

export default async function SocioDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  let quotas: any[] = [];
  try {
    quotas = await query(
      `SELECT ano, janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro, ano_completo 
       FROM tb_cota_mes 
       WHERE socio_id = ? 
       ORDER BY ano DESC LIMIT 3`,
      [user.id]
    );
  } catch (err) {
    console.warn('Erro ao carregar quotas do sócio:', err);
  }

  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  return (
    <DashboardLayout user={user} title="Área do Associado" navItems={socioNav}>
      <div className="space-y-8">
        {/* Cartão de Sócio */}
        <div className="p-6 bg-gradient-to-r from-amber-600/20 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Cartão de Associado
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">{user.nome}</h2>
              <p className="text-sm text-neutral-400 mt-1">
                Sociedade Musical 1º de Agosto • Sócio Ativo
              </p>
            </div>
            <div className="px-5 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-center">
              <span className="text-xs text-neutral-400 block uppercase font-bold">Número de Sócio</span>
              <span className="text-xl font-black text-amber-400">#{user.id}</span>
            </div>
          </div>
        </div>

        {/* Situação de Quotas */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span>Situação de Quotas de Sócio</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Registo de pagamento das quotas mensais
              </p>
            </div>
          </div>

          {quotas.length === 0 ? (
            <p className="text-neutral-500 text-sm py-4">Sem histórico de quotas registado para este número.</p>
          ) : (
            <div className="space-y-6">
              {quotas.map((q, idx) => (
                <div key={idx} className="p-4 bg-neutral-800/40 rounded-xl border border-neutral-700/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-extrabold text-white text-base">Ano {q.ano}</span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded font-bold ${
                        q.ano_completo === '1'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {q.ano_completo === '1' ? 'Ano Liquidado' : 'Parcial'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 text-center text-xs">
                    {[
                      q.janeiro, q.fevereiro, q.marco, q.abril, q.maio, q.junho,
                      q.julho, q.agosto, q.setembro, q.outubro, q.novembro, q.dezembro
                    ].map((status, mIdx) => (
                      <div
                        key={mIdx}
                        className={`p-2 rounded-lg font-bold border transition ${
                          status === '1'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60'
                            : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                        }`}
                      >
                        <span className="block text-[10px] uppercase font-semibold text-neutral-400">
                          {meses[mIdx]}
                        </span>
                        <span className="mt-1 block">{status === '1' ? 'Pago' : '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

