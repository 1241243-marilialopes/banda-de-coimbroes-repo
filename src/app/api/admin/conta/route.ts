import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nome, email, tele, nif, cc, data, instrumento, genero, senha } = body;

    if (!nome || !email) {
      return NextResponse.json({ error: 'Nome e email são obrigatórios.' }, { status: 400 });
    }

    // Verificar se CC ou NIF já estão registados noutro utilizador
    const existing: any = await query(
      `SELECT id_utilizador FROM tb_utilizadores 
       WHERE (email = ? OR (numero_cc = ? AND ? != '') OR (nif = ? AND ? != '')) 
         AND id_utilizador != ?`,
      [email, cc || 0, cc || '', nif || 0, nif || '', user.id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Já existe outro utilizador com este Email, Cartão de Cidadão ou NIF.' },
        { status: 400 }
      );
    }

    // Format date properly
    let formattedDate = null;
    if (data && String(data).trim() !== '') {
      formattedDate = String(data).split('T')[0];
    }

    if (senha && senha.trim().length >= 6) {
      const hashed = await hashPassword(senha.trim());
      await query(
        `UPDATE tb_utilizadores 
         SET nome_utilizador = ?, email = ?, telemovel = ?, nif = ?, numero_cc = ?, 
             data_nascimento = ?, instrumento = COALESCE(?, instrumento), genero_id = COALESCE(?, genero_id), senha = ?
         WHERE id_utilizador = ?`,
        [
          nome,
          email,
          tele || '',
          nif ? Number(nif) : null,
          cc ? Number(cc) : null,
          formattedDate,
          instrumento ? Number(instrumento) : null,
          genero ? Number(genero) : null,
          hashed,
          user.id,
        ]
      );
    } else {
      await query(
        `UPDATE tb_utilizadores 
         SET nome_utilizador = ?, email = ?, telemovel = ?, nif = ?, numero_cc = ?, 
             data_nascimento = ?, instrumento = COALESCE(?, instrumento), genero_id = COALESCE(?, genero_id)
         WHERE id_utilizador = ?`,
        [
          nome,
          email,
          tele || '',
          nif ? Number(nif) : null,
          cc ? Number(cc) : null,
          formattedDate,
          instrumento ? Number(instrumento) : null,
          genero ? Number(genero) : null,
          user.id,
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro ao atualizar conta:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
