import type { Movement } from '@/features/movements';
import { getPeriodRange } from './getPeriodRange';

export function filterMovementsByPeriod(
  movements: Movement[],
  referenceDate: Date = new Date(),
): Movement[] {
  const { start, end } = getPeriodRange('monthly', referenceDate);

  return movements.filter((movement) => {
    const date = new Date(movement.date);
    return date >= start && date <= end;
  });
}
