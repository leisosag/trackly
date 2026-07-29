import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaymentMethodMultiSelect } from './PaymentMethodMultiSelect';

describe('PaymentMethodMultiSelect', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra todos los medios de pago disponibles', () => {
    render(
      <PaymentMethodMultiSelect
        selectedPaymentMethodIds={[]}
        onToggle={() => {}}
      />,
    );

    expect(screen.getByText('Efectivo')).toBeInTheDocument();
    expect(screen.getByText('Débito')).toBeInTheDocument();
    expect(screen.getByText('Tarjeta principal')).toBeInTheDocument();
  });

  it('llama a onToggle con el id del medio de pago tocado', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(
      <PaymentMethodMultiSelect
        selectedPaymentMethodIds={[]}
        onToggle={handleToggle}
      />,
    );

    await user.click(screen.getByText('Débito'));

    expect(handleToggle).toHaveBeenCalledWith('debit');
  });

  it('marca aria-checked=true en un medio de pago ya seleccionado', () => {
    render(
      <PaymentMethodMultiSelect
        selectedPaymentMethodIds={['debit']}
        onToggle={() => {}}
      />,
    );

    const debitChip = screen.getByText('Débito').closest('button');
    expect(debitChip).toHaveAttribute('aria-checked', 'true');
  });

  it('marca aria-checked=false en un medio de pago no seleccionado', () => {
    render(
      <PaymentMethodMultiSelect
        selectedPaymentMethodIds={['debit']}
        onToggle={() => {}}
      />,
    );

    const cashChip = screen.getByText('Efectivo').closest('button');
    expect(cashChip).toHaveAttribute('aria-checked', 'false');
  });

  it('renderiza un ícono en cada chip', () => {
    render(
      <PaymentMethodMultiSelect
        selectedPaymentMethodIds={[]}
        onToggle={() => {}}
      />,
    );

    const debitChip = screen.getByText('Débito').closest('button');
    expect(debitChip?.querySelector('svg')).toBeInTheDocument();
  });
});
