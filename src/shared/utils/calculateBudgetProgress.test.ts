import { describe, it, expect } from 'vitest';
import { calculateBudgetProgress } from './calculateBudgetProgress';
import type { Budget } from '@/features/budgets';
import type { Movement } from '@/features/movements';

const referenceDate = new Date('2026-07-15T12:00:00');

const movements: Movement[] = [
  {
    id: '1',
    categoryId: 'food',
    amount: 800,
    date: '2026-07-05T10:00:00.000Z',
    paymentMethodId: 'debit',
  },
  {
    id: '2',
    categoryId: 'transport',
    amount: 100,
    date: '2026-07-06T10:00:00.000Z',
    paymentMethodId: 'debit',
  },
  {
    id: '3',
    categoryId: 'salary',
    amount: 5000,
    date: '2026-07-01T10:00:00.000Z',
  },
];

describe('calculateBudgetProgress', () => {
  it('un presupuesto general suma todos los gastos, sin importar la categoría', () => {
    const general: Budget = {
      id: 'g',
      name: 'General',
      amount: 1000,
      period: 'monthly',
      categoryIds: null,
      isGeneral: true,
    };

    const result = calculateBudgetProgress(general, movements, referenceDate);

    expect(result.spent).toBe(900); // food + transport, no salary
  });

  it('un presupuesto personalizado solo suma las categorías seleccionadas', () => {
    const foodOnly: Budget = {
      id: 'f',
      name: 'Comida',
      amount: 1000,
      period: 'monthly',
      categoryIds: ['food'],
      isGeneral: false,
    };

    const result = calculateBudgetProgress(foodOnly, movements, referenceDate);

    expect(result.spent).toBe(800);
    expect(result.remaining).toBe(200);
  });

  it('devuelve estado "ok" por debajo del 80% de uso', () => {
    const budget: Budget = {
      id: 'b',
      name: 'Test',
      amount: 2000,
      period: 'monthly',
      categoryIds: ['food'],
      isGeneral: false,
    };
    expect(
      calculateBudgetProgress(budget, movements, referenceDate).status,
    ).toBe('ok');
  });

  it('devuelve estado "warning" entre 80% y 100% de uso', () => {
    const budget: Budget = {
      id: 'b',
      name: 'Test',
      amount: 900,
      period: 'monthly',
      categoryIds: ['food'],
      isGeneral: false,
    };
    expect(
      calculateBudgetProgress(budget, movements, referenceDate).status,
    ).toBe('warning');
  });

  it('devuelve estado "exceeded" al superar el 100% de uso', () => {
    const budget: Budget = {
      id: 'b',
      name: 'Test',
      amount: 500,
      period: 'monthly',
      categoryIds: ['food'],
      isGeneral: false,
    };
    expect(
      calculateBudgetProgress(budget, movements, referenceDate).status,
    ).toBe('exceeded');
  });
});
