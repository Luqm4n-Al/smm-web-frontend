'use client';

import { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { id } from 'date-fns/locale';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Event {
  date: Date;
  title: string;
  time?: string;
}

interface CustomCalendarProps {
  events: Event[];
  onSelectDate?: (date: Date) => void;
}

export function CustomCalendar({ events, onSelectDate }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Senin
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']; // Bisa disesuaikan

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    onSelectDate?.(day);
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {/* Header Bulan & Navigasi */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy', { locale: id })}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <FiChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Month
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <FiChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Grid Kalender */}
      <div className="grid grid-cols-7 gap-1">
        {/* Header Hari */}
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Cells */}
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const today = isToday(day);

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(day)}
              className={`
                relative flex min-h-20 cursor-pointer flex-col border border-gray-100 p-1 transition-colors hover:bg-gray-50
                ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'bg-white text-gray-900'}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <span
                className={`
                  inline-flex h-6 w-6 items-center justify-center rounded-full text-sm
                  ${today ? 'bg-blue-600 font-bold text-white' : ''}
                `}
              >
                {format(day, 'd')}
              </span>
              <div className="mt-1 space-y-0.5 overflow-hidden">
                {dayEvents.slice(0, 2).map((event, i) => (
                  <div
                    key={i}
                    className="truncate rounded bg-blue-100 px-1 py-0.5 text-[10px] font-medium text-blue-800"
                    title={event.title}
                  >
                    {event.time && `${event.time} `}{event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-gray-500">+{dayEvents.length - 2} lagi</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agenda Tanggal Terpilih */}
      {selectedEvents.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            Agenda {selectedDate && format(selectedDate, 'dd MMMM yyyy', { locale: id })}
          </h3>
          <ul className="space-y-2">
            {selectedEvents.map((event, idx) => (
              <li key={idx} className="rounded-md bg-gray-50 p-2 text-sm">
                <p className="font-medium">{event.title}</p>
                {event.time && <p className="text-xs text-gray-500">{event.time}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}