import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { UserCheck, Trash2, Mail, Phone, Calendar, Music } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminInscricoesPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 0 && user.cargo !== 2)) {
    redirect('/');
  }

  let inscricoes: any[] = [];

  try {
    inscricoes = await query(
      `SELECT i.id_inscricao, i.nome, i.telemovel, i.numero_cc, i.nif, 
              i.data_nascimento, i.email, inst.nome_instrumento, g.genero
       FROM tb_inscricoes i
       LEFT JOIN tb_genero g ON i.genero_id = g.id_genero
       LEFT JOIN tb_instrumentos inst ON i.instrumento = inst.id_instrumento
       ORDER BY i.id_inscricao DESC`
    );
  } catch (err) {
    console.warn('Erro ao carregar inscrições:', err);
  }

  return (
    <DashboardLayout user={user} title="Aprovar Inscrições">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Candidaturas de Novos Sócios</h2>
          <p className="text-sm text-neutral-500">
            {inscricoes.length} candidaturas submetidas através do formulário do website
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
          {inscricoes.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 space-y-2">
              <UserCheck className="w-12 h-12 mx-auto text-neutral-400" />
              <p className="font-bold text-neutral-800">Sem inscrições pendentes</p>
              <p className="text-xs text-neutral-500">
                Todas as candidaturas submetidas já foram analisadas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-700">
                <thead className="bg-neutral-50 text-xs uppercase font-extrabold text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-3.5 px-4">Candidato</th>
                    <th className="py-3.5 px-4">Contactos</th>
                    <th className="py-3.5 px-4">Documentação</th>
                    <th className="py-3.5 px-4">Instrumento</th>
                    <th className="py-3.5 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {inscricoes.map((item) => (
                    <tr key={item.id_inscricao} className="hover:bg-neutral-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">{item.nome}</div>
                        <div className="text-xs text-neutral-500">Género: {item.genero || '—'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-neutral-700">
                          <Mail className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{item.email}</span>
                        </div>
                        {item.telemovel && (
                          <div className="flex items-center gap-1.5 text-neutral-500">
                            <Phone className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{item.telemovel}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-neutral-600">
                        <div>CC: {item.numero_cc || '—'}</div>
                        <div>NIF: {item.nif || '—'}</div>
                        <div>Nasc.: {item.data_nascimento || '—'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-semibold text-neutral-800">
                        <div className="flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5 text-red-600" />
                          <span>{item.nome_instrumento || 'Geral'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                          Recebida
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

