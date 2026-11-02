import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Music, Calendar, CreditCard, Download, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MusicoDashboardPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 1 && user.cargo !== 2)) {
    redirect('/');
  }

  let partituras: any[] = [];
  let proximosServicos: any[] = [];
  let instrumentName = 'Geral';

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
  } catch (err) {
    console.warn('Erro ao carregar dados do músico:', err);
  }

  return (
    <DashboardLayout user={user} title="Área do Músico & Sócio">
      <div className="space-y-6">
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
                      <td className="py-3 px-4 text-neutral-500">{s.data_inicial || 'A definir'}</td>
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
