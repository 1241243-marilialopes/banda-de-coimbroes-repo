import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { nome, descricao, tipo, data_inicial, data_final, localizacao, contacto, responsavel, valor, cachet } = body;

    if (!nome || !data_inicial || !data_final) {
      return NextResponse.json({ error: 'Nome, data inicial e data final são obrigatórios.' }, { status: 400 });
    }

    const dInicio = new Date(data_inicial);
    const dFim = new Date(data_final);

    if (dFim < dInicio) {
      return NextResponse.json(
        { error: 'A data final tem de ser superior ou igual à data inicial.' },
        { status: 400 }
      );
    }

    const cachetVal =
      cachet !== undefined && cachet !== null && cachet !== ''
        ? Number(cachet)
        : valor !== undefined && valor !== null && valor !== ''
        ? Number(valor)
        : 0;

    const TYPE_COLORS: Record<number, string> = {
      1: '#2563eb', // Concerto
      2: '#dc2626', // Festa
      3: '#d97706', // Arruada
      4: '#059669', // Convívio
    };
    const color = TYPE_COLORS[Number(tipo)] || '#2563eb';

    const res: any = await query(
      `INSERT INTO tb_servicos 
       (nome_servico, descricao_servico, tipo, color, data_inicial, data_final, localizacao, cachet, contacto_comissao, nome_comissao) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        descricao || '',
        tipo ? Number(tipo) : 1,
        color,
        data_inicial,
        data_final,
        localizacao || '',
        cachetVal,
        contacto || '',
        responsavel || '',
      ]
    );

    const newId = res.insertId;

    // Se o serviço não for do tipo 4 (ex.: ensaio geral/evento interno), gerar registo de presenças para todos os músicos
    if (Number(tipo) !== 4) {
      const musicos: any = await query(
        "SELECT id_utilizador FROM tb_utilizadores WHERE cargo_id IN (1, 2)"
      );

      for (const m of musicos) {
        await query(
          `INSERT INTO tb_presencas 
           (musico_id, confirmado, servico_id, cor_botao_pagar, texto_pagar, cor_botao_confirma_musico, cor_musico_confirmado, musico_label_pago, cor_pago_musico, pago) 
           VALUES (?, 'Não confirmada', ?, 'danger', 'Pagar', 'warning', 'red', 'Por pagar', 'red', 0)`,
          [m.id_utilizador, newId]
        );
      }
    }

    return NextResponse.json({ success: true, id: newId });
  } catch (err: any) {
    console.error('Erro ao adicionar serviço:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id_servico, nome, descricao, tipo, data_inicial, data_final, localizacao, contacto, responsavel, valor, cachet } = body;

    if (!id_servico || !nome || !data_inicial || !data_final) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
    }

    const dInicio = new Date(data_inicial);
    const dFim = new Date(data_final);

    if (dFim < dInicio) {
      return NextResponse.json(
        { error: 'A data final tem de ser superior ou igual à data inicial.' },
        { status: 400 }
      );
    }

    const cachetVal =
      cachet !== undefined && cachet !== null && cachet !== ''
        ? Number(cachet)
        : valor !== undefined && valor !== null && valor !== ''
        ? Number(valor)
        : 0;

    const TYPE_COLORS: Record<number, string> = {
      1: '#2563eb', // Concerto
      2: '#dc2626', // Festa
      3: '#d97706', // Arruada
      4: '#059669', // Convívio
    };
    const color = TYPE_COLORS[Number(tipo)] || '#2563eb';

    await query(
      `UPDATE tb_servicos 
       SET nome_servico = ?, descricao_servico = ?, tipo = ?, color = ?, data_inicial = ?, data_final = ?, 
           localizacao = ?, cachet = ?, contacto_comissao = ?, nome_comissao = ?
       WHERE id_servico = ?`,
      [
        nome,
        descricao || '',
        tipo ? Number(tipo) : 1,
        color,
        data_inicial,
        data_final,
        localizacao || '',
        cachetVal,
        contacto || '',
        responsavel || '',
        id_servico,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro ao atualizar serviço:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
    }

    // Apagar presenças associadas primeiro
    await query('DELETE FROM tb_presencas WHERE servico_id = ?', [id]);
    // Apagar serviço
    await query('DELETE FROM tb_servicos WHERE id_servico = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro ao eliminar serviço:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
