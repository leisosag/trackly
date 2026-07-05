import { getCategoryById } from '@/features/categories';
import type { Movement } from '@/features/movements';
import type { Budget } from '@/features/budgets';
import { getPeriodRange } from './getPeriodRange';

function belongsToBudget(movement: Movement, budget: Budget): boolean {
  const category = getCategoryById(movement.categoryId);
  if (category?.type !== 'expense') return false;
  if (budget.categoryIds === null) return true; // presupuesto general: todas
  return budget.categoryIds.includes(movement.categoryId);
}

// Único punto donde se define qué movimientos pertenecen a un presupuesto (categoría + período seleccionado)
// Tanto calculateBudgetProgress como cualquier vista de detalle deben usar esta función en vez de reimplementar el criterio de filtrado.
export function getBudgetMovements(
  budget: Budget,
  movements: Movement[],
  referenceDate: Date = new Date(),
): Movement[] {
  const { start, end } = getPeriodRange(budget.period, referenceDate);

  return movements.filter((m) => {
    const date = new Date(m.date);
    return date >= start && date <= end && belongsToBudget(m, budget);
  });
}
