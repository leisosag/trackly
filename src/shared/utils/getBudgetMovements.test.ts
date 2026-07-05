import { describe, it, expect } from 'vitest';
import { getBudgetMovements } from './getBudgetMovements';
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
  {
    id: '4',
    categoryId: 'food',
    amount: 300,
    date: '2026-06-20T10:00:00.000Z',
    paymentMethodId: 'debit',
  },
];

describe('getBudgetMovements', () => {
  it('un presupuesto general incluye todos los gastos del período, sin importar la categoría', () => {
    const general: Budget = {
      id: 'g',
      name: 'General',
      amount: 1000,
      period: 'monthly',
      categoryIds: null,
      isGeneral: true,
    };

    const result = getBudgetMovements(general, movements, referenceDate);

    expect(result.map((m) => m.id)).toEqual(['1', '2']);
  });

  it('un presupuesto personalizado incluye solo movimientos de sus categorías', () => {
    const foodOnly: Budget = {
      id: 'f',
      name: 'Comida',
      amount: 1000,
      period: 'monthly',
      categoryIds: ['food'],
      isGeneral: false,
    };

    const result = getBudgetMovements(foodOnly, movements, referenceDate);

    expect(result.map((m) => m.id)).toEqual(['1']);
  });

  it('excluye movimientos fuera del período seleccionado', () => {
    const foodOnly: Budget = {
      id: 'f',
      name: 'Comida',
      amount: 1000,
      period: 'monthly',
      categoryIds: ['food'],
      isGeneral: false,
    };

    const result = getBudgetMovements(foodOnly, movements, referenceDate);

    expect(result.find((m) => m.id === '4')).toBeUndefined();
  });

  it('devuelve un array vacío si no hay movimientos que coincidan', () => {
    const budget: Budget = {
      id: 'b',
      name: 'Salud',
      amount: 1000,
      period: 'monthly',
      categoryIds: ['health'],
      isGeneral: false,
    };

    expect(getBudgetMovements(budget, movements, referenceDate)).toEqual([]);
  });
});
