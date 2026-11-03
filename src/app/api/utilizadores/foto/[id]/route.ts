import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rows: any = await query('SELECT foto_perfil FROM tb_utilizadores WHERE id_utilizador = ?', [params.id]);
    const foto = rows[0]?.foto_perfil;
    if (!foto || !Buffer.isBuffer(foto) || foto.length === 0) {
      return NextResponse.redirect(new URL('/assets/utilizador.jpg', req.url));
    }
    return new NextResponse(new Uint8Array(foto), {
      headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-cache' },
    });
  } catch {
    return NextResponse.redirect(new URL('/assets/utilizador.jpg', req.url));
  }
}
