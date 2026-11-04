import { describe, it, expect, beforeEach } from 'vitest';
import { budgetsRepository } from './budgetsRepository';
import type { Budget } from '../types';

describe('budgetsRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devuelve un array vacÃ­o cuando no hay presupuestos guardados', () => {
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

  const food: Omit<Budget, 'id'> = {
    name: 'Comida', amount: 100000, period: 'monthly',
    categoryIds: ['food'], isGeneral: false,
  };

  it('copia el mes anterior y aísla las ediciones y eliminaciones por mes', () => {
    const november = budgetsRepository.create(food, '2026-11');
    const december = budgetsRepository.getAll('2026-12')[0];
    expect(december.amount).toBe(100000);
    expect(december.id).not.toBe(november.id);

    budgetsRepository.update(december.id, { ...food, amount: 120000 }, '2026-12');
    expect(budgetsRepository.getAll('2026-11')).toEqual([november]);
    expect(budgetsRepository.getAll('2026-12')[0].amount).toBe(120000);
    expect(budgetsRepository.getAll('2027-01')[0].amount).toBe(120000);

    budgetsRepository.remove(december.id, '2026-12');
    expect(budgetsRepository.getAll('2026-12')).toEqual([]);
    expect(budgetsRepository.getAll('2026-11')).toEqual([november]);
    expect(budgetsRepository.getAll('2027-01')[0].amount).toBe(120000);
  });

  it('conserva los presupuestos existentes como base sin alterar el historial al navegar hacia atrás', () => {
    const legacy = budgetsRepository.create(food);
    const december = budgetsRepository.getAll('2026-12')[0];
    budgetsRepository.update(december.id, { ...food, amount: 120000 }, '2026-12');

    expect(budgetsRepository.getAll('2026-11')[0].amount).toBe(100000);
    expect(budgetsRepository.getAll()).toEqual([legacy]);
    expect(budgetsRepository.getAll('2026-12')[0].amount).toBe(120000);
  });

  it('mantiene un presupuesto general independiente por mes', () => {
    const general = { ...food, name: 'General', isGeneral: true, categoryIds: null };
    budgetsRepository.create(general, '2026-11');
    const december = budgetsRepository.getGeneral('2026-12')!;
    budgetsRepository.update(december.id, { ...general, amount: 120000 }, '2026-12');

    expect(budgetsRepository.getGeneral('2026-11')?.amount).toBe(100000);
    expect(budgetsRepository.getGeneral('2026-12')?.amount).toBe(120000);
    expect(() => budgetsRepository.create(general, '2026-12')).toThrow();
  });

});
