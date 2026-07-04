import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryMultiSelect } from './CategoryMultiSelect';

describe('CategoryMultiSelect', () => {
  it('muestra solo categorías de tipo gasto', () => {
    render(
      <CategoryMultiSelect selectedCategoryIds={[]} onToggle={() => {}} />,
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.queryByText('Salario')).not.toBeInTheDocument();
  });

  it('llama a onToggle con el id de la categoría tocada', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <CategoryMultiSelect selectedCategoryIds={[]} onToggle={handleToggle} />,
    );

    await user.click(screen.getByText('Comida'));

    expect(handleToggle).toHaveBeenCalledWith('food');
  });

  it('marca aria-checked=true en una categoría ya seleccionada', () => {
    render(
      <CategoryMultiSelect
        selectedCategoryIds={['food']}
        onToggle={() => {}}
      />,
    );

    const foodButton = screen.getByText('Comida').closest('button');
    expect(foodButton).toHaveAttribute('aria-checked', 'true');
  });
});
