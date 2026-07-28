import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryFilterModal } from './CategoryFilterModal';

describe('CategoryFilterModal', () => {
  it('muestra categorías de ingreso y de gasto combinadas', () => {
    render(
      <CategoryFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        onApply={() => {}}
      />,
    );

    expect(screen.getByText('Salario')).toBeInTheDocument();
    expect(screen.getByText('Comida')).toBeInTheDocument();
  });

  it('arranca con las categorías indicadas ya seleccionadas', () => {
    render(
      <CategoryFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={['food']}
        onApply={() => {}}
      />,
    );

    const foodButton = screen.getByText('Comida').closest('button');
    expect(foodButton).toHaveAttribute('aria-checked', 'true');
  });

  it('permite tildar una categoría antes de confirmar', async () => {
    const user = userEvent.setup();
    render(
      <CategoryFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        onApply={() => {}}
      />,
    );

    await user.click(screen.getByText('Comida'));

    const foodButton = screen.getByText('Comida').closest('button');
    expect(foodButton).toHaveAttribute('aria-checked', 'true');
  });

  it('llama a onApply con los ids seleccionados al tocar "Filtrar"', async () => {
    const user = userEvent.setup();
    const handleApply = vi.fn();
    render(
      <CategoryFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={['salary']}
        onApply={handleApply}
      />,
    );

    await user.click(screen.getByText('Comida'));
    await user.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(handleApply).toHaveBeenCalledWith(['salary', 'food']);
  });

  it('no llama a onOpenChange al confirmar (el cierre lo decide quien lo use)', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();
    render(
      <CategoryFilterModal
        open={true}
        onOpenChange={handleOpenChange}
        initialCategoryIds={[]}
        onApply={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(handleOpenChange).not.toHaveBeenCalled();
  });
});
