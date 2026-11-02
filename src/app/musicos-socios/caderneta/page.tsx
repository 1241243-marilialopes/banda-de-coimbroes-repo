import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import MusicoCadernetaClient from './MusicoCadernetaClient';

export const dynamic = 'force-dynamic';

export default async function MusicoCadernetaPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 1 && user.cargo !== 2)) {
    redirect('/');
  }

  let partituras: any[] = [];
  let instrumentName = 'Instrumento Geral';

  try {
    // Obter o instrumento atual do utilizador da base de dados
    const dbUser: any = await queryOne(
      `SELECT u.instrumento, i.nome_instrumento 
       FROM tb_utilizadores u
       LEFT JOIN tb_instrumentos i ON u.instrumento = i.id_instrumento
       WHERE u.id_utilizador = ?`,
      [user.id]
    );

    const instrumentoId = dbUser?.instrumento || user.instrumento || 1;
    instrumentName = dbUser?.nome_instrumento || 'Geral';

    partituras = (await query(
      `SELECT p.id_partitura, np.nome_partitura, p.instrumento as instrumento_id, i.nome_instrumento
       FROM tb_partituras p
       INNER JOIN tb_nome_partituras np ON p.nome = np.id_nome_partitura
       INNER JOIN tb_instrumentos i ON p.instrumento = i.id_instrumento
       WHERE p.instrumento = ?
       ORDER BY np.nome_partitura ASC`,
      [instrumentoId]
    )) as any[];
  } catch (err) {
    console.warn('Erro ao carregar caderneta do músico:', err);
  }

  return (
    <DashboardLayout user={user} title={`Caderneta de Partituras (${instrumentName})`}>
      <MusicoCadernetaClient
        partituras={partituras || []}
        instrumentName={instrumentName}
      />
    </DashboardLayout>
  );
}
