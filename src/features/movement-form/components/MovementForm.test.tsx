import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
