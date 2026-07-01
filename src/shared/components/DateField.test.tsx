import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateField } from './DateField';

describe('DateField', () => {
  beforeEach(() => {
    // jsdom no implementa showPicker todavía; lo mockeamos para poder testear el click.
    HTMLInputElement.prototype.showPicker = vi.fn();
  });

  it('muestra "Hoy" cuando el valor es la fecha actual', () => {
    const today = new Date().toISOString().slice(0, 10);
    render(<DateField value={today} onChange={() => {}} />);

    expect(screen.getByText('Hoy')).toBeInTheDocument();
  });

  it('muestra dd/mm/aaaa cuando el valor no es hoy', () => {
    render(<DateField value="2026-07-20" onChange={() => {}} />);

    expect(screen.getByText('20/07/2026')).toBeInTheDocument();
  });

  it('llama a onChange con la nueva fecha elegida', () => {
    const handleChange = vi.fn();
    render(<DateField value="2026-07-01" onChange={handleChange} />);

    const input = screen.getByLabelText(/fecha del movimiento/i);
    fireEvent.change(input, { target: { value: '2026-07-20' } });

    expect(handleChange).toHaveBeenCalledWith('2026-07-20');
  });

  it('abre el selector de fecha al tocar cualquier parte de la fila', async () => {
    const user = userEvent.setup();
    render(<DateField value="2026-07-01" onChange={() => {}} />);

    await user.click(screen.getByRole('button'));

    expect(HTMLInputElement.prototype.showPicker).toHaveBeenCalled();
  });
});
