import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DescriptionField } from './DescriptionField';

describe('DescriptionField', () => {
  it('muestra el placeholder cuando está vacío', () => {
    render(<DescriptionField value="" onChange={() => {}} />);

    expect(
      screen.getByPlaceholderText('Descripción (opcional)'),
    ).toBeInTheDocument();
  });

  it('llama a onChange al escribir', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DescriptionField value="" onChange={handleChange} />);

    await user.type(
      screen.getByLabelText(/descripción del movimiento/i),
      'Super',
    );

    expect(handleChange).toHaveBeenCalled();
  });

  it('muestra el valor actual', () => {
    render(<DescriptionField value="Supermercado" onChange={() => {}} />);

    expect(screen.getByDisplayValue('Supermercado')).toBeInTheDocument();
  });
});
