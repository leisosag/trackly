import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('no muestra el contenido cuando open es false', () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="Test">
        <p>Contenido</p>
      </Modal>,
    );

    expect(screen.queryByText('Contenido')).not.toBeInTheDocument();
  });

  it('muestra el contenido y el título cuando open es true', () => {
    render(
      <Modal open={true} onOpenChange={() => {}} title="Nuevo movimiento">
        <p>Contenido</p>
      </Modal>,
    );

    expect(screen.getByText('Nuevo movimiento')).toBeInTheDocument();
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('llama a onOpenChange al hacer click en cerrar', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Modal open={true} onOpenChange={handleOpenChange} title="Test">
        <p>Contenido</p>
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: /cerrar/i }));

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
