import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || (admin.cargo !== 0 && admin.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { nome, email, tele, cc, nif, data, instrumento, genero, cargo, senha } = body;

    if (!nome || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios.' }, { status: 400 });
    }

    // Verificar se já existe email, CC ou NIF
    const existing: any = await query(
      `SELECT id_utilizador FROM tb_utilizadores 
       WHERE email = ? OR (numero_cc = ? AND ? != '') OR (nif = ? AND ? != '')`,
      [email, cc || 0, cc || '', nif || 0, nif || '']
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Já existe um utilizador registado com este Email, Cartão de Cidadão ou NIF.' },
        { status: 400 }
      );
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

    // Se o utilizador for músico (cargo 1 ou 2), gerar presenças para todos os serviços existentes
    if (Number(cargo) === 1 || Number(cargo) === 2) {
      const servicos: any = await query('SELECT id_servico FROM tb_servicos WHERE tipo != 4');
      for (const s of servicos) {
        await query(
          `INSERT INTO tb_presencas 
           (musico_id, confirmado, servico_id, cor_botao_pagar, texto_pagar, cor_botao_confirma_musico, cor_musico_confirmado, musico_label_pago, cor_pago_musico, pago) 
           VALUES (?, 'Não confirmada', ?, 'danger', 'Pagar', 'warning', 'red', 'Por pagar', 'red', 0)`,
          [newId, s.id_servico]
        );
      }
    }

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
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
    }

    // Verificar duplicação de CC, NIF ou Email em outros utilizadores
    const existing: any = await query(
      `SELECT id_utilizador FROM tb_utilizadores 
       WHERE (email = ? OR (numero_cc = ? AND ? != '') OR (nif = ? AND ? != '')) AND id_utilizador != ?`,
      [email, cc || 0, cc || '', nif || 0, nif || '', id_utilizador]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Já existe outro utilizador com este Email, Cartão de Cidadão ou NIF.' },
        { status: 400 }
      );
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
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
    }

    // Não permitir ao próprio admin remover a sua conta
    if (Number(id) === admin.id) {
      return NextResponse.json({ error: 'Não pode eliminar a sua própria conta de administrador.' }, { status: 400 });
    }

    // Limpar cotas e presenças
    await query('DELETE FROM tb_cota_mes WHERE socio_id = ?', [id]);
    await query('DELETE FROM tb_presencas WHERE musico_id = ?', [id]);
    await query('DELETE FROM tb_utilizadores WHERE id_utilizador = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro ao eliminar utilizador:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
