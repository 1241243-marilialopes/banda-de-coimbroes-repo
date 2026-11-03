import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import ServiceCalendar, { CalendarEvent } from '@/components/ServiceCalendar';

export const dynamic = 'force-dynamic';

function serializeDate(val: any): string {
  if (!val) return '';
  if (val instanceof Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(val.getDate())}T${pad(val.getHours())}:${pad(val.getMinutes())}:${pad(val.getSeconds())}`;
  }
  return String(val);
}

export default async function SocioCalendarioPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  let rawEvents: any[] = [];

  const TYPE_COLORS: Record<number, string> = {
    1: '#2563eb', // Concerto (Azul)
    2: '#dc2626', // Festa (Vermelho)
    3: '#d97706', // Arruada (Laranja)
    4: '#059669', // Convívio (Verde)
  };

  try {
    rawEvents = (await query(
      'SELECT id_servico, nome_servico, descricao_servico, tipo, color, data_inicial, data_final, localizacao FROM tb_servicos ORDER BY data_inicial ASC'
    )) as any[];
  } catch (err) {
    console.warn('Erro ao carregar calendário do sócio:', err);
  }

  const events: CalendarEvent[] = (rawEvents || []).map((ev) => ({
    id_servico: ev.id_servico,
    nome_servico: ev.nome_servico,
    descricao_servico: ev.descricao_servico || '',
    color: TYPE_COLORS[Number(ev.tipo)] || ev.color || '#2563eb',
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
