import { XIcon } from '@phosphor-icons/react';
import { getCategoryById } from '@/features/categories';
import { calculateSummary, formatCurrency } from '@/shared/utils';
import type { Movement } from '../types';

interface FilteredSummaryProps {
  movements: Movement[]; // ya filtrados por categoría
  categoryIds: string[];
  onClear: () => void;
}

const MAX_VISIBLE_NAMES = 3;

function formatCategoryNames(categoryIds: string[]): string {
  const names = categoryIds
    .map((id) => getCategoryById(id)?.name)
    .filter((name): name is string => Boolean(name));

  if (names.length <= MAX_VISIBLE_NAMES) return names.join(', ');

  const visible = names.slice(0, MAX_VISIBLE_NAMES);
  const remaining = names.length - MAX_VISIBLE_NAMES;
  return `${visible.join(', ')} +${remaining} más`;
}

export function FilteredSummary({
  movements,
  categoryIds,
  onClear,
}: FilteredSummaryProps) {
  const { income, expense, balance } = calculateSummary(movements);

  return (
    <div className="flex flex-col gap-1.5 bg-neutral-100 dark:bg-mauve-900 px-4 py-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-neutral-600 dark:text-mauve-300">
          {formatCategoryNames(categoryIds)}
        </p>
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
