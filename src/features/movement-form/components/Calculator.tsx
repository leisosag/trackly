import { evaluateExpression } from '../utils/evaluateExpression';
import { formatCurrency, cn } from '@/shared/utils';
import { CheckIcon } from '@phosphor-icons/react';

interface CalculatorProps {
  expression: string;
  onExpressionChange: (expression: string) => void;
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

export function Calculator({
  expression,
  onExpressionChange,
  onConfirm,
}: CalculatorProps) {
  const result = evaluateExpression(expression);
  const isValid = result !== null && result > 0;

  function handleKey(key: string) {
    if (key === '⌫') {
      onExpressionChange(expression.slice(0, -1));
      return;
    }
    onExpressionChange(expression + key);
  }

  function handleConfirm() {
    if (isValid) {
      onConfirm(result);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl bg-neutral-100 dark:bg-mauve-700 px-4 py-3 text-right">
        <p
          data-testid="expression-display"
          className="min-h-6 text-sm text-neutral-500 dark:text-mauve-400"
        >
          {expression || '0'}
        </p>
        <p className="text-2xl font-semibold text-neutral-900 dark:text-mauve-50">
          {result !== null ? formatCurrency(result) : '—'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            className="rounded-lg bg-neutral-50 dark:bg-mauve-700 py-2 text-base font-medium text-neutral-800 dark:text-mauve-50 hover:bg-neutral-200 dark:hover:bg-mauve-600/30 active:bg-neutral-300 hover:cursor-pointer"
          >
            {key}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!isValid}
        onClick={handleConfirm}
        className={cn(
          'flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-cyan-300 py-3 font-medium text-white dark:text-mauve-900 disabled:bg-neutral-300 dark:disabled:bg-mauve-400',
          isValid && 'hover:cursor-pointer',
        )}
        aria-label="guardar"
      >
        <CheckIcon size={25} />
      </button>
    </div>
  );
}
