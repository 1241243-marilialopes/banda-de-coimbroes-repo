import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';

export const dynamic = 'force-dynamic';

export default async function MusicoContaPage() {
  const session = await getCurrentUser();

  if (!session || (session.cargo !== 1 && session.cargo !== 2)) {
    redirect('/');
  }

  let userDetails: any = null;

  try {
    userDetails = await queryOne(
      `SELECT u.id_utilizador, u.nome_utilizador, u.telemovel, u.numero_cc, u.nif, 
              u.data_nascimento, u.email, i.nome_instrumento, c.nome_cargo, g.genero
       FROM tb_utilizadores u
       LEFT JOIN tb_genero g ON u.genero_id = g.id_genero
       LEFT JOIN tb_cargo c ON u.cargo_id = c.id_cargo
       LEFT JOIN tb_instrumentos i ON u.instrumento = i.id_instrumento
       WHERE u.id_utilizador = ?`,
      [session.id]
    );
  } catch (err) {
    console.warn('Erro ao carregar perfil do músico:', err);
  }

  const u = userDetails || session;

  return (
    <DashboardLayout user={session} title="O Meu Perfil">
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Dados do Músico</h2>
          <p className="text-sm text-neutral-500">
            Ficha pessoal e identificação associada à banda
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
            <div className="w-16 h-16 rounded-full bg-red-600/10 text-red-600 border border-red-500/20 font-black text-2xl flex items-center justify-center">
              {u.nome_utilizador ? u.nome_utilizador.charAt(0).toUpperCase() : 'M'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">{u.nome_utilizador || u.nome}</h3>
              <p className="text-xs text-neutral-500">{u.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-red-600/10 text-red-600 font-bold rounded text-xs">
                {u.nome_instrumento || 'Músico'} • {u.nome_cargo || 'Músico & Sócio'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-xs text-neutral-400 block font-semibold uppercase">Telemóvel</span>
              <span className="font-bold text-neutral-800">{u.telemovel || '—'}</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-xs text-neutral-400 block font-semibold uppercase">Nº Cartão Cidadão</span>
              <span className="font-bold text-neutral-800">{u.numero_cc || '—'}</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-xs text-neutral-400 block font-semibold uppercase">NIF</span>
              <span className="font-bold text-neutral-800">{u.nif || '—'}</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-xs text-neutral-400 block font-semibold uppercase">Instrumento Ativo</span>
              <span className="font-bold text-neutral-800">{u.nome_instrumento || 'Geral'}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

