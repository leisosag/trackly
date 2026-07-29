import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MovementFilterModal } from './MovementFilterModal';

describe('MovementFilterModal', () => {
  it('muestra categorías de ingreso y de gasto combinadas', () => {
    render(
      <MovementFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        initialPaymentMethodIds={[]}
        onApply={() => {}}
      />,
    );

    expect(screen.getByText('Salario')).toBeInTheDocument();
    expect(screen.getByText('Comida')).toBeInTheDocument();
  });

  it('arranca con las categorías indicadas ya seleccionadas', () => {
    render(
      <MovementFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={['food']}
        initialPaymentMethodIds={[]}
        onApply={() => {}}
      />,
    );

    const foodButton = screen.getByText('Comida').closest('button');
    expect(foodButton).toHaveAttribute('aria-checked', 'true');
  });

  it('permite tildar una categoría antes de confirmar', async () => {
    const user = userEvent.setup();
    render(
      <MovementFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        initialPaymentMethodIds={[]}
        onApply={() => {}}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Comida' }));

    const foodButton = screen.getByText('Comida').closest('button');
    expect(foodButton).toHaveAttribute('aria-checked', 'true');
  });

  it('muestra los medios de pago disponibles bajo su propia sección', () => {
    render(
      <MovementFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        initialPaymentMethodIds={[]}
        onApply={() => {}}
      />,
    );

    expect(screen.getByText('Medio de pago')).toBeInTheDocument();
    expect(screen.getByText('Efectivo')).toBeInTheDocument();
    expect(screen.getByText('Tarjeta principal')).toBeInTheDocument();
  });

  it('arranca con los medios de pago indicados ya seleccionados', () => {
    render(
      <MovementFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        initialPaymentMethodIds={['debit']}
        onApply={() => {}}
      />,
    );

    const debitChip = screen.getByText('Débito').closest('button');
    expect(debitChip).toHaveAttribute('aria-checked', 'true');
  });

  it('llama a onApply con las categorías y medios de pago seleccionados al tocar "Filtrar"', async () => {
    const user = userEvent.setup();
    const handleApply = vi.fn();
    render(
      <MovementFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={['salary']}
        initialPaymentMethodIds={[]}
        onApply={handleApply}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Comida' }));
    await user.click(screen.getByRole('checkbox', { name: 'Débito' }));
    await user.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(handleApply).toHaveBeenCalledWith(['salary', 'food'], ['debit']);
  });

  it('resincroniza ambas selecciones con los valores iniciales cada vez que se reabre', () => {
    const { rerender } = render(
      <MovementFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={['food']}
        initialPaymentMethodIds={['debit']}
        onApply={() => {}}
      />,
    );

    expect(screen.getByText('Comida').closest('button')).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByText('Débito').closest('button')).toHaveAttribute(
      'aria-checked',
      'true',
    );

    // se cierra (sin desmontar) y se limpia el filtro externamente
    rerender(
      <MovementFilterModal
        open={false}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        initialPaymentMethodIds={[]}
        onApply={() => {}}
      />,
    );

    // se reabre: debe reflejar los nuevos valores iniciales (vacíos)
    rerender(
      <MovementFilterModal
        open={true}
        onOpenChange={() => {}}
        initialCategoryIds={[]}
        initialPaymentMethodIds={[]}
        onApply={() => {}}
      />,
    );

    expect(screen.getByText('Comida').closest('button')).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByText('Débito').closest('button')).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('no llama a onOpenChange al confirmar (el cierre lo decide quien lo use)', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();
    render(
      <MovementFilterModal
        open={true}
        onOpenChange={handleOpenChange}
        initialCategoryIds={[]}
        initialPaymentMethodIds={[]}
        onApply={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Filtrar' }));

    expect(handleOpenChange).not.toHaveBeenCalled();
  });
});
