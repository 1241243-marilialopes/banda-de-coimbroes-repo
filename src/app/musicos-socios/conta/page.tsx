import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import ContaClient from '@/app/admin/conta/ContaClient';

export const dynamic = 'force-dynamic';

function formatDate(val: any): string {
  if (!val) return '';
  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }
  return String(val).split('T')[0];
}

export default async function MusicoContaPage() {
  const session = await getCurrentUser();

  if (!session || (session.cargo !== 1 && session.cargo !== 2)) {
    redirect('/');
  }

  let userDetails: any = null;
  let instrumentos: any[] = [];
  let generos: any[] = [];

  try {
    userDetails = await queryOne(
      `SELECT u.id_utilizador, u.nome_utilizador, u.telemovel, u.numero_cc, u.nif, 
              u.data_nascimento, u.email, u.instrumento, u.genero_id, u.cargo_id,
              u.numero_socio, u.morada, u.area_residencia,
              i.nome_instrumento, c.nome_cargo, g.genero
       FROM tb_utilizadores u
       LEFT JOIN tb_genero g ON u.genero_id = g.id_genero
       LEFT JOIN tb_cargo c ON u.cargo_id = c.id_cargo
       LEFT JOIN tb_instrumentos i ON u.instrumento = i.id_instrumento
       WHERE u.id_utilizador = ?`,
      [session.id]
    );

    instrumentos = (await query(
      'SELECT id_instrumento, nome_instrumento FROM tb_instrumentos ORDER BY nome_instrumento ASC'
    )) as any[];

    generos = (await query(
      'SELECT id_genero, genero FROM tb_genero ORDER BY id_genero ASC'
    )) as any[];
  } catch (err) {
    console.warn('Erro ao carregar perfil do músico:', err);
  }

  const u = userDetails || {
    id_utilizador: session.id,
    nome_utilizador: session.nome,
    email: session.email,
    telemovel: '',
    numero_cc: '',
    nif: '',
    data_nascimento: '',
    instrumento: session.instrumento || 21,
    genero_id: 2,
    cargo_id: session.cargo,
    nome_cargo: 'Músico & Sócio',
  };

  const serializedUser = {
    ...u,
    data_nascimento: formatDate(u.data_nascimento),
  };

  return (
    <DashboardLayout user={session} title="O Meu Perfil">
      <ContaClient
        initialUser={serializedUser}
        instrumentos={instrumentos || []}
        generos={generos || []}
      />
    </DashboardLayout>
  );
}
