import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import CadernetaClient from './CadernetaClient';

export const dynamic = 'force-dynamic';

export default async function AdminCadernetaPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let instrumentos: any[] = [];
  let partituras: any[] = [];

  try {
    instrumentos = await query(
      'SELECT id_instrumento, nome_instrumento FROM tb_instrumentos ORDER BY nome_instrumento ASC'
    );

    partituras = await query(
      `SELECT p.id_partitura, p.nome, np.nome_partitura as nome_obra, p.nome_ficheiro, 
              p.instrumento as instrumento_id, i.nome_instrumento
       FROM tb_partituras p
       LEFT JOIN tb_nome_partituras np ON p.nome = np.id_nome
       LEFT JOIN tb_instrumentos i ON p.instrumento = i.id_instrumento
       ORDER BY np.nome_partitura ASC, i.nome_instrumento ASC`
    );
  } catch (err) {
    console.warn('Erro ao carregar caderneta:', err);
  }

  return (
    <DashboardLayout user={user} title="Arquivo de Partituras & Caderneta">
      <CadernetaClient instrumentos={instrumentos} partituras={partituras} />
    </DashboardLayout>
  );
}
