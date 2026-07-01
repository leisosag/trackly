import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from './Calculator';

function ControlledCalculator({
  onConfirm,
}: {
  onConfirm: (amount: number) => void;
}) {
  const [expression, setExpression] = useState('');
  return (
    <Calculator
      expression={expression}
      onExpressionChange={setExpression}
      onConfirm={onConfirm}
    />
  );
}

describe('Calculator', () => {
  it('muestra la expresión a medida que se tocan las teclas', async () => {
    const user = userEvent.setup();
    render(<ControlledCalculator onConfirm={() => {}} />);

    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByText('0'));

    expect(screen.getByTestId('expression-display')).toHaveTextContent('100');
  });

  it('borra el último caracter al tocar ⌫', async () => {
    const user = userEvent.setup();
    render(<ControlledCalculator onConfirm={() => {}} />);

    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('⌫'));

    expect(screen.getByTestId('expression-display')).toHaveTextContent('1');
  });

  it('el botón confirmar está deshabilitado sin una expresión válida', () => {
    render(<ControlledCalculator onConfirm={() => {}} />);

    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
  });

  it('llama a onConfirm con el resultado calculado', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    render(<ControlledCalculator onConfirm={handleConfirm} />);

    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByText('+'));
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('0'));
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(handleConfirm).toHaveBeenCalledWith(150);
  });
});
