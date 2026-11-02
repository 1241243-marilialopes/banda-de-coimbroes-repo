import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import UtilizadoresClient from './UtilizadoresClient';

export const dynamic = 'force-dynamic';

export default async function AdminUtilizadoresPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let users: any[] = [];
  let instrumentos: any[] = [];

  try {
    const rawUsers: any = await query(
      `SELECT u.id_utilizador, u.nome_utilizador, u.telemovel, u.numero_cc, u.nif, 
              u.data_nascimento, u.email, u.instrumento, i.nome_instrumento, 
              u.genero_id, g.genero, u.cargo_id, c.nome_cargo, u.foto_perfil
       FROM tb_utilizadores u
       LEFT JOIN tb_genero g ON u.genero_id = g.id_genero
       LEFT JOIN tb_cargo c ON u.cargo_id = c.id_cargo
       LEFT JOIN tb_instrumentos i ON u.instrumento = i.id_instrumento
       ORDER BY u.nome_utilizador ASC`
    );

    users = rawUsers.map((u: any) => ({
      ...u,
      data_nascimento: u.data_nascimento
        ? u.data_nascimento instanceof Date
          ? u.data_nascimento.toISOString().slice(0, 10)
          : String(u.data_nascimento).slice(0, 10)
        : '',
    }));

    const rawInst: any = await query(
      'SELECT id_instrumento, nome_instrumento FROM tb_instrumentos ORDER BY nome_instrumento ASC'
    );
    instrumentos = rawInst.map((i: any) => ({
      id: i.id_instrumento,
      label: i.nome_instrumento,
    }));
  } catch (err) {
    console.warn('Erro ao carregar utilizadores:', err);
  }

  return (
    <DashboardLayout user={user} title="Utilizadores & Sócios">
      <UtilizadoresClient users={users} instrumentos={instrumentos} />
    </DashboardLayout>
  );
}
