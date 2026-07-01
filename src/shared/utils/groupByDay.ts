import type { Movement } from '../../features/movements/types';

export interface MovementGroup {
  date: string; // "2026-07-01"
  movements: Movement[];
}

export function groupByDay(movements: Movement[]): MovementGroup[] {
  const map = new Map<string, Movement[]>();

  for (const movement of movements) {
    const day = movement.date.slice(0, 10); // "2026-07-01T..." -> "2026-07-01"
    const existing = map.get(day) ?? [];
    map.set(day, [...existing, movement]);
  }

  return Array.from(map.entries())
    .map(([date, movements]) => ({ date, movements }))
    .sort((a, b) => b.date.localeCompare(a.date)); // más reciente primero
}
