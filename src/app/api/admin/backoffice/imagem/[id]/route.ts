import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const row: any = await queryOne(
      'SELECT imagem, nome_imagem FROM tb_backoffice_imagens WHERE id_imagem = ?',
      [id]
    );

    if (!row || !row.imagem) {
      return new NextResponse('Imagem não encontrada', { status: 404 });
    }

    const buffer = Buffer.from(row.imagem);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    console.error('Erro ao servir imagem de backoffice:', err);
    return new NextResponse('Erro interno', { status: 500 });
  }
}
