import { getCategoryById } from '@/features/categories';
import type { Movement } from '@/features/movements';
import type { Budget, BudgetProgress, BudgetStatus } from '@/features/budgets';
import { getPeriodRange } from './getPeriodRange';

const WARNING_THRESHOLD = 0.8;

function belongsToBudget(movement: Movement, budget: Budget): boolean {
  const category = getCategoryById(movement.categoryId);
  if (category?.type !== 'expense') return false;
  if (budget.categoryIds === null) return true; // presupuesto general: todas
  return budget.categoryIds.includes(movement.categoryId);
}

export function calculateBudgetProgress(
  budget: Budget,
  movements: Movement[],
  referenceDate: Date = new Date(),
): BudgetProgress {
  const { start, end } = getPeriodRange(budget.period, referenceDate);

  const spent = movements
    .filter((m) => {
      const date = new Date(m.date);
      return date >= start && date <= end && belongsToBudget(m, budget);
    })
    .reduce((total, m) => total + m.amount, 0);

  const remaining = budget.amount - spent;
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

  let status: BudgetStatus = 'ok';
  if (percentage >= 100) status = 'exceeded';
  else if (percentage >= WARNING_THRESHOLD * 100) status = 'warning';

  return { budget, spent, remaining, percentage, status };
}
