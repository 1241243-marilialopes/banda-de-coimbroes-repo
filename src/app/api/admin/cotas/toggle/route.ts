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
    const { id_pagamento, mes, value } = await req.json();

    if (!id_pagamento || !mes) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const val = value ? 1 : 0;
    const monthOrder = [
      'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    if (mes !== 'ano_completo' && !monthOrder.includes(mes)) {
      return NextResponse.json({ error: 'Mês inválido' }, { status: 400 });
    }

    const updatedMonths: Record<string, number> = {};

    if (mes === 'ano_completo') {
      await query(
        `UPDATE tb_cota_mes 
         SET janeiro = ?, fevereiro = ?, marco = ?, abril = ?, maio = ?, junho = ?,
             julho = ?, agosto = ?, setembro = ?, outubro = ?, novembro = ?, dezembro = ?, ano_completo = ?
         WHERE id_pagamento = ?`,
        [val, val, val, val, val, val, val, val, val, val, val, val, val, id_pagamento]
      );
    } else {
      const idx = monthOrder.indexOf(mes);
      if (idx !== -1) {
        if (val === 1) {
          // REGRA DE NEGÓCIO: Ao clicar num mês para pagar (ex: Julho), preenche todos os meses desde Janeiro até esse mês inclusive
          const setClauses: string[] = [];
          for (let i = 0; i <= idx; i++) {
            setClauses.push(`${monthOrder[i]} = 1`);
          }
          await query(
            `UPDATE tb_cota_mes SET ${setClauses.join(', ')} WHERE id_pagamento = ?`,
            [id_pagamento]
          );
        } else {
          // Desmarcar desde o mês selecionado até Dezembro
          const setClauses: string[] = [];
          for (let i = idx; i < monthOrder.length; i++) {
            setClauses.push(`${monthOrder[i]} = 0`);
          }
          await query(
            `UPDATE tb_cota_mes SET ${setClauses.join(', ')} WHERE id_pagamento = ?`,
            [id_pagamento]
          );
        }

        // Recalcular com precisão se todos os 12 meses estão pagos
        await query(
          `UPDATE tb_cota_mes 
           SET ano_completo = CASE 
             WHEN (janeiro = 1 AND fevereiro = 1 AND marco = 1 AND abril = 1 AND maio = 1 AND junho = 1 AND 
                   julho = 1 AND agosto = 1 AND setembro = 1 AND outubro = 1 AND novembro = 1 AND dezembro = 1) 
             THEN 1 ELSE 0 END 
           WHERE id_pagamento = ?`,
          [id_pagamento]
        );
      }
    }

    // Consultar a linha guardada para garantir 100% de integridade com a BD
    const updatedRows: any = await query(
      'SELECT janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro, ano_completo FROM tb_cota_mes WHERE id_pagamento = ?',
      [id_pagamento]
    );

    const savedRow = updatedRows[0] || {};
    return NextResponse.json({
      success: true,
      message: 'Quota guardada com sucesso.',
      updatedMonths: savedRow,
    });
  } catch (err: any) {
    console.error('Erro ao atualizar cota:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
