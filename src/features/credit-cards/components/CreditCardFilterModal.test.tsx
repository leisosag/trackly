import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreditCardFilterModal } from './CreditCardFilterModal';

describe('CreditCardFilterModal', () => {
  it('muestra únicamente categorías de gasto', () => {
    render(
      <CreditCardFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        onApply={() => {}}
      />,
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.queryByText('Salario')).not.toBeInTheDocument();
  });

  it('arranca con las categorías indicadas ya seleccionadas', () => {
    render(
      <CreditCardFilterModal
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
      <CreditCardFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        onApply={() => {}}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Comida' }));

    const foodButton = screen.getByText('Comida').closest('button');
    expect(foodButton).toHaveAttribute('aria-checked', 'true');
  });

  it('llama a onApply con las categorías seleccionadas al tocar "Filtrar"', async () => {
    const user = userEvent.setup();
    const handleApply = vi.fn();
    render(
      <CreditCardFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        onApply={handleApply}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Comida' }));
    await user.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(handleApply).toHaveBeenCalledWith(['food']);
  });

  it('resincroniza la selección con initialCategoryIds cada vez que se reabre', () => {
    const { rerender } = render(
      <CreditCardFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={['food']}
        onApply={() => {}}
      />,
    );

    expect(screen.getByText('Comida').closest('button')).toHaveAttribute(
      'aria-checked',
      'true',
    );

    rerender(
      <CreditCardFilterModal
        open={false}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        onApply={() => {}}
      />,
    );

    rerender(
      <CreditCardFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        onApply={() => {}}
      />,
    );

    expect(screen.getByText('Comida').closest('button')).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });
});
