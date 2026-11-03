import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import CotasClient from './CotasClient';

export const dynamic = 'force-dynamic';

export default async function AdminCotasPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  const currentYear = new Date().getFullYear();

  // Garantir que o próximo ano é adicionado a cada ano que passa
  try {
    const maxYearRow: any = await queryOne('SELECT MAX(ano) as max_ano FROM tb_ano');
    const maxAno = maxYearRow?.max_ano ? Number(maxYearRow.max_ano) : currentYear;
    if (maxAno < currentYear + 1) {
      await query('INSERT INTO tb_ano (ano) VALUES (?)', [currentYear + 1]);
    }
  } catch (e) {
    console.warn('Erro ao verificar próximo ano em tb_ano:', e);
  }

  let anos: any[] = [];
  let cotas: any[] = [];

  try {
    anos = (await query('SELECT id_ano, ano FROM tb_ano ORDER BY ano ASC')) as any[];

    cotas = (await query(
      `SELECT c.id_pagamento, c.socio_id, c.ano as ano_id, a.ano as ano_real,
              u.nome_utilizador, u.numero_socio,
              c.janeiro, c.fevereiro, c.marco, c.abril, c.maio, c.junho,
              c.julho, c.agosto, c.setembro, c.outubro, c.novembro, c.dezembro, c.ano_completo
       FROM tb_cota_mes c
       INNER JOIN tb_utilizadores u ON c.socio_id = u.id_utilizador
       LEFT JOIN tb_ano a ON c.ano = a.id_ano
       ORDER BY u.nome_utilizador ASC`
    )) as any[];
  } catch (err) {
    console.warn('Erro ao carregar cotas:', err);
  }

  return (
    <DashboardLayout user={user} title="Gestão de Quotas de Sócio">
      <CotasClient anos={anos || []} initialCotas={cotas || []} />
    </DashboardLayout>
  );
}
