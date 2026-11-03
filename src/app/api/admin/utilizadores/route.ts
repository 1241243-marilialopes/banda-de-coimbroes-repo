import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getDefaultPhotoBuffer(): Buffer | null {
  try {
    const p1 = path.join(process.cwd(), 'public/assets/img/utilizador.jpg');
    if (fs.existsSync(p1)) return fs.readFileSync(p1);
    const p2 = path.join(process.cwd(), 'public/assets/utilizador.jpg');
    if (fs.existsSync(p2)) return fs.readFileSync(p2);
  } catch (e) {
    console.warn('Erro ao ler foto predefinida:', e);
  }
  return null;
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || (admin.cargo !== 0 && admin.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    let nome: string, email: string, tele: any, cc: any, nif: any,
        data: string, instrumento: any, genero: any,
        cargo: any, senha: string | undefined,
        numero_socio: any, tipo_socio: any,
        morada: string | undefined, area_residencia: string | undefined,
        fotoBuffer: Buffer | null = null;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      nome = (formData.get('nome') as string) || '';
      email = (formData.get('email') as string) || '';
      tele = formData.get('tele');
      cc = formData.get('cc');
      nif = formData.get('nif');
      data = (formData.get('data') as string) || '';
      instrumento = formData.get('instrumento');
      genero = formData.get('genero');
      cargo = formData.get('cargo');
      senha = (formData.get('senha') as string) || undefined;
      numero_socio = formData.get('numero_socio');
      tipo_socio = formData.get('tipo_socio');
      morada = (formData.get('morada') as string) || undefined;
      area_residencia = (formData.get('area_residencia') as string) || undefined;

      const foto = formData.get('foto') as File | null;
      if (foto && foto.size > 0) {
        const ab = await foto.arrayBuffer();
        fotoBuffer = Buffer.from(ab);
      }
    } else {
      const body = await req.json();
      ({
        nome, email, tele, cc, nif, data, instrumento, genero, cargo, senha,
        numero_socio, tipo_socio, morada, area_residencia
      } = body);
    }

    if (!nome || !nome.trim()) {
      return NextResponse.json({ error: 'Por favor, insira o nome completo.' }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Por favor, insira um endereço de email válido.' }, { status: 400 });
    }

    const cleanNome = nome.trim();
    const cleanEmail = email.trim();

    // Verificações rigorosas de duplicados com mensagens específicas
    const checkEmail: any = await query('SELECT id_utilizador FROM tb_utilizadores WHERE email = ?', [cleanEmail]);
    if (checkEmail.length > 0) {
      return NextResponse.json({ error: 'Já existe um utilizador registado com este endereço de email.' }, { status: 400 });
    }

    const cleanCc = cc && String(cc).trim() ? Number(String(cc).replace(/\D/g, '')) || null : null;
    if (cleanCc) {
      const checkCc: any = await query('SELECT id_utilizador FROM tb_utilizadores WHERE numero_cc = ?', [cleanCc]);
      if (checkCc.length > 0) {
        return NextResponse.json({ error: 'Já existe um utilizador registado com este Cartão de Cidadão.' }, { status: 400 });
      }
    }

    const cleanNif = nif && String(nif).trim() ? Number(String(nif).replace(/\D/g, '')) || null : null;
    if (cleanNif) {
      const checkNif: any = await query('SELECT id_utilizador FROM tb_utilizadores WHERE nif = ?', [cleanNif]);
      if (checkNif.length > 0) {
        return NextResponse.json({ error: 'Já existe um utilizador registado com este NIF.' }, { status: 400 });
      }
    }

    // Sanitize integer and date fields to prevent MySQL NOT NULL errors
    const cleanTele = tele && String(tele).trim() ? Number(String(tele).replace(/\D/g, '')) || 0 : 0;
    
    let cleanData = '2000-01-01';
    if (data && String(data).trim() !== '') {
      const dStr = String(data).split('T')[0].trim();
      const d = new Date(dStr);
      if (!isNaN(d.getTime())) cleanData = dStr;
    }

    const cleanInstrumento = instrumento !== undefined && instrumento !== '' ? Number(instrumento) || 21 : 21;
    const cleanGenero = genero !== undefined && genero !== '' ? Number(genero) || 2 : 2;
    const cleanCargo = cargo !== undefined && cargo !== '' ? Number(cargo) : 3;
    const cleanTipoSocio = tipo_socio !== undefined && tipo_socio !== '' ? Number(tipo_socio) || 1 : 1;
    const cleanMorada = morada && String(morada).trim() ? String(morada).trim() : null;
    const cleanArea = area_residencia && String(area_residencia).trim() ? String(area_residencia).trim() : null;

    // Foto predefinida se não foi carregada nenhuma foto
    if (!fotoBuffer) {
      fotoBuffer = getDefaultPhotoBuffer();
    }

    // Auto-atribuir número de sócio se não especificado
    let numSocioFinal = numero_socio && String(numero_socio).trim() ? Number(numero_socio) : null;
    if (!numSocioFinal) {
      const maxSocio: any = await query('SELECT MAX(COALESCE(numero_socio, 0)) AS max_num FROM tb_utilizadores');
      numSocioFinal = (maxSocio[0]?.max_num || 0) + 1;
    }

    const hashed = await hashPassword(senha && senha.trim().length >= 6 ? senha.trim() : '12345678');

    const res: any = await query(
      `INSERT INTO tb_utilizadores 
       (nome_utilizador, email, telemovel, numero_cc, nif, data_nascimento, instrumento, genero_id, cargo_id, senha, nome_foto, numero_socio, tipo_socio, morada, area_residencia, foto_perfil)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'utilizador.jpg', ?, ?, ?, ?, ?)`,
      [
        cleanNome,
        cleanEmail,
        cleanTele,
        cleanCc,
        cleanNif,
        cleanData,
        cleanInstrumento,
        cleanGenero,
        cleanCargo,
        hashed,
        numSocioFinal,
        cleanTipoSocio,
        cleanMorada,
        cleanArea,
        fotoBuffer,
      ]
    );

    const newId = res.insertId;

    // Se o utilizador for músico (cargo 1 ou 2), gerar presenças para todos os serviços existentes
    if (cleanCargo === 1 || cleanCargo === 2) {
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

    return NextResponse.json({ success: true, id: newId, numero_socio: numSocioFinal });
  } catch (err: any) {
    console.error('Erro ao criar utilizador:', err);
    return NextResponse.json({ error: err.message || 'Erro interno ao criar utilizador.' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || (admin.cargo !== 0 && admin.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    let id_utilizador: any, nome: string, email: string, tele: any, cc: any, nif: any,
        data: string, instrumento: any, genero: any,
        cargo: any, senha: string | undefined,
        numero_socio: any, tipo_socio: any,
        morada: string | undefined, area_residencia: string | undefined,
        fotoBuffer: Buffer | null = null;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      id_utilizador = formData.get('id_utilizador');
      nome = (formData.get('nome') as string) || '';
      email = (formData.get('email') as string) || '';
      tele = formData.get('tele');
      cc = formData.get('cc');
      nif = formData.get('nif');
      data = (formData.get('data') as string) || '';
      instrumento = formData.get('instrumento');
      genero = formData.get('genero');
      cargo = formData.get('cargo');
      senha = (formData.get('senha') as string) || undefined;
      numero_socio = formData.get('numero_socio');
      tipo_socio = formData.get('tipo_socio');
      morada = (formData.get('morada') as string) || undefined;
      area_residencia = (formData.get('area_residencia') as string) || undefined;

      const foto = formData.get('foto') as File | null;
      if (foto && foto.size > 0) {
        const ab = await foto.arrayBuffer();
        fotoBuffer = Buffer.from(ab);
      }
    } else {
      const body = await req.json();
      ({
        id_utilizador, nome, email, tele, cc, nif, data, instrumento, genero, cargo, senha,
        numero_socio, tipo_socio, morada, area_residencia
      } = body);
    }

    const idNum = Number(id_utilizador);
    if (!idNum || isNaN(idNum)) {
      return NextResponse.json({ error: 'ID de utilizador inválido.' }, { status: 400 });
    }

    if (!nome || !nome.trim()) {
      return NextResponse.json({ error: 'O nome de utilizador é obrigatório.' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'O email é obrigatório.' }, { status: 400 });
    }

    const cleanNome = nome.trim();
    const cleanEmail = email.trim();

    // Carregar utilizador existente da BD
    const existingUser: any = await queryOne('SELECT * FROM tb_utilizadores WHERE id_utilizador = ?', [idNum]);
    if (!existingUser) {
      return NextResponse.json({ error: 'Utilizador não encontrado na base de dados.' }, { status: 404 });
    }

    // Verificar se email já existe noutro utilizador
    const checkEmail: any = await query(
      'SELECT id_utilizador FROM tb_utilizadores WHERE email = ? AND id_utilizador != ?',
      [cleanEmail, idNum]
    );
    if (checkEmail.length > 0) {
      return NextResponse.json({ error: 'Já existe outro utilizador registado com este endereço de email.' }, { status: 400 });
    }

    // Verificar CC noutro utilizador
    const cleanCc = cc && String(cc).trim() ? Number(String(cc).replace(/\D/g, '')) || null : null;
    if (cleanCc) {
      const checkCc: any = await query(
        'SELECT id_utilizador FROM tb_utilizadores WHERE numero_cc = ? AND id_utilizador != ?',
        [cleanCc, idNum]
      );
      if (checkCc.length > 0) {
        return NextResponse.json({ error: 'Já existe outro utilizador registado com este Cartão de Cidadão.' }, { status: 400 });
      }
    }

    // Verificar NIF noutro utilizador
    const cleanNif = nif && String(nif).trim() ? Number(String(nif).replace(/\D/g, '')) || null : null;
    if (cleanNif) {
      const checkNif: any = await query(
        'SELECT id_utilizador FROM tb_utilizadores WHERE nif = ? AND id_utilizador != ?',
        [cleanNif, idNum]
      );
      if (checkNif.length > 0) {
        return NextResponse.json({ error: 'Já existe outro utilizador registado com este NIF.' }, { status: 400 });
      }
    }

    // Sanitizar campos inteiros e de data
    const cleanTele = tele !== undefined && String(tele).trim() !== ''
      ? Number(String(tele).replace(/\D/g, '')) || 0
      : (existingUser.telemovel || 0);

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

    const cleanCargo = cargo !== undefined && cargo !== ''
      ? Number(cargo)
      : existingUser.cargo_id;

    const cleanTipoSocio = tipo_socio !== undefined && tipo_socio !== ''
      ? Number(tipo_socio) || 1
      : (existingUser.tipo_socio || 1);

    const cleanNumSocio = numero_socio !== undefined && String(numero_socio).trim() !== ''
      ? Number(numero_socio)
      : existingUser.numero_socio;

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
           SET nome_utilizador = ?, email = ?, telemovel = ?, numero_cc = ?, nif = ?, 
               data_nascimento = ?, instrumento = ?, genero_id = ?, cargo_id = ?, senha = ?,
               numero_socio = ?, tipo_socio = ?, morada = ?, area_residencia = ?, foto_perfil = ?
           WHERE id_utilizador = ?`,
          [
            cleanNome, cleanEmail, cleanTele, cleanCc, cleanNif, cleanData,
            cleanInstrumento, cleanGenero, cleanCargo, hashed,
            cleanNumSocio, cleanTipoSocio, cleanMorada, cleanArea, fotoBuffer, idNum
          ]
        );
      } else {
        await query(
          `UPDATE tb_utilizadores 
           SET nome_utilizador = ?, email = ?, telemovel = ?, numero_cc = ?, nif = ?, 
               data_nascimento = ?, instrumento = ?, genero_id = ?, cargo_id = ?, senha = ?,
               numero_socio = ?, tipo_socio = ?, morada = ?, area_residencia = ?
           WHERE id_utilizador = ?`,
          [
            cleanNome, cleanEmail, cleanTele, cleanCc, cleanNif, cleanData,
            cleanInstrumento, cleanGenero, cleanCargo, hashed,
            cleanNumSocio, cleanTipoSocio, cleanMorada, cleanArea, idNum
          ]
        );
      }
    } else {
      if (fotoBuffer) {
        await query(
          `UPDATE tb_utilizadores 
           SET nome_utilizador = ?, email = ?, telemovel = ?, numero_cc = ?, nif = ?, 
               data_nascimento = ?, instrumento = ?, genero_id = ?, cargo_id = ?,
               numero_socio = ?, tipo_socio = ?, morada = ?, area_residencia = ?, foto_perfil = ?
           WHERE id_utilizador = ?`,
          [
            cleanNome, cleanEmail, cleanTele, cleanCc, cleanNif, cleanData,
            cleanInstrumento, cleanGenero, cleanCargo,
            cleanNumSocio, cleanTipoSocio, cleanMorada, cleanArea, fotoBuffer, idNum
          ]
        );
      } else {
        await query(
          `UPDATE tb_utilizadores 
           SET nome_utilizador = ?, email = ?, telemovel = ?, numero_cc = ?, nif = ?, 
               data_nascimento = ?, instrumento = ?, genero_id = ?, cargo_id = ?,
               numero_socio = ?, tipo_socio = ?, morada = ?, area_residencia = ?
           WHERE id_utilizador = ?`,
          [
            cleanNome, cleanEmail, cleanTele, cleanCc, cleanNif, cleanData,
            cleanInstrumento, cleanGenero, cleanCargo,
            cleanNumSocio, cleanTipoSocio, cleanMorada, cleanArea, idNum
          ]
        );
      }
    }

    return NextResponse.json({ success: true, message: 'Utilizador atualizado com sucesso!' });
  } catch (err: any) {
    console.error('Erro ao atualizar utilizador:', err);
    return NextResponse.json({ error: err.message || 'Erro ao atualizar dados do utilizador.' }, { status: 400 });
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
    const hardDelete = searchParams.get('hard') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
    }

    if (Number(id) === admin.id) {
      return NextResponse.json({ error: 'Não é possível eliminar a sua própria conta de administrador.' }, { status: 400 });
    }

    if (hardDelete) {
      // Eliminação física
      await query('DELETE FROM tb_presencas WHERE musico_id = ?', [id]);
      await query('DELETE FROM tb_cota_mes WHERE socio_id = ?', [id]);
      await query('DELETE FROM tb_utilizadores WHERE id_utilizador = ?', [id]);
      return NextResponse.json({ success: true, message: 'Utilizador eliminado definitivamente.' });
    } else {
      // REGRA DE NEGÓCIO: Guardar dados de sócios inativos ou eliminados (tipo_socio = 7: Inativo)
      // Se o sócio estiver inativo, perde acesso ao site
      await query('UPDATE tb_utilizadores SET tipo_socio = 7 WHERE id_utilizador = ?', [id]);
      return NextResponse.json({ success: true, message: 'Utilizador desativado com sucesso (dados mantidos no histórico).' });
    }
  } catch (err: any) {
    console.error('Erro ao processar eliminação de utilizador:', err);
    return NextResponse.json({ error: err.message || 'Erro ao processar utilizador.' }, { status: 500 });
  }
}
