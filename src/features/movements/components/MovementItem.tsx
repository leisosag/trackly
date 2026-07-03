import { getCategoryById } from '@/features/categories';
import { formatCurrency, cn } from '@/shared/utils';
import type { Movement } from '../types';
import { CategoryIcon } from '@/shared/components';

interface MovementItemProps {
  movement: Movement;
  onClick?: (movement: Movement) => void;
}

export function MovementItem({ movement, onClick }: MovementItemProps) {
  const category = getCategoryById(movement.categoryId);
  const isIncome = category?.type === 'income';

  return (
    <button
      type="button"
      onClick={() => onClick?.(movement)}
      className="flex w-full items-center gap-3 px-2 py-3 text-left bg-neutral-50 hover:bg-neutral-100 dark:bg-mauve-800 dark:hover:bg-mauve-800/80 hover:cursor-pointer"
    >
      {category && <CategoryIcon category={category} />}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 dark:text-mauve-50">
          {category?.name ?? 'Sin categoría'}
        </p>
        {movement.description && (
          <p className="truncate text-sm text-neutral-500 dark:text-mauve-400">
            {movement.description}
          </p>
        )}
      </div>

      <span
        className={cn(
          'font-semibold dark:text-mauve-50',
          isIncome ? 'dark:text-emerald-400' : 'dark:text-rose-400',
        )}
      >
        {isIncome ? '+' : '-'}
        {formatCurrency(movement.amount)}
      </span>
    </button>
  );
}
