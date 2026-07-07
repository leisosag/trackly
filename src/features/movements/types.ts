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
