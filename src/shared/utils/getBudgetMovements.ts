import { getCategoryById } from '@/features/categories';
import type { Movement } from '@/features/movements';
import type { Budget } from '@/features/budgets';
import { getPeriodRange } from './getPeriodRange';
import { excludeCreditCardMovements } from './excludeCreditCardMovements';

function belongsToBudget(movement: Movement, budget: Budget): boolean {
  const category = getCategoryById(movement.categoryId);
  if (category?.type !== 'expense') return false;
  if (budget.categoryIds === null) return true;
  return budget.categoryIds.includes(movement.categoryId);
}

export function getBudgetMovements(
  budget: Budget,
  movements: Movement[],
  referenceDate: Date = new Date(),
): Movement[] {
  const { start, end } = getPeriodRange(budget.period, referenceDate);

  return excludeCreditCardMovements(movements).filter((m) => {
    const date = new Date(m.date);
    return date >= start && date <= end && belongsToBudget(m, budget);
  });
}
