import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryPicker } from './CategoryPicker';

describe('CategoryPicker', () => {
  it('muestra las categorías agrupadas en Ingresos y Gastos', () => {
    render(<CategoryPicker selectedCategoryId={null} onSelect={() => {}} />);

    expect(screen.getByText('Ingresos')).toBeInTheDocument();
    expect(screen.getByText('Gastos')).toBeInTheDocument();
    expect(screen.getByText('Salario')).toBeInTheDocument();
    expect(screen.getByText('Comida')).toBeInTheDocument();
  });

  it('llama a onSelect con el id de la categoría tocada', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <CategoryPicker selectedCategoryId={null} onSelect={handleSelect} />,
    );

    await user.click(screen.getByText('Comida'));

    expect(handleSelect).toHaveBeenCalledWith('food');
  });

  it('resalta visualmente la categoría seleccionada', () => {
    render(<CategoryPicker selectedCategoryId="food" onSelect={() => {}} />);

    const foodButton = screen.getByText('Comida').closest('button');
    expect(foodButton).toHaveClass('bg-neutral-900');
  });
});
