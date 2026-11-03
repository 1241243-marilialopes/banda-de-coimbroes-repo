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
      for (const m of monthOrder) {
        updatedMonths[m] = val;
      }
      updatedMonths['ano_completo'] = val;

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
            updatedMonths[monthOrder[i]] = 1;
          }
          if (idx === 11) {
            setClauses.push(`ano_completo = 1`);
            updatedMonths['ano_completo'] = 1;
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
            updatedMonths[monthOrder[i]] = 0;
          }
          setClauses.push(`ano_completo = 0`);
          updatedMonths['ano_completo'] = 0;
          await query(
            `UPDATE tb_cota_mes SET ${setClauses.join(', ')} WHERE id_pagamento = ?`,
            [id_pagamento]
          );
        }
      }
    }

    return NextResponse.json({ success: true, updatedMonths });
  } catch (err: any) {
    console.error('Erro ao atualizar cota:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
