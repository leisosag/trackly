export type BudgetPeriod = 'monthly'; // a futuro: 'weekly' | 'annual'

export interface Budget {
  id: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  categoryIds: string[] | null; // null = todas las categorías (presupuesto general)
  isGeneral: boolean;
}

export type BudgetStatus = 'ok' | 'warning' | 'exceeded';

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
}
