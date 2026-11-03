import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const id_utilizador = Number(formData.get('id_utilizador'));
    const foto = formData.get('foto') as File | null;

    if (!id_utilizador || !foto) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
    }

    // Only admin (cargo 0 or 2) or the user themselves
    const isAdmin = currentUser.cargo === 0 || currentUser.cargo === 2;
    if (!isAdmin && currentUser.id !== id_utilizador) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const arrayBuffer = await foto.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await query('UPDATE tb_utilizadores SET foto_perfil = ? WHERE id_utilizador = ?', [buffer, id_utilizador]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erro ao fazer upload da foto:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
