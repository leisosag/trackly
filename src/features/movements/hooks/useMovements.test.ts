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
});
