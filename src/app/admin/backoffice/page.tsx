import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { FileEdit, Image as ImageIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminBackofficePage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let elementos: any[] = [];

  try {
    elementos = await query(
      'SELECT id_elemento, nome_elemento, conteudo FROM tb_backoffice ORDER BY id_elemento ASC'
    );
  } catch (err) {
    console.warn('Erro ao carregar elementos de backoffice:', err);
  }

  return (
    <DashboardLayout user={user} title="Backoffice do Website">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Gestão de Conteúdos Públicos</h2>
          <p className="text-sm text-neutral-500">
            Textos e informações exibidos na página inicial e nas secções públicas do website
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {elementos.map((item) => (
              <div key={item.id_elemento} className="p-4 sm:p-5 space-y-1.5 hover:bg-neutral-50/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded">
                    {item.nome_elemento}
                  </span>
                  <span className="text-xs text-neutral-400">ID #{item.id_elemento}</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 font-medium line-clamp-3 leading-relaxed">
                  {item.conteudo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

