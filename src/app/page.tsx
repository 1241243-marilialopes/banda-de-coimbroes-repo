import { query } from '@/lib/db';
import HomeClient from './HomeClient';

interface BackofficeItem {
  id_elemento: number;
  nome_elemento: string;
  conteudo: string;
}

interface ImageItem {
  id_imagem: number;
  ordem: string;
  imagem: Buffer | null;
  nome_imagem: string;
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const contentMap: Record<string, string> = {};
  const imageMap: Record<string, string> = {};

  try {
    const textRows = await query<BackofficeItem>('SELECT nome_elemento, conteudo FROM tb_backoffice');
    textRows.forEach((row) => {
      contentMap[row.nome_elemento] = row.conteudo;
    });

    const imgRows = await query<ImageItem>('SELECT ordem, imagem FROM tb_backoffice_imagens');
    imgRows.forEach((row) => {
      if (row.imagem) {
        imageMap[row.ordem] = `data:image/jpeg;base64,${Buffer.from(row.imagem).toString('base64')}`;
      }
    });
  } catch (err) {
    console.warn('Base de dados não disponível no momento. A utilizar dados padrão.', err);
  }

  return <HomeClient contentMap={contentMap} imageMap={imageMap} />;
}

