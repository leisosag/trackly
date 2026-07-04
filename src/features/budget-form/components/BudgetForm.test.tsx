import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetForm } from './BudgetForm';
import type { Budget } from '@/features/budgets';

describe('BudgetForm', () => {
  it('el botón guardar está deshabilitado sin datos completos', () => {
    render(<BudgetForm onSubmit={() => {}} />);

    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
  });

  it('llama a onSubmit con los datos armados', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<BudgetForm onSubmit={handleSubmit} />);

    await user.type(
      screen.getByLabelText(/nombre del presupuesto/i),
      'Servicios',
    );
    await user.type(screen.getByLabelText(/monto límite/i), '20000');
    await user.click(screen.getByText('Hogar'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Servicios',
        amount: 20000,
        categoryIds: ['home'],
        isGeneral: false,
        period: 'monthly',
      }),
    );
  });

  it('en modo edición del presupuesto general, oculta nombre y categorías', () => {
    const general: Budget = {
      id: 'g',
      name: 'Presupuesto general',
      amount: 100000,
      period: 'monthly',
      categoryIds: null,
      isGeneral: true,
    };

    render(
      <BudgetForm mode="edit" initialBudget={general} onSubmit={() => {}} />,
    );

    expect(
      screen.queryByLabelText(/nombre del presupuesto/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Hogar')).not.toBeInTheDocument();
  });

  it('no muestra la opción de eliminar para el presupuesto general', () => {
    const general: Budget = {
      id: 'g',
      name: 'Presupuesto general',
      amount: 100000,
      period: 'monthly',
      categoryIds: null,
      isGeneral: true,
    };

    render(
      <BudgetForm
        mode="edit"
        initialBudget={general}
        onSubmit={() => {}}
        onDelete={() => {}}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /eliminar/i }),
    ).not.toBeInTheDocument();
  });

  it('requiere 2 clicks en Eliminar antes de llamar a onDelete en un presupuesto personalizado', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    const custom: Budget = {
      id: 'c',
      name: 'Servicios',
      amount: 20000,
      period: 'monthly',
      categoryIds: ['home'],
      isGeneral: false,
    };

    render(
      <BudgetForm
        mode="edit"
        initialBudget={custom}
        onSubmit={() => {}}
        onDelete={handleDelete}
      />,
    );

    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    expect(handleDelete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Sí, eliminar/i }));
    expect(handleDelete).toHaveBeenCalledOnce();
  });
});
