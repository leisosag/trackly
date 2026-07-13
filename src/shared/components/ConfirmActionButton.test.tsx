import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmActionButton } from './ConfirmActionButton';

describe('ConfirmActionButton', () => {
  describe('variant="edit" (modo toggle)', () => {
    it('llama a onConfirm en cada click y cambia el label', async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      render(<ConfirmActionButton variant="edit" onConfirm={handleConfirm} />);

      await user.click(screen.getByRole('button', { name: 'Editar' }));

      expect(handleConfirm).toHaveBeenCalledOnce();
      expect(
        screen.getByRole('button', { name: 'Editando' }),
      ).toBeInTheDocument();
    });
  });

  describe('variant="delete" (modo confirm)', () => {
    it('no llama a onConfirm en el primer click, solo cambia el label', async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      render(
        <ConfirmActionButton variant="delete" onConfirm={handleConfirm} />,
      );

      await user.click(screen.getByRole('button', { name: 'Eliminar' }));

      expect(handleConfirm).not.toHaveBeenCalled();
      expect(
        screen.getByRole('button', { name: 'Sí, eliminar' }),
      ).toBeInTheDocument();
    });

    it('llama a onConfirm en el segundo click', async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      render(
        <ConfirmActionButton variant="delete" onConfirm={handleConfirm} />,
      );

      await user.click(screen.getByRole('button', { name: 'Eliminar' }));
      await user.click(screen.getByRole('button', { name: 'Sí, eliminar' }));

      expect(handleConfirm).toHaveBeenCalledOnce();
    });
  });

  describe('variant="activate" (modo confirm)', () => {
    it('requiere 2 clicks antes de llamar a onConfirm, con sus propios labels por defecto', async () => {
      const user = userEvent.setup();
      const handleConfirm = vi.fn();
      render(
        <ConfirmActionButton variant="activate" onConfirm={handleConfirm} />,
      );

      await user.click(screen.getByRole('button', { name: 'Activar' }));
      expect(handleConfirm).not.toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: 'Sí, activar' }));
      expect(handleConfirm).toHaveBeenCalledOnce();
    });
  });

  it('permite personalizar los labels sin importar el variant', () => {
    render(
      <ConfirmActionButton
        variant="delete"
        onConfirm={() => {}}
        label="Desactivar"
        confirmLabel="Sí, desactivar"
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Desactivar' }),
    ).toBeInTheDocument();
  });
});
