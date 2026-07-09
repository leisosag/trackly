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

  it('al cargar una compra en cuotas con tarjeta de crédito, cada cuota queda fechada en el mes de su resumen', () => {
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

    const months = result.current.movements
      .map((m) => new Date(m.date).getMonth())
      .sort((a, b) => a - b);

    expect(months).toEqual([6, 7, 8]); // julio, agosto, septiembre
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
