import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const partitura: any = await queryOne(
      `SELECT np.nome_partitura, p.ficheiro_partitura, p.nome_ficheiro 
       FROM tb_partituras p
       INNER JOIN tb_nome_partituras np ON p.nome = np.id_nome_partitura
       WHERE p.id_partitura = ?`,
      [id]
    );

    if (!partitura || !partitura.ficheiro_partitura) {
      return new NextResponse('Ficheiro não encontrado na base de dados.', { status: 404 });
    }

    const buffer = Buffer.from(partitura.ficheiro_partitura);
    const fileName = partitura.nome_ficheiro || `${partitura.nome_partitura || 'partitura'}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error('Erro ao transferir partitura:', err);
    return new NextResponse('Erro interno ao obter partitura', { status: 500 });
  }
}
