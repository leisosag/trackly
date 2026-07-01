import { describe, it, expect, beforeEach } from 'vitest';
import { movementsRepository } from './movementsRepository';

describe('movementsRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devuelve un array vacío cuando no hay movimientos guardados', () => {
    expect(movementsRepository.getAll()).toEqual([]);
  });

  it('crea un movimiento y lo persiste', () => {
    const created = movementsRepository.create({
      categoryId: 'food',
      amount: 1500,
      date: '2026-07-01T12:00:00.000Z',
    });

    expect(created.id).toBeDefined();

    const all = movementsRepository.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].categoryId).toBe('food');
  });

  it('acumula movimientos sin pisar los anteriores', () => {
    movementsRepository.create({
      categoryId: 'food',
      amount: 100,
      date: '2026-07-01',
    });
    movementsRepository.create({
      categoryId: 'salary',
      amount: 5000,
      date: '2026-07-02',
    });

    expect(movementsRepository.getAll()).toHaveLength(2);
  });
});
