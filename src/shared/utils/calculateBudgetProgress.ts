import type { Movement } from '@/features/movements';
import type { Budget, BudgetProgress, BudgetStatus } from '@/features/budgets';
import { getBudgetMovements } from './getBudgetMovements';

const WARNING_THRESHOLD = 0.8;

export function calculateBudgetProgress(
  budget: Budget,
  movements: Movement[],
  referenceDate: Date = new Date(),
): BudgetProgress {
  const spent = getBudgetMovements(budget, movements, referenceDate).reduce(
    (total, m) => total + m.amount,
    0,
  );

  const remaining = budget.amount - spent;
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

  let status: BudgetStatus = 'ok';
  if (percentage >= 100) status = 'exceeded';
  else if (percentage >= WARNING_THRESHOLD * 100) status = 'warning';

  return { budget, spent, remaining, percentage, status };
}
