import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MovementForm } from './MovementForm';

describe('MovementForm', () => {
  it('empieza mostrando el selector de categorías', () => {
    render(<MovementForm />);

    expect(screen.getByText('Ingresos')).toBeInTheDocument();
    expect(screen.getByText('Gastos')).toBeInTheDocument();
  });

  it('avanza al paso de monto al elegir una categoría', async () => {
    const user = userEvent.setup();
    render(<MovementForm />);

    await user.click(screen.getByText('Comida'));

    expect(screen.getByTestId('expression-display')).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
  });

  it('vuelve al selector de categorías al hacer click en la categoría elegida', async () => {
    const user = userEvent.setup();
    render(<MovementForm />);

    await user.click(screen.getByText('Comida'));
    await user.click(
      screen.getByRole('button', { name: /volver a elegir categoría/i }),
    );

    expect(screen.getByText('Ingresos')).toBeInTheDocument();
  });

  it('conserva el monto tipeado al volver y reelegir categoría', async () => {
    const user = userEvent.setup();
    render(<MovementForm />);

    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));

    await user.click(
      screen.getByRole('button', { name: /volver a elegir categoría/i }),
    );
    await user.click(screen.getByText('Comida')); // reelige la misma categoría

    expect(screen.getByTestId('expression-display')).toHaveTextContent('150');
  });

  it('conserva la descripción tipeada al volver y reelegir categoría', async () => {
    const user = userEvent.setup();
    render(<MovementForm />);

    await user.click(screen.getByText('Comida'));
    await user.type(screen.getByLabelText(/descripción/i), 'Supermercado');

    await user.click(
      screen.getByRole('button', { name: /volver a elegir categoría/i }),
    );
    await user.click(screen.getByText('Salario')); // esta vez elige una categoría distinta

    expect(screen.getByLabelText(/descripción/i)).toHaveValue('Supermercado');
  });
});
