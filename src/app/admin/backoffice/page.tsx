import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import BackofficeClient from './BackofficeClient';

export const dynamic = 'force-dynamic';

export default async function AdminBackofficePage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let tipos: any[] = [];
  let elementos: any[] = [];
  let imagens: any[] = [];

  try {
    tipos = (await query('SELECT id_tipo, tipo_elemento FROM tb_tipos_elementos ORDER BY id_tipo ASC')) as any[];
    elementos = (await query('SELECT id_elemento, designacao_conteudo, conteudo, elemento_tipo FROM tb_backoffice ORDER BY id_elemento ASC')) as any[];
    imagens = (await query('SELECT id_imagem, designacao_imagem, nome_imagem, conteudo_tipo FROM tb_backoffice_imagens ORDER BY id_imagem ASC')) as any[];
  } catch (err) {
    console.warn('Erro ao carregar dados de backoffice:', err);
  }

  return (
    <DashboardLayout user={user} title="Backoffice">
      <BackofficeClient
        tipos={tipos || []}
        elementos={elementos || []}
        imagens={imagens || []}
      />
    </DashboardLayout>
  );
}
