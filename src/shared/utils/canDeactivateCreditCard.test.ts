import { describe, it, expect } from 'vitest';
import { canDeactivateCreditCard } from './canDeactivateCreditCard';
import type { Movement } from '@/features/movements';

const referenceDate = new Date('2026-07-15T12:00:00');

const movements: Movement[] = [
  {
    id: '1',
    categoryId: 'food',
    amount: 100,
    date: '2026-07-05T10:00:00.000Z',
    paymentMethodId: 'card-1',
    statementPeriod: '2026-06', // pasado
  },
  {
    id: '2',
    categoryId: 'food',
    amount: 100,
    date: '2026-07-05T10:00:00.000Z',
    paymentMethodId: 'card-2',
    statementPeriod: '2026-07', // mes actual
  },
  {
    id: '3',
    categoryId: 'food',
    amount: 100,
    date: '2026-07-05T10:00:00.000Z',
    paymentMethodId: 'card-3',
    statementPeriod: '2026-09', // futuro
  },
];

describe('canDeactivateCreditCard', () => {
  it('permite desactivar si solo tiene movimientos de períodos pasados', () => {
    expect(canDeactivateCreditCard('card-1', movements, referenceDate)).toBe(
      true,
    );
  });

  it('no permite desactivar si tiene movimientos del mes actual', () => {
    expect(canDeactivateCreditCard('card-2', movements, referenceDate)).toBe(
      false,
    );
  });

  it('no permite desactivar si tiene movimientos de meses futuros', () => {
    expect(canDeactivateCreditCard('card-3', movements, referenceDate)).toBe(
      false,
    );
  });

  it('permite desactivar una tarjeta sin movimientos asociados', () => {
    expect(canDeactivateCreditCard('card-4', movements, referenceDate)).toBe(
      true,
    );
  });
});
