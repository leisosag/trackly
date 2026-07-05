export type PaymentMethodKind = 'cash' | 'debit' | 'credit';

export interface PaymentMethod {
  id: string;
  name: string;
  kind: PaymentMethodKind;
}
