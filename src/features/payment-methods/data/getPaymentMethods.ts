import { paymentMethodsSeed } from './paymentMethodsSeed';
import type { PaymentMethod } from '../types';

// Punto único de evolución: cuando exista el módulo de Tarjetas de Crédito,
// acá se combinarán los medios fijos (efectivo, débito) con las tarjetas dinámicas de cardsRepository.
// Quien consume esta función (el Select, el formulario) no necesita cambiar nada.
export function getPaymentMethods(): PaymentMethod[] {
  return paymentMethodsSeed;
}
