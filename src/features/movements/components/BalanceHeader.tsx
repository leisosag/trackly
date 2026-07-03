import { calculateSummary, formatCurrency } from '@/shared/utils';
import type { Movement } from '../types';

interface BalanceHeaderProps {
  movements: Movement[];
}

export function BalanceHeader({ movements }: BalanceHeaderProps) {
  const { balance, income, expense } = calculateSummary(movements);

  return (
    <header className="sticky top-0 z-2 bg-neutral-900 dark:bg-mauve-800 py-4 px-6 text-white">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-base text-neutral-400">Saldo</p>
          <p className="text-3xl font-semibold dark:text-cyan-300">
            {formatCurrency(balance)}
          </p>
        </div>

        <div className="flex flex-col gap-1 text-sm text-right">
          <span className="text-sm text-neutral-400">
            Gasto: {formatCurrency(expense)}
          </span>
          <span className="text-sm text-neutral-400">
            Ingreso: {formatCurrency(income)}
          </span>
        </div>
      </div>
    </header>
  );
}
