import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Music, Calendar, CreditCard, Download, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
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

export default async function MusicoDashboardPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 1 && user.cargo !== 2)) {
    redirect('/');
  }

  let partituras: any[] = [];
  let proximosServicos: any[] = [];
  let instrumentName = 'Geral';
  let aniversarios: any[] = [];
  let proximosServicosAlerta: any[] = [];

  try {
    if (user.instrumento) {
      const inst: any = await query(
        'SELECT nome_instrumento FROM tb_instrumentos WHERE id_instrumento = ?',
        [user.instrumento]
      );
      if (inst.length > 0) instrumentName = inst[0].nome_instrumento;

      partituras = await query(
        'SELECT id_partitura, nome, nome_ficheiro, ficheiro_partitura FROM tb_partituras WHERE instrumento = ? LIMIT 6',
        [user.instrumento]
      );
    }

    proximosServicos = await query(
      `SELECT s.id_servico, s.nome_servico, s.data_inicial, p.confirmado 
       FROM tb_servicos s 
       LEFT JOIN tb_presencas p ON p.servico_id = s.id_servico AND p.musico_id = ?
       ORDER BY s.data_inicial DESC LIMIT 4`,
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
    console.warn('Erro ao carregar dados do músico:', err);
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

  return (
    <DashboardLayout user={user} title="Área do Músico & Sócio">
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

        {/* Banner do Músico */}
        <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                Caderneta Digital
              </span>
              <h2 className="text-2xl font-black text-neutral-900 mt-1">Bem-vindo, {user.nome}!</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Instrumento ativo: <strong className="text-red-600 font-bold">{instrumentName}</strong>
              </p>
            </div>
            <div className="px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-center">
              <span className="text-xs text-neutral-500 block">Identificação</span>
              <span className="text-base font-black text-neutral-900">#{user.id}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/musicos-socios/calendario"
            className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-md hover:border-red-500 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Calendário</h4>
                <p className="text-xs text-neutral-500">Ensaios e concertos</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-600" />
          </Link>

          <Link
            href="/musicos-socios/caderneta"
            className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-md hover:border-red-500 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Caderneta</h4>
                <p className="text-xs text-neutral-500">Partituras em PDF</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-600" />
          </Link>

          <Link
            href="/musicos-socios/presencas"
            className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-xs hover:shadow-md hover:border-red-500 transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Presenças</h4>
                <p className="text-xs text-neutral-500">Marcar disponibilidade</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-600" />
          </Link>
        </div>

        {/* Partituras do Instrumento */}
        <div id="partituras" className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Music className="w-5 h-5 text-red-600" />
                <span>Partituras para {instrumentName}</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Aceda e transfira o material de estudo e ensaio
              </p>
            </div>
            <Link
              href="/musicos-socios/caderneta"
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Ver todas →
            </Link>
          </div>

          {partituras.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-sm space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-neutral-400" />
              <p>Ainda não foram atribuídas partituras ao seu naipe ou instrumento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {partituras.map((p) => (
                <div
                  key={p.id_partitura}
                  className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between hover:border-red-500 transition"
                >
                  <div className="overflow-hidden pr-3">
                    <p className="font-bold text-sm text-neutral-900 truncate">
                      {p.nome || p.nome_ficheiro}
                    </p>
                    <span className="text-xs text-neutral-500">PDF de Partitura</span>
                  </div>
                  <button
                    className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-600 rounded-lg transition"
                    title="Transferir partitura"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Serviços e Presenças */}
        <div id="servicos" className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <span>Próximos Ensaios e Serviços</span>
            </h3>
            <Link
              href="/musicos-socios/presencas"
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Gerir presenças →
            </Link>
          </div>

          {proximosServicos.length === 0 ? (
            <p className="text-neutral-500 text-sm py-4">Sem serviços agendados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-700">
                <thead className="bg-neutral-50 text-xs uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">Evento</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Presença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {proximosServicos.map((s) => (
                    <tr key={s.id_servico} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3 px-4 font-semibold text-neutral-900">{s.nome_servico}</td>
                      <td className="py-3 px-4 text-neutral-600 font-medium">{formatPtDate(s.data_inicial)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs rounded-full font-bold ${
                            s.confirmado === 'Confirmada'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {s.confirmado || 'Não confirmada'}
                        </span>
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
