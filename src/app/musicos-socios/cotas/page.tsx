import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { CheckCircle2, XCircle, CreditCard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MusicoCotasPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 1 && user.cargo !== 2)) {
    redirect('/');
  }

  let quotas: any[] = [];
  try {
    quotas = await query(
      `SELECT c.ano, a.ano as ano_real, c.janeiro, c.fevereiro, c.marco, c.abril, 
              c.maio, c.junho, c.julho, c.agosto, c.setembro, c.outubro, 
              c.novembro, c.dezembro, c.ano_completo 
       FROM tb_cota_mes c
       LEFT JOIN tb_ano a ON c.ano = a.id_ano
       WHERE c.socio_id = ? 
       ORDER BY a.ano DESC, c.id_pagamento DESC`,
      [user.id]
    );
  } catch (err) {
    console.warn('Erro ao carregar quotas:', err);
  }

  const meses = [
    { key: 'janeiro', label: 'Janeiro' },
    { key: 'fevereiro', label: 'Fevereiro' },
    { key: 'marco', label: 'Março' },
    { key: 'abril', label: 'Abril' },
    { key: 'maio', label: 'Maio' },
    { key: 'junho', label: 'Junho' },
    { key: 'julho', label: 'Julho' },
    { key: 'agosto', label: 'Agosto' },
    { key: 'setembro', label: 'Setembro' },
    { key: 'outubro', label: 'Outubro' },
    { key: 'novembro', label: 'Novembro' },
    { key: 'dezembro', label: 'Dezembro' },
  ];

  return (
    <DashboardLayout user={user} title="Quotas de Sócio">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Estado de Quotas</h2>
          <p className="text-sm text-neutral-500">
            Registo de pagamento das quotas mensais de associado
          </p>
        </div>

        {quotas.length === 0 ? (
          <div className="p-8 bg-white border border-neutral-200 rounded-2xl shadow-xs text-center text-neutral-500">
            <CreditCard className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
            <p className="font-bold">Ainda não constam registos de quotas para este associado.</p>
          </div>
        ) : (
          quotas.map((q, idx) => {
            const displayYear = q.ano_real || q.ano;
            return (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-base font-extrabold text-neutral-900">Ano de {displayYear}</span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                    12 Mensalidades
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {meses.map((m) => {
                    const isPaid = q[m.key] === 1 || q[m.key] === '1';
                    return (
                      <div
                        key={m.key}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isPaid
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-500'
                        }`}
                      >
                        <span className="text-xs font-bold">{m.label}</span>
                        {isPaid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-neutral-300" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
