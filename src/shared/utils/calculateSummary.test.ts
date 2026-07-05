import { describe, it, expect } from 'vitest';
import { calculateSummary } from './calculateSummary';
import type { Movement } from '@/features/movements';

const movements: Movement[] = [
  {
    id: '1',
    categoryId: 'salary',
    amount: 5000,
    date: '2026-07-01T10:00:00.000Z',
    paymentMethodId: 'debit',
  },
  {
    id: '2',
    categoryId: 'food',
    amount: 1500,
    date: '2026-07-01T10:00:00.000Z',
    paymentMethodId: 'debit',
  },
  {
    id: '3',
    categoryId: 'transport',
    amount: 500,
    date: '2026-07-02T10:00:00.000Z',
    paymentMethodId: 'debit',
  },
];

describe('calculateSummary', () => {
  it('suma los ingresos y gastos por separado', () => {
    const result = calculateSummary(movements);

    expect(result.income).toBe(5000);
    expect(result.expense).toBe(2000);
  });

  it('calcula el balance como ingresos menos gastos', () => {
    const result = calculateSummary(movements);

    expect(result.balance).toBe(3000);
  });

  it('devuelve un balance negativo si los gastos superan a los ingresos', () => {
    const result = calculateSummary([
      {
        id: '1',
        categoryId: 'food',
        amount: 5000,
        date: '2026-07-01T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
      {
        id: '2',
        categoryId: 'salary',
        amount: 1000,
        date: '2026-07-01T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
    ]);

    expect(result.balance).toBe(-4000);
  });

  it('devuelve todo en cero sin movimientos', () => {
    expect(calculateSummary([])).toEqual({ income: 0, expense: 0, balance: 0 });
  });
});
