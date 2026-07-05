import { getPaymentMethods } from './getPaymentMethods';
import type { PaymentMethod } from '../types';

export function getPaymentMethodById(id: string): PaymentMethod | undefined {
  return getPaymentMethods().find((m) => m.id === id);
}
