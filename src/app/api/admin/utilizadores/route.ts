import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || (admin.cargo !== 0 && admin.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { nome, email, tele, cc, nif, data, instrumento, genero, cargo, senha } = body;

    if (!nome || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios' }, { status: 400 });
    }

    // Verificar se já existe email ou CC/NIF
    const existing: any = await query(
      'SELECT id_utilizador FROM tb_utilizadores WHERE email = ? OR (numero_cc = ? AND ? != "") OR (nif = ? AND ? != "")',
      [email, cc || 0, cc || '', nif || 0, nif || '']
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Já existe um utilizador com este Email, CC ou NIF.' }, { status: 400 });
    }

    const hashed = await hashPassword(senha || '12345678');

    const res: any = await query(
      `INSERT INTO tb_utilizadores 
       (nome_utilizador, email, telemovel, numero_cc, nif, data_nascimento, instrumento, genero_id, cargo_id, senha, nome_foto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'utilizador.jpg')`,
      [
        nome,
        email,
        tele || '',
        cc ? Number(cc) : null,
        nif ? Number(nif) : null,
        data || null,
        instrumento ? Number(instrumento) : 1,
        genero ? Number(genero) : 1,
        cargo !== undefined ? Number(cargo) : 3,
        hashed,
      ]
    );

    const newId = res.insertId;

    // Criar linhas de quotas para cada ano
    const anos: any = await query('SELECT id_ano FROM tb_ano');
    for (const a of anos) {
      await query(
        `INSERT INTO tb_cota_mes 
         (socio_id, ano, janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro, ano_completo)
         VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)`,
        [newId, a.id_ano]
      );
    }

    return NextResponse.json({ success: true, id: newId });
  } catch (err: any) {
    console.error('Erro ao criar utilizador:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || (admin.cargo !== 0 && admin.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id_utilizador, nome, email, tele, cc, nif, data, instrumento, genero, cargo, senha } = body;

    if (!id_utilizador || !nome || !email) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    if (senha && senha.trim().length >= 6) {
      const hashed = await hashPassword(senha.trim());
      await query(
        `UPDATE tb_utilizadores 
         SET nome_utilizador = ?, email = ?, telemovel = ?, numero_cc = ?, nif = ?, 
             data_nascimento = ?, instrumento = ?, genero_id = ?, cargo_id = ?, senha = ?
         WHERE id_utilizador = ?`,
        [
          nome,
          email,
          tele || '',
          cc ? Number(cc) : null,
          nif ? Number(nif) : null,
          data || null,
          instrumento ? Number(instrumento) : 1,
          genero ? Number(genero) : 1,
          cargo !== undefined ? Number(cargo) : 3,
          hashed,
          id_utilizador,
        ]
      );
    } else {
      await query(
        `UPDATE tb_utilizadores 
         SET nome_utilizador = ?, email = ?, telemovel = ?, numero_cc = ?, nif = ?, 
             data_nascimento = ?, instrumento = ?, genero_id = ?, cargo_id = ?
         WHERE id_utilizador = ?`,
        [
          nome,
          email,
          tele || '',
          cc ? Number(cc) : null,
          nif ? Number(nif) : null,
          data || null,
          instrumento ? Number(instrumento) : 1,
          genero ? Number(genero) : 1,
          cargo !== undefined ? Number(cargo) : 3,
          id_utilizador,
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro ao atualizar utilizador:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || (admin.cargo !== 0 && admin.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await query('DELETE FROM tb_cota_mes WHERE socio_id = ?', [id]);
    await query('DELETE FROM tb_presencas WHERE musico_id = ?', [id]);
    await query('DELETE FROM tb_utilizadores WHERE id_utilizador = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro ao eliminar utilizador:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

