import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const { id_presenca } = await req.json();

    if (!id_presenca) {
      return NextResponse.json({ error: 'ID de presença inválido' }, { status: 400 });
    }

    const row: any = await queryOne(
      'SELECT id_presenca, confirmado, pago FROM tb_presencas WHERE id_presenca = ?',
      [id_presenca]
    );

    if (!row) {
      return NextResponse.json({ error: 'Presença não encontrada' }, { status: 404 });
    }

    const isConfirmed = row.confirmado === 'Confirmada';
    const nextConfirmado = isConfirmed ? 'Não confirmada' : 'Confirmada';
    const nextCor = isConfirmed ? 'red' : 'green';
    const nextBotao = isConfirmed ? 'warning' : 'success';

    await query(
      `UPDATE tb_presencas 
       SET confirmado = ?, cor_musico_confirmado = ?, cor_botao_confirma_musico = ?
       WHERE id_presenca = ?`,
      [nextConfirmado, nextCor, nextBotao, id_presenca]
    );

    return NextResponse.json({
      success: true,
      confirmado: nextConfirmado,
      message: `Presença alterada para "${nextConfirmado}".`,
    });
  } catch (err: any) {
    console.error('Erro ao alternar presença:', err);
    return NextResponse.json({ error: err.message || 'Erro ao alternar presença.' }, { status: 500 });
  }
}

