import type { Movement, MovementFilters } from '@/features/movements';
import { filterMovementsByCategories } from './filterMovementsByCategories';
import { filterMovementsByPaymentMethods } from './filterMovementsByPaymentMethods';

// Único punto donde se combinan todas las dimensiones de MovementFilters.
// Cada dimensión activa se aplica como una pasada adicional sobre el
// resultado de la anterior (AND entre dimensiones): filtrar por categoría +
// medio de pago devuelve la intersección de ambos criterios. Si en el
// futuro se suma una nueva dimensión (monto, búsqueda), se agrega acá como
// un `if` más, sin tocar quien llama a esta función (MovementsPage).
export function applyMovementFilters(
  movements: Movement[],
  filters: MovementFilters,
): Movement[] {
  let result = movements;

  if (filters.categoryIds.length > 0) {
    result = filterMovementsByCategories(result, filters.categoryIds);
  }

  if (filters.paymentMethodIds.length > 0) {
    result = filterMovementsByPaymentMethods(result, filters.paymentMethodIds);
  }

  return result;
}
