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
        }}
        onSubmit={handleSubmit}
      />,
    );

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
        }}
        onSubmit={() => {}}
        onDelete={handleDelete}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    await user.click(deleteButton);
    expect(handleDelete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /confirmar/i }));
    expect(handleDelete).toHaveBeenCalledOnce();
  });

  it('la fecha arranca en "Hoy" por defecto al crear un movimiento nuevo', async () => {
    const user = userEvent.setup();
    render(<MovementForm onSubmit={() => {}} />);

    await user.click(screen.getByText('Comida'));

    expect(screen.getByText('Hoy')).toBeInTheDocument();
  });

  it('permite editar la fecha y la incluye en el movimiento creado', async () => {
    const user = userEvent.setup();
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
  });
});
