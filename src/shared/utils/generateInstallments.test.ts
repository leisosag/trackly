import { describe, it, expect } from 'vitest';
import { generateInstallments } from './generateInstallments';

const base = {
  categoryId: 'credit',
  amount: 100,
  date: '2026-07-05T10:00:00.000Z',
  paymentMethodId: 'default-card',
};

describe('generateInstallments', () => {
  it('genera un movimiento por cada cuota, con el mismo importe', () => {
    const result = generateInstallments(base, 3, 15);

    expect(result).toHaveLength(3);
    expect(result.every((m) => m.amount === 100)).toBe(true);
  });

  it('asigna el mismo groupId a todas las cuotas de la compra', () => {
    const result = generateInstallments(base, 3, 15);

    const groupIds = new Set(result.map((m) => m.installment?.groupId));
    expect(groupIds.size).toBe(1);
  });

  it('numera las cuotas correlativamente desde 1', () => {
    const result = generateInstallments(base, 3, 15);

    expect(result.map((m) => m.installment?.number)).toEqual([1, 2, 3]);
    expect(result.every((m) => m.installment?.total === 3)).toBe(true);
  });

  it('calcula el statementPeriod incremental para cada cuota, respetando el cierre', () => {
    // compra el 5/7 con cierre el 15 → primer resumen es julio
    const result = generateInstallments(base, 3, 15);

    expect(result.map((m) => m.statementPeriod)).toEqual([
      '2026-07',
      '2026-08',
      '2026-09',
    ]);
  });

  it('con 1 cuota, igual asigna el statementPeriod correspondiente', () => {
    const result = generateInstallments(base, 1, 15);

    expect(result).toHaveLength(1);
    expect(result[0].statementPeriod).toBe('2026-07');
    expect(result[0].installment).toEqual({
      groupId: expect.any(String),
      number: 1,
      total: 1,
    });
  });

  it('una compra después del cierre entra en el resumen del mes siguiente', () => {
    const lateBase = { ...base, date: '2026-07-22T10:00:00.000Z' };
    const result = generateInstallments(lateBase, 1, 15);

    expect(result[0].statementPeriod).toBe('2026-08');
  });

  it('ajusta la fecha de cada cuota al mes de su statementPeriod, conservando el día y la hora', () => {
    const result = generateInstallments(base, 3, 15);

    expect(new Date(result[0].date).getMonth()).toBe(6); // julio
    expect(new Date(result[1].date).getMonth()).toBe(7); // agosto
    expect(new Date(result[2].date).getMonth()).toBe(8); // septiembre

    result.forEach((m) => {
      expect(new Date(m.date).getDate()).toBe(new Date(base.date).getDate());
      expect(new Date(m.date).getHours()).toBe(new Date(base.date).getHours());
    });
  });

  it('ajusta el día si el mes de destino tiene menos días (ej: 31 de enero -> febrero)', () => {
    // con cierre el día 15, una compra el 31/01 (después del cierre) ya
    // entra en el resumen de febrero desde la primera cuota
    const jan31Base = { ...base, date: '2026-01-31T10:00:00.000Z' };
    const result = generateInstallments(jan31Base, 2, 15);

    expect(new Date(result[0].date).getMonth()).toBe(1); // febrero
    expect(new Date(result[0].date).getDate()).toBeLessThanOrEqual(28);

    // marzo sí tiene 31 días, así que la segunda cuota no necesita clamp
    expect(new Date(result[1].date).getMonth()).toBe(2); // marzo
    expect(new Date(result[1].date).getDate()).toBe(31);
  });
});
