import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    let nome: string, email: string, tele: any, nif: any, cc: any,
        data: string, instrumento: any, genero: any,
        morada: string | undefined, area_residencia: string | undefined,
        senha: string | undefined, fotoBuffer: Buffer | null = null;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      nome = (formData.get('nome') as string) || '';
      email = (formData.get('email') as string) || '';
      tele = formData.get('tele');
      nif = formData.get('nif');
      cc = formData.get('cc');
      data = (formData.get('data') as string) || '';
      instrumento = formData.get('instrumento');
      genero = formData.get('genero');
      morada = (formData.get('morada') as string) || undefined;
      area_residencia = (formData.get('area_residencia') as string) || undefined;
      senha = (formData.get('senha') as string) || undefined;

      const foto = formData.get('foto') as File | null;
      if (foto && foto.size > 0) {
        const ab = await foto.arrayBuffer();
        fotoBuffer = Buffer.from(ab);
      }
    } else {
      const body = await req.json();
      ({ nome, email, tele, nif, cc, data, instrumento, genero, morada, area_residencia, senha } = body);
    }

    if (!nome || !nome.trim()) {
      return NextResponse.json({ error: 'O nome de utilizador é obrigatório.' }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'O email é obrigatório.' }, { status: 400 });
    }

    const cleanNome = nome.trim();
    const cleanEmail = email.trim();

    // Obter dados atuais do utilizador
    const existingUser: any = await queryOne('SELECT * FROM tb_utilizadores WHERE id_utilizador = ?', [user.id]);
    if (!existingUser) {
      return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });
    }

    // Verificar email duplicado
    const checkEmail: any = await query(
      'SELECT id_utilizador FROM tb_utilizadores WHERE email = ? AND id_utilizador != ?',
      [cleanEmail, user.id]
    );
    if (checkEmail.length > 0) {
      return NextResponse.json({ error: 'Já existe outro utilizador registado com este Email.' }, { status: 400 });
    }

    // Verificar CC duplicado
    const cleanCc = cc && String(cc).trim() ? Number(String(cc).replace(/\D/g, '')) || null : null;
    if (cleanCc) {
      const checkCc: any = await query(
        'SELECT id_utilizador FROM tb_utilizadores WHERE numero_cc = ? AND id_utilizador != ?',
        [cleanCc, user.id]
      );
      if (checkCc.length > 0) {
        return NextResponse.json({ error: 'Já existe outro utilizador com este Cartão de Cidadão.' }, { status: 400 });
      }
    }

    // Verificar NIF duplicado
    const cleanNif = nif && String(nif).trim() ? Number(String(nif).replace(/\D/g, '')) || null : null;
    if (cleanNif) {
      const checkNif: any = await query(
        'SELECT id_utilizador FROM tb_utilizadores WHERE nif = ? AND id_utilizador != ?',
        [cleanNif, user.id]
      );
      if (checkNif.length > 0) {
        return NextResponse.json({ error: 'Já existe outro utilizador com este NIF.' }, { status: 400 });
      }
    }

    // Telefone
    const cleanTele = tele !== undefined && String(tele).trim() !== ''
      ? Number(String(tele).replace(/\D/g, '')) || 0
      : (existingUser.telemovel || 0);

    // Data de nascimento
    let cleanData = existingUser.data_nascimento
      ? (existingUser.data_nascimento instanceof Date
          ? existingUser.data_nascimento.toISOString().slice(0, 10)
          : String(existingUser.data_nascimento).slice(0, 10))
      : '2000-01-01';

    if (data && String(data).trim() !== '') {
      const dStr = String(data).split('T')[0].trim();
      const d = new Date(dStr);
      if (!isNaN(d.getTime())) cleanData = dStr;
    }

    const cleanInstrumento = instrumento !== undefined && instrumento !== ''
      ? Number(instrumento) || 21
      : existingUser.instrumento;

    const cleanGenero = genero !== undefined && genero !== ''
      ? Number(genero) || 2
      : existingUser.genero_id;

    const cleanMorada = morada !== undefined ? (String(morada).trim() || null) : existingUser.morada;
    const cleanArea = area_residencia !== undefined ? (String(area_residencia).trim() || null) : existingUser.area_residencia;

    let hashed: string | null = null;
    if (senha && String(senha).trim().length >= 6) {
      hashed = await hashPassword(String(senha).trim());
    }

    if (hashed) {
      if (fotoBuffer) {
        await query(
          `UPDATE tb_utilizadores 
           SET nome_utilizador = ?, email = ?, telemovel = ?, nif = ?, numero_cc = ?, 
               data_nascimento = ?, instrumento = ?, genero_id = ?, morada = ?, area_residencia = ?, senha = ?, foto_perfil = ?
           WHERE id_utilizador = ?`,
          [cleanNome, cleanEmail, cleanTele, cleanNif, cleanCc, cleanData, cleanInstrumento, cleanGenero, cleanMorada, cleanArea, hashed, fotoBuffer, user.id]
        );
      } else {
        await query(
          `UPDATE tb_utilizadores 
           SET nome_utilizador = ?, email = ?, telemovel = ?, nif = ?, numero_cc = ?, 
               data_nascimento = ?, instrumento = ?, genero_id = ?, morada = ?, area_residencia = ?, senha = ?
           WHERE id_utilizador = ?`,
          [cleanNome, cleanEmail, cleanTele, cleanNif, cleanCc, cleanData, cleanInstrumento, cleanGenero, cleanMorada, cleanArea, hashed, user.id]
        );
      }
    } else {
      if (fotoBuffer) {
        await query(
          `UPDATE tb_utilizadores 
           SET nome_utilizador = ?, email = ?, telemovel = ?, nif = ?, numero_cc = ?, 
               data_nascimento = ?, instrumento = ?, genero_id = ?, morada = ?, area_residencia = ?, foto_perfil = ?
           WHERE id_utilizador = ?`,
          [cleanNome, cleanEmail, cleanTele, cleanNif, cleanCc, cleanData, cleanInstrumento, cleanGenero, cleanMorada, cleanArea, fotoBuffer, user.id]
        );
      } else {
        await query(
          `UPDATE tb_utilizadores 
           SET nome_utilizador = ?, email = ?, telemovel = ?, nif = ?, numero_cc = ?, 
               data_nascimento = ?, instrumento = ?, genero_id = ?, morada = ?, area_residencia = ?
           WHERE id_utilizador = ?`,
          [cleanNome, cleanEmail, cleanTele, cleanNif, cleanCc, cleanData, cleanInstrumento, cleanGenero, cleanMorada, cleanArea, user.id]
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Perfil atualizado com sucesso!' });
  } catch (err: any) {
    console.error('Erro ao atualizar perfil:', err);
    return NextResponse.json({ error: err.message || 'Erro ao atualizar dados do perfil.' }, { status: 400 });
  }
}
