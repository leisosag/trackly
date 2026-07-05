import { describe, it, expect } from 'vitest';
import { filterMovementsByPeriod } from './filterMovementsByPeriod';
import type { Movement } from '@/features/movements';

const referenceDate = new Date('2026-07-15T12:00:00');

const movements: Movement[] = [
  {
    id: '1',
    categoryId: 'food',
    amount: 800,
    date: '2026-07-01T10:00:00.000Z',
  },
  {
    id: '2',
    categoryId: 'salary',
    amount: 5000,
    date: '2026-07-31T23:59:00.000Z',
  },
  {
    id: '3',
    categoryId: 'transport',
    amount: 100,
    date: '2026-06-30T23:00:00.000Z',
  },
  {
    id: '4',
    categoryId: 'transport',
    amount: 100,
    date: '2026-08-01T10:00:00.000Z',
  },
];

describe('filterMovementsByPeriod', () => {
  it('incluye únicamente los movimientos del mes de referencia', () => {
    const result = filterMovementsByPeriod(movements, referenceDate);

    expect(result.map((m) => m.id)).toEqual(['1', '2']);
  });

  it('excluye movimientos de meses anteriores o posteriores', () => {
    const result = filterMovementsByPeriod(movements, referenceDate);

    expect(result.find((m) => m.id === '3')).toBeUndefined();
    expect(result.find((m) => m.id === '4')).toBeUndefined();
  });

  it('devuelve un array vacío si no hay movimientos en ese mes', () => {
    const result = filterMovementsByPeriod([], new Date('2026-07-15T12:00:00'));

    expect(result).toEqual([]);
  });
});
