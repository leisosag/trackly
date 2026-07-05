import { describe, it, expect } from 'vitest';
import { groupByDay } from './groupByDay';
import type { Movement } from '../../features/movements/types';

const movements: Movement[] = [
  {
    id: '1',
    categoryId: 'food',
    amount: 100,
    date: '2026-07-01T10:00:00.000Z',
    paymentMethodId: 'debit',
  },
  {
    id: '2',
    categoryId: 'salary',
    amount: 5000,
    date: '2026-07-01T18:00:00.000Z',
    paymentMethodId: 'debit',
  },
  {
    id: '3',
    categoryId: 'transport',
    amount: 50,
    date: '2026-06-30T09:00:00.000Z',
    paymentMethodId: 'debit',
  },
];

describe('groupByDay', () => {
  it('agrupa movimientos del mismo día juntos y los ordena del más reciente al más viejo', () => {
    const result = groupByDay(movements);
    const julyGroup = result.find((g) => g.date === '2026-07-01');

    expect(julyGroup?.movements).toHaveLength(2);
    expect(julyGroup?.movements.map((m) => m.id)).toEqual(['2', '1']);
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

  it('agrupa según el día local, no el día crudo del string UTC', () => {
    // 23:00 hora Argentina (UTC-3) del 17/7 se guarda como 02:00 UTC del 18/7.
    // Debe agruparse en "17", no en "18".
    const lateNightMovement: Movement = {
      id: '4',
      categoryId: 'food',
      amount: 200,
      date: '2026-07-18T02:00:00.000Z',
      paymentMethodId: 'debit',
    };

    const result = groupByDay([lateNightMovement]);

    // Nota: este test asume que el entorno de test corre en UTC-3 (Argentina).
    // Si corre en otro huso horario, isoToInputValue también será consistente
    // con ese huso, así que el valor esperado podría variar en CI.
    expect(result[0].date).toBe('2026-07-17');
  });
});
