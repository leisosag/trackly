import { describe, it, expect } from 'vitest';
import { filterMovementsByPaymentMethods } from './filterMovementsByPaymentMethods';
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
  },
  {
    id: '3',
    categoryId: 'salary',
    amount: 5000,
    date: '2026-07-01T10:00:00.000Z',
  },
];

describe('filterMovementsByPaymentMethods', () => {
  it('incluye únicamente los movimientos del medio de pago indicado', () => {
    const result = filterMovementsByPaymentMethods(movements, ['debit']);

    expect(result.map((m) => m.id)).toEqual(['1']);
  });

  it('combina varios medios de pago', () => {
    const result = filterMovementsByPaymentMethods(movements, [
      'debit',
      'default-card',
    ]);

    expect(result.map((m) => m.id)).toEqual(['1', '2']);
  });

  it('excluye movimientos sin paymentMethodId (ingresos)', () => {
    const result = filterMovementsByPaymentMethods(movements, [
      'debit',
      'default-card',
    ]);

    expect(result.find((m) => m.id === '3')).toBeUndefined();
  });

  it('devuelve un array vacío si ningún medio de pago matchea', () => {
    expect(filterMovementsByPaymentMethods(movements, ['cash'])).toEqual([]);
  });

  it('con paymentMethodIds vacío, devuelve un array vacío', () => {
    expect(filterMovementsByPaymentMethods(movements, [])).toEqual([]);
  });
});
