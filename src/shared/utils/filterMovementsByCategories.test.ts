import { describe, it, expect } from 'vitest';
import { filterMovementsByCategories } from './filterMovementsByCategories';
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

describe('filterMovementsByCategories', () => {
  it('incluye únicamente los movimientos de la categoría indicada', () => {
    const result = filterMovementsByCategories(movements, ['food']);

    expect(result.map((m) => m.id)).toEqual(['1']);
  });

  it('combina varias categorías, incluyendo mezcla de ingreso y gasto', () => {
    const result = filterMovementsByCategories(movements, ['food', 'salary']);

    expect(result.map((m) => m.id)).toEqual(['1', '3']);
  });

  it('devuelve un array vacío si ninguna categoría matchea', () => {
    expect(filterMovementsByCategories(movements, ['health'])).toEqual([]);
  });

  it('con categoryIds vacío, devuelve un array vacío (ningún movimiento pertenece a un set vacío)', () => {
    expect(filterMovementsByCategories(movements, [])).toEqual([]);
  });

  it('no filtra por período: devuelve movimientos de cualquier fecha si la categoría matchea', () => {
    const otherMonthMovement: Movement = {
      id: '4',
      categoryId: 'food',
      amount: 300,
      date: '2026-01-01T10:00:00.000Z',
      paymentMethodId: 'debit',
    };

    const result = filterMovementsByCategories(
      [...movements, otherMonthMovement],
      ['food'],
    );

    expect(result.map((m) => m.id)).toEqual(['1', '4']);
  });
});
