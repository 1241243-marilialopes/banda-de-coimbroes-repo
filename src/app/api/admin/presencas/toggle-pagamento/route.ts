import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

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

    const rows: any = await query(
      'SELECT pago FROM tb_presencas WHERE id_presenca = ?',
      [id_presenca]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Presença não encontrada' }, { status: 404 });
    }

    const currentPago = rows[0].pago === 1 || rows[0].pago === '1';
    const nextPago = currentPago ? 0 : 1;
    const corBotao = nextPago === 1 ? 'success' : 'danger';
    const textoPagar = nextPago === 1 ? 'Pago' : 'Pagar';

    await query(
      `UPDATE tb_presencas 
       SET pago = ?, cor_botao_pagar = ?, texto_pagar = ?, musico_label_pago = ?, cor_pago_musico = ?
       WHERE id_presenca = ?`,
      [nextPago, corBotao, textoPagar, textoPagar, nextPago === 1 ? 'green' : 'red', id_presenca]
    );

    return NextResponse.json({ success: true, pago: nextPago });
  } catch (err: any) {
    console.error('Erro ao alternar pagamento de presença:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

