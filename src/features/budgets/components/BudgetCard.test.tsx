import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetCard } from './BudgetCard';
import type { BudgetProgress } from '../types';

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

describe('BudgetCard', () => {
  it('muestra el nombre, el gasto y el restante', () => {
    render(<BudgetCard progress={makeProgress()} />);

    expect(screen.getByText('Servicios')).toBeInTheDocument();
    expect(screen.getByText(/5.000 gastado/)).toBeInTheDocument();
    expect(screen.getByText(/15.000 restante/)).toBeInTheDocument();
  });

  it('muestra la etiqueta "Excedido" cuando el estado es exceeded', () => {
    render(<BudgetCard progress={makeProgress({ status: 'exceeded' })} />);

    expect(screen.getByText('Excedido')).toBeInTheDocument();
  });

  it('llama a onClick al tocar la tarjeta', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<BudgetCard progress={makeProgress()} onClick={handleClick} />);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
