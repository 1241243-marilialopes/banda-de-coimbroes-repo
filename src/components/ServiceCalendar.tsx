'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  FileText,
  X,
  CreditCard,
  List,
  Grid,
} from 'lucide-react';

export interface CalendarEvent {
  id_servico: number;
  nome_servico: string;
  descricao_servico?: string;
  localizacao?: string;
  color?: string;
  data_inicial: string;
  data_final?: string;
  valor?: number | string;
}

interface ServiceCalendarProps {
  events: CalendarEvent[];
  isAdmin?: boolean;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function ServiceCalendar({ events, isAdmin = false }: ServiceCalendarProps) {
  const today = new Date();

  // Calcular o mês inicial com base nos eventos registados na base de dados
  const [currentDate, setCurrentDate] = useState(() => {
    if (!events || events.length === 0) {
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }

    const todayStr = today.toISOString().slice(0, 10);
    // Verificar se há eventos no mês atual
    const thisMonthEvents = events.filter((e) => {
      const d = new Date(e.data_inicial);
      return (
        !isNaN(d.getTime()) &&
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth()
      );
    });
    if (thisMonthEvents.length > 0) {
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }

    // Procura evento futuro mais próximo
    const futureEvent = events.find((e) => {
      const dStr = String(e.data_inicial).slice(0, 10);
      return dStr >= todayStr;
    });
    if (futureEvent) {
      const d = new Date(futureEvent.data_inicial);
      if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1);
    }

    // Se todos forem no passado, abre no mês do último evento registado na BD
    const lastEvent = events[events.length - 1];
    if (lastEvent) {
      const d = new Date(lastEvent.data_inicial);
      if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1);
    }

    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  function prevMonth() {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  }

  function goToToday() {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  // Obter dias do calendário
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Dia da semana do 1º dia (0 = Domingo, 1 = Segunda... -> converter para 0 = Segunda)
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays: {
    dayNumber: number;
    isCurrentMonth: boolean;
    dateStr: string;
    isToday: boolean;
  }[] = [];

  // Dias do mês anterior
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const m = currentMonth === 0 ? 12 : currentMonth;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: day,
      isCurrentMonth: false,
      dateStr,
      isToday: false,
    });
  }

  // Dias do mês atual
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isToday =
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === i;
    calendarDays.push({
      dayNumber: i,
      isCurrentMonth: true,
      dateStr,
      isToday,
    });
  }

  // Preencher os dias do mês seguinte para completar a grelha
  const totalSlots = Math.ceil(calendarDays.length / 7) * 7;
  const remainingDays = totalSlots - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    const m = currentMonth + 2 > 12 ? 1 : currentMonth + 2;
    const y = currentMonth + 2 > 12 ? currentYear + 1 : currentYear;
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({
      dayNumber: i,
      isCurrentMonth: false,
      dateStr,
      isToday: false,
    });
  }

  // Mapear eventos por data
  function getEventsForDate(dateStr: string) {
    return events.filter((ev) => {
      if (!ev.data_inicial) return false;
      const str = String(ev.data_inicial);
      const evDate = str.includes('T') ? str.split('T')[0] : str.split(' ')[0];
      return evDate === dateStr;
    });
  }

  return (
    <div className="w-full space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/10 text-red-600 rounded-xl">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 capitalize">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Total de {events.length} serviços registados na base de dados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-white shadow-xs text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Grelha mensal"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-bold transition ${
                viewMode === 'list'
                  ? 'bg-white shadow-xs text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title="Lista de todos os eventos"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3.5 py-1.5 text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition"
          >
            Hoje
          </button>

          <div className="flex items-center rounded-lg border border-neutral-200 bg-white">
            <button
              onClick={prevMonth}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-l-lg transition"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-r-lg transition border-l border-neutral-200"
              aria-label="Mês seguinte"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Month Grid */
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Weekday labels */}
          <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50/80 text-center">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className={`py-3 text-xs font-extrabold uppercase tracking-wider ${
                  idx >= 5 ? 'text-red-600' : 'text-neutral-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-neutral-200/70">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDate(day.dateStr);

              return (
                <div
                  key={idx}
                  className={`min-h-[105px] sm:min-h-[125px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors ${
                    !day.isCurrentMonth
                      ? 'bg-neutral-50/50 text-neutral-300'
                      : day.isToday
                      ? 'bg-red-50/30'
                      : 'hover:bg-neutral-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center justify-center text-xs font-bold rounded-full w-6 h-6 ${
                        day.isToday
                          ? 'bg-red-600 text-white shadow-xs'
                          : day.isCurrentMonth
                          ? 'text-neutral-800'
                          : 'text-neutral-400'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event pills on the day */}
                  <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                    {dayEvents.map((ev) => (
                      <button
                        key={ev.id_servico}
                        onClick={() => setSelectedEvent(ev)}
                        className="w-full text-left px-2 py-1 rounded-md text-[11px] font-bold truncate block transition hover:scale-[1.02] shadow-xs cursor-pointer"
                        style={{
                          backgroundColor: ev.color ? `${ev.color}20` : '#dc262615',
                          color: ev.color || '#b91c1c',
                          borderLeft: `3px solid ${ev.color || '#dc2626'}`,
                        }}
                      >
                        {ev.nome_servico}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List / Agenda View */
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-base font-bold text-neutral-900">
              Todos os Serviços Registados ({events.length})
            </h3>
          </div>

          {events.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6 text-center">Nenhum evento registado na base de dados.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {events.map((ev) => (
                <div
                  key={ev.id_servico}
                  onClick={() => setSelectedEvent(ev)}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50 px-3 rounded-xl transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: ev.color || '#dc2626' }}
                      ></span>
                      <h4 className="font-bold text-sm text-neutral-900">{ev.nome_servico}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        {ev.data_inicial}
                      </span>
                      {ev.localizacao && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          {ev.localizacao}
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="text-xs font-bold text-red-600 hover:underline">
                    Ver Detalhes →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalhes do Evento */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEvent(null);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-900 border border-neutral-200">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedEvent.color || '#dc2626' }}
              ></div>
              <h3 className="text-xl font-bold text-neutral-900">
                {selectedEvent.nome_servico}
              </h3>
            </div>

            <div className="space-y-4 text-sm divide-y divide-neutral-100 pt-2">
              <div className="flex items-start gap-3 pt-2">
                <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold uppercase text-neutral-400">
                    Data e Horário
                  </span>
                  <p className="font-semibold text-neutral-800">
                    Início: {selectedEvent.data_inicial || '—'}
                  </p>
                  {selectedEvent.data_final && (
                    <p className="text-neutral-600 text-xs mt-0.5">
                      Fim: {selectedEvent.data_final}
                    </p>
                  )}
                </div>
              </div>

              {selectedEvent.localizacao && (
                <div className="flex items-start gap-3 pt-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-neutral-400">
                      Localização
                    </span>
                    <p className="font-semibold text-neutral-800">{selectedEvent.localizacao}</p>
                  </div>
                </div>
              )}

              {selectedEvent.descricao_servico && (
                <div className="flex items-start gap-3 pt-3">
                  <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-neutral-400">
                      Descrição
                    </span>
                    <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.descricao_servico}
                    </p>
                  </div>
                </div>
              )}

              {isAdmin && selectedEvent.valor && (
                <div className="flex items-start gap-3 pt-3">
                  <CreditCard className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-neutral-400">
                      Cachet / Valor
                    </span>
                    <p className="font-bold text-emerald-600 text-base">
                      {selectedEvent.valor} €
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-100 text-right">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg transition text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
