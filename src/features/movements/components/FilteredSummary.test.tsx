import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilteredSummary } from './FilteredSummary';
import type { Movement } from '../types';

const movements: Movement[] = [
  {
    id: '1',
    categoryId: 'food',
    amount: 800,
    date: '2026-07-05T10:00:00.000Z',
    paymentMethodId: 'debit',
  },
  {
    id: '2',
    categoryId: 'salary',
    amount: 5000,
    date: '2026-07-01T10:00:00.000Z',
  },
];

describe('FilteredSummary', () => {
  it('muestra los nombres de las categorías filtradas', () => {
    render(
      <FilteredSummary
        movements={movements}
        filters={{ categoryIds: ['food', 'salary'], paymentMethodIds: [] }}
        onClear={() => {}}
      />,
    );

    expect(screen.getByText('Comida, Salario')).toBeInTheDocument();
  });

  it('trunca la lista de nombres de categorías cuando hay más de 3', () => {
    render(
      <FilteredSummary
        movements={movements}
        filters={{
          categoryIds: ['food', 'salary', 'transport', 'home', 'health'],
          paymentMethodIds: [],
        }}
        onClear={() => {}}
      />,
    );

    expect(
      screen.getByText('Comida, Salario, Transporte +2 más'),
    ).toBeInTheDocument();
  });

  it('muestra los nombres de los medios de pago filtrados en su propia línea', () => {
    render(
      <FilteredSummary
        movements={movements}
        filters={{ categoryIds: [], paymentMethodIds: ['debit'] }}
        onClear={() => {}}
      />,
    );

    expect(screen.getByText('Débito')).toBeInTheDocument();
  });

  it('no muestra la línea de categorías si no hay categorías en el filtro', () => {
    render(
      <FilteredSummary
        movements={movements}
        filters={{ categoryIds: [], paymentMethodIds: ['debit'] }}
        onClear={() => {}}
      />,
    );

    expect(screen.queryByText('Comida')).not.toBeInTheDocument();
  });

  it('no muestra la línea de medios de pago si no hay medios de pago en el filtro', () => {
    render(
      <FilteredSummary
        movements={movements}
        filters={{ categoryIds: ['food'], paymentMethodIds: [] }}
        onClear={() => {}}
      />,
    );

    expect(screen.queryByText('Débito')).not.toBeInTheDocument();
  });

  it('muestra ambas líneas cuando el filtro combina categorías y medios de pago', () => {
    render(
      <FilteredSummary
        movements={movements}
        filters={{ categoryIds: ['food'], paymentMethodIds: ['debit'] }}
        onClear={() => {}}
      />,
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByText('Débito')).toBeInTheDocument();
  });

  it('muestra ingreso, gasto y balance calculados sobre los movimientos filtrados', () => {
    render(
      <FilteredSummary
        movements={movements}
        filters={{ categoryIds: ['food', 'salary'], paymentMethodIds: [] }}
        onClear={() => {}}
      />,
    );

    expect(screen.getByText(/Ingreso: 5.000/)).toBeInTheDocument();
    expect(screen.getByText(/Gasto: 800/)).toBeInTheDocument();
    expect(screen.getByText(/Balance: 4.200/)).toBeInTheDocument();
  });

  it('llama a onClear al tocar el botón de quitar filtro', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    render(
      <FilteredSummary
        movements={movements}
        filters={{ categoryIds: ['food'], paymentMethodIds: [] }}
        onClear={handleClear}
      />,
    );

    await user.click(screen.getByRole('button', { name: /quitar filtro/i }));

    expect(handleClear).toHaveBeenCalledOnce();
  });

  it('muestra los totales en cero si no hay movimientos que matcheen el filtro', () => {
    render(
      <FilteredSummary
        movements={[]}
        filters={{ categoryIds: ['food'], paymentMethodIds: [] }}
        onClear={() => {}}
      />,
    );

    expect(screen.getByText(/Ingreso: 0/)).toBeInTheDocument();
    expect(screen.getByText(/Gasto: 0/)).toBeInTheDocument();
    expect(screen.getByText(/Balance: 0/)).toBeInTheDocument();
  });
});
