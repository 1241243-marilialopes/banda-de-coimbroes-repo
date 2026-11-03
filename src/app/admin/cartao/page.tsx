import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import CartaoSocioCard from '@/components/CartaoSocioCard';

export const dynamic = 'force-dynamic';

const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default async function AdminCartaoPage() {
  const session = await getCurrentUser();

  if (!session || (session.cargo !== 0 && session.cargo !== 2)) {
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

  let birthDateFormatted = '—';
  if (u.data_nascimento) {
    try {
      if (u.data_nascimento instanceof Date) {
        birthDateFormatted = u.data_nascimento.toISOString().slice(0, 10);
      } else {
        birthDateFormatted = String(u.data_nascimento).slice(0, 10);
      }
    } catch {
      birthDateFormatted = String(u.data_nascimento).slice(0, 10);
    }
  }

  return (
    <DashboardLayout user={session} title="Cartão de Sócio">
      <div className="max-w-xl mx-auto py-8">
        <CartaoSocioCard
          numeroSocio={u.numero_socio || u.id_utilizador || session.id}
          nome={u.nome_utilizador || session.nome}
          dataNascimento={birthDateFormatted}
          idUtilizador={u.id_utilizador || session.id}
          isRegular={isRegular}
          mesCorrenteTexto={mesCorrenteTexto}
        />
      </div>
    </DashboardLayout>
  );
}
