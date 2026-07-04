import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WalletIcon, ChartPieIcon } from '@phosphor-icons/react';
import { BottomNav, type NavItem } from './BottomNav';

const items: NavItem[] = [
  { id: 'movements', label: 'Movimientos', icon: WalletIcon },
  { id: 'budgets', label: 'Presupuestos', icon: ChartPieIcon },
];

describe('BottomNav', () => {
  it('muestra todos los ítems recibidos', () => {
    render(
      <BottomNav items={items} activeId="movements" onSelect={() => {}} />,
    );

    expect(screen.getByText('Movimientos')).toBeInTheDocument();
    expect(screen.getByText('Presupuestos')).toBeInTheDocument();
  });

  it('llama a onSelect con el id del ítem tocado', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <BottomNav items={items} activeId="movements" onSelect={handleSelect} />,
    );

    await user.click(screen.getByText('Presupuestos'));

    expect(handleSelect).toHaveBeenCalledWith('budgets');
  });

  it('resalta visualmente el ítem activo', () => {
    render(<BottomNav items={items} activeId="budgets" onSelect={() => {}} />);

    const budgetsButton = screen.getByText('Presupuestos').closest('button');
    expect(budgetsButton).toHaveClass('text-neutral-900');
  });
});
