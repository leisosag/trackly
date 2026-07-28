import { FunnelIcon } from '@phosphor-icons/react';
import { calculateSummary, formatCurrency } from '@/shared/utils';
import type { Movement } from '../types';

interface BalanceHeaderProps {
  movements: Movement[];
  onFilterClick?: () => void;
  hasActiveFilters?: boolean;
}

export function BalanceHeader({
  movements,
  onFilterClick,
  hasActiveFilters = false,
}: BalanceHeaderProps) {
  const { balance, income, expense } = calculateSummary(movements);

  return (
    <header className="sticky top-0 z-2 bg-neutral-900 dark:bg-mauve-800 pb-4 pt-1 px-6 text-white">
      <div className="flex flex-col justify-end gap-3">
        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            aria-label="Filtrar por categoría"
            className="rounded-full p-1.5 text-neutral-400 hover:cursor-pointer hover:bg-white/10 hover:text-white self-end"
          >
            <FunnelIcon
              size={20}
              weight={hasActiveFilters ? 'fill' : 'regular'}
              className={hasActiveFilters ? 'dark:text-cyan-300' : ''}
            />
          </button>
        )}
        <div className="flex items-center justify-between items-end">
          <div>
            <p className="text-base text-neutral-400">Saldo</p>
            <p className="text-3xl font-semibold dark:text-cyan-300">
              {formatCurrency(balance)}
            </p>
          </div>

          <div className="flex flex-col gap-1 text-sm text-right">
            <span className="text-neutral-400">
              Gasto: {formatCurrency(expense)}
            </span>
            <span className="text-neutral-400">
              Ingreso: {formatCurrency(income)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
