import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import ServiceCalendar, { CalendarEvent } from '@/components/ServiceCalendar';

export const dynamic = 'force-dynamic';

function serializeDate(val: any): string {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

export default async function SocioCalendarioPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  let rawEvents: any[] = [];

  try {
    rawEvents = (await query(
      'SELECT id_servico, nome_servico, descricao_servico, color, data_inicial, data_final, localizacao FROM tb_servicos ORDER BY data_inicial ASC'
    )) as any[];
  } catch (err) {
    console.warn('Erro ao carregar calendário do sócio:', err);
  }

  const events: CalendarEvent[] = (rawEvents || []).map((ev) => ({
    id_servico: ev.id_servico,
    nome_servico: ev.nome_servico,
    descricao_servico: ev.descricao_servico || '',
    color: ev.color || '#dc2626',
    data_inicial: serializeDate(ev.data_inicial),
    data_final: ev.data_final ? serializeDate(ev.data_final) : undefined,
    localizacao: ev.localizacao || '',
  }));

  return (
    <DashboardLayout user={user} title="Calendário de Atuações">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Agenda de Concertos e Romarias</h2>
          <p className="text-sm text-neutral-500">
            Acompanhe as atuações e eventos públicos da Sociedade Musical 1º de Agosto
          </p>
        </div>

        <ServiceCalendar events={events} isAdmin={false} />
      </div>
    </DashboardLayout>
  );
}
