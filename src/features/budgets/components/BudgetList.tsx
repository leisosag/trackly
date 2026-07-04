import { calculateBudgetProgress } from '@/shared/utils';
import { BudgetCard } from './BudgetCard';
import type { Movement } from '@/features/movements';
import type { Budget } from '../types';

interface BudgetListProps {
  budgets: Budget[];
  movements: Movement[];
  onBudgetClick?: (budget: Budget) => void;
}

export function BudgetList({
  budgets,
  movements,
  onBudgetClick,
}: BudgetListProps) {
  const general = budgets.find((b) => b.isGeneral);
  const custom = budgets.filter((b) => !b.isGeneral);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {general && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-neutral-500">General</h4>
          <BudgetCard
            progress={calculateBudgetProgress(general, movements)}
            onClick={() => onBudgetClick?.(general)}
          />
        </div>
      )}

      <div>
        <h4 className="mb-2 text-sm font-medium text-neutral-500">
          Personalizados
        </h4>

        {custom.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
            <p>Todavía no creaste presupuestos personalizados</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {custom.map((budget) => (
              <BudgetCard
                key={budget.id}
                progress={calculateBudgetProgress(budget, movements)}
                onClick={() => onBudgetClick?.(budget)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
