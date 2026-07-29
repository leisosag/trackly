import { getCategoryById } from '@/features/categories';
import { getPaymentMethodById } from '@/features/payment-methods';
import type { MovementFilters } from '@/features/movements';

const MAX_VISIBLE_NAMES = 3;

function formatNames(names: string[]): string {
  if (names.length <= MAX_VISIBLE_NAMES) return names.join(', ');

  const visible = names.slice(0, MAX_VISIBLE_NAMES);
  const remaining = names.length - MAX_VISIBLE_NAMES;
  return `${visible.join(', ')} +${remaining} más`;
}

export interface MovementFiltersDescription {
  categoryLabel: string | null;
  paymentMethodLabel: string | null;
}

// Arma el texto descriptivo de cada dimensión activa de MovementFilters,
// para mostrar en FilteredSummary. Cada línea es independiente (null si esa
// dimensión no tiene selección), así el componente decide si renderizarla.
// Nueva dimensión de filtro futura → se suma acá un campo más, sin tocar a
// quien consume esta función.
export function formatMovementFiltersDescription(
  filters: MovementFilters,
): MovementFiltersDescription {
  const categoryNames = filters.categoryIds
    .map((id) => getCategoryById(id)?.name)
    .filter((name): name is string => Boolean(name));

  const paymentMethodNames = filters.paymentMethodIds
    .map((id) => getPaymentMethodById(id)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    categoryLabel: categoryNames.length > 0 ? formatNames(categoryNames) : null,
    paymentMethodLabel:
      paymentMethodNames.length > 0 ? formatNames(paymentMethodNames) : null,
  };
}
