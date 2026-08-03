import type { Movement } from '@/features/movements';

// Único punto donde se define qué movimientos pertenecen a la tarjeta de
// crédito (criterio inverso al de getCreditCardMovements). Los movimientos
// de crédito no se ven ni se computan en el saldo mensual ni en los
// presupuestos: solo se ven desde la vista de Tarjetas.
export function excludeCreditCardMovements(movements: Movement[]): Movement[] {
  return movements.filter((m) => m.statementPeriod === undefined);
}
