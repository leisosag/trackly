import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryMultiSelect } from './CategoryMultiSelect';

describe('CategoryMultiSelect', () => {
  describe('modo multi (default)', () => {
    it('sin prop types, muestra solo categorías de tipo gasto, sin encabezado de grupo', () => {
      render(
        <CategoryMultiSelect selectedCategoryIds={[]} onToggle={() => {}} />,
      );

      expect(screen.getByText('Comida')).toBeInTheDocument();
      expect(screen.queryByText('Salario')).not.toBeInTheDocument();
      expect(screen.queryByText('Gastos')).not.toBeInTheDocument();
    });

    it('llama a onToggle con el id de la categoría tocada', async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();
      render(
        <CategoryMultiSelect
          selectedCategoryIds={[]}
          onToggle={handleToggle}
        />,
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

    it('con types de más de un tipo, agrupa visualmente bajo "Ingresos" y "Gastos"', () => {
      render(
        <CategoryMultiSelect
          selectedCategoryIds={[]}
          onToggle={() => {}}
          types={['income', 'expense']}
        />,
      );

      expect(screen.getByText('Ingresos')).toBeInTheDocument();
      expect(screen.getByText('Gastos')).toBeInTheDocument();
      expect(screen.getByText('Salario')).toBeInTheDocument();
      expect(screen.getByText('Comida')).toBeInTheDocument();
    });
  });

  describe('modo single', () => {
    it('agrupa en "Ingresos" y "Gastos" al pasar ambos tipos', () => {
      render(
        <CategoryMultiSelect
          mode="single"
          types={['income', 'expense']}
          selectedCategoryId={null}
          onSelect={() => {}}
        />,
      );

      expect(screen.getByText('Ingresos')).toBeInTheDocument();
      expect(screen.getByText('Gastos')).toBeInTheDocument();
    });

    it('llama a onSelect (no onToggle) con el id de la categoría tocada', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();
      render(
        <CategoryMultiSelect
          mode="single"
          types={['income', 'expense']}
          selectedCategoryId={null}
          onSelect={handleSelect}
        />,
      );

      await user.click(screen.getByText('Comida'));

      expect(handleSelect).toHaveBeenCalledWith('food');
    });

    it('no aplica role="checkbox" ni aria-checked (selección única, no checkbox)', () => {
      render(
        <CategoryMultiSelect
          mode="single"
          types={['income', 'expense']}
          selectedCategoryId="food"
          onSelect={() => {}}
        />,
      );

      const foodButton = screen.getByText('Comida').closest('button');
      expect(foodButton).not.toHaveAttribute('role');
      expect(foodButton).not.toHaveAttribute('aria-checked');
    });
  });
});
