import type { Movement } from '@/features/movements';

// Único punto donde se define qué movimientos pertenecen a un set de medios
// de pago. Los movimientos sin paymentMethodId (ingresos) nunca matchean,
// ya que un ingreso no tiene medio de pago asociado.
export function filterMovementsByPaymentMethods(
  movements: Movement[],
  paymentMethodIds: string[],
): Movement[] {
  return movements.filter(
    (m) =>
      m.paymentMethodId !== undefined &&
      paymentMethodIds.includes(m.paymentMethodId),
  );
}
