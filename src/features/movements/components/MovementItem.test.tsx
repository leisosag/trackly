import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    };

    render(<MovementItem movement={movement} />);

    expect(screen.getByText('Supermercado')).toBeInTheDocument();
  });
});
