import { describe, it, expect } from 'vitest';
import { getBudgetMovements } from './getBudgetMovements';
import type { Budget } from '@/features/budgets';
import type { Movement } from '@/features/movements';
import { getCreditCardMovements } from './getCreditCardMovements';
import { calculateBudgetProgress } from './calculateBudgetProgress';

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
  it.each([false, true])('imputa solo la cuota del resumen seleccionado (general: %s)', (isGeneral) => {
    const budget: Budget = {
      id: 'b', name: 'Presupuesto', amount: 1000, period: 'monthly',
      categoryIds: isGeneral ? null : ['food'], isGeneral,
    };
    const installments: Movement[] = ['2026-12', '2027-01', '2027-02'].map((period, index) => ({
      id: `installment-${index}`, categoryId: 'food', amount: 200,
      date: '2026-12-20T10:00:00.000Z', paymentMethodId: 'default-card',
      statementPeriod: period,
      installment: { groupId: 'purchase', number: index + 1, total: 3 },
    }));

    for (const [index, period] of ['2026-12', '2027-01', '2027-02'].entries()) {
      const selectedDate = new Date(2026, 11 + index, 15);
      expect(getBudgetMovements(budget, installments, selectedDate)).toEqual(
        getCreditCardMovements(installments, period),
      );
      expect(calculateBudgetProgress(budget, installments, selectedDate).spent).toBe(200);
    }
    expect(getBudgetMovements(budget, installments, new Date(2027, 2, 15))).toEqual([]);
  });

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

  it('incluye una compra con tarjeta de crédito en el mes de su resumen', () => {
    const foodOnly: Budget = {
      id: 'f',
      name: 'Comida',
      amount: 1000,
      period: 'monthly',
      categoryIds: ['food'],
      isGeneral: false,
    };

    const creditMovement: Movement = {
      id: '5',
      categoryId: 'food',
      amount: 400,
      date: '2026-07-10T10:00:00.000Z',
      paymentMethodId: 'default-card',
      statementPeriod: '2026-07',
      installment: { groupId: 'g1', number: 1, total: 1 },
    };

    const result = getBudgetMovements(
      foodOnly,
      [creditMovement],
      referenceDate,
    );

    expect(result.map((m) => m.id)).toEqual(['5']);
  });
});
