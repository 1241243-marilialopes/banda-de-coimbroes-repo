import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';

export const dynamic = 'force-dynamic';

const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default async function MusicoCartaoPage() {
  const session = await getCurrentUser();

  if (!session || (session.cargo !== 1 && session.cargo !== 2)) {
    redirect('/');
  }

  let userDetails: any = null;
  let isRegular = true;

  try {
    userDetails = await queryOne(
      `SELECT id_utilizador, nome_utilizador, email, numero_socio, data_nascimento, morada, area_residencia
       FROM tb_utilizadores WHERE id_utilizador = ?`,
      [session.id]
    );

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    // Verificar situação das quotas no ano corrente
    const cotaRows: any = await query(
      `SELECT c.ano, a.ano as ano_real,
              c.janeiro, c.fevereiro, c.marco, c.abril, c.maio, c.junho,
              c.julho, c.agosto, c.setembro, c.outubro, c.novembro, c.dezembro
       FROM tb_cota_mes c
       LEFT JOIN tb_ano a ON c.ano = a.id_ano
       WHERE c.socio_id = ?
       ORDER BY a.ano DESC`,
      [session.id]
    );

    if (cotaRows && cotaRows.length > 0) {
      const monthCols = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
                         'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      const currentRow = cotaRows.find((r: any) => Number(r.ano_real) === currentYear);
      if (currentRow) {
        const currentMonthPaid = currentRow[monthCols[currentMonth - 1]] === 1 || currentRow[monthCols[currentMonth - 1]] === '1';
        isRegular = !!currentMonthPaid;
      } else {
        isRegular = false;
      }
    } else {
      isRegular = false;
    }
  } catch (err) {
    console.warn('Erro ao carregar cartão:', err);
  }

  const u = userDetails || session;
  const now = new Date();
  const mesCorrenteTexto = `${MONTH_NAMES_PT[now.getMonth()]} ${now.getFullYear()}`;

  const birthDateFormatted = u.data_nascimento
    ? u.data_nascimento instanceof Date
      ? u.data_nascimento.toISOString().slice(0, 10)
      : String(u.data_nascimento).slice(0, 10)
    : '—';

  return (
    <DashboardLayout user={session} title="Cartão de Sócio">
      <div className="max-w-xl mx-auto py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200/80 shadow-md relative">
          <div className="flex items-start justify-between">
            <span className="text-base font-semibold text-neutral-500 tracking-wide">
              Cartão de Sócio
            </span>

            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`w-4 h-4 rounded-full inline-block shadow-sm ${
                  isRegular
                    ? 'bg-emerald-500 shadow-emerald-500/50'
                    : 'bg-amber-500 shadow-amber-500/50'
                }`}
                title={isRegular ? 'Quotas regularizadas' : 'Quotas em atraso'}
              />
              <span className="text-xs font-medium text-neutral-400">
                {mesCorrenteTexto}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-10 mt-8 mb-2">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-neutral-200 shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/utilizadores/foto/${u.id_utilizador || session.id}`}
                alt={u.nome_utilizador || session.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/img/utilizador.jpg';
                }}
              />
            </div>

            <div className="space-y-4 text-center sm:text-left flex-1">
              <div>
                <h4 className="text-base font-black text-neutral-900 tracking-tight">
                  Nº de Sócio
                </h4>
                <p className="text-sm text-neutral-700 font-medium mt-0.5">
                  {u.numero_socio || u.id_utilizador || session.id}
                </p>
              </div>

              <div>
                <h4 className="text-base font-black text-neutral-900 tracking-tight">
                  Nome
                </h4>
                <p className="text-sm text-neutral-700 font-medium mt-0.5">
                  {u.nome_utilizador || session.nome}
                </p>
              </div>

              <div>
                <h4 className="text-base font-black text-neutral-900 tracking-tight">
                  Data de Nascimento
                </h4>
                <p className="text-sm text-neutral-700 font-medium mt-0.5">
                  {birthDateFormatted}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
