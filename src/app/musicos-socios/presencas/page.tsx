import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import MusicoPresencasClient from './MusicoPresencasClient';

export const dynamic = 'force-dynamic';

function formatDisplayDate(val: any): string {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function MusicoPresencasPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 1 && user.cargo !== 2)) {
    redirect('/');
  }

  let presencas: any[] = [];

  try {
    // Serviços futuros (data_inicial >= CURDATE() e tipo != 4)
    const rows: any = await query(
      `SELECT s.id_servico, s.nome_servico, s.descricao_servico, s.data_inicial, s.data_final, s.localizacao,
              p.id_presenca, p.confirmado, p.pago, p.musico_label_pago
       FROM tb_servicos s
       LEFT JOIN tb_presencas p ON p.servico_id = s.id_servico AND p.musico_id = ?
       WHERE s.data_inicial >= CURDATE() AND s.tipo != 4
       ORDER BY s.data_inicial ASC`,
      [user.id]
    );

    presencas = (rows || []).map((r: any) => ({
      id_presenca: r.id_presenca,
      id_servico: r.id_servico,
      nome_servico: r.nome_servico,
      descricao_servico: r.descricao_servico || '',
      data_inicial: formatDisplayDate(r.data_inicial),
      data_final: formatDisplayDate(r.data_final),
      localizacao: r.localizacao || '',
      confirmado: r.confirmado || 'Não confirmada',
      pago: r.pago !== undefined && r.pago !== null ? Number(r.pago) : 0,
      musico_label_pago: r.musico_label_pago || 'Por pagar',
    }));
  } catch (err) {
    console.warn('Erro ao carregar presenças do músico:', err);
  }

  return (
    <DashboardLayout user={user} title="Marcação de Presenças">
      <MusicoPresencasClient initialPresencas={presencas} />
    </DashboardLayout>
  );
}
