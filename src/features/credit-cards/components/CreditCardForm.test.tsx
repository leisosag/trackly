import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreditCardForm } from './CreditCardForm';
import type { CreditCard } from '../types';

describe('CreditCardForm', () => {
  it('el botón guardar está deshabilitado sin datos completos', () => {
    render(<CreditCardForm onSubmit={() => {}} />);

    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
  });

  it('llama a onSubmit con los datos armados', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<CreditCardForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/nombre de la tarjeta/i), 'Visa');
    await user.type(screen.getByLabelText(/día de cierre/i), '10');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Visa',
      closingDay: 10,
      isActive: true,
    });
  });

  it('no permite un día de cierre fuera del rango 1-31', async () => {
    const user = userEvent.setup();
    render(<CreditCardForm onSubmit={() => {}} />);

    await user.type(screen.getByLabelText(/nombre de la tarjeta/i), 'Visa');
    await user.type(screen.getByLabelText(/día de cierre/i), '35');

    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
  });

  it('en modo edición, muestra el botón de desactivar cuando canDeactivate es true', () => {
    const card: CreditCard = {
      id: '1',
      name: 'Visa',
      closingDay: 10,
      isActive: true,
    };

    render(
      <CreditCardForm
        mode="edit"
        initialCard={card}
        onSubmit={() => {}}
        onDeactivate={() => {}}
        canDeactivate
      />,
    );

    expect(
      screen.getByRole('button', { name: /desactivar/i }),
    ).toBeInTheDocument();
  });

  it('en modo edición, oculta el botón de desactivar y muestra un aviso cuando canDeactivate es false', () => {
    const card: CreditCard = {
      id: '1',
      name: 'Visa',
      closingDay: 10,
      isActive: true,
    };

    render(
      <CreditCardForm
        mode="edit"
        initialCard={card}
        onSubmit={() => {}}
        onDeactivate={() => {}}
        canDeactivate={false}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /desactivar/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/no se puede desactivar/i)).toBeInTheDocument();
  });

  it('requiere 2 clicks en Desactivar antes de llamar a onDeactivate', async () => {
    const user = userEvent.setup();
    const handleDeactivate = vi.fn();
    const card: CreditCard = {
      id: '1',
      name: 'Visa',
      closingDay: 10,
      isActive: true,
    };

    render(
      <CreditCardForm
        mode="edit"
        initialCard={card}
        onSubmit={() => {}}
        onDeactivate={handleDeactivate}
        canDeactivate
      />,
    );

    await user.click(screen.getByRole('button', { name: /desactivar/i }));
    expect(handleDeactivate).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Sí, desactivar/i }));
    expect(handleDeactivate).toHaveBeenCalledOnce();
  });

  it('en modo edición, muestra el botón de activar para una tarjeta desactivada', () => {
    const card: CreditCard = {
      id: '1',
      name: 'Visa vieja',
      closingDay: 10,
      isActive: false,
    };

    render(
      <CreditCardForm
        mode="edit"
        initialCard={card}
        onSubmit={() => {}}
        onActivate={() => {}}
      />,
    );

    expect(
      screen.getByRole('button', { name: /activar/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /desactivar/i }),
    ).not.toBeInTheDocument();
  });

  it('requiere 2 clicks en Activar antes de llamar a onActivate', async () => {
    const user = userEvent.setup();
    const handleActivate = vi.fn();
    const card: CreditCard = {
      id: '1',
      name: 'Visa vieja',
      closingDay: 10,
      isActive: false,
    };

    render(
      <CreditCardForm
        mode="edit"
        initialCard={card}
        onSubmit={() => {}}
        onActivate={handleActivate}
      />,
    );

    await user.click(screen.getByRole('button', { name: /activar/i }));
    expect(handleActivate).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Sí, activar/i }));
    expect(handleActivate).toHaveBeenCalledOnce();
  });
});
