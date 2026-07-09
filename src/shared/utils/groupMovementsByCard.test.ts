import { describe, it, expect } from 'vitest';
import { groupMovementsByCard } from './groupMovementsByCard';
import type { Movement } from '@/features/movements';
import type { CreditCard } from '@/features/credit-cards';

const cards: CreditCard[] = [
  { id: 'card-1', name: 'Tarjeta principal', closingDay: 15, isActive: true },
  { id: 'card-2', name: 'Visa', closingDay: 10, isActive: true },
];

const movements: Movement[] = [
  {
    id: '1',
    categoryId: 'food',
    amount: 100,
    date: '2026-07-05T10:00:00.000Z',
    paymentMethodId: 'card-1',
    statementPeriod: '2026-07',
  },
  {
    id: '2',
    categoryId: 'food',
    amount: 200,
    date: '2026-07-06T10:00:00.000Z',
    paymentMethodId: 'card-1',
    statementPeriod: '2026-07',
  },
  {
    id: '3',
    categoryId: 'transport',
    amount: 50,
    date: '2026-07-08T10:00:00.000Z',
    paymentMethodId: 'card-2',
    statementPeriod: '2026-07',
  },
];

describe('groupMovementsByCard', () => {
  it('agrupa los movimientos según la tarjeta a la que pertenecen', () => {
    const result = groupMovementsByCard(movements, cards);

    const card1Group = result.find((g) => g.card.id === 'card-1');
    expect(card1Group?.movements.map((m) => m.id)).toEqual(['1', '2']);
  });

  it('calcula el total gastado por tarjeta', () => {
    const result = groupMovementsByCard(movements, cards);

    expect(result.find((g) => g.card.id === 'card-1')?.total).toBe(300);
    expect(result.find((g) => g.card.id === 'card-2')?.total).toBe(50);
  });

  it('incluye tarjetas sin movimientos en el período, con total 0', () => {
    const result = groupMovementsByCard([], cards);

    expect(result).toHaveLength(2);
    expect(result.every((g) => g.total === 0)).toBe(true);
  });

  it('devuelve un array vacío si no hay tarjetas', () => {
    expect(groupMovementsByCard(movements, [])).toEqual([]);
  });
});
