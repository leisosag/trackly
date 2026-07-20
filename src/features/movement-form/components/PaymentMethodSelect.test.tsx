import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaymentMethodSelect } from './PaymentMethodSelect';

describe('PaymentMethodSelect', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra todos los medios de pago disponibles', () => {
    render(<PaymentMethodSelect value="cash" onChange={() => {}} />);

    expect(
      screen.getByRole('option', { name: 'Efectivo' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Débito' })).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Tarjeta principal' }),
    ).toBeInTheDocument();
  });

  it('llama a onChange con el id del medio de pago elegido', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PaymentMethodSelect value="cash" onChange={handleChange} />);

    await user.selectOptions(screen.getByLabelText(/medio de pago/i), 'debit');

    expect(handleChange).toHaveBeenCalledWith('debit');
  });

  it('refleja el valor seleccionado actualmente', () => {
    render(<PaymentMethodSelect value="default-card" onChange={() => {}} />);

    expect(screen.getByLabelText(/medio de pago/i)).toHaveValue('default-card');
  });
});
