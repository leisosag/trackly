import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MovementGroup } from './MovementGroup';
import type { Movement } from '../types';
import type { MovementGroup as MovementGroupType } from '@/shared/utils';

function makeGroup(movements: Movement[]): MovementGroupType {
  return { date: '2026-07-01', movements };
}

describe('MovementGroup', () => {
  it('muestra únicamente "Gastos" cuando el grupo solo tiene egresos', () => {
    const movements: Movement[] = [
      {
        id: '1',
        categoryId: 'food',
        amount: 800,
        date: '2026-07-01T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
      {
        id: '2',
        categoryId: 'transport',
        amount: 200,
        date: '2026-07-01T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
    ];

    render(<MovementGroup group={makeGroup(movements)} />);

    expect(screen.getByText('Gastos: 1.000')).toBeInTheDocument();
    expect(screen.queryByText(/Ingresos:/)).not.toBeInTheDocument();
  });

  it('muestra únicamente "Ingresos" cuando el grupo solo tiene ingresos', () => {
    const movements: Movement[] = [
      {
        id: '1',
        categoryId: 'salary',
        amount: 5000,
        date: '2026-07-01T10:00:00.000Z',
      },
    ];

    render(<MovementGroup group={makeGroup(movements)} />);

    expect(screen.getByText('Ingresos: 5.000')).toBeInTheDocument();
    expect(screen.queryByText(/Gastos:/)).not.toBeInTheDocument();
  });

  it('muestra ambas líneas cuando el grupo combina ingresos y gastos', () => {
    const movements: Movement[] = [
      {
        id: '1',
        categoryId: 'salary',
        amount: 5000,
        date: '2026-07-01T10:00:00.000Z',
      },
      {
        id: '2',
        categoryId: 'food',
        amount: 800,
        date: '2026-07-01T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
    ];

    render(<MovementGroup group={makeGroup(movements)} />);

    expect(screen.getByText('Ingresos: 5.000')).toBeInTheDocument();
    expect(screen.getByText('Gastos: 800')).toBeInTheDocument();
  });

  it('calcula los totales sumando todos los movimientos de cada tipo, no solo el primero', () => {
    const movements: Movement[] = [
      {
        id: '1',
        categoryId: 'salary',
        amount: 3000,
        date: '2026-07-01T10:00:00.000Z',
      },
      {
        id: '2',
        categoryId: 'cashback',
        amount: 500,
        date: '2026-07-01T10:00:00.000Z',
      },
      {
        id: '3',
        categoryId: 'food',
        amount: 300,
        date: '2026-07-01T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
      {
        id: '4',
        categoryId: 'transport',
        amount: 200,
        date: '2026-07-01T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
    ];

    render(<MovementGroup group={makeGroup(movements)} />);

    expect(screen.getByText('Ingresos: 3.500')).toBeInTheDocument();
    expect(screen.getByText('Gastos: 500')).toBeInTheDocument();
  });
});
