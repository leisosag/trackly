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

  it('actualiza un movimiento existente', () => {
    const created = movementsRepository.create({
      categoryId: 'food',
      amount: 1500,
      date: '2026-07-01T12:00:00.000Z',
    });

    const updated = movementsRepository.update(created.id, {
      categoryId: 'food',
      amount: 2000,
      description: 'Corregido',
      date: '2026-07-01T12:00:00.000Z',
    });

    expect(updated?.amount).toBe(2000);
    expect(updated?.description).toBe('Corregido');
    expect(movementsRepository.getAll()).toHaveLength(1);
  });

  it('devuelve null al intentar actualizar un id inexistente', () => {
    const result = movementsRepository.update('id-fantasma', {
      categoryId: 'food',
      amount: 100,
      date: '2026-07-01',
    });

    expect(result).toBeNull();
  });

  it('elimina un movimiento por id', () => {
    const created = movementsRepository.create({
      categoryId: 'food',
      amount: 1500,
      date: '2026-07-01T12:00:00.000Z',
    });

    movementsRepository.remove(created.id);

    expect(movementsRepository.getAll()).toHaveLength(0);
  });

  it('no rompe si intenta eliminar un id inexistente', () => {
    movementsRepository.create({
      categoryId: 'food',
      amount: 100,
      date: '2026-07-01',
    });

    expect(() => movementsRepository.remove('id-fantasma')).not.toThrow();
    expect(movementsRepository.getAll()).toHaveLength(1);
  });
});
