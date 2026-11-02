import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import PresencasClient from './PresencasClient';

export const dynamic = 'force-dynamic';

function formatDate(val: any): string {
  if (!val) return '—';
  if (val instanceof Date) {
    return val.toISOString().slice(0, 10);
  }
  return String(val).slice(0, 10);
}

export default async function AdminPresencasPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let presencas: any[] = [];
  let servicos: any[] = [];

  try {
    const rawServicos: any = await query(
      'SELECT id_servico, nome_servico, data_inicial, localizacao FROM tb_servicos ORDER BY data_inicial DESC'
    );
    servicos = rawServicos.map((s: any) => ({
      ...s,
      data_inicial: formatDate(s.data_inicial),
    }));

    const rawPresencas: any = await query(
      `SELECT p.id_presenca, p.musico_id, p.confirmado, p.pago, p.texto_pagar, p.cor_botao_pagar,
              u.nome_utilizador, s.id_servico as servico_id, s.nome_servico, s.data_inicial, i.nome_instrumento
       FROM tb_presencas p
       INNER JOIN tb_utilizadores u ON p.musico_id = u.id_utilizador
       INNER JOIN tb_servicos s ON p.servico_id = s.id_servico
       LEFT JOIN tb_instrumentos i ON u.instrumento = i.id_instrumento
       ORDER BY s.data_inicial DESC, u.nome_utilizador ASC`
    );

    presencas = rawPresencas.map((p: any) => ({
      ...p,
      data_inicial: formatDate(p.data_inicial),
    }));
  } catch (err) {
    console.warn('Erro ao carregar presenças:', err);
  }

  return (
    <DashboardLayout user={user} title="Controlo de Presenças">
      <PresencasClient servicos={servicos} initialPresencas={presencas} />
    </DashboardLayout>
  );
}
