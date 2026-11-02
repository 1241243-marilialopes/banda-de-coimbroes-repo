import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout, { NavItem } from '@/components/DashboardLayout';
import { Music, Calendar, CreditCard, UserCheck, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const musicoNav: NavItem[] = [
  { label: 'A Minha Área', href: '/musicos-socios', icon: UserCheck },
  { label: 'Partituras do Instrumento', href: '/musicos-socios/partituras', icon: Music },
  { label: 'Presenças & Serviços', href: '/musicos-socios/presencas', icon: Calendar },
  { label: 'Estado de Quotas', href: '/musicos-socios/cotas', icon: CreditCard },
];

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
    <DashboardLayout user={user} title="Área do Músico & Sócio" navItems={musicoNav}>
      <div className="space-y-8">
        {/* Banner do Músico */}
        <div className="p-6 bg-gradient-to-r from-amber-600/20 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Caderneta Digital
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">Bem-vindo, {user.nome}!</h2>
              <p className="text-sm text-neutral-400 mt-1">
                Instrumento ativo: <strong className="text-amber-400">{instrumentName}</strong>
              </p>
            </div>
            <div className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-center">
              <span className="text-xs text-neutral-400 block">Identificação</span>
              <span className="text-base font-bold text-white">#{user.id}</span>
            </div>
          </div>
        </div>

        {/* Partituras do Instrumento */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-500" />
                <span>Partituras para {instrumentName}</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Aceda e transfira o material de estudo e ensaio
              </p>
            </div>
          </div>

          {partituras.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-sm space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-neutral-600" />
              <p>Ainda não foram atribuídas partituras ao seu naipe ou instrumento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {partituras.map((p) => (
                <div
                  key={p.id_partitura}
                  className="p-4 bg-neutral-800/60 border border-neutral-700 rounded-xl flex items-center justify-between hover:border-amber-500/50 transition"
                >
                  <div className="overflow-hidden pr-3">
                    <p className="font-bold text-sm text-white truncate">{p.nome || p.nome_ficheiro}</p>
                    <span className="text-xs text-neutral-400">PDF de Partitura</span>
                  </div>
                  <button
                    className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition"
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
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Próximos Ensaios e Serviços</span>
            </h3>
          </div>

          {proximosServicos.length === 0 ? (
            <p className="text-neutral-500 text-sm py-4">Sem serviços agendados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-800/60 text-xs uppercase text-neutral-400 border-b border-neutral-700">
                  <tr>
                    <th className="py-3 px-4">Evento</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Presença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {proximosServicos.map((s) => (
                    <tr key={s.id_servico} className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-semibold text-white">{s.nome_servico}</td>
                      <td className="py-3 px-4 text-neutral-400">{s.data_inicial || 'A definir'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs rounded-full font-bold ${
                            s.confirmado === 'Confirmada'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
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

