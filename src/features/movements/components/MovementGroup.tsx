import { MovementItem } from './MovementItem';
import type { MovementGroup as MovementGroupType } from '@/shared/utils';
import { calculateSummary, formatCurrency } from '@/shared/utils';
import type { Movement } from '../types';

interface MovementGroupProps {
  group: MovementGroupType;
  onMovementClick?: (movement: Movement) => void;
}

function formatGroupDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function MovementGroup({ group, onMovementClick }: MovementGroupProps) {
  const { income, expense } = calculateSummary(group.movements);

  return (
    <div className="px-4">
      <div className="flex items-start justify-between gap-2 p-2 rounded-t-lg bg-neutral-200 dark:bg-mauve-900">
        <h3 className="text-sm font-medium capitalize text-neutral-700 dark:text-mauve-50">
          {formatGroupDate(group.date)}
        </h3>
        <div className="flex flex-col gap-1 items-end text-xs text-neutral-500 dark:text-mauve-400">
          {income > 0 && <span>Ingresos: {formatCurrency(income)}</span>}
          {expense > 0 && <span>Gastos: {formatCurrency(expense)}</span>}
        </div>
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-mauve-500 overflow-hidden rounded-b-lg [&>*:last-child]:rounded-b-lg">
        {group.movements.map((movement) => (
          <MovementItem
            key={movement.id}
            movement={movement}
            onClick={onMovementClick}
          />
        ))}
      </div>
    </div>
  );
}
