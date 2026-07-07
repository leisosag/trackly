import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstallmentsField } from './InstallmentsField';

describe('InstallmentsField', () => {
  it('muestra el valor actual', () => {
    render(
      <InstallmentsField value="3" onChange={() => {}} periodLabels={[]} />,
    );

    expect(screen.getByLabelText(/cantidad de cuotas/i)).toHaveValue(3);
  });

  it('llama a onChange al escribir', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <InstallmentsField value="1" onChange={handleChange} periodLabels={[]} />,
    );

    await user.type(screen.getByLabelText(/cantidad de cuotas/i), '2');

    expect(handleChange).toHaveBeenCalled();
  });

  it('no muestra ningún mensaje de ayuda si periodLabels está vacío', () => {
    render(
      <InstallmentsField value="1" onChange={() => {}} periodLabels={[]} />,
    );

    expect(screen.queryByText(/resumen/i)).not.toBeInTheDocument();
  });

  it('muestra un mensaje singular cuando hay un solo período', () => {
    render(
      <InstallmentsField
        value="1"
        onChange={() => {}}
        periodLabels={['Julio de 2026']}
      />,
    );

    expect(
      screen.getByText('Se va a reflejar en el resumen de Julio de 2026'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje plural con la lista de meses cuando hay varias cuotas', () => {
    render(
      <InstallmentsField
        value="3"
        onChange={() => {}}
        periodLabels={['Julio de 2026', 'Agosto de 2026', 'Septiembre de 2026']}
      />,
    );

    expect(
      screen.getByText(
        'Se van a crear 3 movimientos, uno por resumen: Julio de 2026, Agosto de 2026, Septiembre de 2026',
      ),
    ).toBeInTheDocument();
  });
});
