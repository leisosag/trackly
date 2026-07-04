import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetList } from './BudgetList';
import type { Movement } from '@/features/movements';
import type { Budget } from '../types';

const general: Budget = {
  id: 'g',
  name: 'Presupuesto general',
  amount: 100000,
  period: 'monthly',
  categoryIds: null,
  isGeneral: true,
};

const custom: Budget = {
  id: 'c',
  name: 'Servicios',
  amount: 20000,
  period: 'monthly',
  categoryIds: ['home'],
  isGeneral: false,
};

const movements: Movement[] = [];

describe('BudgetList', () => {
  it('muestra el presupuesto general y los personalizados', () => {
    render(<BudgetList budgets={[general, custom]} movements={movements} />);

    expect(screen.getByText('Presupuesto general')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();
  });

  it('muestra un mensaje cuando no hay presupuestos personalizados', () => {
    render(<BudgetList budgets={[general]} movements={movements} />);

    expect(
      screen.getByText('Todavía no creaste presupuestos personalizados'),
    ).toBeInTheDocument();
  });

  it('llama a onBudgetClick con el presupuesto tocado', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <BudgetList
        budgets={[general, custom]}
        movements={movements}
        onBudgetClick={handleClick}
      />,
    );

    await user.click(screen.getByText('Servicios'));

    expect(handleClick).toHaveBeenCalledWith(custom);
  });
});
