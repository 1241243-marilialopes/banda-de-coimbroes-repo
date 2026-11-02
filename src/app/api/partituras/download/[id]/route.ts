import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const partitura: any = await queryOne(
      'SELECT nome_ficheiro, ficheiro_partitura FROM tb_partituras WHERE id_partitura = ?',
      [id]
    );

    if (!partitura || !partitura.ficheiro_partitura) {
      return new NextResponse('Ficheiro não encontrado', { status: 404 });
    }

    const buffer = Buffer.from(partitura.ficheiro_partitura);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(partitura.nome_ficheiro || 'partitura.pdf')}"`,
      },
    });
  } catch (err: any) {
    console.error('Erro ao transferir partitura:', err);
    return new NextResponse('Erro interno', { status: 500 });
  }
}

