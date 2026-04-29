'use client';

import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EXPLORER_DATE_SCOPE_A6, useSelectedDate } from '@/context/SelectedDateContext';
import { useCaptureDates } from '@/hooks/useCaptureDates';
import { cn } from '@/utils/cn';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function SidebarCalendar() {
  const { selectedDate, setDateForScope } = useSelectedDate();
  const { dates: captureDates } = useCaptureDates();
  const [cursor, setCursor] = useState<Date>(() =>
    selectedDate ? parseISO(selectedDate) : new Date(),
  );

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    const list: Date[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      list.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return list;
  }, [cursor]);

  const selected = selectedDate ? parseISO(selectedDate) : null;

  return (
    <div className="rounded-lg border border-base-800 bg-base-900/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor((d) => subMonths(d, 1))}
          className="grid h-7 w-7 place-items-center rounded-md text-[#8B949E] transition-colors hover:bg-base-800 hover:text-amber-500"
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="font-display text-sm font-semibold tracking-tight">
          {format(cursor, 'MMM yyyy')}
        </span>
        <button
          type="button"
          onClick={() => setCursor((d) => addMonths(d, 1))}
          className="grid h-7 w-7 place-items-center rounded-md text-[#8B949E] transition-colors hover:bg-base-800 hover:text-amber-500"
          aria-label="Next month"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((d, i) => (
          <span
            key={i}
            className="grid h-6 place-items-center font-mono text-[9px] uppercase tracking-wider text-[#484F58]"
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d) => {
          const ymd = format(d, 'yyyy-MM-dd');
          const inMonth = isSameMonth(d, cursor);
          const isSelected = selected && isSameDay(d, selected);
          const isCurrent = isToday(d);
          const hasMedia = captureDates.has(ymd);
          return (
            <button
              key={ymd}
              type="button"
              onClick={() => setDateForScope(EXPLORER_DATE_SCOPE_A6, ymd)}
              className={cn(
                'relative grid h-7 place-items-center rounded text-[10.5px] transition-colors',
                !inMonth && 'text-[#30363D]',
                inMonth && !isSelected && 'text-[#C9D1D9] hover:bg-base-800',
                isSelected && 'bg-amber-500 font-semibold text-base-950',
                !isSelected && isCurrent && 'ring-1 ring-amber-500/50',
              )}
            >
              {d.getDate()}
              {hasMedia && !isSelected && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
