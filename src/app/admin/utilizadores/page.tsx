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
  let cargos: any[] = [];
  let generos: any[] = [];
  let tiposSocio: any[] = [];
  let proximoNumeroSocio = 1;

  try {
    const rawUsers: any = await query(
      `SELECT u.id_utilizador, u.nome_utilizador, u.telemovel, u.numero_cc, u.nif, 
              u.data_nascimento, u.email, u.instrumento, i.nome_instrumento, 
              u.genero_id, g.genero, u.cargo_id, c.nome_cargo,
              u.numero_socio, u.tipo_socio, ts.tipo_socio AS nome_tipo_socio,
              u.morada, u.area_residencia
       FROM tb_utilizadores u
       LEFT JOIN tb_genero g ON u.genero_id = g.id_genero
       LEFT JOIN tb_cargo c ON u.cargo_id = c.id_cargo
       LEFT JOIN tb_instrumentos i ON u.instrumento = i.id_instrumento
       LEFT JOIN tb_tipos_socio ts ON u.tipo_socio = ts.id_tipo_socio
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

    // Próximo número de sócio disponível
    const maxSocio: any = await query('SELECT MAX(COALESCE(numero_socio, 0)) AS max_num FROM tb_utilizadores');
    proximoNumeroSocio = (maxSocio[0]?.max_num || 0) + 1;

    const rawInst: any = await query(
      'SELECT id_instrumento, nome_instrumento FROM tb_instrumentos ORDER BY nome_instrumento ASC'
    );
    instrumentos = rawInst.map((i: any) => ({
      id: i.id_instrumento,
      label: i.nome_instrumento,
    }));

    const rawCargos: any = await query(
      'SELECT id_cargo, nome_cargo FROM tb_cargo ORDER BY id_cargo ASC'
    );
    cargos = rawCargos.map((c: any) => ({
      id: c.id_cargo,
      label: c.nome_cargo,
    }));

    const rawGeneros: any = await query(
      'SELECT id_genero, genero FROM tb_genero ORDER BY id_genero ASC'
    );
    generos = rawGeneros.map((g: any) => ({
      id: g.id_genero,
      label: g.genero,
    }));

    const rawTiposSocio: any = await query(
      'SELECT id_tipo_socio, tipo_socio FROM tb_tipos_socio ORDER BY id_tipo_socio ASC'
    );
    tiposSocio = rawTiposSocio.map((t: any) => ({
      id: t.id_tipo_socio,
      label: t.tipo_socio,
    }));
  } catch (err) {
    console.warn('Erro ao carregar utilizadores:', err);
  }

  return (
    <DashboardLayout user={user} title="Utilizadores & Sócios">
      <UtilizadoresClient
        users={users}
        instrumentos={instrumentos}
        cargos={cargos}
        generos={generos}
        tiposSocio={tiposSocio}
        proximoNumeroSocio={proximoNumeroSocio}
      />
    </DashboardLayout>
  );
}
