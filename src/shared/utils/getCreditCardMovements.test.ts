import { describe, it, expect } from 'vitest';
import { getCreditCardMovements } from './getCreditCardMovements';
import type { Movement } from '@/features/movements';

const movements: Movement[] = [
  {
    id: '1',
    categoryId: 'food',
    amount: 100,
    date: '2026-07-05T10:00:00.000Z',
    paymentMethodId: 'default-card',
    statementPeriod: '2026-07',
    installment: { groupId: 'g1', number: 1, total: 1 },
  },
  {
    id: '2',
    categoryId: 'food',
    amount: 200,
    date: '2026-07-06T10:00:00.000Z',
    paymentMethodId: 'debit',
  },
  {
    id: '3',
    categoryId: 'transport',
    amount: 300,
    date: '2026-06-20T10:00:00.000Z',
    paymentMethodId: 'default-card',
    statementPeriod: '2026-08',
  },
];

describe('getCreditCardMovements', () => {
  it('incluye solo movimientos con statementPeriod igual al período pedido', () => {
    const result = getCreditCardMovements(movements, '2026-07');

    expect(result.map((m) => m.id)).toEqual(['1']);
  });

  it('excluye movimientos sin statementPeriod (medios de pago que no son crédito)', () => {
    const result = getCreditCardMovements(movements, '2026-07');

    expect(result.find((m) => m.id === '2')).toBeUndefined();
  });

  it('excluye movimientos de crédito de otro período', () => {
    const result = getCreditCardMovements(movements, '2026-07');

    expect(result.find((m) => m.id === '3')).toBeUndefined();
  });

  it('devuelve un array vacío si no hay movimientos para ese período', () => {
    expect(getCreditCardMovements(movements, '2099-01')).toEqual([]);
  });
});
