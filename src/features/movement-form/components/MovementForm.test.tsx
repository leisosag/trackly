import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MovementForm } from './MovementForm';

describe('MovementForm', () => {
  it('empieza mostrando el selector de categorías', () => {
    render(<MovementForm onSubmit={() => {}} />);

    expect(screen.getByText('Ingresos')).toBeInTheDocument();
    expect(screen.getByText('Gastos')).toBeInTheDocument();
  });

  it('avanza al paso de monto al elegir una categoría', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Comida'));

    expect(screen.getByTestId('expression-display')).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
  });

  it('conserva el monto y la descripción al volver y reelegir categoría', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));
    await user.type(screen.getByLabelText(/descripción/i), 'Supermercado');

    await user.click(
      screen.getByRole('button', { name: /volver a elegir categoría/i }),
    );
    await user.click(screen.getByText('Salario'));

    expect(screen.getByTestId('expression-display')).toHaveTextContent('150');
    expect(screen.getByLabelText(/descripción/i)).toHaveValue('Supermercado');
  });

  it('llama a onSubmit con el movimiento armado, sin descripción si está vacía', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<MovementForm onSubmit={handleSubmit} />);

    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: 'food',
        amount: 150,
        description: undefined,
      }),
    );
  });

  it('incluye la descripción en el movimiento si fue completada', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<MovementForm onSubmit={handleSubmit} />);

    await user.click(screen.getByText('Comida'));
    await user.type(screen.getByLabelText(/descripción/i), 'Supermercado');
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Supermercado' }),
    );
  });

  it('resetea el formulario después de confirmar, volviendo al selector de categorías', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(screen.getByText('Ingresos')).toBeInTheDocument();
  });

  it('en modo edición, arranca directo en el paso de monto con los datos precargados', () => {
    render(
      <MovementForm
        mode="edit"
        initialMovement={{
          id: '1',
          categoryId: 'food',
          amount: 1500,
          description: 'Supermercado',
          date: '2026-07-01T10:00:00.000Z',
          paymentMethodId: 'debit',
        }}
        onSubmit={() => {}}
      />,
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByTestId('expression-display')).toHaveTextContent('1500');
    expect(screen.getByLabelText(/descripción/i)).toHaveValue('Supermercado');
  });

  it('en modo edición, llama a onSubmit con los datos modificados', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <MovementForm
        mode="edit"
        initialMovement={{
          id: '1',
          categoryId: 'food',
          amount: 1500,
          date: '2026-07-01T10:00:00.000Z',
          paymentMethodId: 'debit',
        }}
        onSubmit={handleSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: /editar/i }));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ categoryId: 'food', amount: 1500 }),
    );
  });

  it('en modo edición, requiere 2 clicks en Eliminar antes de llamar a onDelete', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    render(
      <MovementForm
        mode="edit"
        initialMovement={{
          id: '1',
          categoryId: 'food',
          amount: 1500,
          date: '2026-07-01T10:00:00.000Z',
          paymentMethodId: 'debit',
        }}
        onSubmit={() => {}}
        onDelete={handleDelete}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    await user.click(deleteButton);
    expect(handleDelete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Sí, eliminar/i }));
    expect(handleDelete).toHaveBeenCalledOnce();
  });

  it('la fecha arranca en "Hoy" por defecto al crear un movimiento nuevo', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Comida'));

    expect(screen.getByText('Hoy')).toBeInTheDocument();
  });

  it('permite editar la fecha y la incluye en el movimiento creado', async () => {
    // Se fija la hora en mediodía (no medianoche) para evitar que el salto
    // local -> UTC de applyDateToIso empuje la fecha al día siguiente según
    // la hora real en que corran los tests (ver Test timezone safety).
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-01T12:00:00'));

    const user = userEvent.setup({ delay: null });
    const handleSubmit = vi.fn();
    render(<MovementForm onSubmit={handleSubmit} />);

    await user.click(screen.getByText('Comida'));

    const dateInput = screen.getByLabelText(/fecha del movimiento/i);
    fireEvent.change(dateInput, { target: { value: '2026-07-20' } });

    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    const submittedDate = handleSubmit.mock.calls[0][0].date;
    expect(submittedDate.slice(0, 10)).toBe('2026-07-20');

    vi.useRealTimers();
  });

  it('no muestra el selector de medio de pago para una categoría de ingreso', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Salario'));

    expect(screen.queryByLabelText(/medio de pago/i)).not.toBeInTheDocument();
  });

  it('no incluye paymentMethodId al guardar un movimiento de ingreso', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<MovementForm onSubmit={handleSubmit} />);

    await user.click(screen.getByText('Salario'));
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ paymentMethodId: undefined }),
    );
  });

  it('el medio de pago por defecto es "Débito" al crear un movimiento nuevo', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Comida'));

    expect(screen.getByLabelText(/medio de pago/i)).toHaveValue('debit');
  });

  it('permite cambiar el medio de pago y lo incluye en el movimiento creado', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<MovementForm onSubmit={handleSubmit} />);

    await user.click(screen.getByText('Comida'));
    await user.selectOptions(screen.getByLabelText(/medio de pago/i), 'cash');
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ paymentMethodId: 'cash' }),
    );
  });

  it('en modo edición, carga el medio de pago del movimiento', () => {
    render(
      <MovementForm
        mode="edit"
        initialMovement={{
          id: '1',
          categoryId: 'food',
          paymentMethodId: 'default-card',
          amount: 1500,
          date: '2026-07-01T10:00:00.000Z',
        }}
        onSubmit={() => {}}
      />,
    );

    expect(screen.getByLabelText(/medio de pago/i)).toHaveValue('default-card');
  });

  it('no muestra el campo de cuotas cuando el medio de pago no es una tarjeta de crédito', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Comida'));

    expect(
      screen.queryByLabelText(/cantidad de cuotas/i),
    ).not.toBeInTheDocument();
  });

  it('muestra el campo de cuotas al elegir una tarjeta de crédito como medio de pago', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Comida'));
    await user.selectOptions(
      screen.getByLabelText(/medio de pago/i),
      'default-card',
    );

    expect(screen.getByLabelText(/cantidad de cuotas/i)).toBeInTheDocument();
  });

  it('no muestra el campo de cuotas en modo edición aunque el medio de pago sea una tarjeta de crédito', () => {
    render(
      <MovementForm
        mode="edit"
        initialMovement={{
          id: '1',
          categoryId: 'food',
          paymentMethodId: 'default-card',
          amount: 1500,
          date: '2026-07-01T10:00:00.000Z',
        }}
        onSubmit={() => {}}
      />,
    );

    expect(
      screen.queryByLabelText(/cantidad de cuotas/i),
    ).not.toBeInTheDocument();
  });

  it('el botón guardar se deshabilita si la cantidad de cuotas es inválida', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Comida'));
    await user.selectOptions(
      screen.getByLabelText(/medio de pago/i),
      'default-card',
    );
    await user.clear(screen.getByLabelText(/cantidad de cuotas/i));
    await user.type(screen.getByLabelText(/cantidad de cuotas/i), '0');
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));

    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
  });

  it('incluye installmentsCount en el movimiento al cargar una compra en varias cuotas', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<MovementForm onSubmit={handleSubmit} />);

    await user.click(screen.getByText('Comida'));
    await user.selectOptions(
      screen.getByLabelText(/medio de pago/i),
      'default-card',
    );
    await user.clear(screen.getByLabelText(/cantidad de cuotas/i));
    await user.type(screen.getByLabelText(/cantidad de cuotas/i), '3');
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 100,
        paymentMethodId: 'default-card',
        installmentsCount: 3,
      }),
    );
  });

  it('no incluye installmentsCount si el medio de pago no es una tarjeta de crédito', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<MovementForm onSubmit={handleSubmit} />);

    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ installmentsCount: undefined }),
    );
  });

  it('al editar una cuota existente, preserva installment y statementPeriod aunque solo se cambie la descripción', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <MovementForm
        mode="edit"
        initialMovement={{
          id: '1',
          categoryId: 'shopping',
          amount: 100,
          date: '2026-08-05T10:00:00.000Z',
          paymentMethodId: 'default-card',
          statementPeriod: '2026-08',
          installment: { groupId: 'g1', number: 2, total: 3 },
        }}
        onSubmit={handleSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: /editar/i }));
    await user.type(screen.getByLabelText(/descripción/i), 'Compra online');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Compra online',
        statementPeriod: '2026-08',
        installment: { groupId: 'g1', number: 2, total: 3 },
      }),
    );
  });

  it('al cambiar el medio de pago a uno que no es tarjeta de crédito, limpia installment y statementPeriod', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(
      <MovementForm
        mode="edit"
        initialMovement={{
          id: '1',
          categoryId: 'shopping',
          amount: 100,
          date: '2026-08-05T10:00:00.000Z',
          paymentMethodId: 'default-card',
          statementPeriod: '2026-08',
          installment: { groupId: 'g1', number: 2, total: 3 },
        }}
        onSubmit={handleSubmit}
      />,
    );

    await user.click(screen.getByRole('button', { name: /editar/i }));
    await user.selectOptions(screen.getByLabelText(/medio de pago/i), 'cash');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        statementPeriod: undefined,
        installment: undefined,
      }),
    );
  });
});
