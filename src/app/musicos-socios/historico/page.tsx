import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { History, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MusicoHistoricoPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 1 && user.cargo !== 2)) {
    redirect('/');
  }

  let presencas: any[] = [];

  try {
    presencas = await query(
      `SELECT s.id_servico, s.nome_servico, s.data_inicial, s.localizacao, p.confirmado 
       FROM tb_presencas p
       INNER JOIN tb_servicos s ON p.servico_id = s.id_servico
       WHERE p.musico_id = ? AND p.confirmado = 'Confirmada'
       ORDER BY s.data_inicial DESC`,
      [user.id]
    );
  } catch (err) {
    console.warn('Erro ao carregar histórico de presenças:', err);
  }

  return (
    <DashboardLayout user={user} title="Histórico de Presenças">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Histórico de Atuações Concluídas</h2>
          <p className="text-sm text-neutral-500">
            Total de {presencas.length} serviços realizados com presença confirmada
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
          {presencas.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 space-y-2">
              <History className="w-12 h-12 mx-auto text-neutral-400" />
              <p className="font-bold text-neutral-800">Sem registos no histórico</p>
              <p className="text-xs text-neutral-500">
                Os seus serviços efetuados surgirão aqui após a realização dos eventos.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-700">
                <thead className="bg-neutral-50 text-xs uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3.5 px-4">Serviço Realizado</th>
                    <th className="py-3.5 px-4">Data</th>
                    <th className="py-3.5 px-4">Local</th>
                    <th className="py-3.5 px-4">Presença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {presencas.map((p) => (
                    <tr key={p.id_servico} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-neutral-900">{p.nome_servico}</td>
                      <td className="py-3.5 px-4 text-xs text-neutral-600">{p.data_inicial || '—'}</td>
                      <td className="py-3.5 px-4 text-xs text-neutral-600">{p.localizacao || '—'}</td>
                      <td className="py-3.5 px-4 text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Realizado</span>
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

