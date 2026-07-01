import { createElement } from 'react';
import { getCategoryById } from '@/features/categories';
import { getIcon, formatCurrency, cn } from '@/shared/utils';
import type { Movement } from '../types';

interface MovementItemProps {
  movement: Movement;
}

export function MovementItem({ movement }: MovementItemProps) {
  const category = getCategoryById(movement.categoryId);
  const icon = createElement(getIcon(category?.icon ?? ''), {
    size: 20,
    className: 'text-neutral-600',
  });
  const isIncome = category?.type === 'income';

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          isIncome ? 'bg-emerald-100' : 'bg-red-100',
        )}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900">
          {category?.name ?? 'Sin categoría'}
        </p>
        {movement.description && (
          <p className="truncate text-sm text-neutral-500">
            {movement.description}
          </p>
        )}
      </div>

      <span className="font-semibold">
        {isIncome ? '+' : '-'}
        {formatCurrency(movement.amount)}
      </span>
    </div>
  );
}
