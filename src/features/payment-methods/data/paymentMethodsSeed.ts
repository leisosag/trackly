import type { PaymentMethod } from '../types';

export const paymentMethodsSeed: PaymentMethod[] = [
  { id: 'cash', name: 'Efectivo', kind: 'cash' },
  { id: 'debit', name: 'Débito', kind: 'debit' },
  { id: 'credit', name: 'Crédito', kind: 'credit' },
];
