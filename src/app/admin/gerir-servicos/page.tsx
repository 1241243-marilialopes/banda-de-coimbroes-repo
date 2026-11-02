import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Calendar, MapPin, Clock, CreditCard, ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminGerirServicosPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let servicos: any[] = [];

  try {
    servicos = await query(
      `SELECT s.id_servico, s.nome_servico, s.descricao_servico, s.data_inicial, 
              s.data_final, s.localizacao, s.valor, s.color, t.tipo_servico
       FROM tb_servicos s
       LEFT JOIN tb_tipos_servicos t ON s.tipo = t.id_tipo
       ORDER BY s.data_inicial DESC`
    );
  } catch (err) {
    console.warn('Erro ao carregar serviços:', err);
  }

  return (
    <DashboardLayout user={user} title="Gerir Serviços & Ensaios">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Lista Completa de Atuações</h2>
            <p className="text-sm text-neutral-500">
              Total de {servicos.length} eventos registados na base de dados
            </p>
          </div>
          <Link
            href="/admin/calendario"
            className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar ao Calendário</span>
          </Link>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
          {servicos.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              Nenhum serviço registado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-700">
                <thead className="bg-neutral-50 text-xs uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3.5 px-4">Serviço</th>
                    <th className="py-3.5 px-4">Datas</th>
                    <th className="py-3.5 px-4">Localização</th>
                    <th className="py-3.5 px-4">Tipo</th>
                    <th className="py-3.5 px-4">Cachet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {servicos.map((s) => (
                    <tr key={s.id_servico} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: s.color || '#dc2626' }}
                          ></span>
                          <span className="font-bold text-neutral-900">{s.nome_servico}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-600 space-y-0.5">
                        <div className="flex items-center gap-1 font-semibold text-neutral-800">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Início: {s.data_inicial || '—'}</span>
                        </div>
                        {s.data_final && <div>Fim: {s.data_final}</div>}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-600">
                        {s.localizacao ? (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            <span>{s.localizacao}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <span className="inline-block px-2.5 py-1 bg-neutral-100 text-neutral-700 font-bold rounded-lg">
                          {s.tipo_servico || 'Serviço'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-bold text-emerald-600">
                        {s.valor ? `${s.valor} €` : '—'}
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

