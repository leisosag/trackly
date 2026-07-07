import { useMovements } from '@/features/movements';
import { MovementList } from '@/features/movements';
import { useSelectedMonth } from '@/shared/context';
import {
  formatCurrency,
  dateToPeriod,
  formatPeriodLabel,
  getCreditCardMovements,
} from '@/shared/utils';

export function CreditCardsPage() {
  const { movements } = useMovements();
  const { selectedDate } = useSelectedMonth();

  const period = dateToPeriod(selectedDate);
  const cardMovements = getCreditCardMovements(movements, period);
  const total = cardMovements.reduce((sum, m) => sum + m.amount, 0);

  return (
    <>
      <header className="sticky top-0 z-2 bg-neutral-900 dark:bg-mauve-800 py-4 px-6 text-white">
        <p className="text-base text-neutral-400">
          Resumen de {formatPeriodLabel(period)}
        </p>
        <p className="text-3xl font-semibold dark:text-cyan-300">
          {formatCurrency(total)}
        </p>
      </header>

      <main className="pb-24">
        <MovementList movements={cardMovements} />
      </main>
    </>
  );
}
