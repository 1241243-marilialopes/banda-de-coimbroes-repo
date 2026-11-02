import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import CotasClient from './CotasClient';

export const dynamic = 'force-dynamic';

export default async function AdminCotasPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let anos: any[] = [];
  let cotas: any[] = [];

  try {
    anos = await query('SELECT id_ano, ano FROM tb_ano ORDER BY ano ASC');

    cotas = await query(
      `SELECT c.id_pagamento, c.socio_id, c.ano as ano_id, a.ano as ano_real,
              u.nome_utilizador,
              c.janeiro, c.fevereiro, c.marco, c.abril, c.maio, c.junho,
              c.julho, c.agosto, c.setembro, c.outubro, c.novembro, c.dezembro, c.ano_completo
       FROM tb_cota_mes c
       INNER JOIN tb_utilizadores u ON c.socio_id = u.id_utilizador
       LEFT JOIN tb_ano a ON c.ano = a.id_ano
       ORDER BY u.nome_utilizador ASC`
    );
  } catch (err) {
    console.warn('Erro ao carregar cotas:', err);
  }

  return (
    <DashboardLayout user={user} title="Gestão de Quotas de Sócio">
      <CotasClient anos={anos} initialCotas={cotas} />
    </DashboardLayout>
  );
}
