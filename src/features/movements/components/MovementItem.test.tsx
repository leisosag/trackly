import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MovementItem } from './MovementItem';
import type { Movement } from '../types';

describe('MovementItem', () => {
  it('muestra el signo + y el nombre de la categoría para un ingreso', () => {
    const movement: Movement = {
      id: '1',
      categoryId: 'salary',
      amount: 5000,
      date: '2026-07-01T10:00:00.000Z',
    };

    render(<MovementItem movement={movement} />);

    expect(screen.getByText('Salario')).toBeInTheDocument();
    expect(screen.getByText(/\+/)).toBeInTheDocument();
  });

  it('muestra el signo - para un egreso', () => {
    const movement: Movement = {
      id: '2',
      categoryId: 'food',
      amount: 1500,
      date: '2026-07-01T10:00:00.000Z',
      paymentMethodId: 'debit',
    };

    render(<MovementItem movement={movement} />);

    expect(screen.getByText(/-/)).toBeInTheDocument();
  });

  it('muestra la descripción solo si existe', () => {
    const movement: Movement = {
      id: '3',
      categoryId: 'food',
      amount: 1500,
      date: '2026-07-01T10:00:00.000Z',
      description: 'Supermercado',
      paymentMethodId: 'debit',
    };

    render(<MovementItem movement={movement} />);

    expect(screen.getByText('Supermercado')).toBeInTheDocument();
  });

  it('llama a onClick con el movimiento al tocarlo', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const movement: Movement = {
      id: '4',
      categoryId: 'food',
      amount: 1500,
      date: '2026-07-01T10:00:00.000Z',
      paymentMethodId: 'debit',
    };

    render(<MovementItem movement={movement} onClick={handleClick} />);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledWith(movement);
  });

  it('renderiza un ícono de medio de pago junto al nombre de la categoría', () => {
    const movement: Movement = {
      id: '5',
      categoryId: 'food',
      paymentMethodId: 'default-card',
      amount: 1500,
      date: '2026-07-01T10:00:00.000Z',
    };

    render(<MovementItem movement={movement} />);

    const categoryName = screen.getByText('Comida');
    expect(categoryName.querySelector('svg')).toBeInTheDocument();
  });
});
