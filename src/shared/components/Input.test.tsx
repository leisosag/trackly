import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { Input } from './Input';

describe('Input', () => {
  it('muestra el placeholder cuando está vacío', () => {
    render(
      <Input
        value=""
        onChange={() => {}}
        ariaLabel="Campo de prueba"
        placeholder="Descripción (opcional)"
      />,
    );

    expect(
      screen.getByPlaceholderText('Descripción (opcional)'),
    ).toBeInTheDocument();
  });

  it('llama a onChange al escribir', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} ariaLabel="Campo" />);

    await user.type(screen.getByLabelText('Campo'), 'Hola');

    expect(handleChange).toHaveBeenCalled();
  });

  it('muestra el valor actual', () => {
    render(
      <Input value="Supermercado" onChange={() => {}} ariaLabel="Campo" />,
    );

    expect(screen.getByDisplayValue('Supermercado')).toBeInTheDocument();
  });

  it('renderiza el ícono cuando se pasa la prop icon', () => {
    render(
      <Input
        value=""
        onChange={() => {}}
        ariaLabel="Campo"
        icon={PencilSimpleIcon}
      />,
    );

    expect(
      screen.getByLabelText('Campo').parentElement?.querySelector('svg'),
    ).toBeInTheDocument();
  });

  it('no renderiza ícono cuando no se pasa la prop', () => {
    render(<Input value="" onChange={() => {}} ariaLabel="Campo" />);

    expect(
      screen.getByLabelText('Campo').parentElement?.querySelector('svg'),
    ).not.toBeInTheDocument();
  });
});
