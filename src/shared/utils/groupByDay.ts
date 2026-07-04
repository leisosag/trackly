import type { Movement } from '../../features/movements/types';
import { isoToInputValue } from './dateInput';

export interface MovementGroup {
  date: string; // "2026-07-01"
  movements: Movement[];
}

export function groupByDay(movements: Movement[]): MovementGroup[] {
  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const map = new Map<string, Movement[]>();

  for (const movement of sortedMovements) {
    const day = isoToInputValue(movement.date); // día local, no UTC crudo

    if (!map.has(day)) {
      map.set(day, []);
    }

    map.get(day)!.push(movement);
  }

  return Array.from(map.entries())
    .map(([date, movements]) => ({ date, movements }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
