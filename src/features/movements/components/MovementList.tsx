import { groupByDay } from '@/shared/utils';
import { MovementGroup } from './MovementGroup';
import type { Movement } from '../types';

interface MovementListProps {
  movements: Movement[];
  onMovementClick?: (movement: Movement) => void;
}

export function MovementList({
  movements,
  onMovementClick,
}: MovementListProps) {
  const groups = groupByDay(movements);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
        <p>Todavía no cargaste ningún movimiento</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <MovementGroup
          key={group.date}
          group={group}
          onMovementClick={onMovementClick}
        />
      ))}
    </div>
  );
}
