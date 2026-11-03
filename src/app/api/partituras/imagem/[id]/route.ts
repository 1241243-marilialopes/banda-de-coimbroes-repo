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
      'SELECT imagem_partitura FROM tb_partituras WHERE id_partitura = ?',
      [id]
    );

    if (!partitura || !partitura.imagem_partitura) {
      return new NextResponse('Imagem não encontrada', { status: 404 });
    }

    const buffer = Buffer.from(partitura.imagem_partitura);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    console.error('Erro ao transferir imagem da partitura:', err);
    return new NextResponse('Erro interno', { status: 500 });
  }
}
