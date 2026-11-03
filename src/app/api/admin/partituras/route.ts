import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const nomePartitura = (formData.get('nome_partitura') as string) || '';
    const idNomePartitura = formData.get('id_nome_partitura') as string | null;
    const instrumento = formData.get('instrumento') as string | null;
    const ficheiro = formData.get('ficheiro') as File | null;
    const imagem = formData.get('imagem') as File | null;

    if (!nomePartitura.trim()) {
      return NextResponse.json({ error: 'O nome da partitura / peça é obrigatório.' }, { status: 400 });
    }
    if (!instrumento) {
      return NextResponse.json({ error: 'O instrumento é obrigatório.' }, { status: 400 });
    }
    if (!ficheiro || ficheiro.size === 0) {
      return NextResponse.json({ error: 'O ficheiro PDF da partitura é obrigatório.' }, { status: 400 });
    }

    // 1. Obter ou criar o registo em tb_nome_partituras
    let finalNomeId: number;
    if (idNomePartitura && Number(idNomePartitura) > 0) {
      finalNomeId = Number(idNomePartitura);
    } else {
      const existingName: any = await queryOne(
        'SELECT id_nome_partitura FROM tb_nome_partituras WHERE LOWER(nome_partitura) = LOWER(?)',
        [nomePartitura.trim()]
      );
      if (existingName) {
        finalNomeId = existingName.id_nome_partitura;
      } else {
        const ins: any = await query(
          'INSERT INTO tb_nome_partituras (nome_partitura) VALUES (?)',
          [nomePartitura.trim()]
        );
        finalNomeId = ins.insertId;
      }
    }

    // 2. Processar ficheiro PDF
    const pdfBuffer = Buffer.from(await ficheiro.arrayBuffer());
    const nomeFicheiro = ficheiro.name || `${nomePartitura.trim()}.pdf`;

    // 3. Processar imagem da capa se fornecida
    let imgBuffer: Buffer | null = null;
    let nomeImagem = 'partitura.jpg';
    if (imagem && imagem.size > 0) {
      imgBuffer = Buffer.from(await imagem.arrayBuffer());
      nomeImagem = imagem.name || 'capa.jpg';
    }

    // 4. Inserir na tabela tb_partituras
    const res: any = await query(
      `INSERT INTO tb_partituras 
       (nome, nome_ficheiro, imagem_partitura, ficheiro_partitura, instrumento, nome_imagem)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        finalNomeId,
        nomeFicheiro,
        imgBuffer,
        pdfBuffer,
        Number(instrumento),
        nomeImagem,
      ]
    );

    return NextResponse.json({ success: true, id: res.insertId, message: 'Partitura adicionada com sucesso!' });
  } catch (err: any) {
    console.error('Erro ao adicionar partitura:', err);
    return NextResponse.json({ error: err.message || 'Erro ao gravar partitura.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const idPartitura = formData.get('id_partitura') as string;
    const nomePartitura = (formData.get('nome_partitura') as string) || '';
    const idNomePartitura = formData.get('id_nome_partitura') as string | null;
    const instrumento = formData.get('instrumento') as string | null;
    const ficheiro = formData.get('ficheiro') as File | null;
    const imagem = formData.get('imagem') as File | null;

    if (!idPartitura) {
      return NextResponse.json({ error: 'ID de partitura inválido.' }, { status: 400 });
    }

    const existing: any = await queryOne('SELECT * FROM tb_partituras WHERE id_partitura = ?', [idPartitura]);
    if (!existing) {
      return NextResponse.json({ error: 'Partitura não encontrada.' }, { status: 404 });
    }

    // Resolver ID de nome da peça
    let finalNomeId = existing.nome;
    if (nomePartitura.trim()) {
      if (idNomePartitura && Number(idNomePartitura) > 0) {
        finalNomeId = Number(idNomePartitura);
      } else {
        const existingName: any = await queryOne(
          'SELECT id_nome_partitura FROM tb_nome_partituras WHERE LOWER(nome_partitura) = LOWER(?)',
          [nomePartitura.trim()]
        );
        if (existingName) {
          finalNomeId = existingName.id_nome_partitura;
        } else {
          const ins: any = await query(
            'INSERT INTO tb_nome_partituras (nome_partitura) VALUES (?)',
            [nomePartitura.trim()]
          );
          finalNomeId = ins.insertId;
        }
      }
    }

    const finalInstrumento = instrumento ? Number(instrumento) : existing.instrumento;

    // Verificar se novo PDF foi enviado
    if (ficheiro && ficheiro.size > 0) {
      const pdfBuffer = Buffer.from(await ficheiro.arrayBuffer());
      const nomeFicheiro = ficheiro.name || `${nomePartitura || 'partitura'}.pdf`;
      await query(
        'UPDATE tb_partituras SET ficheiro_partitura = ?, nome_ficheiro = ? WHERE id_partitura = ?',
        [pdfBuffer, nomeFicheiro, idPartitura]
      );
    }

    // Verificar se nova Imagem foi enviada
    if (imagem && imagem.size > 0) {
      const imgBuffer = Buffer.from(await imagem.arrayBuffer());
      const nomeImagem = imagem.name || 'capa.jpg';
      await query(
        'UPDATE tb_partituras SET imagem_partitura = ?, nome_imagem = ? WHERE id_partitura = ?',
        [imgBuffer, nomeImagem, idPartitura]
      );
    }

    // Atualizar nome e instrumento
    await query(
      'UPDATE tb_partituras SET nome = ?, instrumento = ? WHERE id_partitura = ?',
      [finalNomeId, finalInstrumento, idPartitura]
    );

    return NextResponse.json({ success: true, message: 'Partitura atualizada com sucesso!' });
  } catch (err: any) {
    console.error('Erro ao atualizar partitura:', err);
    return NextResponse.json({ error: err.message || 'Erro ao atualizar partitura.' }, { status: 500 });
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

    if (!id) {
      return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
    }

    await query('DELETE FROM tb_partituras WHERE id_partitura = ?', [id]);
    return NextResponse.json({ success: true, message: 'Partitura eliminada com sucesso!' });
  } catch (err: any) {
    console.error('Erro ao eliminar partitura:', err);
    return NextResponse.json({ error: err.message || 'Erro ao eliminar partitura.' }, { status: 500 });
  }
}
