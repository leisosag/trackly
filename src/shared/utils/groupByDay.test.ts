import { describe, it, expect } from 'vitest';
import { groupByDay } from './groupByDay';
import type { Movement } from '../../features/movements/types';

const movements: Movement[] = [
  {
    id: '1',
    categoryId: 'food',
    amount: 100,
    date: '2026-07-01T10:00:00.000Z',
  },
  {
    id: '2',
    categoryId: 'salary',
    amount: 5000,
    date: '2026-07-01T18:00:00.000Z',
  },
  {
    id: '3',
    categoryId: 'transport',
    amount: 50,
    date: '2026-06-30T09:00:00.000Z',
  },
];

describe('groupByDay', () => {
  it('agrupa movimientos del mismo día juntos', () => {
    const result = groupByDay(movements);
    const julyGroup = result.find((g) => g.date === '2026-07-01');

    expect(julyGroup?.movements).toHaveLength(2);
  });

  it('separa movimientos de días distintos en grupos distintos', () => {
    const result = groupByDay(movements);

    expect(result).toHaveLength(2);
  });

  it('ordena los grupos del más reciente al más viejo', () => {
    const result = groupByDay(movements);

    expect(result[0].date).toBe('2026-07-01');
    expect(result[1].date).toBe('2026-06-30');
  });

  it('devuelve un array vacío si no hay movimientos', () => {
    expect(groupByDay([])).toEqual([]);
  });
});
