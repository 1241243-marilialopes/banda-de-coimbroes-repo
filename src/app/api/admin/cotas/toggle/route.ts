import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

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
    const allowedMonths = [
      'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
      'ano_completo'
    ];

    if (!allowedMonths.includes(mes)) {
      return NextResponse.json({ error: 'Mês inválido' }, { status: 400 });
    }

    if (mes === 'ano_completo') {
      await query(
        `UPDATE tb_cota_mes 
         SET janeiro = ?, fevereiro = ?, marco = ?, abril = ?, maio = ?, junho = ?,
             julho = ?, agosto = ?, setembro = ?, outubro = ?, novembro = ?, dezembro = ?, ano_completo = ?
         WHERE id_pagamento = ?`,
        [val, val, val, val, val, val, val, val, val, val, val, val, val, id_pagamento]
      );
    } else {
      await query(
        `UPDATE tb_cota_mes SET ${mes} = ? WHERE id_pagamento = ?`,
        [val, id_pagamento]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro ao atualizar cota:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

