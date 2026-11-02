import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Music, Download, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MusicoCadernetaPage() {
  const user = await getCurrentUser();

  if (!user || (user.cargo !== 1 && user.cargo !== 2)) {
    redirect('/');
  }

  let partituras: any[] = [];
  let instrumentName = 'Geral';

  try {
    if (user.instrumento) {
      const inst: any = await query(
        'SELECT nome_instrumento FROM tb_instrumentos WHERE id_instrumento = ?',
        [user.instrumento]
      );
      if (inst.length > 0) instrumentName = inst[0].nome_instrumento;

      partituras = await query(
        `SELECT p.id_partitura, np.nome_partitura as nome_obra, p.nome_ficheiro 
         FROM tb_partituras p
         LEFT JOIN tb_nome_partituras np ON p.nome = np.id_nome
         WHERE p.instrumento = ? 
         ORDER BY np.nome_partitura ASC`,
        [user.instrumento]
      );
    }
  } catch (err) {
    console.warn('Erro ao carregar caderneta:', err);
  }

  return (
    <DashboardLayout user={user} title={`Caderneta de Partituras (${instrumentName})`}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Partituras Atribuídas</h2>
          <p className="text-sm text-neutral-500">
            Material de ensaio e estudo musical para {instrumentName}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
          {partituras.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 space-y-2">
              <BookOpen className="w-12 h-12 mx-auto text-neutral-400" />
              <p className="font-bold text-neutral-800">Sem partituras atribuídas</p>
              <p className="text-xs text-neutral-500">
                Ainda não foram associadas partituras ao seu instrumento.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {partituras.map((p) => (
                <div
                  key={p.id_partitura}
                  className="p-4 flex items-center justify-between hover:bg-neutral-50/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">
                        {p.nome_obra || p.nome_ficheiro}
                      </h4>
                      <span className="text-xs text-neutral-500">
                        {p.nome_ficheiro || 'Ficheiro PDF'}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`/api/partituras/download/${p.id_partitura}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
