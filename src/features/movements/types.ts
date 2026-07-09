export interface Installment {
  groupId: string; // agrupa todas las cuotas de una misma compra
  number: number; // 1-based
  total: number;
}

export interface Movement {
  id: string;
  categoryId: string;
  description?: string;
  amount: number;
  date: string; // ISO string, ej: "2026-07-01T14:30:00.000Z"
  // Para cuotas de crédito, date queda reubicada en el mes de su statementPeriod (mismo día/hora de la compra original, pero mes/año del resumen en que factura)
  // Así balance, Movimientos y presupuestos, que filtran por date, la cuentan en el mes correcto.
  // Ver shared/utils/generateInstallments.
  paymentMethodId?: string;
  statementPeriod?: string; // "2026-08" — solo para medio de pago crédito
  installment?: Installment; // solo para medio de pago crédito
}

// Input para crear/editar un movimiento: sin id (lo genera el repositorio).
// installment/statementPeriod viajan opcionalmente para permitir que
// MovementForm los preserve al editar una cuota ya existente (ver
// MovementForm.handleAmountConfirm). Al crear, useMovements.addMovement los
// recalcula igual vía generateInstallments si el medio de pago es crédito.
// installmentsCount es solo un input de formulario, nunca se persiste tal
// cual en el Movement final.
export type NewMovementInput = Omit<Movement, 'id'> & {
  installmentsCount?: number;
};
