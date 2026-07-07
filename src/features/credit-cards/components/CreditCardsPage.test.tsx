import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CreditCardsPage } from './CreditCardsPage';
import { SelectedMonthProvider } from '@/shared/context';

function seedMovements() {
  localStorage.setItem(
    'movements',
    JSON.stringify([
      {
        id: '1',
        categoryId: 'food',
        amount: 100,
        date: '2026-07-05T10:00:00.000Z',
        paymentMethodId: 'default-card',
        statementPeriod: '2026-07',
        installment: { groupId: 'g1', number: 1, total: 1 },
      },
      {
        id: '2',
        categoryId: 'food',
        amount: 200,
        date: '2026-07-06T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
      {
        id: '3',
        categoryId: 'transport',
        amount: 300,
        date: '2026-06-20T10:00:00.000Z',
        paymentMethodId: 'default-card',
        statementPeriod: '2026-08',
      },
    ]),
  );
}

describe('CreditCardsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra los movimientos de crédito del período seleccionado y su total', () => {
    seedMovements();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument(); // total del header
    expect(screen.getByText(/-100/)).toBeInTheDocument(); // importe del movimiento
  });

  it('excluye movimientos que no son de tarjeta de crédito aunque sean del mismo mes', () => {
    seedMovements();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    // el movimiento débito de $200 no debe listarse ni sumarse al total
    expect(screen.queryByText('200')).not.toBeInTheDocument();
  });

  it('excluye movimientos de crédito de otro statementPeriod', () => {
    seedMovements();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    expect(screen.queryByText('Transporte')).not.toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay movimientos de crédito en el período', () => {
    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    expect(
      screen.getByText('Todavía no cargaste movimientos en este período'),
    ).toBeInTheDocument();
  });

  it('muestra el período formateado en el encabezado', () => {
    seedMovements();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    expect(screen.getByText(/Julio de 2026/)).toBeInTheDocument();
  });
});
