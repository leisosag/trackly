import type { BudgetPeriod } from '@/features/budgets';

export function getPeriodRange(
  period: BudgetPeriod,
  referenceDate: Date = new Date(),
): { start: Date; end: Date } {
  switch (period) {
    case 'monthly':
    default: {
      const start = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        1,
      );
      const end = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      return { start, end };
    }
  }
}
