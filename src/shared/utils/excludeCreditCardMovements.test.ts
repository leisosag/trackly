import { describe, it, expect } from 'vitest';
import { excludeCreditCardMovements } from './excludeCreditCardMovements';
import type { Movement } from '@/features/movements';

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
    categoryId: 'shopping',
    amount: 100,
    date: '2026-07-06T10:00:00.000Z',
    paymentMethodId: 'default-card',
    statementPeriod: '2026-07',
    installment: { groupId: 'g1', number: 1, total: 1 },
  },
  {
    id: '3',
    categoryId: 'salary',
    amount: 5000,
    date: '2026-07-01T10:00:00.000Z',
  },
];

describe('excludeCreditCardMovements', () => {
  it('excluye los movimientos con statementPeriod definido (pagados con tarjeta de crédito)', () => {
    const result = excludeCreditCardMovements(movements);

    expect(result.map((m) => m.id)).toEqual(['1', '3']);
  });

  it('devuelve todos los movimientos si ninguno tiene statementPeriod', () => {
    const noCreditMovements = movements.filter((m) => m.id !== '2');
    expect(excludeCreditCardMovements(noCreditMovements)).toEqual(
      noCreditMovements,
    );
  });

  it('devuelve un array vacío si todos los movimientos son de crédito', () => {
    expect(excludeCreditCardMovements([movements[1]])).toEqual([]);
  });
});
