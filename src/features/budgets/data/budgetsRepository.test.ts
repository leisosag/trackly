import { describe, it, expect, beforeEach } from 'vitest';
import { budgetsRepository } from './budgetsRepository';

describe('budgetsRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devuelve un array vacío cuando no hay presupuestos guardados', () => {
    expect(budgetsRepository.getAll()).toEqual([]);
  });

  it('crea un presupuesto y lo persiste', () => {
    const created = budgetsRepository.create({
      name: 'Servicios',
      amount: 20000,
      period: 'monthly',
      categoryIds: ['home'],
      isGeneral: false,
    });

    expect(budgetsRepository.getAll()).toHaveLength(1);
    expect(created.id).toBeDefined();
  });

  it('no permite crear un segundo presupuesto general', () => {
    budgetsRepository.create({
      name: 'General',
      amount: 100000,
      period: 'monthly',
      categoryIds: null,
      isGeneral: true,
    });

    expect(() =>
      budgetsRepository.create({
        name: 'Otro general',
        amount: 50000,
        period: 'monthly',
        categoryIds: null,
        isGeneral: true,
      }),
    ).toThrow();
  });

  it('actualiza un presupuesto existente', () => {
    const created = budgetsRepository.create({
      name: 'Servicios',
      amount: 20000,
      period: 'monthly',
      categoryIds: ['home'],
      isGeneral: false,
    });

    const updated = budgetsRepository.update(created.id, {
      name: 'Servicios',
      amount: 25000,
      period: 'monthly',
      categoryIds: ['home'],
      isGeneral: false,
    });

    expect(updated?.amount).toBe(25000);
  });

  it('elimina un presupuesto por id', () => {
    const created = budgetsRepository.create({
      name: 'Servicios',
      amount: 20000,
      period: 'monthly',
      categoryIds: ['home'],
      isGeneral: false,
    });

    budgetsRepository.remove(created.id);

    expect(budgetsRepository.getAll()).toHaveLength(0);
  });
});
