import { useState } from 'react';
import { evaluateExpression } from '../utils/evaluateExpression';
import { formatCurrency } from '@/shared/utils';

interface CalculatorProps {
  onConfirm: (amount: number) => void;
}

const KEYS = [
  '7',
  '8',
  '9',
  '/',
  '4',
  '5',
  '6',
  '*',
  '1',
  '2',
  '3',
  '-',
  '0',
  '.',
  '⌫',
  '+',
];

export function Calculator({ onConfirm }: CalculatorProps) {
  const [expression, setExpression] = useState('');

  const result = evaluateExpression(expression);
  const isValid = result !== null && result > 0;

  function handleKey(key: string) {
    if (key === '⌫') {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }
    setExpression((prev) => prev + key);
  }

  function handleConfirm() {
    if (isValid) {
      onConfirm(result);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-neutral-100 px-4 py-3 text-right">
        <p
          data-testid="expression-display"
          className="min-h-6 text-sm text-neutral-500"
        >
          {expression || '0'}
        </p>
        <p className="text-2xl font-semibold text-neutral-900">
          {result !== null ? formatCurrency(result) : '—'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className="rounded-lg bg-neutral-50 py-3 text-lg font-medium text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300"
          >
            {key}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!isValid}
        onClick={handleConfirm}
        className="rounded-xl bg-neutral-900 py-3 font-medium text-white disabled:bg-neutral-300"
      >
        Confirmar monto
      </button>
    </div>
  );
}
