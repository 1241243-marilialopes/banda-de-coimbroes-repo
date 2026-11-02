import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MusicoPresencasPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 1 && user.cargo !== 2)) {
    redirect('/');
  }

  let servicos: any[] = [];

  try {
    servicos = await query(
      `SELECT s.id_servico, s.nome_servico, s.data_inicial, s.localizacao, p.confirmado 
       FROM tb_servicos s 
       LEFT JOIN tb_presencas p ON p.servico_id = s.id_servico AND p.musico_id = ?
       ORDER BY s.data_inicial DESC`,
      [user.id]
    );
  } catch (err) {
    console.warn('Erro ao carregar presenças:', err);
  }

  return (
    <DashboardLayout user={user} title="Presenças em Serviços">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Marcação de Presenças</h2>
          <p className="text-sm text-neutral-500">
            Confirme a sua disponibilidade e presença nos ensaios e atuações
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
          {servicos.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">Sem serviços agendados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-700">
                <thead className="bg-neutral-50 text-xs uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3.5 px-4">Evento / Serviço</th>
                    <th className="py-3.5 px-4">Data</th>
                    <th className="py-3.5 px-4">Local</th>
                    <th className="py-3.5 px-4">Estado da Presença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {servicos.map((s) => {
                    const isConfirmed = s.confirmado === 'Confirmada';
                    return (
                      <tr key={s.id_servico} className="hover:bg-neutral-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-neutral-900">
                          {s.nome_servico}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-neutral-600">
                          {s.data_inicial || 'A definir'}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-neutral-600">
                          {s.localizacao || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                            }`}
                          >
                            {isConfirmed ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Confirmada</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-neutral-400" />
                                <span>{s.confirmado || 'Pendente'}</span>
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

