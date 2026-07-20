import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AmountInput } from './AmountInput';

function ControlledAmountInput({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState('');
  return (
    <AmountInput
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange(v);
      }}
      ariaLabel="Monto"
    />
  );
}

describe('AmountInput', () => {
  it('formatea con puntos de miles a medida que se escribe', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ControlledAmountInput onChange={handleChange} />);

    await user.type(screen.getByLabelText('Monto'), '50000');

    // se controla desde afuera: el último valor emitido ya viene formateado
    expect(handleChange).toHaveBeenLastCalledWith('50.000');
  });

  it('muestra el valor formateado que recibe por props', () => {
    render(
      <AmountInput value="50.000,50" onChange={() => {}} ariaLabel="Monto" />,
    );

    expect(screen.getByDisplayValue('50.000,50')).toBeInTheDocument();
  });
});
