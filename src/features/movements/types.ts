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
  paymentMethodId?: string;
  statementPeriod?: string; // "2026-08" — solo para medio de pago crédito
  installment?: Installment; // solo para medio de pago crédito
}

// Input para crear un movimiento nuevo: sin id (lo genera el repositorio) y sin installment/statementPeriod
// (se calculan automáticamente si el medio de pago es una tarjeta de crédito).
// installmentsCount es solo un input de formulario, nunca se persiste tal cual en el Movement final.
export type NewMovementInput = Omit<
  Movement,
  'id' | 'installment' | 'statementPeriod'
> & {
  installmentsCount?: number;
};
