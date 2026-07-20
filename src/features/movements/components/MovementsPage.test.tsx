import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'sonner';
import { MovementsPage } from './MovementsPage';
import { SelectedMonthProvider } from '@/shared/context';

function seedMovements() {
  localStorage.setItem(
    'movements',
    JSON.stringify([
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
        date: '2026-07-05T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
      {
        id: '3',
        categoryId: 'food',
        amount: 800,
        date: '2026-06-20T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
    ]),
  );
}

function renderPage() {
  return render(
    <SelectedMonthProvider>
      <Toaster />
      <MovementsPage />
    </SelectedMonthProvider>,
  );
}

describe('MovementsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra únicamente los movimientos del mes seleccionado', () => {
    seedMovements();
    renderPage();

    expect(screen.getByText('Salario')).toBeInTheDocument();
    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByText(/-1.500/)).toBeInTheDocument();
  });

  it('excluye movimientos de otros meses del listado', () => {
    seedMovements();
    renderPage();

    // el de junio (800) no debería aparecer, solo el de julio (1500)
    expect(screen.queryByText(/-800/)).not.toBeInTheDocument();
  });

  it('muestra el balance total en el header, considerando solo el mes actual', () => {
    seedMovements();
    renderPage();

    // saldo del mes: 5000 (ingreso) - 1500 (gasto) = 3500
    expect(screen.getByText('Saldo')).toBeInTheDocument();
    expect(screen.getByText('3.500')).toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay movimientos en el mes', () => {
    renderPage();

    expect(
      screen.getByText('Todavía no cargaste movimientos en este período'),
    ).toBeInTheDocument();
  });

  it('abre el modal de alta al tocar el FAB', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: /agregar movimiento/i }),
    );

    expect(screen.getByText('Nuevo movimiento')).toBeInTheDocument();
    expect(screen.getByText('Ingresos')).toBeInTheDocument();
  });

  it('permite crear un movimiento nuevo y lo agrega al listado con un toast de confirmación', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: /agregar movimiento/i }),
    );
    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(
      screen.getByRole('button', { name: /comida.*200/i }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Movimiento cargado')).toBeInTheDocument();
  });

  it('abre el modal de edición precargado al tocar un movimiento existente', async () => {
    seedMovements();
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText('Salario'));

    expect(screen.getByText('Editar movimiento')).toBeInTheDocument();
    expect(screen.getByTestId('expression-display')).toHaveTextContent('5000');
  });

  it('permite editar un movimiento existente y muestra un toast de confirmación', async () => {
    seedMovements();
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByRole('button', { name: /editar/i }));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(
      await screen.findByText('Movimiento actualizado'),
    ).toBeInTheDocument();
  });

  it('permite eliminar un movimiento mediante el modal de confirmación', async () => {
    seedMovements();
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    await user.click(screen.getByRole('button', { name: /sí, eliminar/i }));

    expect(screen.queryByText('Comida')).not.toBeInTheDocument();
    expect(await screen.findByText('Movimiento eliminado')).toBeInTheDocument();
  });

  it('cancelar en el modal de confirmación no elimina el movimiento', async () => {
    seedMovements();
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(screen.getAllByText('Comida').length).toBeGreaterThan(0);
    expect(
      screen.queryByRole('button', { name: /sí, eliminar/i }),
    ).not.toBeInTheDocument();
  });
});
