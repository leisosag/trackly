import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetList } from './BudgetList';
import type { Movement } from '@/features/movements';
import type { Budget } from '../types';
import { SelectedMonthProvider } from '@/shared/context';

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
    render(
      <SelectedMonthProvider>
        <BudgetList budgets={[general, custom]} movements={movements} />
      </SelectedMonthProvider>,
    );

    expect(screen.getByText('Presupuesto general')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();
  });

  it('muestra un mensaje cuando no hay presupuestos personalizados', () => {
    render(
      <SelectedMonthProvider>
        <BudgetList budgets={[general]} movements={movements} />
      </SelectedMonthProvider>,
    );

    expect(
      screen.getByText('Todavía no creaste presupuestos personalizados'),
    ).toBeInTheDocument();
  });
});
