import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 1 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const { id_presenca } = await req.json();

    if (!id_presenca) {
      return NextResponse.json({ error: 'ID de presença inválido' }, { status: 400 });
    }

    const presenca: any = await queryOne(
      `SELECT p.id_presenca, p.confirmado, p.servico_id, s.data_final 
       FROM tb_presencas p
       INNER JOIN tb_servicos s ON p.servico_id = s.id_servico
       WHERE p.id_presenca = ? AND p.musico_id = ?`,
      [id_presenca, user.id]
    );

    if (!presenca) {
      return NextResponse.json({ error: 'Registo de presença não encontrado' }, { status: 404 });
    }

    const isCurrentlyConfirmed = presenca.confirmado === 'Confirmada';
    const nextConfirmado = isCurrentlyConfirmed ? 'Não confirmada' : 'Confirmada';
    const corBotao = nextConfirmado === 'Confirmada' ? 'success' : 'warning';
    const corTexto = nextConfirmado === 'Confirmada' ? 'green' : 'red';

    await query(
      `UPDATE tb_presencas 
       SET confirmado = ?, cor_botao_confirma_musico = ?, cor_musico_confirmado = ?
       WHERE id_presenca = ?`,
      [nextConfirmado, corBotao, corTexto, id_presenca]
    );

    return NextResponse.json({
      success: true,
      confirmado: nextConfirmado,
      message:
        nextConfirmado === 'Confirmada'
          ? 'Presença confirmada com sucesso!'
          : 'Presença desmarcada com sucesso.',
    });
  } catch (err: any) {
    console.error('Erro ao marcar presença do músico:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
