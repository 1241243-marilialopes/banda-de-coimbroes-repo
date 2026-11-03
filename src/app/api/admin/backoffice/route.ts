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
    const body = await req.json();
    const { tipo_id, novo_tipo, designacao, conteudo, nome_identificador } = body;

    let targetTipoId = tipo_id;

    // Se o utilizador está a criar uma nova secção principal (tipo de elemento)
    if (novo_tipo && novo_tipo.trim()) {
      const resultTipo = (await query(
        'INSERT INTO tb_tipos_elementos (tipo_elemento) VALUES (?)',
        [novo_tipo.trim()]
      )) as any;
      targetTipoId = resultTipo.insertId;
    }

    if (!targetTipoId) {
      return NextResponse.json({ error: 'Selecione ou indique uma secção válida.' }, { status: 400 });
    }

    const designacaoVal = designacao?.trim() || novo_tipo?.trim() || 'Nova Secção';
    const slugName = (nome_identificador || designacaoVal)
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, '_')
      .slice(0, 50);

    const result = (await query(
      'INSERT INTO tb_backoffice (nome_elemento, designacao_conteudo, conteudo, elemento_tipo) VALUES (?, ?, ?, ?)',
      [slugName, designacaoVal, conteudo || '', targetTipoId]
    )) as any;

    return NextResponse.json({
      success: true,
      message: 'Secção adicionada com sucesso.',
      id_elemento: result.insertId,
      id_tipo: targetTipoId,
    });
  } catch (err: any) {
    console.error('Erro ao adicionar secção no backoffice:', err);
    return NextResponse.json({ error: err.message || 'Erro ao criar secção' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'texto';

    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    if (type === 'imagem') {
      await query('DELETE FROM tb_backoffice_imagens WHERE id_imagem = ?', [id]);
    } else {
      await query('DELETE FROM tb_backoffice WHERE id_elemento = ?', [id]);
    }

    return NextResponse.json({ success: true, message: 'Elemento eliminado com sucesso.' });
  } catch (err: any) {
    console.error('Erro ao eliminar elemento:', err);
    return NextResponse.json({ error: err.message || 'Erro ao eliminar' }, { status: 500 });
  }
}

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
