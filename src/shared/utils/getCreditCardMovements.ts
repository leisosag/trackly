import type { Movement } from '@/features/movements';

// Único punto donde se define qué movimientos pertenecen al resumen de tarjetas de un período dado.
// statementPeriod solo lo completan los movimientos con medio de pago crédito (ver generateInstallments),
// así que alcanza con compararlo directamente. No hace falta resolver el medio de pago acá también.
export function getCreditCardMovements(
  movements: Movement[],
  period: string,
): Movement[] {
  return movements.filter((m) => m.statementPeriod === period);
}
