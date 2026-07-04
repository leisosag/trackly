import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDeleteButton } from './ConfirmDeleteButton';

describe('ConfirmDeleteButton', () => {
  it('no llama a onConfirm en el primer click, solo cambia el label', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    render(<ConfirmDeleteButton onConfirm={handleConfirm} />);

    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(handleConfirm).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Sí, eliminar' }),
    ).toBeInTheDocument();
  });

  it('llama a onConfirm en el segundo click', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    render(<ConfirmDeleteButton onConfirm={handleConfirm} />);

    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    await user.click(screen.getByRole('button', { name: 'Sí, eliminar' }));

    expect(handleConfirm).toHaveBeenCalledOnce();
  });

  it('permite personalizar los labels', () => {
    render(
      <ConfirmDeleteButton
        onConfirm={() => {}}
        label="Borrar"
        confirmLabel="Confirmar borrado"
      />,
    );

    expect(screen.getByRole('button', { name: 'Borrar' })).toBeInTheDocument();
  });
});
