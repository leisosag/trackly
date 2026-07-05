import { useState } from 'react';
import { ReceiptIcon, PencilSimpleIcon } from '@phosphor-icons/react';
import { formatCurrency, cn, getBudgetMovements } from '@/shared/utils';
import type { BudgetProgress } from '../types';
import { useSelectedMonth } from '@/shared/context';
import { Modal } from '@/shared/components';
import { MovementList, type Movement } from '@/features/movements';

interface BudgetCardProps {
  progress: BudgetProgress;
  movements: Movement[];
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

export function BudgetCard({ progress, movements, onClick }: BudgetCardProps) {
  const { budget, spent, remaining, percentage, status } = progress;
  const barWidth = Math.min(percentage, 100);
  const { selectedDate } = useSelectedMonth();
  const [showMovements, setShowMovements] = useState(false);

  const budgetMovements = budget.isGeneral
    ? []
    : getBudgetMovements(budget, movements, selectedDate);

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl bg-neutral-50 dark:bg-mauve-800 p-4 text-left">
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

      <div className="grid grid-cols-2 gap-2 pt-1 sm:flex sm:justify-end">
        {!budget.isGeneral && (
          <button
            type="button"
            onClick={() => setShowMovements(true)}
            aria-label="ver movimientos"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-mauve-700 px-3 py-2 text-sm font-medium text-neutral-600 dark:text-mauve-200 hover:bg-neutral-200 dark:hover:bg-mauve-600/40 hover:cursor-pointer sm:w-auto"
          >
            <ReceiptIcon size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={onClick}
          aria-label="editar"
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-mauve-700 px-3 py-2 text-sm font-medium text-neutral-600 dark:text-mauve-200 hover:bg-neutral-200 dark:hover:bg-mauve-600/40 hover:cursor-pointer sm:w-auto',
            budget.isGeneral && 'col-span-2',
          )}
        >
          <PencilSimpleIcon size={16} />
        </button>
      </div>

      <Modal
        open={showMovements}
        onOpenChange={setShowMovements}
        title={`Movimientos de ${budget.name}`}
        className="dark:bg-mauve-950"
      >
        <MovementList movements={budgetMovements} />
      </Modal>
    </div>
  );
}
