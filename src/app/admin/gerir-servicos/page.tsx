import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import GerirServicosClient from './GerirServicosClient';

export const dynamic = 'force-dynamic';

function serializeDate(val: any): string {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

export default async function AdminGerirServicosPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let rawServicos: any[] = [];
  let tipos: any[] = [];

  try {
    tipos = (await query('SELECT id_tipo, tipo_servico FROM tb_tipos_servicos ORDER BY id_tipo ASC')) as any[];

    rawServicos = (await query(
      `SELECT s.id_servico, s.nome_servico, s.descricao_servico, s.tipo, ts.tipo_servico,
              s.color, s.data_inicial, s.data_final, s.localizacao, s.contacto_comissao, 
              s.nome_comissao, s.valor
       FROM tb_servicos s
       LEFT JOIN tb_tipos_servicos ts ON s.tipo = ts.id_tipo
       ORDER BY s.data_inicial DESC`
    )) as any[];
  } catch (err) {
    console.warn('Erro ao carregar serviços:', err);
  }

  const servicos = (rawServicos || []).map((s) => ({
    id_servico: s.id_servico,
    nome_servico: s.nome_servico,
    descricao_servico: s.descricao_servico || '',
    tipo: s.tipo,
    tipo_servico: s.tipo_servico || 'Geral',
    color: s.color || '#808080',
    data_inicial: serializeDate(s.data_inicial),
    data_final: serializeDate(s.data_final),
    localizacao: s.localizacao || '',
    contacto_comissao: s.contacto_comissao || '',
    nome_comissao: s.nome_comissao || '',
    valor: s.valor !== undefined && s.valor !== null ? Number(s.valor) : 0,
  }));

  return (
    <DashboardLayout user={user} title="Gerir Serviços & Ensaios">
      <GerirServicosClient servicos={servicos} tipos={tipos || []} />
    </DashboardLayout>
  );
}
