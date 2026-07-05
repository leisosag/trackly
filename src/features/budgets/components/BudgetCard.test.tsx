import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetCard } from './BudgetCard';
import type { BudgetProgress } from '../types';
import type { Movement } from '@/features/movements';
import { SelectedMonthProvider } from '@/shared/context';

function makeProgress(overrides: Partial<BudgetProgress> = {}): BudgetProgress {
  return {
    budget: {
      id: '1',
      name: 'Servicios',
      amount: 20000,
      period: 'monthly',
      categoryIds: ['home'],
      isGeneral: false,
    },
    spent: 5000,
    remaining: 15000,
    percentage: 25,
    status: 'ok',
    ...overrides,
  };
}

function renderCard(
  progress: BudgetProgress,
  movements: Movement[] = [],
  onClick?: () => void,
) {
  return render(
    <SelectedMonthProvider>
      <BudgetCard progress={progress} movements={movements} onClick={onClick} />
    </SelectedMonthProvider>,
  );
}

describe('BudgetCard', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra el nombre, el gasto y el restante', () => {
    renderCard(makeProgress());

    expect(screen.getByText('Servicios')).toBeInTheDocument();
    expect(screen.getByText(/5.000 gastado/)).toBeInTheDocument();
    expect(screen.getByText(/15.000 restante/)).toBeInTheDocument();
  });

  it('muestra la etiqueta "Excedido" cuando el estado es exceeded', () => {
    renderCard(makeProgress({ status: 'exceeded' }));

    expect(screen.getByText('Excedido')).toBeInTheDocument();
  });

  it('llama a onClick al tocar el botón de editar', async () => {
    const user = userEvent.setup({ delay: null });
    const handleClick = vi.fn();
    renderCard(makeProgress(), [], handleClick);

    await user.click(screen.getByRole('button', { name: /editar/i }));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('muestra el botón "Ver movimientos" para un presupuesto personalizado', () => {
    renderCard(makeProgress());

    expect(
      screen.getByRole('button', { name: /ver movimientos/i }),
    ).toBeInTheDocument();
  });

  it('no muestra el botón "Ver movimientos" para el presupuesto general', () => {
    const general = makeProgress({
      budget: {
        id: 'g',
        name: 'Presupuesto general',
        amount: 100000,
        period: 'monthly',
        categoryIds: null,
        isGeneral: true,
      },
    });

    renderCard(general);

    expect(
      screen.queryByRole('button', { name: /ver movimientos/i }),
    ).not.toBeInTheDocument();
  });

  it('abre un modal con los movimientos del presupuesto al tocar "Ver movimientos"', async () => {
    const user = userEvent.setup({ delay: null });
    const movements: Movement[] = [
      {
        id: 'm1',
        categoryId: 'home',
        amount: 5000,
        date: '2026-07-10T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
      {
        id: 'm2',
        categoryId: 'food', // otra categoría: no pertenece a este presupuesto
        amount: 800,
        date: '2026-07-10T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
    ];

    renderCard(makeProgress(), movements);

    await user.click(screen.getByRole('button', { name: /ver movimientos/i }));

    expect(screen.getByText('Movimientos de Servicios')).toBeInTheDocument();
    expect(screen.getByText('Hogar')).toBeInTheDocument();
    expect(screen.queryByText('Comida')).not.toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay movimientos asociados', async () => {
    const user = userEvent.setup({ delay: null });
    renderCard(makeProgress(), []);

    await user.click(screen.getByRole('button', { name: /ver movimientos/i }));

    expect(
      screen.getByText('Todavía no cargaste movimientos en este período'),
    ).toBeInTheDocument();
  });

  it('no abre el modal de movimientos al tocar "Editar"', async () => {
    const user = userEvent.setup({ delay: null });
    renderCard(makeProgress(), []);

    await user.click(screen.getByRole('button', { name: /editar/i }));

    expect(
      screen.queryByText('Movimientos de Servicios'),
    ).not.toBeInTheDocument();
  });
});
