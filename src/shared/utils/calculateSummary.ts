import { getCategoryById } from '@/features/categories';
import type { Movement } from '@/features/movements';

export interface Summary {
  balance: number;
  income: number;
  expense: number;
}

export function calculateSummary(movements: Movement[]): Summary {
  let income = 0;
  let expense = 0;

  for (const movement of movements) {
    const category = getCategoryById(movement.categoryId);
    if (category?.type === 'income') {
      income += movement.amount;
    } else {
      expense += movement.amount;
    }
  }

  return {
    income,
    expense,
    balance: income - expense,
  };
}
