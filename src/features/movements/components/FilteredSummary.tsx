import { XIcon } from '@phosphor-icons/react';
import {
  calculateSummary,
  formatCurrency,
  formatMovementFiltersDescription,
} from '@/shared/utils';
import type { Movement, MovementFilters } from '../types';

interface FilteredSummaryProps {
  movements: Movement[];
  filters: MovementFilters;
  onClear: () => void;
}

export function FilteredSummary({
  movements,
  filters,
  onClear,
}: FilteredSummaryProps) {
  const { income, expense, balance } = calculateSummary(movements);
  const { categoryLabel, paymentMethodLabel } =
    formatMovementFiltersDescription(filters);

  return (
    <div className="flex flex-col gap-1.5 bg-neutral-100 dark:bg-mauve-900 px-4 py-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 text-neutral-600 dark:text-mauve-300">
          {categoryLabel && <p>{categoryLabel}</p>}
          {paymentMethodLabel && <p>{paymentMethodLabel}</p>}
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Quitar filtro"
          className="shrink-0 rounded-full p-1 text-neutral-400 hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-mauve-700/40 hover:text-neutral-600 dark:text-mauve-400 dark:hover:text-mauve-50"
        >
          <XIcon size={14} />
        </button>
      </div>

      <p className="text-neutral-500 dark:text-mauve-400">
        Ingreso: {formatCurrency(income)} · Gasto: {formatCurrency(expense)} ·
        Balance: {formatCurrency(balance)}
      </p>
    </div>
  );
}
