import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalanceHeader } from './BalanceHeader';
import type { Movement } from '../types';

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
    amount: 1500,
    date: '2026-07-01T10:00:00.000Z',
  },
];

describe('BalanceHeader', () => {
  it('muestra el saldo, ingreso y gasto totales', () => {
    render(<BalanceHeader movements={movements} />);

    expect(screen.getByText('Saldo')).toBeInTheDocument();
    expect(screen.getByText(/Ingreso:/)).toBeInTheDocument();
    expect(screen.getByText(/Gasto:/)).toBeInTheDocument();
  });

  it('muestra el saldo en 0 sin movimientos', () => {
    render(<BalanceHeader movements={[]} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
