import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const type = formData.get('type') as string;

    if (type === 'imagem') {
      const id = formData.get('id') as string;
      const file = formData.get('imagem') as File | null;

      if (!id) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await query(
          'UPDATE tb_backoffice_imagens SET nome_imagem = ?, imagem = ? WHERE id_imagem = ?',
          [file.name, buffer, id]
        );
      }

      return NextResponse.json({ success: true, message: 'Elemento atualizado com sucesso.' });
    } else {
      const id = formData.get('id') as string;
      const conteudo = formData.get('conteudo') as string;

      if (!id) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
      }

      await query(
        'UPDATE tb_backoffice SET conteudo = ? WHERE id_elemento = ?',
        [conteudo || '', id]
      );

      return NextResponse.json({ success: true, message: 'Elemento atualizado com sucesso.' });
    }
  } catch (err: any) {
    console.error('Erro ao atualizar elemento de backoffice:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
