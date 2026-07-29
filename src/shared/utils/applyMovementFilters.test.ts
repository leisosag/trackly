import { describe, it, expect } from 'vitest';
import { applyMovementFilters } from './applyMovementFilters';
import type { Movement, MovementFilters } from '@/features/movements';

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
    categoryId: 'food',
    amount: 300,
    date: '2026-07-06T10:00:00.000Z',
    paymentMethodId: 'default-card',
  },
  {
    id: '3',
    categoryId: 'shopping',
    amount: 500,
    date: '2026-07-07T10:00:00.000Z',
    paymentMethodId: 'default-card',
  },
  {
    id: '4',
    categoryId: 'salary',
    amount: 5000,
    date: '2026-07-01T10:00:00.000Z',
  },
];

const EMPTY_FILTERS: MovementFilters = {
  categoryIds: [],
  paymentMethodIds: [],
};

describe('applyMovementFilters', () => {
  it('sin filtros activos, devuelve todos los movimientos tal cual', () => {
    const result = applyMovementFilters(movements, EMPTY_FILTERS);

    expect(result).toEqual(movements);
  });

  it('con solo categoryIds, filtra únicamente por categoría', () => {
    const result = applyMovementFilters(movements, {
      categoryIds: ['food'],
      paymentMethodIds: [],
    });

    expect(result.map((m) => m.id)).toEqual(['1', '2']);
  });

  it('con solo paymentMethodIds, trae movimientos de esa tarjeta sin importar la categoría', () => {
    const result = applyMovementFilters(movements, {
      categoryIds: [],
      paymentMethodIds: ['default-card'],
    });

    expect(result.map((m) => m.id)).toEqual(['2', '3']);
  });

  it('con ambas dimensiones activas, devuelve la intersección (filtra más en detalle)', () => {
    const result = applyMovementFilters(movements, {
      categoryIds: ['food'],
      paymentMethodIds: ['default-card'],
    });

    expect(result.map((m) => m.id)).toEqual(['2']);
  });

  it('devuelve un array vacío si la combinación de filtros no matchea ningún movimiento', () => {
    const result = applyMovementFilters(movements, {
      categoryIds: ['shopping'],
      paymentMethodIds: ['debit'],
    });

    expect(result).toEqual([]);
  });
});
