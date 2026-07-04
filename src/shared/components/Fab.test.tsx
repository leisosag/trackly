import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Fab } from './Fab';

describe('Fab', () => {
  it('llama a onClick al tocarlo', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Fab onClick={handleClick} />);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('usa "Agregar" como aria-label por defecto', () => {
    render(<Fab onClick={() => {}} />);

    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('permite personalizar el aria-label mediante la prop label', () => {
    render(<Fab onClick={() => {}} label="Agregar presupuesto" />);

    expect(
      screen.getByRole('button', { name: 'Agregar presupuesto' }),
    ).toBeInTheDocument();
  });
});
