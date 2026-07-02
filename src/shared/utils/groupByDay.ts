import type { Movement } from '../../features/movements/types';
import { isoToInputValue } from './dateInput';

export interface MovementGroup {
  date: string; // "2026-07-01"
  movements: Movement[];
}

export function groupByDay(movements: Movement[]): MovementGroup[] {
  const map = new Map<string, Movement[]>();

  for (const movement of movements) {
    const day = isoToInputValue(movement.date); // día local, no UTC crudo
    const existing = map.get(day) ?? [];
    map.set(day, [...existing, movement]);
  }

  return Array.from(map.entries())
    .map(([date, movements]) => ({ date, movements }))
    .sort((a, b) => b.date.localeCompare(a.date)); // más reciente primero
}
