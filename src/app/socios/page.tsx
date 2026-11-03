import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { CreditCard, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function formatPtDate(val: any): string {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const formatted = d.toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const hours = d.getHours();
  const minutes = d.getMinutes();
  if (hours !== 0 || minutes !== 0) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${formatted} às ${pad(hours)}:${pad(minutes)}`;
  }
  return formatted;
}

export default async function SocioDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  let quotas: any[] = [];
  let aniversarios: any[] = [];
  let proximosServicosAlerta: any[] = [];

  try {
    quotas = await query(
      `SELECT ano, janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro, ano_completo 
       FROM tb_cota_mes 
       WHERE socio_id = ? 
       ORDER BY ano DESC LIMIT 3`,
      [user.id]
    );

    aniversarios = await query(`
      SELECT nome_utilizador, data_nascimento 
      FROM tb_utilizadores 
      WHERE DATE_FORMAT(data_nascimento, '%m-%d') = DATE_FORMAT(CURDATE(), '%m-%d')
         OR DATE_FORMAT(data_nascimento, '%m-%d') = DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), '%m-%d')
    `) as any[];

    proximosServicosAlerta = await query(`
      SELECT nome_servico, data_inicial, localizacao 
      FROM tb_servicos 
      WHERE data_inicial BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 14 DAY)
      ORDER BY data_inicial ASC
    `) as any[];
  } catch (err) {
    console.warn('Erro ao carregar quotas do sócio:', err);
  }

  const todayMD = (() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const serializedAniversarios = aniversarios.map((a: any) => ({
    nome_utilizador: a.nome_utilizador,
    data_nascimento: a.data_nascimento ? String(a.data_nascimento).slice(5, 10) : '',
  }));

  const serializedAlerta = proximosServicosAlerta.map((s: any) => ({
    nome_servico: s.nome_servico,
    localizacao: s.localizacao || '',
    data_inicial: formatPtDate(s.data_inicial),
  }));

  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  return (
    <DashboardLayout user={user} title="Área do Associado">
      <div className="space-y-6">
        {/* Alerts Section (Aniversários & Serviços) */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-600 mb-2">Avisos de Aniversários</h3>
            {serializedAniversarios.length === 0 ? (
              <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800">
                Ninguém faz anos hoje/amanhã
              </div>
            ) : (
              <div className="space-y-2">
                {serializedAniversarios.map((a: any, i: number) => {
                  const isToday = a.data_nascimento === todayMD;
                  return (
                    <div key={i} className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-900">
                      🎉 {a.nome_utilizador} faz anos {isToday ? 'hoje' : 'amanhã'}!
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-neutral-600 mb-2">Avisos de Serviços</h3>
            {serializedAlerta.length === 0 ? (
              <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800">
                Sem serviços próximos
              </div>
            ) : (
              <div className="space-y-2">
                {serializedAlerta.map((s: any, i: number) => (
                  <div key={i} className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-sm font-semibold text-blue-900 flex items-center justify-between">
                    <span>🎺 {s.nome_servico} {s.localizacao ? `(${s.localizacao})` : ''}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md font-bold">{s.data_inicial}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cartão de Sócio */}
        <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                Cartão de Associado
              </span>
              <h2 className="text-2xl font-black text-neutral-900 mt-1">{user.nome}</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Sociedade Musical 1º de Agosto • Sócio Ativo
              </p>
            </div>
            <div className="px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-center">
              <span className="text-xs text-neutral-500 block uppercase font-bold">Número de Sócio</span>
              <span className="text-xl font-black text-red-600">#{user.id}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/socios/calendario"
            className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-md hover:border-red-500 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Calendário de Atuações</h4>
                <p className="text-xs text-neutral-500">Próximos concertos e romarias</p>
              </div>
            </div>
            <span className="text-xs font-bold text-red-600">Ver →</span>
          </Link>

          <Link
            href="/socios/cotas"
            className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-md hover:border-red-500 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Estado de Quotas</h4>
                <p className="text-xs text-neutral-500">Histórico de pagamentos anuais</p>
              </div>
            </div>
            <span className="text-xs font-bold text-red-600">Ver →</span>
          </Link>
        </div>

        {/* Situação de Quotas */}
        <div id="quotas" className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-600" />
                <span>Situação de Quotas de Sócio</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Registo de pagamento das quotas mensais
              </p>
            </div>
          </div>

          {quotas.length === 0 ? (
            <p className="text-neutral-500 text-sm py-4">Sem histórico de quotas registado para este número.</p>
          ) : (
            <div className="space-y-6">
              {quotas.map((q, idx) => (
                <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-extrabold text-neutral-900 text-base">Ano {q.ano}</span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded font-bold ${
                        q.ano_completo === '1'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-700'
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
                        className={`p-2 rounded-lg font-semibold flex flex-col items-center justify-center gap-1 ${
                          status === '1' || status === 1
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-white border border-neutral-200 text-neutral-400'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold">{meses[mIdx]}</span>
                        {status === '1' || status === 1 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-neutral-300" />
                        )}
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
