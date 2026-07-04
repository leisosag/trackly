import { formatCurrency, cn } from '@/shared/utils';
import type { BudgetProgress } from '../types';

interface BudgetCardProps {
  progress: BudgetProgress;
  onClick?: () => void;
}

const STATUS_LABELS: Record<BudgetProgress['status'], string> = {
  ok: 'Dentro del límite',
  warning: 'Cercano al límite',
  exceeded: 'Excedido',
};

const STATUS_BAR_COLORS: Record<BudgetProgress['status'], string> = {
  ok: 'bg-emerald-400',
  warning: 'bg-amber-400',
  exceeded: 'bg-red-500',
};

const STATUS_TEXT_COLORS: Record<BudgetProgress['status'], string> = {
  ok: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  exceeded: 'text-red-600 dark:text-rose-400',
};

export function BudgetCard({ progress, onClick }: BudgetCardProps) {
  const { budget, spent, remaining, percentage, status } = progress;
  const barWidth = Math.min(percentage, 100);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-2 rounded-xl bg-neutral-50 dark:bg-mauve-800 p-4 text-left hover:bg-neutral-100 dark:hover:bg-mauve-800/80 hover:cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <p className="font-medium text-neutral-900 dark:text-mauve-50">
          {budget.name}
        </p>
        <span className={cn('text-xs font-medium', STATUS_TEXT_COLORS[status])}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-mauve-700">
        <div
          className={cn('h-full rounded-full', STATUS_BAR_COLORS[status])}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-neutral-500 dark:text-mauve-400">
        <span>{formatCurrency(spent)} gastado</span>
        <span>{formatCurrency(remaining)} restante</span>
      </div>

      <p className="text-xs text-neutral-400 dark:text-mauve-500">
        Asignado: {formatCurrency(budget.amount)} · {Math.round(percentage)}%
      </p>
    </button>
  );
}
