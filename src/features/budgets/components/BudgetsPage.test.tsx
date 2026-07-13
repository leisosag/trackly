import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'sonner';
import { BudgetsPage } from './BudgetsPage';
import { SelectedMonthProvider } from '@/shared/context';

function renderPage() {
  return render(
    <SelectedMonthProvider>
      <Toaster />
      <BudgetsPage />
    </SelectedMonthProvider>,
  );
}

describe('BudgetsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('crea el presupuesto general automáticamente si no existe ninguno', () => {
    renderPage();

    expect(screen.getByText('Presupuesto general')).toBeInTheDocument();
  });

  it('abre el modal de alta al tocar el FAB', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: /agregar presupuesto/i }),
    );

    expect(screen.getByText('Nuevo presupuesto')).toBeInTheDocument();
  });

  it('permite crear un presupuesto personalizado y muestra un toast de confirmación', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: /agregar presupuesto/i }),
    );
    await user.type(screen.getByLabelText(/nombre del presupuesto/i), 'Comida');
    await user.type(
      screen.getByLabelText(/monto límite del presupuesto/i),
      '20000',
    );
    await user.click(screen.getByText('Hogar'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(await screen.findByText('Presupuesto creado')).toBeInTheDocument();
  });

  it('abre el modal de edición del presupuesto general al tocarlo', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /editar/i }));

    expect(screen.getByText('Editar presupuesto general')).toBeInTheDocument();
  });

  it('permite editar el presupuesto general y muestra un toast de confirmación', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /editar/i }));
    await user.click(screen.getByRole('button', { name: /editar/i }));
    await user.type(
      screen.getByLabelText(/monto límite del presupuesto/i),
      '100000',
    );
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(
      await screen.findByText('Presupuesto actualizado'),
    ).toBeInTheDocument();
  });

  it('no muestra la opción de eliminar para el presupuesto general', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /editar/i }));

    expect(
      screen.queryByRole('button', { name: /eliminar/i }),
    ).not.toBeInTheDocument();
  });

  it('permite eliminar un presupuesto personalizado mediante el modal de confirmación', async () => {
    const user = userEvent.setup();
    renderPage();

    // crea uno personalizado primero
    await user.click(
      screen.getByRole('button', { name: /agregar presupuesto/i }),
    );
    await user.type(screen.getByLabelText(/nombre del presupuesto/i), 'Comida');
    await user.type(
      screen.getByLabelText(/monto límite del presupuesto/i),
      '20000',
    );
    await user.click(screen.getByText('Hogar'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    // lo edita y elimina
    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    await user.click(editButtons[editButtons.length - 1]);
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    await user.click(screen.getByRole('button', { name: /sí, eliminar/i }));

    expect(screen.queryByText('Comida')).not.toBeInTheDocument();
    expect(
      await screen.findByText('Presupuesto eliminado'),
    ).toBeInTheDocument();
  });

  it('cancelar en el modal de confirmación no elimina el presupuesto', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: /agregar presupuesto/i }),
    );
    await user.type(screen.getByLabelText(/nombre del presupuesto/i), 'Comida');
    await user.type(
      screen.getByLabelText(/monto límite del presupuesto/i),
      '20000',
    );
    await user.click(screen.getByText('Hogar'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    await user.click(editButtons[editButtons.length - 1]);
    await user.click(screen.getByRole('button', { name: /eliminar/i }));
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(screen.getAllByText('Comida').length).toBeGreaterThan(0);
    expect(
      screen.queryByRole('button', { name: /sí, eliminar/i }),
    ).not.toBeInTheDocument();
  });
});
