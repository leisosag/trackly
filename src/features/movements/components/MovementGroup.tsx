import { MovementItem } from './MovementItem';
import type { MovementGroup as MovementGroupType } from '@/shared/utils';
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
  return (
    <div>
      <h3 className="px-4 py-2 text-sm font-medium capitalize text-neutral-500">
        {formatGroupDate(group.date)}
      </h3>
      <div className="divide-y divide-neutral-100">
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
