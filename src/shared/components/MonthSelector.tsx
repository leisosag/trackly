import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useSelectedMonth } from '@/shared/context';
import { cn } from '../utils';

function formatMonthLabel(date: Date): string {
  const label = new Intl.DateTimeFormat('es-AR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function MonthSelector() {
  const {
    selectedDate,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
  } = useSelectedMonth();

  return (
    <div className="flex items-center justify-between bg-neutral-900 px-4 py-2 dark:bg-mauve-800">
      <div className="invisible w-[47px]"></div>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={goToPreviousMonth}
          aria-label="Mes anterior"
          className="rounded-full p-1.5 text-neutral-400 hover:cursor-pointer hover:bg-white/10 dark:text-mauve-400 hover:text-white"
        >
          <CaretLeftIcon size={18} />
        </button>

        <span className="min-w-32 text-center text-sm font-medium text-mauve-400">
          {formatMonthLabel(selectedDate)}
        </span>

        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Mes siguiente"
          className="rounded-full p-1.5 text-neutral-400 hover:cursor-pointer hover:bg-white/10 dark:text-mauve-400 hover:text-white"
        >
          <CaretRightIcon size={18} />
        </button>
      </div>

      <button
        type="button"
        onClick={goToCurrentMonth}
        disabled={isCurrentMonth}
        className={cn(
          'rounded-full px-3 py-1 text-xs font-medium hover:cursor-pointer',
          isCurrentMonth
            ? 'invisible'
            : 'text-neutral-400 dark:text-mauve-400 hover:text-white hover:bg-white/10',
        )}
      >
        Hoy
      </button>
    </div>
  );
}
