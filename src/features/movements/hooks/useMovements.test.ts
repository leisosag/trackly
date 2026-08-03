import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMovements } from './useMovements';

function seedDefaultCard() {
  localStorage.setItem(
    'creditCards',
    JSON.stringify([
      {
        id: 'default-card',
        name: 'Tarjeta principal',
        closingDay: 15,
        isActive: true,
        closingDayConfirmedPeriod: '2026-07',
      },
    ]),
  );
}

describe('useMovements', () => {
  beforeEach(() => {
    localStorage.clear();
    seedDefaultCard();
  });

  it('al cargar una compra en cuotas con tarjeta de crédito, cada cuota conserva la fecha real de compra y solo varía su statementPeriod', () => {
    const { result } = renderHook(() => useMovements());

    act(() => {
      result.current.addMovement({
        categoryId: 'shopping',
        amount: 100,
        date: '2026-07-05T10:00:00.000Z',
        paymentMethodId: 'default-card',
        installmentsCount: 3,
      });
    });

    expect(result.current.movements).toHaveLength(3);
    expect(
      result.current.movements.every(
        (m) => m.date === '2026-07-05T10:00:00.000Z',
      ),
    ).toBe(true);

    const periods = result.current.movements
      .map((m) => m.statementPeriod)
      .sort();
    expect(periods).toEqual(['2026-07', '2026-08', '2026-09']);
  });

  it('un movimiento sin medio de pago crédito conserva la fecha original tal cual fue cargada', () => {
    const { result } = renderHook(() => useMovements());

    act(() => {
      result.current.addMovement({
        categoryId: 'food',
        amount: 1500,
        date: '2026-07-05T10:00:00.000Z',
        paymentMethodId: 'debit',
      });
    });

    expect(result.current.movements[0].date).toBe('2026-07-05T10:00:00.000Z');
  });

  it('updateInstallmentGroup regenera todas las cuotas del grupo con los nuevos datos, conservando cantidad y groupId', () => {
    const { result } = renderHook(() => useMovements());

    act(() => {
      result.current.addMovement({
        categoryId: 'shopping',
        amount: 100,
        date: '2026-07-05T10:00:00.000Z',
        paymentMethodId: 'default-card',
        installmentsCount: 3,
      });
    });

    const groupId = result.current.movements[0].installment!.groupId;

    act(() => {
      result.current.updateInstallmentGroup(groupId, {
        categoryId: 'leisure',
        amount: 150,
        date: '2026-08-10T10:00:00.000Z',
        paymentMethodId: 'default-card',
      });
    });

    expect(result.current.movements).toHaveLength(3);
    expect(
      result.current.movements.every(
        (m) =>
          m.categoryId === 'leisure' &&
          m.amount === 150 &&
          m.date === '2026-08-10T10:00:00.000Z' &&
          m.installment?.groupId === groupId &&
          m.installment?.total === 3,
      ),
    ).toBe(true);
  });

  it('updateInstallmentGroup no afecta movimientos de otros grupos o sin cuotas', () => {
    const { result } = renderHook(() => useMovements());

    act(() => {
      result.current.addMovement({
        categoryId: 'food',
        amount: 50,
        date: '2026-07-01T10:00:00.000Z',
        paymentMethodId: 'debit',
      });
      result.current.addMovement({
        categoryId: 'shopping',
        amount: 100,
        date: '2026-07-05T10:00:00.000Z',
        paymentMethodId: 'default-card',
        installmentsCount: 2,
      });
    });

    const groupId = result.current.movements.find((m) => m.installment)!
      .installment!.groupId;

    act(() => {
      result.current.updateInstallmentGroup(groupId, {
        categoryId: 'leisure',
        amount: 999,
        date: '2026-08-01T10:00:00.000Z',
        paymentMethodId: 'default-card',
      });
    });

    expect(
      result.current.movements.find((m) => m.paymentMethodId === 'debit')
        ?.amount,
    ).toBe(50);
  });

  it('removeInstallmentGroup elimina todas las cuotas del grupo indicado', () => {
    const { result } = renderHook(() => useMovements());

    act(() => {
      result.current.addMovement({
        categoryId: 'food',
        amount: 50,
        date: '2026-07-01T10:00:00.000Z',
        paymentMethodId: 'debit',
      });
      result.current.addMovement({
        categoryId: 'shopping',
        amount: 100,
        date: '2026-07-05T10:00:00.000Z',
        paymentMethodId: 'default-card',
        installmentsCount: 3,
      });
    });

    const groupId = result.current.movements.find((m) => m.installment)!
      .installment!.groupId;

    act(() => {
      result.current.removeInstallmentGroup(groupId);
    });

    expect(result.current.movements).toHaveLength(1);
    expect(result.current.movements[0].paymentMethodId).toBe('debit');
  });
});
